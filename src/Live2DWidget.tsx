'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

// Danh sách models có sẵn
const BUILT_IN_MODELS = [
  'histoire', 'bilibili-22', 'bilibili-33', 'cat-black', 'cat-white',
  'chino', 'date', 'ganyu', 'hallo', 'haruto', 'hibiki', 'HK416-1-normal',
  'HK416-2-destroy', 'HK416-2-normal', 'Kar98k-normal', 'kobayaxi', 'koharu',
  'kp31', 'live_uu', 'mai', 'murakumo', 'Pio', 'platelet', 'platelet_2',
  'potion-Maker-Pio', 'rem', 'rem_2', 'senko', 'shizuku', 'shizuku_48',
  'shizuku_pajama', 'terisa', 'tia', 'umaru', 'uni', 'wed_16', 'xisitina', 'z16'
] as const;

export type ModelName = typeof BUILT_IN_MODELS[number] | (string & {});

export type Live2DWidgetProps = {
  /** Tên model (bắt buộc nếu không dùng random) */
  modelName?: ModelName;
  /** Custom base URL để load models (mặc định: GitHub raw) */
  baseUrl?: string;
  /** CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Vị trí widget: 'left' | 'right' */
  position?: 'left' | 'right';
  /** Chiều rộng widget (px) */
  width?: number;
  /** Chiều cao widget (px) */
  height?: number;
  /** Độ trong suốt mặc định (0-1) */
  opacity?: number;
  /** Độ trong suốt khi hover (0-1) */
  hoverOpacity?: number;
  /** Hiển thị trên mobile */
  showOnMobile?: boolean;
  /** Chọn model ngẫu nhiên */
  random?: boolean;
  /** Callback khi load xong */
  onLoad?: () => void;
  /** Callback khi có lỗi */
  onError?: (error: Error) => void;
  /** Callback khi click vào widget */
  onClick?: () => void;
  /** Component hiển thị khi đang load */
  fallback?: React.ReactNode;
};

const DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/2hjaito/next-live2d/refs/heads/main/models';
const LIVE2D_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
const LIVE2D_CHUNK_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.0.min.js';
const LIVE2D_SCRIPT_SELECTOR = 'script[data-next-live2d-script="true"]';
const LIVE2D_CHUNK_SCRIPT_SELECTOR = 'script[data-next-live2d-chunk="true"]';
const MODEL_JSON_TIMEOUT_MS = 10000;

type Live2DWidgetGlobal = {
  init?: (options: unknown) => unknown;
  config?: Record<string, unknown>;
};

type Live2DWindow = Window & {
  L2Dwidget?: Live2DWidgetGlobal;
  __next_live2d_script_loading__?: Promise<void>;
  __next_live2d_initialized__?: boolean;
};

