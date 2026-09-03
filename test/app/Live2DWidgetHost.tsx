'use client'

import { useEffect, useState } from 'react'
import { Live2DWidget } from 'next-live2d'

const MODEL_STORAGE_KEY = 'next-live2d-model'
const MODEL_CHANGE_EVENT = 'next-live2d:model-change'

export default function Live2DWidgetHost() {
  const [model, setModel] = useState('Kar98k-normal')

  useEffect(() => {
    const stored = window.localStorage.getItem(MODEL_STORAGE_KEY)
    if (stored) {
      setModel(stored)
    }

    const onModelChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>
      if (typeof customEvent.detail === 'string' && customEvent.detail) {
        setModel(customEvent.detail)
      }
    }

    window.addEventListener(MODEL_CHANGE_EVENT, onModelChange)
    return () => {
      window.removeEventListener(MODEL_CHANGE_EVENT, onModelChange)
    }
  }, [])

  return (
    <Live2DWidget
      modelName={model}
      width={200}
      height={400}
      scale={0.9}
      bottomOffset={-20}
    />
  )
}
