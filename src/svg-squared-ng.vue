<!--
UTF-8絵文字🆖(SQUARED NG)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
    :style="iconSizeStyle(props.size)"
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
      <!-- Gの開口: リングの右上を欠く -->
      <clipPath :id="apertureClipId">
        <path clip-rule="evenodd" d="M0 0 H64 V64 H0 Z M46 25.6 H60 V31.4 H46 Z" />
      </clipPath>
      <!-- Gの横棒の右端をリングの外周に沿わせる -->
      <clipPath :id="barClipId">
        <path d="M56.11 31.89Q56.11 34.7 55.27 37Q54.44 39.3 52.87 40.93Q51.3 42.57 49.05 43.45Q46.79 44.34 43.94 44.34Q40.93 44.34 38.67 43.41Q36.42 42.48 34.9 40.82Q33.38 39.16 32.63 36.88Q31.87 34.6 31.87 31.89Q31.87 29.08 32.66 26.81Q33.45 24.55 34.99 22.96Q36.53 21.36 38.79 20.5Q41.05 19.64 43.98 19.64Q46.91 19.64 49.16 20.51Q51.42 21.38 52.96 22.98Q54.5 24.58 55.31 26.84Q56.11 29.1 56.11 31.89Z" />
      </clipPath>
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
    <!-- Nの文字 -->
    <path d="M8.17 20 L13.91 20 L24.22 38.11 L24.22 20 L28.68 20 L28.68 44 L22.78 44 L12.63 26.17 L12.63 44 L8.17 44 Z" :fill="props.color" />
    <!-- Gのリング(Oと同じ輪郭) -->
    <g :clip-path="`url(#${apertureClipId})`">
      <path
        d="M56.11 31.89Q56.11 34.7 55.27 37Q54.44 39.3 52.87 40.93Q51.3 42.57 49.05 43.45Q46.79 44.34 43.94 44.34Q40.93 44.34 38.67 43.41Q36.42 42.48 34.9 40.82Q33.38 39.16 32.63 36.88Q31.87 34.6 31.87 31.89Q31.87 29.08 32.66 26.81Q33.45 24.55 34.99 22.96Q36.53 21.36 38.79 20.5Q41.05 19.64 43.98 19.64Q46.91 19.64 49.16 20.51Q51.42 21.38 52.96 22.98Q54.5 24.58 55.31 26.84Q56.11 29.1 56.11 31.89ZM50.98 31.89Q50.98 30 50.53 28.47Q50.08 26.95 49.19 25.86Q48.3 24.77 47 24.18Q45.7 23.59 43.98 23.59Q42.22 23.59 40.9 24.18Q39.58 24.77 38.7 25.86Q37.81 26.95 37.37 28.47Q36.93 30 36.93 31.89Q36.93 33.76 37.38 35.32Q37.83 36.88 38.71 38Q39.6 39.13 40.91 39.76Q42.22 40.39 43.94 40.39Q45.78 40.39 47.11 39.75Q48.44 39.11 49.3 37.98Q50.16 36.85 50.57 35.29Q50.98 33.73 50.98 31.89Z"
        :fill="props.color"
      />
    </g>
    <!-- Gの横棒 -->
    <path d="M43.5 31.4 H58 V35.8 H43.5 Z" :fill="props.color" :clip-path="`url(#${barClipId})`" />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

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

const uid = (useId() ?? 'ng').replace(/[^a-zA-Z0-9_-]/g, '') || 'ng';
const bgGradientId = `squared-ng-bg-${uid}`;
const glossGradId = `squared-ng-gloss-${uid}`;
const glossBlurId = `squared-ng-gloss-blur-${uid}`;
const apertureClipId = `squared-ng-aperture-${uid}`;
const barClipId = `squared-ng-bar-${uid}`;

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