function buildModelJsonPath(baseUrl: string, model: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedModel = model
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${normalizedBaseUrl}/${normalizedModel}/model.json`;
}

async function validateModelJson(modelJsonPath: string): Promise<void> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), MODEL_JSON_TIMEOUT_MS);

  try {
    const response = await fetch(modelJsonPath, {
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Model JSON request failed (${response.status}) for ${modelJsonPath}`);
    }

    const raw = await response.text();
    if (!raw || raw.trim() === 'undefined') {
      throw new Error(`Model JSON is empty/undefined at ${modelJsonPath}`);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`Model JSON is invalid at ${modelJsonPath}`);
    }

    if (!parsed || typeof parsed !== 'object') {
      throw new Error(`Model JSON has unexpected shape at ${modelJsonPath}`);
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Timed out while loading model JSON: ${modelJsonPath}`);
    }
    throw err;
  } finally {
    window.clearTimeout(timeout);
  }
}

function ensureLive2DScript(win: Live2DWindow): Promise<void> {
  if (win.L2Dwidget?.init) {
    return Promise.resolve();
  }

  if (win.__next_live2d_script_loading__) {
    return win.__next_live2d_script_loading__;
  }

  const existing = document.querySelector(LIVE2D_SCRIPT_SELECTOR) as HTMLScriptElement | null;
  const existingChunk = document.querySelector(LIVE2D_CHUNK_SCRIPT_SELECTOR) as HTMLScriptElement | null;
  if (existing && existingChunk && win.L2Dwidget?.init) {
    return Promise.resolve();
  }

  const loadScript = (
    src: string,
    dataAttr: 'nextLive2dScript' | 'nextLive2dChunk',
    existingNode: HTMLScriptElement | null,
  ) => new Promise<void>((resolve, reject) => {
    const script = existingNode ?? document.createElement('script');

    if (script.dataset.nextLive2dLoaded === 'true') {
      resolve();
      return;
    }

    script.src = src;
    script.async = true;
    script.dataset[dataAttr] = 'true';

    const cleanup = () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };

    const onLoad = () => {
      script.dataset.nextLive2dLoaded = 'true';
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load script: ${src}`));
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    if (!existingNode) {
      document.body.appendChild(script);
    }
  });

  win.__next_live2d_script_loading__ = new Promise<void>((resolve, reject) => {
    void loadScript(LIVE2D_SCRIPT_SRC, 'nextLive2dScript', existing)
      .then(() => loadScript(LIVE2D_CHUNK_SCRIPT_SRC, 'nextLive2dChunk', existingChunk))
      .then(() => {
        if (!win.L2Dwidget?.init) {
          throw new Error('Live2D widget API is unavailable after script load');
        }
        resolve();
      })
      .catch((err) => {
        reject(err instanceof Error ? err : new Error(String(err)));
      });
  }).finally(() => {
    win.__next_live2d_script_loading__ = undefined;
  });

  return win.__next_live2d_script_loading__;
}

function safeRemoveNode(node: Element | null): void {
  if (!node) {
    return;
  }

  try {
    node.remove();
  } catch {
    const parent = node.parentNode;
    if (!parent) {
      return;
    }

    try {
      parent.removeChild(node);
    } catch {
      // Ignore DOM detach race during route transitions.
    }
  }
}

function safeCleanupWidgetDom(): void {
  safeRemoveNode(document.querySelector('#live2d-widget'));
  safeRemoveNode(document.querySelector('#live2dcanvas'));
}

function resetWidgetConfig(widgetApi: Live2DWidgetGlobal): void {
  const config = widgetApi.config;
  if (!config || typeof config !== 'object') {
    return;
  }

  for (const key of Object.keys(config)) {
    delete (config as Record<string, unknown>)[key];
  }
}

function applyWidgetDomProps(
  el: HTMLElement,
  position: 'left' | 'right',
  style: React.CSSProperties | undefined,
  className: string | undefined,
  onClick: (() => void) | undefined,
): void {
  Object.assign(el.style, {
    position: 'fixed',
    [position]: '0px',
    transition: 'bottom 0.3s ease-in-out',
    zIndex: '9999',
    pointerEvents: onClick ? 'auto' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  });

  const previousClassName = el.dataset.nextLive2dClassName;
  if (previousClassName) {
    const oldClasses = previousClassName.split(/\s+/).filter(Boolean);
    for (const cls of oldClasses) {
      el.classList.remove(cls);
    }
  }

  if (className) {
    const classes = className.split(/\s+/).filter(Boolean);
    for (const cls of classes) {
      el.classList.add(cls);
    }
    el.dataset.nextLive2dClassName = className;
  } else {
    delete el.dataset.nextLive2dClassName;
  }

  el.onclick = onClick ?? null;
}

