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
  /** CSS classes áp dụng cho iframe bọc ngoài */
  className?: string;
  /** Inline styles áp dụng cho iframe bọc ngoài */
  style?: React.CSSProperties;
  /** Vị trí widget: 'left' | 'right' */
  position?: 'left' | 'right';
  /** Chiều rộng widget (px) */
  width?: number;
  /** Chiều cao widget (px) */
  height?: number;
  /** Tỉ lệ scale widget, hữu ích khi model cao/rộng hơn khung hiển thị mặc định */
  scale?: number;
  /** Khoảng lệch tính từ đáy màn hình (px), có thể âm để đẩy widget xuống thấp hơn */
  bottomOffset?: number;
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
const MODEL_JSON_TIMEOUT_MS = 10000;
const WIDGET_READY_TIMEOUT_MS = 10000;

type Live2DWidgetGlobal = {
  init?: (options: unknown) => unknown;
  config?: Record<string, unknown>;
};

type FrameWindow = Window & {
  L2Dwidget?: Live2DWidgetGlobal;
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

// Viết lại toàn bộ document bên trong iframe để widget chạy tách biệt,
// tránh việc thao tác DOM va chạm với cây React của trang host (nguyên nhân gây lỗi removeChild).
function writeFrameDocument(
  doc: Document,
  opts: { position: 'left' | 'right'; width: number; height: number; bottomOffset: number },
): void {
  doc.open();
  doc.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  html, body { margin: 0; width: 100%; height: 100%; overflow: visible; background: transparent; }
  #live2d-root {
    position: fixed;
    bottom: ${opts.bottomOffset}px;
    ${opts.position}: 0;
    width: ${opts.width}px;
    height: ${opts.height}px;
    z-index: 9999;
    pointer-events: none;
    overflow: visible;
  }
</style>
</head>
<body>
<div id="live2d-root"></div>
</body>
</html>`);
  doc.close();
}

function loadFrameScript(doc: Document, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = doc.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    doc.body.appendChild(script);
  });
}

function waitForElement(win: Window, doc: Document, selector: string, timeoutMs: number): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const tick = () => {
      const el = doc.querySelector(selector) as HTMLElement | null;
      if (el) {
        resolve(el);
        return;
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out while waiting for Live2D widget container (${selector})`));
        return;
      }

      win.requestAnimationFrame(tick);
    };

    win.requestAnimationFrame(tick);
  });
}

export default function Live2DWidget({
  modelName,
  baseUrl = DEFAULT_BASE_URL,
  style,
  className,
  position = 'right',
  width = 180,
  height = 300,
  scale = 1,
  bottomOffset = 0,
  opacity = 0.8,
  hoverOpacity = 0.2,
  showOnMobile = true,
  random = false,
  onLoad,
  onError,
  onClick,
  fallback,
}: Live2DWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
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
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    let mounted = true;

    const finishWithError = (err: unknown) => {
      if (!mounted) {
        return;
      }
      const normalizedError = err instanceof Error ? err : new Error(String(err));
      setError(normalizedError);
      setIsLoading(false);
      onErrorRef.current?.(normalizedError);
    };

    setIsLoading(true);
    setError(null);

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow as FrameWindow | null;
    if (!doc || !win) {
      finishWithError(new Error('Live2D widget iframe document is unavailable'));
      return;
    }

    writeFrameDocument(doc, { position, width, height, bottomOffset });

    void validateModelJson(modelJsonPath)
      .then(() => loadFrameScript(doc, LIVE2D_SCRIPT_SRC))
      .then(() => loadFrameScript(doc, LIVE2D_CHUNK_SCRIPT_SRC))
      .then(() => {
        if (!mounted) {
          return;
        }

        if (!win.L2Dwidget?.init) {
          throw new Error('Live2D widget API is unavailable after script load');
        }

        const initResult = win.L2Dwidget.init({
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

        return Promise.resolve(initResult).then(() => undefined);
      })
      .then(() => waitForElement(win, doc, '#live2d-widget', WIDGET_READY_TIMEOUT_MS))
      .then((widgetNode) => {
        if (!mounted) {
          return;
        }

        const mountNode = doc.querySelector('#live2d-root') as HTMLElement | null;
        if (mountNode && widgetNode.parentElement !== mountNode) {
          mountNode.appendChild(widgetNode);
        }

        widgetNode.style.pointerEvents = 'auto';
        widgetNode.style.transform = `scale(${scale})`;
        widgetNode.style.transformOrigin = position === 'right' ? 'right bottom' : 'left bottom';

        const widgetCanvas = doc.querySelector('#live2dcanvas') as HTMLElement | null;
        if (widgetCanvas) {
          widgetCanvas.style.pointerEvents = 'auto';
        }

        setIsLoading(false);
        onLoadRef.current?.();
      })
      .catch((err) => {
        finishWithError(err);
      });

    // Iframe bọc ngoài dùng pointer-events: none để không chặn thao tác trên trang host,
    // nên phải chuyển tiếp sự kiện chuột của host vào bên trong iframe để widget vẫn theo dõi/tap được.
    const relayEvent = (type: 'mousemove' | 'click') => (event: MouseEvent) => {
      const hitTarget = doc.elementFromPoint(event.clientX, event.clientY);
      const target: EventTarget = hitTarget ?? doc;

      const forwarded = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
      });

      target.dispatchEvent(forwarded);

      if (type === 'click' && hitTarget instanceof Element && hitTarget.closest('#live2d-widget, #live2dcanvas')) {
        onClickRef.current?.();
      }
    };

    const relayMouseMove = relayEvent('mousemove');
    const relayClick = relayEvent('click');

    window.addEventListener('mousemove', relayMouseMove);
    window.addEventListener('click', relayClick);

    return () => {
      mounted = false;
      window.removeEventListener('mousemove', relayMouseMove);
      window.removeEventListener('click', relayClick);

      try {
        doc.open();
        doc.write('');
        doc.close();
      } catch {
        // Ignore cleanup races when the iframe has already been torn down by the browser.
      }
    };
  }, [modelJsonPath, position, width, height, scale, bottomOffset, opacity, hoverOpacity, showOnMobile]);

  // Hiển thị fallback khi đang load
  if (isLoading && fallback) {
    return <>{fallback}</>;
  }

  // Hiển thị error nếu có
  if (error) {
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      title="Live2D Widget"
      aria-hidden="true"
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 0,
        background: 'transparent',
        zIndex: 9999,
        pointerEvents: 'none',
        ...style,
      }}
    />
  );
}

// Export danh sách models và helper
export { BUILT_IN_MODELS };
export const getRandomModel = (): ModelName => {
  const randomIndex = Math.floor(Math.random() * BUILT_IN_MODELS.length);
  return BUILT_IN_MODELS[randomIndex];
};
