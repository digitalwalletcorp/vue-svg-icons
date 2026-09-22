<!--
UTF-8絵文字🆗(SQUARED OK)をイメージしたアイコン
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
      <!-- 背景: 上薄め→下濃め(objectBoundingBox基準の縦グラデーション) -->
      <linearGradient :id="bgGradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="bgColorLight" />
        <stop offset="100%" :stop-color="bgColorDark" />
      </linearGradient>
      <!-- 背景の光沢: 下端で透明へ落として面へなじませる -->
      <linearGradient :id="glossGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.6" />
        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <filter :id="glossBlurId" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.1" />
      </filter>
    </defs>
    <rect
      x="4"
      y="4"
      width="56"
      height="56"
      :rx="props.cornerRadius"
      :fill="`url(#${bgGradientId})`"
      :stroke="props.borderColor"
      stroke-width="4"
    />
    <rect x="8.5" y="8" width="47" height="17.5" :rx="glossRound" :fill="`url(#${glossGradId})`" :filter="`url(#${glossBlurId})`" />
    <!-- OKの文字 -->
    <path
      d="M31.51 31.89Q31.51 34.7 30.67 37Q29.84 39.3 28.27 40.93Q26.7 42.57 24.45 43.45Q22.19 44.34 19.34 44.34Q16.33 44.34 14.07 43.41Q11.82 42.48 10.3 40.82Q8.78 39.16 8.03 36.88Q7.27 34.6 7.27 31.89Q7.27 29.08 8.06 26.81Q8.85 24.55 10.39 22.96Q11.93 21.36 14.19 20.5Q16.45 19.64 19.38 19.64Q22.31 19.64 24.56 20.51Q26.82 21.38 28.36 22.98Q29.9 24.58 30.71 26.84Q31.51 29.1 31.51 31.89ZM26.38 31.89Q26.38 30 25.93 28.47Q25.48 26.95 24.59 25.86Q23.7 24.77 22.4 24.18Q21.1 23.59 19.38 23.59Q17.62 23.59 16.3 24.18Q14.98 24.77 14.1 25.86Q13.21 26.95 12.77 28.47Q12.33 30 12.33 31.89Q12.33 33.76 12.78 35.32Q13.23 36.88 14.11 38Q15 39.13 16.31 39.76Q17.62 40.39 19.34 40.39Q21.18 40.39 22.51 39.75Q23.84 39.11 24.7 37.98Q25.56 36.85 25.97 35.29Q26.38 33.73 26.38 31.89Z M51.91 44L43.29 32.98L40.33 35.24L40.33 44L35.3 44L35.3 20L40.33 20L40.33 30.88L51.15 20L57 20L46.75 30.15L57.84 44L51.91 44Z"
      :fill="props.color"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  size?: number | string;
  /** 文字の色 */
  color?: string;
  bgColor?: string;
  borderColor?: string;
  cornerRadius?: number;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  color: '#ffffff',
  bgColor: '#738aa5',
  borderColor: '#738aa5',
  cornerRadius: 8
});

const uid = (useId() ?? 'ok').replace(/[^a-zA-Z0-9_-]/g, '') || 'ok';
const bgGradientId = `squared-ok-bg-${uid}`;
const glossGradId = `squared-ok-gloss-${uid}`;
const glossBlurId = `squared-ok-gloss-blur-${uid}`;

/** #RRGGBB を明暗方向に amount(-255〜255)だけシフトする */
const shiftColor = (hex: string, amount: number): string => {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (m === null) {
    return hex; // #RGB等の想定外形式はそのまま返す
  }
  const num = parseInt(m[1], 16);
  const clamp = (v: number): number => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16 & 0xff) + amount);
  const g = clamp((num >> 8 & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const bgColorLight = computed((): string => shiftColor(props.bgColor, 24));
const bgColorDark = computed((): string => shiftColor(props.bgColor, -28));

/** 光沢の角丸。背景のcornerRadiusからインセット分を引いて丸みを追従させる */
const glossRound = computed((): number => Math.max(props.cornerRadius - 4.5, 2));
</script>