export default function Live2DWidget({
  modelName,
  baseUrl = DEFAULT_BASE_URL,
  style,
  className,
  position = 'right',
  width = 180,
  height = 300,
  opacity = 0.8,
  hoverOpacity = 0.2,
  showOnMobile = true,
  random = false,
  onLoad,
  onError,
  onClick,
  fallback,
}: Live2DWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const randomModelRef = useRef<ModelName | null>(null);
  const onClickRef = useRef<typeof onClick>(onClick);
  const onLoadRef = useRef<typeof onLoad>(onLoad);
  const onErrorRef = useRef<typeof onError>(onError);

  onClickRef.current = onClick;
  onLoadRef.current = onLoad;
  onErrorRef.current = onError;

  if (!random) {
    randomModelRef.current = null;
  }

  const selectedModel = useMemo(() => {
    if (random) {
      if (!randomModelRef.current) {
        const randomIndex = Math.floor(Math.random() * BUILT_IN_MODELS.length);
        randomModelRef.current = BUILT_IN_MODELS[randomIndex];
      }
      return randomModelRef.current;
    }

    return modelName || 'histoire';
  }, [random, modelName]);

  const modelJsonPath = buildModelJsonPath(baseUrl, selectedModel);

  useEffect(() => {
    const win = window as Live2DWindow;
    let mounted = true;
    let frameId: number | null = null;

    const finishWithError = (err: unknown) => {
      if (!mounted) {
        return;
      }
      const normalizedError = err instanceof Error ? err : new Error(String(err));
      setError(normalizedError);
      setIsLoading(false);
      onErrorRef.current?.(normalizedError);
    };

    const waitForWidget = () => {
      const startedAt = Date.now();

      const tick = () => {
        if (!mounted) {
          return;
        }

        const el = document.querySelector('#live2d-widget') as HTMLElement | null;
        if (el) {
          applyWidgetDomProps(el, position, style, className, onClickRef.current);
          setIsLoading(false);
          onLoadRef.current?.();
          return;
        }

        if (Date.now() - startedAt > 10000) {
          finishWithError(new Error('Timed out while waiting for Live2D widget container'));
          return;
        }

        frameId = requestAnimationFrame(tick);
      };

      frameId = requestAnimationFrame(tick);
    };

    setIsLoading(true);
    setError(null);

    void Promise.all([ensureLive2DScript(win), validateModelJson(modelJsonPath)])
      .then(() => {
        if (!mounted) {
          return;
        }

        const widgetApi = win.L2Dwidget;
        if (!widgetApi?.init) {
          throw new Error('Live2D widget API is unavailable after script load');
        }

        resetWidgetConfig(widgetApi);
        safeCleanupWidgetDom();
        win.__next_live2d_initialized__ = false;

        const initResult = widgetApi.init({
          model: {
            jsonPath: modelJsonPath,
          },
          display: {
            position,
            width,
            height,
          },
          mobile: {
            show: showOnMobile,
          },
          react: {
            opacityDefault: opacity,
            opacityOnHover: hoverOpacity,
          },
        });

        win.__next_live2d_initialized__ = true;

        if (initResult && typeof (initResult as PromiseLike<unknown>).then === 'function') {
          return Promise.resolve(initResult as PromiseLike<unknown>)
            .then(() => {
              if (mounted) {
                waitForWidget();
              }
            })
            .catch((err) => {
              finishWithError(err);
            });
        }

        waitForWidget();
      })
      .catch((err) => {
        finishWithError(err);
      });

    return () => {
      mounted = false;

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }

      safeCleanupWidgetDom();

      const winCleanup = window as Live2DWindow;
      winCleanup.__next_live2d_initialized__ = false;
    };
  }, [modelJsonPath, position, width, height, opacity, hoverOpacity, showOnMobile]);

  useEffect(() => {
    return () => {
      safeCleanupWidgetDom();

      const winCleanup = window as Live2DWindow;
      winCleanup.__next_live2d_initialized__ = false;
    };
  }, []);

  useEffect(() => {
    const el = document.querySelector('#live2d-widget') as HTMLElement | null;
    if (!el) {
      return;
    }

    applyWidgetDomProps(el, position, style, className, onClick);
  }, [position, style, className, onClick]);

  // Hiển thị fallback khi đang load
  if (isLoading && fallback) {
    return <>{fallback}</>;
  }

  // Hiển thị error nếu có
  if (error) {
    return null;
  }

  return null;
}

// Export danh sách models và helper
export { BUILT_IN_MODELS };
export const getRandomModel = (): ModelName => {
  const randomIndex = Math.floor(Math.random() * BUILT_IN_MODELS.length);
  return BUILT_IN_MODELS[randomIndex];
};
