'use client';
import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
// Danh sách models có sẵn
const BUILT_IN_MODELS = [
    'histoire', 'bilibili-22', 'bilibili-33', 'cat-black', 'cat-white',
    'chino', 'date', 'ganyu', 'hallo', 'haruto', 'hibiki', 'HK416-1-normal',
    'HK416-2-destroy', 'HK416-2-normal', 'Kar98k-normal', 'kobayaxi', 'koharu',
    'kp31', 'live_uu', 'mai', 'murakumo', 'Pio', 'platelet', 'platelet_2',
    'potion-Maker-Pio', 'rem', 'rem_2', 'senko', 'shizuku', 'shizuku_48',
    'shizuku_pajama', 'terisa', 'tia', 'umaru', 'uni', 'wed_16', 'xisitina', 'z16'
];
const DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/2hjaito/next-live2d/refs/heads/main/models';
const LIVE2D_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
const LIVE2D_CHUNK_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.0.min.js';
const MODEL_JSON_TIMEOUT_MS = 10000;
const WIDGET_READY_TIMEOUT_MS = 10000;
function buildModelJsonPath(baseUrl, model) {
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
    const normalizedModel = model
        .split('/')
        .filter(Boolean)
        .map((segment) => encodeURIComponent(segment))
        .join('/');
    return `${normalizedBaseUrl}/${normalizedModel}/model.json`;
}
async function validateModelJson(modelJsonPath) {
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
        let parsed;
        try {
            parsed = JSON.parse(raw);
        }
        catch {
            throw new Error(`Model JSON is invalid at ${modelJsonPath}`);
        }
        if (!parsed || typeof parsed !== 'object') {
            throw new Error(`Model JSON has unexpected shape at ${modelJsonPath}`);
        }
    }
    catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error(`Timed out while loading model JSON: ${modelJsonPath}`);
        }
        throw err;
    }
    finally {
        window.clearTimeout(timeout);
    }
}
// Viết lại toàn bộ document bên trong iframe để widget chạy tách biệt,
// tránh việc thao tác DOM va chạm với cây React của trang host (nguyên nhân gây lỗi removeChild).
function writeFrameDocument(doc, opts) {
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
function loadFrameScript(doc, src) {
    return new Promise((resolve, reject) => {
        const script = doc.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        doc.body.appendChild(script);
    });
}
function waitForElement(win, doc, selector, timeoutMs) {
    return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        const tick = () => {
            const el = doc.querySelector(selector);
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
export default function Live2DWidget({ modelName, baseUrl = DEFAULT_BASE_URL, style, className, position = 'right', width = 180, height = 300, scale = 1, bottomOffset = 0, opacity = 0.8, hoverOpacity = 0.2, showOnMobile = true, random = false, onLoad, onError, onClick, fallback, }) {
    const iframeRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const randomModelRef = useRef(null);
    const onClickRef = useRef(onClick);
    const onLoadRef = useRef(onLoad);
    const onErrorRef = useRef(onError);
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
        const finishWithError = (err) => {
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
        const win = iframe.contentWindow;
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
            const mountNode = doc.querySelector('#live2d-root');
            if (mountNode && widgetNode.parentElement !== mountNode) {
                mountNode.appendChild(widgetNode);
            }
            widgetNode.style.pointerEvents = 'auto';
            widgetNode.style.transform = `scale(${scale})`;
            widgetNode.style.transformOrigin = position === 'right' ? 'right bottom' : 'left bottom';
            const widgetCanvas = doc.querySelector('#live2dcanvas');
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
        const relayEvent = (type) => (event) => {
            const hitTarget = doc.elementFromPoint(event.clientX, event.clientY);
            const target = hitTarget ?? doc;
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
            }
            catch {
                // Ignore cleanup races when the iframe has already been torn down by the browser.
            }
        };
    }, [modelJsonPath, position, width, height, scale, bottomOffset, opacity, hoverOpacity, showOnMobile]);
    // Hiển thị fallback khi đang load
    if (isLoading && fallback) {
        return _jsx(_Fragment, { children: fallback });
    }
    // Hiển thị error nếu có
    if (error) {
        return null;
    }
    return (_jsx("iframe", { ref: iframeRef, title: "Live2D Widget", "aria-hidden": "true", className: className, style: {
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
        } }));
}
// Export danh sách models và helper
export { BUILT_IN_MODELS };
export const getRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * BUILT_IN_MODELS.length);
    return BUILT_IN_MODELS[randomIndex];
};
