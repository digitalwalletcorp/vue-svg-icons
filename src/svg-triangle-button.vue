<!--
UTF-8絵文字🔽(DOWN-POINTING SMALL RED TRIANGLE)をイメージしたアイコン
ボタン形式の三角アイコン(既定は下向き)
direction: 三角の向きを変更可能
linearGradientのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
  >
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
    <polygon
      points="16,26 48,26 32,44"
      :fill="props.arrowColor"
      :transform="`rotate(${rotation} 32 32)`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
interface Props {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: number | string;
  bgColor?: string;
  borderColor?: string;
  arrowColor?: string;
  cornerRadius?: number;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'down',
  size: '1.2em',
  bgColor: '#738aa5',
  borderColor: '#738aa5',
  arrowColor: '#ffffff',
  cornerRadius: 8
});

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const bgGradientId = `arrow-btn-bg-${uid}`;

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

const rotation = computed(() => {
  switch (props.direction) {
    case 'up': return 180;
    case 'left': return 90;
    case 'right': return -90;
    default: return 0;
  }
});
</script>
