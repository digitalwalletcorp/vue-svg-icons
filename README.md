# Vue SVG Icons

[![NPM Version](https://img.shields.io/npm/v/%40digitalwalletcorp%2Fvue-svg-icons)](https://www.npmjs.com/package/@digitalwalletcorp/vue-svg-icons) [![License](https://img.shields.io/npm/l/%40digitalwalletcorp%2Fvue-svg-icons)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/github/actions/workflow/status/digitalwalletcorp/vue-svg-icons/ci.yml?branch=main)](https://github.com/digitalwalletcorp/vue-svg-icons/actions) [![Test Coverage](https://img.shields.io/codecov/c/github/digitalwalletcorp/vue-svg-icons.svg)](https://codecov.io/gh/digitalwalletcorp/vue-svg-icons)

A set of original SVG icons shipped directly as Vue 3 components. Includes independent interpretations of Unicode emoji characters as well as common UI components.

Every icon is drawn from scratch using basic SVG primitives. No emoji font glyphs are referenced or traced, ensuring identical rendering across all environments with zero font licensing obligations.

![Icon catalog](https://raw.githubusercontent.com/digitalwalletcorp/vue-svg-icons/main/docs/catalog.png)

**[Open the interactive demo](https://digitalwalletcorp.github.io/vue-svg-icons/demo/)** to browse every icon and edit its props to see how it renders.

#### ✨ Features

* **Tree-shaking**: Only import what you use. Importing a single icon won't bundle the rest of the library.
* **Fully typed**: Type definitions are included, allowing your editor to auto-complete props and default values automatically.
* **SSR-safe**: Fully compatible with server-side rendering. Animations safely trigger after mounting.
* **Scales with text**: Defaults to `1.2em` in size, naturally matching surrounding inline text without extra CSS.
* **Collision-free IDs**: Components utilizing gradients or clipping paths use isolated element IDs, preventing display bugs when rendering multiple identical icons on the same page.
* **Peer dependency**: Requires Vue 3.5 or later.

#### 📦 Installation

```bash
npm install @digitalwalletcorp/vue-svg-icons
# or
yarn add @digitalwalletcorp/vue-svg-icons

```

> ##### ⚠️ Requirements
>
> * **Vue 3.5.0+**: This library uses Vue's built-in `useId()` helper to generate unique element IDs, requiring **Vue 3.5.0 or later**.

#### 📖 Usage

There are three ways to use the icons. Choose the one that best fits your project.

|                                                                         | When to use                                                      | Bundled icons                 |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------- |
| [Import individually](#1-import-icons-individually)                     | When you want to minimize bundle size or prefer explicit imports | Only the icons you import     |
| [Register all icons globally (Vue)](#2-register-all-icons-globally-vue) | When you want to use icons without importing them in each file   | All icons                     |
| [Register icons globally (Nuxt)](#3-register-icons-globally-nuxt)       | When you want to use icons globally in a Nuxt project            | Only the icons you use        |

> **Note:** In Nuxt, icons are registered globally, but only the icons actually used in your templates are included in the bundle.

##### 1. Import icons individually

Import the icons you need in each file and use them in your template.

```vue
<script setup lang="ts">
import {
  SvgWhiteHeavyCheckMark,
  SvgDownload,
  SvgChevron,
  SvgClock,
  SvgCalendar
} from '@digitalwalletcorp/vue-svg-icons';
</script>

<template>
  <p>Upload finished <SvgWhiteHeavyCheckMark /></p>
  <SvgDownload :size="20" color="#c0392b" />
  <SvgChevron direction="up" />
  <SvgClock :hour="9" :minute="41" :duration="60" />
  <SvgCalendar date="20260920" :duration="3" />
</template>
```

##### 2. Register all icons globally (Vue)

Call `registerIcons()` once when you create the app. All icons then become available in any template without importing them.

```ts
// main.ts
import { createApp } from 'vue';
import { registerIcons } from '@digitalwalletcorp/vue-svg-icons/register';
import App from './App.vue';

const app = createApp(App);
registerIcons(app);
app.mount('#app');
```

```vue
<template>
  <!-- no import needed -->
  <SvgDownload :size="20" color="#c0392b" />
  <SvgChevron direction="up" />
</template>
```

This registers every icon, so all icons are included in the bundle. If bundle size matters, import icons individually instead.

##### 3. Register icons globally (Nuxt)

Add the Nuxt module to `nuxt.config.ts`. Icons are automatically available in any template without imports, and no additional type setup is required.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@digitalwalletcorp/vue-svg-icons/nuxt']
});
```

```vue
<template>
  <!-- no import needed -->
  <SvgDownload :size="20" color="#c0392b" />
  <SvgChevron direction="up" />
</template>
```

#### 🔧 Props

All icons accept the `size` and `title` props. See the Props table below for icon-specific properties.

*Note: Default values vary per icon. Your editor will auto-complete accepted values through the included type definitions.*

| Prop | Type | Description |
| --- | --- | --- |
| `size` | `number \| string` | Icon size. Numbers are treated as pixels; strings accept any valid CSS length unit. Defaults to `1.2em` to match surrounding font size. |
| `title` | `string` | Accessible name. When given, the icon renders `role="img"` and an SVG `<title>`, which browsers also show as a native tooltip. When omitted, the icon is treated as decorative and rendered with `aria-hidden="true"`. |
| `color` | `string` | Stroke or fill color. Line-art icons inherit the surrounding text color by default (`currentColor`). |
| `strokeWidth` | `number` | Line thickness relative to the icon's 64-unit coordinate grid. |
| `direction` | string literal | Orientation of the icon (e.g., `'up'`, `'down'`, `'left'`, `'right'`, etc.). |
| `variant` | `'large' \| 'medium' \| 'small'` | Adjusts the relative scale of the drawn shape itself, independent of `size`. |
| `filled` | `boolean` | Renders the icon with a solid fill instead of an outline. |
| `slashed` | `boolean` | Overlays a slash over the icon to indicate a "hidden" or "disabled" state. |
| `bgColor` / `borderColor` / `arrowColor` | `string` | For button-style icons: sets the background plate color, border color, and foreground symbol color. |
| `cornerRadius` | `number` | For button-style icons: controls the corner radius of the background plate. |
| `topLineWidth` | `number` | Thickness of the top horizontal bar (e.g., on download icons). |
| `duration` | `number` | Animation duration in seconds. Lower values run faster; `0` stops the animation completely. On `SvgCalendar` it is the time one day takes to pass. |
| `flipSeconds` | `number` | Seconds spent flipping a single sheet on `SvgCalendar`. Raising `duration` lengthens the pause between flips without slowing the flip itself. Defaults to `0.45`. When `duration` is shorter than this, the flip takes the whole day instead. |
| `hour` / `minute` | `number` | Sets the starting time displayed on clock icons. |
| `date` | `string` | Start date for calendar icons, in `yyyyMMdd` format. The year is never displayed, but it decides whether February has 29 days. Defaults to `20280229`, so the icon still reads `FEB 29` when the prop is omitted. A calendar animates only when `date` is a day that really exists and `duration` is given: a malformed value falls back to the default date, and a date that does not exist in that year (`20260229`, `20260431`) is still displayed as given, but neither one animates. |
| `moonAge` | `number` | Moon age in days for `SvgMoonPhases`, driving the lit shape through the phases. `0` = new moon, ~`7.4` = first quarter, ~`14.8` = full moon, ~`22.1` = last quarter (synodic period 29.53 days). Any value is accepted and wraps within the cycle. Defaults to `3`. |
| `angle` | `number` | Rotation of the whole moon in degrees, clockwise. Negative values and values beyond `360` are accepted. Around `30`–`40` gives a crescent its familiar tilt. Defaults to `0` (no rotation). |

#### 📚 Icon Catalog

##### Unicode Emoji Icons

| Component | Unicode Character | Accepted Props |
| --- | --- | --- |
| `SvgAnticlockwiseOpenCircleArrows` | 🔄 `ANTICLOCKWISE DOWNWARDS AND UPWARDS OPEN CIRCLE ARROWS` | `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |
| `SvgArrowButton` | ➡️ `BLACK RIGHTWARDS ARROW` | `direction`, `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |
| `SvgBooks` | 📚 `BOOKS` | `size` |
| `SvgCalendar` | 📅 `CALENDAR` | `date`, `duration`, `flipSeconds`, `size` |
| `SvgCircle` | 🟠 `LARGE ORANGE CIRCLE` | `variant`, `size`, `color` |
| `SvgClock` | 🕓 `CLOCK FACE FOUR OCLOCK` | `hour`, `minute`, `duration`, `size` |
| `SvgCrossMark` | ❌ `CROSS MARK` | `size` |
| `SvgDiamond` | 🔷 `LARGE BLUE DIAMOND` | `variant`, `size`, `color` |
| `SvgEyes` | 👀 `EYES` | `size` |
| `SvgGear` | ⚙️ `GEAR` | `size` |
| `SvgHeavyMinusSign` | ➖ `HEAVY MINUS SIGN` | `size`, `color` |
| `SvgHeavyPlusSign` | ➕ `HEAVY PLUS SIGN` | `size`, `color` |
| `SvgHighBrightness` | 🔆 `HIGH BRIGHTNESS SYMBOL` | `size` |
| `SvgHourglass` | ⏳ `HOURGLASS WITH FLOWING SAND` | `duration`, `size` |
| `SvgMagnifyingGlass` | 🔍 `LEFT-POINTING MAGNIFYING GLASS` | `direction`, `size` |
| `SvgMemo` | 📝 `MEMO` | `size` |
| `SvgMoneyBag` | 💰 `MONEY BAG` | `size` |
| `SvgMoonPhases` | 🌑🌒🌓🌔🌕🌖🌗🌘 `MOON PHASES` | `moonAge`, `angle`, `size` |
| `SvgNegativeSquaredCrossMark` | ❎ `NEGATIVE SQUARED CROSS MARK` | `size` |
| `SvgNoOneUnderEighteen` | 🔞 `NO ONE UNDER EIGHTEEN` | `size` |
| `SvgOpenBook` | 📖 `OPEN BOOK` | `size` |
| `SvgPrinter` | 🖨 `PRINTER` | `size` |
| `SvgPushpin` | 📌 `PUSHPIN` | `direction`, `size` |
| `SvgRoundPushpin` | 📍 `ROUND PUSHPIN` | `size` |
| `SvgSquare` | 🟥 `LARGE RED SQUARE` | `variant`, `size`, `color` |
| `SvgSquaredNg` | 🆖 `SQUARED NG` | `size`, `color`, `bgColor`, `borderColor`, `cornerRadius` |
| `SvgSquaredOk` | 🆗 `SQUARED OK` | `size`, `color`, `bgColor`, `borderColor`, `cornerRadius` |
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
| `SvgCritical` | `size` |
| `SvgDot` | `size`, `color` |
| `SvgDownloadAll` | `size`, `color`, `strokeWidth`, `topLineWidth` |
| `SvgDownload` | `size`, `color`, `strokeWidth` |
| `SvgEye` | `size`, `color`, `strokeWidth`, `slashed` |
| `SvgFitScreen` | `size`, `color` |
| `SvgInfo` | `size` |
| `SvgPointingTriangle` | `direction`, `size`, `color` |
| `SvgQuestion` | `size` |
| `SvgReset` | `size`, `bgColor`, `borderColor`, `arrowColor`, `cornerRadius` |
| `SvgTrashbox` | `size` |

#### 🎨 Artwork & Copyright

* All icons in this package are original SVG artwork drawn from scratch with assistance from generative AI.
* The icons are independently drawn and do not trace or incorporate artwork from existing emoji fonts or icon sets.
* Contains no embedded `<text>` elements or font outlines; all text-like elements are rendered strictly as SVG paths.
* Component naming follows formal character names from the official Unicode Character Database.
* The package is released under the MIT License. No copyright is asserted over the icon artwork itself, and you are free to use, modify, and redistribute the artwork without attribution.

#### 📜 License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
