'use client';
import { useEffect, useState, useCallback } from 'react';

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

const DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/dangtranhuu/next-live2d/refs/heads/main/models';

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

  // Chọn model ngẫu nhiên hoặc theo prop
  const getModelName = useCallback(() => {
    if (random) {
      const randomIndex = Math.floor(Math.random() * BUILT_IN_MODELS.length);
      return BUILT_IN_MODELS[randomIndex];
    }
    return modelName || 'histoire';
  }, [random, modelName]);

  const [selectedModel] = useState(getModelName);

  const modelJsonPath = `${baseUrl}/${selectedModel}/model.json`;

  useEffect(() => {
    // ✅ Đã khởi tạo rồi thì không lặp lại
    if ((window as any).__live2d_initialized) return;

    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
    script.async = true;

    script.onerror = () => {
      const err = new Error('Failed to load Live2D widget script');
      setError(err);
      setIsLoading(false);
      onError?.(err);
    };

    script.onload = () => {
      if ((window as any).__live2d_initialized) return;

      try {
        // @ts-ignore
        window.L2Dwidget?.init({
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

        (window as any).__live2d_initialized = true;

        const waitForWidget = () => {
          const el = document.querySelector('#live2d-widget') as HTMLElement;
          if (!el) return requestAnimationFrame(waitForWidget);

          Object.assign(el.style, {
            position: 'fixed',
            [position]: '0px',
            transition: 'bottom 0.3s ease-in-out',
            zIndex: '9999',
            pointerEvents: onClick ? 'auto' : 'none',
            cursor: onClick ? 'pointer' : 'default',
            ...style,
          });

          if (className) {
            el.className += ' ' + className;
          }

          // Thêm click handler
          if (onClick) {
            el.addEventListener('click', onClick);
          }

          setIsLoading(false);
          onLoad?.();
        };

        waitForWidget();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize Live2D');
        setError(error);
        setIsLoading(false);
        onError?.(error);
      }
    };

    document.body.appendChild(script);

    return () => {
      // ✅ cleanup an toàn tuyệt đối
      const widget = document.querySelector('#live2d-widget');
      if (widget?.parentNode) {
        if (onClick) {
          widget.removeEventListener('click', onClick);
        }
        widget.parentNode.removeChild(widget);
      }

      // ✅ xóa flag để có thể re-init lần sau nếu cần
      (window as any).L2Dwidget = undefined;
      (window as any).__live2d_initialized = false;
    };
  }, [modelJsonPath, style, className, position, width, height, opacity, hoverOpacity, showOnMobile, onClick, onLoad, onError]);

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
