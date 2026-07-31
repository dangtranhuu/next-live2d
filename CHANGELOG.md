# 📦 Changelog – next-live2d

All notable changes to this project are documented here.

---

## [2.0.5] - 2026-07-31

### 🐛 Fixed
- Hardened DOM cleanup during widget lifecycle transitions to reduce `removeChild` race crashes.

### 🧪 Test App
- Reworked the demo runtime to isolate Live2D execution from App Router UI updates.
- Restored demo interactions for model switch and mouse tracking in the isolated widget.
- Increased isolated widget viewport sizing so taller models are less likely to be clipped.

---

## [2.0.4] - 2026-07-27

### 🐛 Fixed
- Fixed model switching where only the first model persisted after selection changes.
- Reset Live2D widget runtime config before each re-initialization so `jsonPath` updates correctly.
- Updated script loading flow to include both `L2Dwidget.min.js` and `L2Dwidget.0.min.js`, preventing partial runtime initialization.

---

## [2.0.3] - 2026-07-27

### 🐛 Fixed
- Fixed Live2D initialization context binding (`this`) to prevent runtime failures such as `Cannot read properties of undefined (reading 'emit')`.
- Added preflight model JSON validation before widget initialization to fail fast with actionable errors.

### ⚙️ Dev Experience
- Added `dev:test:clean` and test app `dev:clean` scripts to clear stale `.next` artifacts and reduce chunk mismatch issues in local package-link workflows.

---

## [2.0.2] - 2026-07-27

### 🔧 Changed
- Updated default model host URL to use the new GitHub username `2hjaito`.
- Updated package metadata links (`repository`, `bugs`) to the new GitHub profile.

### 📚 Documentation
- Updated README GitHub badge/link to the new repository owner.
- Updated demo page GitHub link to keep showcase links consistent.

---

## [2.0.1] - 2026-07-27

### 🐛 Fixed
- Hardened Live2D script loading to avoid duplicate injection during React StrictMode remounts.
- Improved initialization flow to reduce async race conditions in Next.js App Router projects.
- Added timeout guard while waiting for `#live2d-widget` to prevent long-running render loops.
- Improved widget cleanup across unmount/remount transitions to reduce UI freezes.
- Added safer Promise handling around widget initialization to prevent uncaught runtime failures.

### 🔧 Changed
- Marked package root entry as client module for safer Next.js import boundaries.
- Refined model selection lifecycle for random mode and prop-driven updates.

### 📚 Documentation
- Added Next.js stability integration guidance to README.
- Added latest release notes section and changelog links in README.
- Updated demo page content to include release timeline and stability highlights.

---

## [2.0.0] - 2026-03-07

### 🚀 Major Release

### ✨ Added
- **Custom Base URL**: `baseUrl` prop for self-hosting models
- **Position Control**: `position` prop (`'left'` | `'right'`)
- **Size Control**: `width` and `height` props
- **Opacity Control**: `opacity` and `hoverOpacity` props
- **Mobile Toggle**: `showOnMobile` prop
- **Random Model**: `random` prop to pick a random built-in model
- **Loading State**: `fallback` prop for loading UI
- **Callbacks**: `onLoad`, `onError`, `onClick` props
- **TypeScript Exports**: `Live2DWidgetProps`, `ModelName`, `BUILT_IN_MODELS`, `getRandomModel()`

### 🔧 Changed
- **React 19 Support**: Updated peer dependencies to `react >= 18` (no upper limit)
- **Improved Defaults**: Better default values for all props
- **Enhanced Cleanup**: More robust cleanup on unmount

### 📚 Documentation
- Complete README rewrite with all new features
- Added TypeScript usage examples
- Updated props reference table

---

## [1.4.1] - 2025-06-24

### 🐛 Fixed
- Avoid `delete window.L2Dwidget` to prevent strict mode crash
- Improve unmount cleanup for Live2D widget

### 🧹 Chore
- Version bump and package metadata update
- Prepare release script for npm

---

## [1.4.0] - 2025-06-16

### ✨ Added
- `style` and `className` props to `<Live2DWidget />`
- Built-in support for dynamic styling and positioning

### 🧼 Refactor
- Prevent duplicate widget initialization via `__live2d_initialized` flag
- Cleanup widget DOM on component unmount

---

## [1.3.2] - 2025-06-14

### 🧼 Style
- Removed legacy `bottom` styling from inline props

---

## [1.3.1] - 2025-06-12

### 🧱 Maintenance
- Updated `devDependencies` to React 18 for consistency

---

## [1.3.0] - 2025-06-11

### ✨ Added
- Allow custom `style` and `className` props
- Improve default behavior and remove `scrollIntoView`

---

## [1.2.x] - 2025-06-09 to 06-10

### 🛠 Fixes & Model Management
- Renamed all `*.model.json` or `index.json` to `model.json` for standardization
- Fixed model paths: `senko`, `z16`, `haruto`, `hibiki`, `rem`, etc.
- Responsive tweaks for mobile
- UI fixes for widget positioning

---

## [1.2.0] - 2025-06-05

### ✨ Added
- Syntax highlighting for example code (`react-syntax-highlighter`)
- Live code block preview on the demo page
- First working demo of model switching

### 🐛 Fixed
- Type declarations for `react-syntax-highlighter` on Vercel

---

## [1.1.0] - 2025-06-04

### 🧼 Refactor
- Renamed all models to use standard `model.json` filename
- Removed unused PixiJS logic
- Migrated to pure CDN-based `live2d-widget`

---

## [1.0.0] - 2025-06-03

### 🐣 Initial release
- Simple `<Live2DWidget modelName="..." />` component
- Injects `live2d-widget` from CDN
- Supports 20+ Live2D models
