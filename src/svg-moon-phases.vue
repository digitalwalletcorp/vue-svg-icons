<!--
UTF-8絵文字(🌑🌒🌓🌔🌕🌖🌗🌘)全体をイメージしたアイコン
絵文字グループ「moon phases」をmoonAgeプロパティで連続的に表現する。
moonAge: 月齢(0=新月, 約7.4=上弦, 約14.8=満月, 約22.1=下弦, 周期29.53日)。
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <radialGradient :id="darkGradId" cx="0.42" cy="0.35" r="0.85">
        <stop offset="0" stop-color="#252a37" />
        <stop offset="0.7" stop-color="#1a1e29" />
        <stop offset="1" stop-color="#0e1119" />
      </radialGradient>
      <linearGradient :id="litGradId" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="#ffe9a8" />
        <stop offset="0.5" stop-color="#f7cf56" />
        <stop offset="1" stop-color="#e3a71f" />
      </linearGradient>
      <!-- リムライト: 光側(暖色・明るい)→暗側(寒色・ごく薄い)。満ち欠けで向きが反転する -->
      <linearGradient :id="rimGradId" :x1="waxing ? 1 : 0" y1="0" :x2="waxing ? 0 : 1" y2="0">
        <stop offset="0" stop-color="#f3e6b4" stop-opacity="0.75" />
        <stop offset="0.45" stop-color="#b9c1d4" stop-opacity="0.28" />
        <stop offset="1" stop-color="#8a93a8" stop-opacity="0.12" />
      </linearGradient>
      <filter :id="rimBlurId" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.4" />
      </filter>
      <clipPath :id="clipId"><circle cx="32" cy="32" r="28" /></clipPath>
      <!-- 光領域のクリップ(金色クレーター用) -->
      <clipPath :id="litClipId"><path :d="litPath" /></clipPath>
      <filter :id="grainWId" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="linear" slope="0.6" intercept="-0.15" /></feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      <filter :id="grainBId" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="23" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer><feFuncA type="linear" slope="0.7" intercept="-0.2" /></feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
    </defs>

    <g :clip-path="`url(#${clipId})`">
      <!-- 暗部の月面+グレイン -->
      <circle cx="32" cy="32" r="28" :fill="`url(#${darkGradId})`" />
      <circle cx="32" cy="32" r="28" fill="#8d96ab" opacity="0.11" :filter="`url(#${grainWId})`" />
      <circle cx="32" cy="32" r="28" fill="#000000" opacity="0.32" :filter="`url(#${grainBId})`" />

      <!-- クレーター(暗色) -->
      <g fill="#0b0e15">
        <circle v-for="(c, i) in CRATERS" :key="i" :cx="c.x" :cy="c.y" :r="c.r" />
      </g>

      <!-- 光っている領域 -->
      <path :d="litPath" :fill="`url(#${litGradId})`" />
      <path :d="litPath" fill="#6e4f13" opacity="0.2" :filter="`url(#${grainBId})`" />

      <!-- クレーター(金色: 光領域にクリップ) -->
      <g fill="#d9a52e" :clip-path="`url(#${litClipId})`">
        <circle v-for="(c, i) in CRATERS" :key="i" :cx="c.x" :cy="c.y" :r="c.r" />
      </g>
    </g>

    <!-- リムライト(方向性グラデーション+微ブラー) -->
    <circle cx="32" cy="32" r="27.5" fill="none" :stroke="`url(#${rimGradId})`" stroke-width="0.9" :filter="`url(#${rimBlurId})`" />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  /** 月齢 */
  moonAge?: number;
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  moonAge: 3,
  size: '1.2em'
});

const uid = (useId() ?? 'mn').replace(/[^a-zA-Z0-9_-]/g, '') || 'mn';
const darkGradId = `moon-dark-${uid}`;
const litGradId = `moon-lit-${uid}`;
const rimGradId = `moon-rim-${uid}`;
const rimBlurId = `moon-rim-blur-${uid}`;
const clipId = `moon-clip-${uid}`;
const litClipId = `moon-lit-clip-${uid}`;
const grainWId = `moon-grain-w-${uid}`;
const grainBId = `moon-grain-b-${uid}`;

/** 朔望周期(日) */
const PERIOD = 29.53;
/** 月の半径 */
const R = 28;

/** クレーター(暗色/金色で共用する座標) */
const CRATERS = [
  { x: 21, y: 19, r: 2.8 }, { x: 13, y: 35, r: 2 }, { x: 26, y: 47, r: 2.5 },
  { x: 35, y: 30, r: 1.7 }, { x: 24, y: 32, r: 1.1 }, { x: 31, y: 12, r: 1.4 },
  { x: 14, y: 25, r: 1 }, { x: 36, y: 52, r: 1.3 }, { x: 40, y: 41, r: 1 },
  { x: 18, y: 43, r: 0.9 }, { x: 47, y: 22, r: 1.6 }, { x: 52, y: 38, r: 2 },
  { x: 45, y: 48, r: 1.2 }, { x: 50, y: 12, r: 1 }
] as const;

const normalizedAge = computed((): number => ((props.moonAge % PERIOD) + PERIOD) % PERIOD);

/** 満ちる期(0〜約14.8)ならtrue。litPathの外周側とリムの明るい側の判定に使う */
const waxing = computed((): boolean => normalizedAge.value < PERIOD / 2);

/**
 * 光っている領域のパス。
 * 外周の半円(満ちる期は右縁、欠ける期は左縁) + ターミネーター(縦楕円弧)。
 * ターミネーターの横半径 rx = R·|cosφ| (φ=位相角)。cosφの符号で凸方向が反転し、
 * 三日月(光側に凸)→半月(直線)→十三夜(暗側に凸)→満月(全面)が連続する。
 */
const litPath = computed((): string => {
  const phi = (2 * Math.PI * normalizedAge.value) / PERIOD;
  const c = Math.cos(phi);
  const rx = Math.max(R * Math.abs(c), 0.01);
  const outer = waxing.value
    ? `M 32 4 A ${R} ${R} 0 0 1 32 60`  // 右縁(上→下)
    : `M 32 4 A ${R} ${R} 0 0 0 32 60`; // 左縁(上→下)
  const sweep = waxing.value ? (c > 0 ? 0 : 1) : (c > 0 ? 1 : 0);
  return `${outer} A ${rx.toFixed(2)} ${R} 0 0 ${sweep} 32 4 Z`;
});
</script>
