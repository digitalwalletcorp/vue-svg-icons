# Vue SVG Icons

[![NPM Version](https://img.shields.io/npm/v/%40digitalwalletcorp%2Fvue-svg-icons)](https://www.npmjs.com/package/@digitalwalletcorp/vue-svg-icons) [![License](https://img.shields.io/npm/l/%40digitalwalletcorp%2Fvue-svg-icons)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/github/actions/workflow/status/digitalwalletcorp/vue-svg-icons/ci.yml?branch=main)](https://github.com/digitalwalletcorp/vue-svg-icons/actions) [![Test Coverage](https://img.shields.io/codecov/c/github/digitalwalletcorp/vue-svg-icons.svg)](https://codecov.io/gh/digitalwalletcorp/vue-svg-icons)

A set of original SVG icons shipped directly as Vue 3 components. Includes independent interpretations of Unicode emoji characters as well as common UI components.

Every icon is drawn from scratch using basic SVG primitives. No emoji font glyphs are referenced or traced, ensuring identical rendering across all environments with zero font licensing obligations.

![Icon catalog](https://raw.githubusercontent.com/digitalwalletcorp/vue-svg-icons/main/docs/catalog.png)

#### ✨ Features

* **Zero configuration required**: Pre-compiled components that work out of the box. No extra bundler or plugin setups (like `@vitejs/plugin-vue` or transpilation rules) needed in your project.
* **Tree-shakeable**: Only import what you use. Importing a single icon won't bundle the rest of the library.
* **Fully typed**: Type definitions are included, allowing your editor to auto-complete props and default values automatically.
* **SSR safe**: Fully compatible with server-side rendering. Animations safely trigger after mounting.
* **Scales with text**: Defaults to `1.2em` in size, naturally matching surrounding inline text without extra CSS.
* **Collision-free IDs**: Components utilizing gradients or clipping paths use isolated element IDs, preventing display bugs when rendering multiple identical icons on the same page.
* **Peer dependency**: Requires Vue 3.5 or later.

#### 📦 Installation

```bash
npm install @digitalwalletcorp/vue-svg-icons
# or
yarn add @digitalwalletcorp/vue-svg-icons

```

#### 📖 Usage

Import the icons you need and place them in your template. All icons accept the `size` prop; refer to the Props table below for icon-specific properties.

```vue
<script setup lang="ts">
import {
  SvgWhiteHeavyCheckMark,
  SvgDownload,
  SvgChevron,
  SvgClock
} from '@digitalwalletcorp/vue-svg-icons';
</script>

<template>
  <p>Upload finished <SvgWhiteHeavyCheckMark /></p>

  <SvgDownload :size="20" color="#c0392b" />
  <SvgChevron direction="up" />
  <SvgClock :hour="9" :minute="41" :duration="10" />
</template>

```

#### 🔧 Props

*Note: Default values vary per icon. Your editor will auto-complete accepted values through the included type definitions.*

| Prop | Type | Description |
| --- | --- | --- |
| `size` | `number \| string` | Icon size. Numbers are treated as pixels; strings accept any valid CSS length unit. Defaults to `1.2em` to match surrounding font size. |
| `color` | `string` | Stroke or fill color. Line-art icons inherit the surrounding text color by default (`currentColor`). |
| `strokeWidth` | `number` | Line thickness relative to the icon's 64-unit coordinate grid. |
| `direction` | string literal | Orientation of the icon (e.g., `'up'`, `'down'`, `'left'`, `'right'`, etc.). |
| `variant` | `'large' \| 'medium' \| 'small'` | Adjusts the relative scale of the drawn shape itself, independent of `size`. |
| `filled` | `boolean` | Renders the icon with a solid fill instead of an outline. |
| `slashed` | `boolean` | Overlays a slash over the icon to indicate a "hidden" or "disabled" state. |
| `bgColor` / `borderColor` / `arrowColor` | `string` | For button-style icons: sets the background plate color, border color, and foreground symbol color. |
| `cornerRadius` | `number` | For button-style icons: controls the corner radius of the background plate. |
| `topLineWidth` | `number` | Thickness of the top horizontal bar (e.g., on download icons). |
| `duration` | `number` | Animation duration in seconds. Lower values run faster; `0` stops the animation completely. |
| `hour` / `minute` | `number` | Sets the initial time displayed on clock icons. |

#### 📚 Icon Catalog

##### Unicode Emoji Icons

| Component | Unicode Character | Accepted Props |
| --- | --- | --- |
| `SvgAnticlockwiseOpenCircleArrows` | 🔄 `ANTICLOCKWISE DOWNWARDS AND UPWARDS OPEN CIRCLE ARROWS` | `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |
| `SvgArrowButton` | ➡️ `BLACK RIGHTWARDS ARROW` | `direction`, `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |
| `SvgBooks` | 📚 `BOOKS` | `size` |
| `SvgCalendar` | 📅 `CALENDAR` | `size` |
| `SvgClock` | 🕓 `CLOCK FACE FOUR OCLOCK` | `hour`, `minute`, `duration`, `size` |
| `SvgCrossMark` | ❌ `CROSS MARK` | `size` |
| `SvgDiamond` | 🔷 `LARGE BLUE DIAMOND` | `variant`, `size`, `color` |
| `SvgEyes` | 👀 `EYES` | `size` |
| `SvgGear` | ⚙️ `GEAR` | `size` |
| `SvgHeavyMinusSign` | ➖ `HEAVY MINUS SIGN` | `size`, `color` |
| `SvgHeavyPlusSign` | ➕ `HEAVY PLUS SIGN` | `size`, `color` |
| `SvgHourglass` | ⏳ `HOURGLASS WITH FLOWING SAND` | `duration`, `size` |
| `SvgMagnifyingGlass` | 🔍 `LEFT-POINTING MAGNIFYING GLASS` | `direction`, `size` |
| `SvgMemo` | 📝 `MEMO` | `size` |
| `SvgMoneyBag` | 💰 `MONEY BAG` | `size` |
| `SvgNegativeSquaredCrossMark` | ❎ `NEGATIVE SQUARED CROSS MARK` | `size` |
| `SvgNoOneUnderEighteen` | 🔞 `NO ONE UNDER EIGHTEEN` | `size` |
| `SvgOpenBook` | 📖 `OPEN BOOK` | `size` |
| `SvgPrinter` | 🖨 `PRINTER` | `size` |
| `SvgPushpin` | 📌 `PUSHPIN` | `direction`, `size` |
| `SvgRoundPushpin` | 📍 `ROUND PUSHPIN` | `size` |
| `SvgTrashbox` | 🗑 `WASTEBASKET` | `size` |
| `SvgTriangleButton` | 🔽 `DOWN-POINTING SMALL RED TRIANGLE` | `direction`, `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |
| `SvgTriangleDoubleButton` | ⏬ `BLACK DOWN-POINTING DOUBLE TRIANGLE` | `direction`, `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |
| `SvgWarningSign` | ⚠️ `WARNING SIGN` | `size` |
| `SvgWastebasket` | 🗑 `WASTEBASKET` | `size` |
| `SvgWhiteHeavyCheckMark` | ✅ `WHITE HEAVY CHECK MARK` | `size` |
| `SvgWhiteMediumStar` | ⭐️ `WHITE MEDIUM STAR` | `size` |

##### Original UI Icons

Standalone UI icons with no direct emoji counterparts.

| Component | Accepted Props |
| --- | --- |
| `SvgChevronDouble` | `direction`, `size`, `color`, `strokeWidth`, `filled` |
| `SvgChevron` | `direction`, `size`, `color`, `strokeWidth`, `filled` |
| `SvgClipboardCopy` | `size` |
| `SvgCornerDiagonal` | `direction`, `size`, `color`, `strokeWidth` |
| `SvgCornerDot` | `direction`, `size`, `color` |
| `SvgDot` | `size`, `color` |
| `SvgDownloadAll` | `size`, `color`, `strokeWidth`, `topLineWidth` |
| `SvgDownload` | `size`, `color`, `strokeWidth` |
| `SvgEye` | `size`, `color`, `strokeWidth`, `slashed` |
| `SvgFitScreen` | `size`, `color` |
| `SvgPointingTriangle` | `direction`, `size`, `color` |
| `SvgReset` | `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |

#### 🎨 Artwork & Copyright

* All icons in this package are original SVG artwork drawn from scratch with assistance from generative AI.
* The icons are independently drawn and do not trace or incorporate artwork from existing emoji fonts or icon sets.
* Contains no embedded `<text>` elements or font outlines; all text-like elements are rendered strictly as SVG paths.
* Component naming follows formal character names from the official Unicode Character Database.
* The package is released under the MIT License. No copyright is asserted over the icon artwork itself, and you are free to use, modify, and redistribute the artwork without attribution.

#### 📜 License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
