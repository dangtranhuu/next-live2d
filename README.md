A simple React component to embed Live2D models (via `live2d-widget`) in Next.js projects.

[![npm](https://img.shields.io/npm/v/next-live2d?style=flat-square)](https://www.npmjs.com/package/next-live2d)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![GitHub Repo stars](https://img.shields.io/github/stars/2hjaito/next-live2d?style=social)](https://github.com/2hjaito/next-live2d)
[![npm](https://img.shields.io/npm/dm/next-live2d.svg)](https://www.npmjs.com/package/next-live2d)




![Live2D Widget Preview](./public/main.gif)

## 📢 Latest Update

### v2.0.2 - GitHub Username Migration

- Updated default `baseUrl` host from the old GitHub username to `2hjaito`.
- Updated repository links and badges to the new GitHub profile.
- Kept full compatibility for existing model paths ending with `/model.json`.

Full history:

- English: [CHANGELOG.md](./CHANGELOG.md)
- Vietnamese: [CHANGELOG-vi.md](./CHANGELOG-vi.md)

## ✨ Features

- 🧠 Auto-load [Live2D Widget](https://github.com/xiazeyu/live2d-widget.js)
- ⚙️ Zero-config usage with App Router
- 🎒 Comes with 35+ built-in models
- ✅ SSR-safe using `dynamic(() => import(...), { ssr: false })`
- 🎲 Random model selection
- 🎨 Full customization (position, size, opacity, etc.)
- 📦 Custom base URL support (self-host models)
- 🔄 Loading state & error handling
- 💪 TypeScript support with exported types
- ⚡ React 18 & 19 compatible

---

## 🚀 Installation

```bash
npm install next-live2d
```


🧩 Usage in Next.js (app/layout.tsx)
```tsx
'use client'

import { Live2DWidget } from 'next-live2d'

import { ReactNode } from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Live2DWidget modelName="mai" />
      </body>
    </html>
  )
}
```

## 🔧 Advanced Usage

## 🛡️ Next.js Stability Guide

To minimize runtime issues in production projects:

1. Render `Live2DWidget` only in Client Components.
2. Avoid rendering the widget from Server Components directly.
3. Keep one widget instance per page/layout to avoid competing initializations.
4. Prefer stable `modelName` values across frequent rerenders.
5. For custom model hosting, ensure `model.json` and textures are accessible with correct CORS headers.

Recommended pattern for App Router:

```tsx
'use client'

import { Live2DWidget } from 'next-live2d'

export default function Live2DClientWidget() {
  return <Live2DWidget modelName="histoire" />
}
```

### Basic Customization

```tsx
<Live2DWidget
  modelName="senko"
  position="left"
  width={200}
  height={350}
  opacity={0.9}
  hoverOpacity={0.3}
/>
```

### Random Model

```tsx
<Live2DWidget random />
```

### Custom Base URL (Self-host models)

```tsx
<Live2DWidget
  modelName="my-model"
  baseUrl="https://my-cdn.com/live2d-models"
/>
```

### With Loading State & Callbacks

```tsx
<Live2DWidget
  modelName="histoire"
  fallback={<div>Loading Live2D...</div>}
  onLoad={() => console.log('Model loaded!')}
  onError={(err) => console.error('Failed:', err)}
  onClick={() => alert('You clicked the model!')}
/>
```

### Tailwind CSS

```tsx
<Live2DWidget
  modelName="senko"
  className="bottom-0 right-0 fixed z-50 opacity-80"
  style={{ width: 200, height: 300 }}
/>
```

## 📋 Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelName` | `string` | `'histoire'` | Name of the model folder (must include `model.json`) |
| `baseUrl` | `string` | GitHub raw URL | Custom base URL to load models from |
| `position` | `'left' \| 'right'` | `'right'` | Widget position on screen |
| `width` | `number` | `180` | Widget width in pixels |
| `height` | `number` | `300` | Widget height in pixels |
| `opacity` | `number` | `0.8` | Default opacity (0-1) |
| `hoverOpacity` | `number` | `0.2` | Opacity when hovering (0-1) |
| `showOnMobile` | `boolean` | `true` | Show widget on mobile devices |
| `random` | `boolean` | `false` | Pick a random built-in model |
| `className` | `string` | - | Custom CSS/Tailwind classes |
| `style` | `CSSProperties` | - | Inline styles |
| `fallback` | `ReactNode` | - | Component to show while loading |
| `onLoad` | `() => void` | - | Callback when model loads |
| `onError` | `(error) => void` | - | Callback on load error |
| `onClick` | `() => void` | - | Callback when widget is clicked |

## 🧭 Versioning

- This project follows semantic versioning.
- Patch releases focus on stability and compatibility fixes.
- Minor releases add non-breaking features.
- Major releases may include behavior changes or migration notes.

## 🔤 TypeScript Support

```tsx
import { 
  Live2DWidget,
  Live2DWidgetProps,
  ModelName,
  BUILT_IN_MODELS,
  getRandomModel 
} from 'next-live2d';

// Get a random model name
const model: ModelName = getRandomModel();

// Access all built-in model names
console.log(BUILT_IN_MODELS); // ['histoire', 'bilibili-22', ...]
```

## 🧠 Tips

The Live2D widget is rendered into a #live2d-widget DOM element, positioned as fixed by default.

If you pass className or style, they will override the default style.

## 📁 Model Path
By default, the widget looks for:

### 📦 Available Built-in Models

| Model Name           | Preview (coming soon)         | Usage                                |
|----------------------|-------------------------------|--------------------------------------|
| histoire             | ![](./public/models/histoire.png)    | `<Live2DWidget modelName="histoire" />`             |
| bilibili-22          | ![](./public/models/bilibili-22.png)     | `<Live2DWidget modelName="bilibili-22" />`          |
| bilibili-33          | ![](./public/models/bilibili-33.png)    | `<Live2DWidget modelName="bilibili-33" />`          |
| cat-black            | ![](./public/models/cat-black.png)    | `<Live2DWidget modelName="cat-black" />`            |
| cat-white            | ![](./public/models/cat-white.png)   | `<Live2DWidget modelName="cat-white" />`            |
| chino                | ![](./public/models/chino.png)   | `<Live2DWidget modelName="chino" />`                |
| date                 | ![](./public/models/date.png)      | `<Live2DWidget modelName="date" />`                 |
| hallo                | ![](./public/models/hallo.png)       | `<Live2DWidget modelName="hallo" />`                |
| haruto               | ![](./public/models/haruto.png)        | `<Live2DWidget modelName="haruto" />`               |
| hibiki               | ![](./public/models/hibiki.png)     | `<Live2DWidget modelName="hibiki" />`               |
| HK416-1-normal       | ![](./public/models/HK416-1-normal.png)      | `<Live2DWidget modelName="HK416-1-normal" />`       |
| HK416-2-destroy      | ![](./public/models/HK416-2-destroy.png)   | `<Live2DWidget modelName="HK416-2-destroy" />`      |
| HK416-2-normal       | ![](./public/models/HK416-2-normal.png)     | `<Live2DWidget modelName="HK416-2-normal" />`       |
| Kar98k-normal        | ![](./public/models/Kar98k-normal.png)  | `<Live2DWidget modelName="Kar98k-normal" />`        |
| kobayaxi             | ![](./public/models/kobayaxi.png)  | `<Live2DWidget modelName="kobayaxi" />`             |
| koharu               | ![](./public/models/koharu.png)     | `<Live2DWidget modelName="koharu" />`               |
| kp31                 | ![](./public/models/kp31.png)     | `<Live2DWidget modelName="kp31" />`                 |
| live_uu              | ![](./public/models/live_uu.png)  | `<Live2DWidget modelName="live_uu" />`              |
| mai                  | ![](./public/models/mai.png)    | `<Live2DWidget modelName="mai" />`                  |
| murakumo             | ![](./public/models/murakumo.png)   | `<Live2DWidget modelName="murakumo" />`             |
| Pio                  | ![](./public/models/Pio.png)    | `<Live2DWidget modelName="Pio" />`                  |
| platelet             | ![](./public/models/platelet.png)   | `<Live2DWidget modelName="platelet" />`             |
| platelet_2           | ![](./public/models/platelet_2.png)    | `<Live2DWidget modelName="platelet_2" />`           |
| potion-Maker-Pio     | ![](./public/models/potion-Maker-Pio.png)  | `<Live2DWidget modelName="potion-Maker-Pio" />`     |
| rem                  | ![](./public/models/rem.png)    | `<Live2DWidget modelName="rem" />`                  |
| rem_2                | ![](./public/models/rem_2.png)       | `<Live2DWidget modelName="rem_2" />`                |
| shizuku              | ![](./public/models/shizuku.png)      | `<Live2DWidget modelName="shizuku" />`              |
| shizuku_48           | ![](./public/models/shizuku_48.png)     | `<Live2DWidget modelName="shizuku_48" />`           |
| shizuku_pajama       | ![](./public/models/shizuku_pajama.png)     | `<Live2DWidget modelName="shizuku_pajama" />`       |
| terisa               | ![](./public/models/terisa.png)      | `<Live2DWidget modelName="terisa" />`               |
| tia                  | ![](./public/models/tia.png)     | `<Live2DWidget modelName="tia" />`                  |
| umaru                | ![](./public/models/umaru.png)    | `<Live2DWidget modelName="umaru" />`                |
| uni                  | ![](./public/models/uni.png)       | `<Live2DWidget modelName="uni" />`                  |
| wed_16               | ![](./public/models/wed_16.png)     | `<Live2DWidget modelName="wed_16" />`               |
| xisitina             | ![](./public/models/xisitina.png)      | `<Live2DWidget modelName="xisitina" />`             |
| z16                  | ![](./public/models/z16.png)       | `<Live2DWidget modelName="z16" />`                  |
| Senko_Normals        | ![](./public/models/Senko_Normals.png)    | `<Live2DWidget modelName="Senko_Normals" />`        |


## 🧑‍💻 Author
Trần Hữu Đang
Website: [https://dangth.dev](https://dangth.dev)

📝 License
[MIT]()
