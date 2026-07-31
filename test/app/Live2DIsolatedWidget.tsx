'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Live2DIsolatedWidgetProps = {
  modelName?: string
  width?: number
  height?: number
  scale?: number
  bottomOffset?: number
  position?: 'left' | 'right'
  baseUrl?: string
}

const DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/2hjaito/next-live2d/refs/heads/main/models'
const MODEL_STORAGE_KEY = 'next-live2d-model'
const MODEL_CHANGE_EVENT = 'next-live2d:model-change'

function buildModelJsonPath(baseUrl: string, model: string): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  const normalizedModel = model
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${normalizedBaseUrl}/${normalizedModel}/model.json`
}

export default function Live2DIsolatedWidget({
  modelName = 'Kar98k-normal',
  width = 156,
  height = 420,
  scale = 0.82,
  bottomOffset = -54,
  position = 'right',
  baseUrl = DEFAULT_BASE_URL,
}: Live2DIsolatedWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [activeModel, setActiveModel] = useState(() => {
    if (typeof window === 'undefined') {
      return modelName
    }

    return window.localStorage.getItem(MODEL_STORAGE_KEY) || modelName
  })
  const modelJsonPath = useMemo(() => buildModelJsonPath(baseUrl, activeModel), [baseUrl, activeModel])

  useEffect(() => {
    const onModelChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      if (typeof customEvent.detail === 'string' && customEvent.detail) {
        setActiveModel(customEvent.detail)
      }
    }

    window.addEventListener(MODEL_CHANGE_EVENT, onModelChange)

    return () => {
      window.removeEventListener(MODEL_CHANGE_EVENT, onModelChange)
    }
  }, [])

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) {
      return
    }

    const doc = iframe.contentDocument
    const win = iframe.contentWindow
    if (!doc || !win) {
      return
    }

    doc.open()
    doc.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      background: transparent;
    }
    #live2d-root {
      position: fixed;
      bottom: ${bottomOffset}px;
      ${position}: 0;
      width: ${width}px;
      height: ${height}px;
      z-index: 9999;
      pointer-events: none;
      overflow: visible;
    }
  </style>
</head>
<body>
  <div id="live2d-root"></div>
</body>
</html>`)
    doc.close()

    const run = () => {
      const scriptMain = doc.createElement('script')
      scriptMain.src = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.min.js'
      scriptMain.async = true

      scriptMain.onload = () => {
        const scriptChunk = doc.createElement('script')
        scriptChunk.src = 'https://cdn.jsdelivr.net/npm/live2d-widget@3.1.4/lib/L2Dwidget.0.min.js'
        scriptChunk.async = true

        scriptChunk.onload = () => {
          const widget = (win as Window & { L2Dwidget?: { init?: (options: unknown) => void } }).L2Dwidget
          if (!widget?.init) {
            return
          }

          widget.init({
            model: {
              jsonPath: modelJsonPath,
            },
            display: {
              position,
              width,
              height,
            },
            mobile: {
              show: true,
            },
            react: {
              opacityDefault: 0.8,
              opacityOnHover: 0.2,
            },
          })

          const widgetNode = doc.querySelector('#live2d-widget') as HTMLElement | null
          const widgetCanvas = doc.querySelector('#live2dcanvas') as HTMLElement | null
          const mountNode = doc.querySelector('#live2d-root') as HTMLElement | null

          if (mountNode && widgetNode) {
            mountNode.appendChild(widgetNode)
          }

          if (widgetNode) {
            widgetNode.style.pointerEvents = 'auto'
            widgetNode.style.transform = `scale(${scale})`
            widgetNode.style.transformOrigin = position === 'right' ? 'right bottom' : 'left bottom'
          }

          if (widgetCanvas) {
            widgetCanvas.style.pointerEvents = 'auto'
          }
        }

        doc.body.appendChild(scriptChunk)
      }

      doc.body.appendChild(scriptMain)
    }

    run()

    const relayMouseMove = (event: MouseEvent) => {
      const relayEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
      })

      win.dispatchEvent(relayEvent)
      doc.dispatchEvent(relayEvent)
    }

    const relayClick = (event: MouseEvent) => {
      const relayEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: event.clientX,
        clientY: event.clientY,
        screenX: event.screenX,
        screenY: event.screenY,
      })

      win.dispatchEvent(relayEvent)
      doc.dispatchEvent(relayEvent)
    }

    window.addEventListener('mousemove', relayMouseMove)
    window.addEventListener('click', relayClick)

    return () => {
      window.removeEventListener('mousemove', relayMouseMove)
      window.removeEventListener('click', relayClick)
    }
  }, [bottomOffset, height, modelJsonPath, position, scale, width])

  return (
    <iframe
      ref={iframeRef}
      title="Live2D Isolated Widget"
      aria-hidden="true"
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
      }}
    />
  )
}
