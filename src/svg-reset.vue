<!--
リセットをイメージしたアイコン(反時計回りの円弧矢印+時計の針)
UTF-8絵文字に対応する定番絵文字は存在しない。
linearGradientのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
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

    <!-- 反時計回りの円弧(r=15、左上→右上へ300°) -->
    <path
      d="M 24.50 19.01 A 15 15 0 1 0 39.50 19.01"
      fill="none"
      :stroke="props.arrowColor"
      stroke-width="5"
      stroke-linecap="round"
    />
    <!-- 矢じり(終点=右上に接続、左上向き) -->
    <polygon points="44.48,14.38 29.97,13.51 37.98,25.64" :fill="props.arrowColor" />

    <!-- 時計の針(12時と4時: 初期時刻の表現) -->
    <g :stroke="props.arrowColor" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M32 32 v-8.5" />
      <path d="M32 32 l4.6 4.6" />
    </g>
    <circle cx="32" cy="32" r="2.2" :fill="props.arrowColor" />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
interface Props {
  size?: number | string;
  bgColor?: string;
  borderColor?: string;
  arrowColor?: string;
  cornerRadius?: number;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  bgColor: '#738aa5',
  borderColor: '#738aa5',
  arrowColor: '#ffffff',
  cornerRadius: 8
});

const uid = (useId() ?? 'rs').replace(/[^a-zA-Z0-9_-]/g, '') || 'rs';
const bgGradientId = `reset-btn-bg-${uid}`;

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
</script>
