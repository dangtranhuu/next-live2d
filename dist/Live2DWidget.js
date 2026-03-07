'use client';
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from 'react';
// Danh sách models có sẵn
const BUILT_IN_MODELS = [
    'histoire', 'bilibili-22', 'bilibili-33', 'cat-black', 'cat-white',
    'chino', 'date', 'ganyu', 'hallo', 'haruto', 'hibiki', 'HK416-1-normal',
    'HK416-2-destroy', 'HK416-2-normal', 'Kar98k-normal', 'kobayaxi', 'koharu',
    'kp31', 'live_uu', 'mai', 'murakumo', 'Pio', 'platelet', 'platelet_2',
    'potion-Maker-Pio', 'rem', 'rem_2', 'senko', 'shizuku', 'shizuku_48',
    'shizuku_pajama', 'terisa', 'tia', 'umaru', 'uni', 'wed_16', 'xisitina', 'z16'
];
const DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/dangtranhuu/next-live2d/refs/heads/main/models';
export default function Live2DWidget({ modelName, baseUrl = DEFAULT_BASE_URL, style, className, position = 'right', width = 180, height = 300, opacity = 0.8, hoverOpacity = 0.2, showOnMobile = true, random = false, onLoad, onError, onClick, fallback, }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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
        if (window.__live2d_initialized)
            return;
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
            if (window.__live2d_initialized)
                return;
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
                window.__live2d_initialized = true;
                const waitForWidget = () => {
                    const el = document.querySelector('#live2d-widget');
                    if (!el)
                        return requestAnimationFrame(waitForWidget);
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
            }
            catch (err) {
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
            window.L2Dwidget = undefined;
            window.__live2d_initialized = false;
        };
    }, [modelJsonPath, style, className, position, width, height, opacity, hoverOpacity, showOnMobile, onClick, onLoad, onError]);
    // Hiển thị fallback khi đang load
    if (isLoading && fallback) {
        return _jsx(_Fragment, { children: fallback });
    }
    // Hiển thị error nếu có
    if (error) {
        return null;
    }
    return null;
}
// Export danh sách models và helper
export { BUILT_IN_MODELS };
export const getRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * BUILT_IN_MODELS.length);
    return BUILT_IN_MODELS[randomIndex];
};
