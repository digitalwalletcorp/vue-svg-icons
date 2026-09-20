<!--
UTF-8絵文字🔄(ANTICLOCKWISE DOWNWARDS AND UPWARDS OPEN CIRCLE ARROWS)をイメージしたアイコン
ボタン形式のリロード(反時計回り循環矢印)アイコン
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

    <!-- 上半分の弧+矢じり(反時計回り: 右上の尻尾から左上の矢じりへ) -->
    <g :id="arrowHalfId">
      <path
        d="M46.57 24.25 A 16.5 16.5 0 0 0 18.01 23.26"
        fill="none"
        :stroke="props.arrowColor"
        stroke-width="5"
        stroke-linecap="round"
      />
      <polygon points="24.53,26.53 12.71,19.63 12.44,33.32 " :fill="props.arrowColor" />
    </g>
    <!-- 下半分は180度回転コピー -->
    <use :href="`#${arrowHalfId}`" transform="rotate(180 32 32)" />
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

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const bgGradientId = `refresh-btn-bg-${uid}`;
const arrowHalfId = `refresh-arrow-half-${uid}`;

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
