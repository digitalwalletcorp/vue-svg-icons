<!--
UTF-8絵文字🔷(LARGE BLUE DIAMOND)/🔸(SMALL ORANGE DIAMOND)をイメージしたアイコン
グラデーションのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
variant: large/medium/small 図形の大きさ(菱形の半径)を変える。文字サイズ(size)とは独立
size: 文字サイズ
color: 図形の色。16進数カラーコードを指定した場合は図形にグラデーションがかかる。redなどのカラーネームを指定した場合はグラデーションがかからない。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
  >
    <defs>
      <!-- 面: 中央上部の光→外周の濃色(objectBoundingBox基準) -->
      <radialGradient :id="faceGradId" cx="0.5" cy="0.32" r="0.75">
        <stop offset="0" :stop-color="colorGlow" />
        <stop offset="0.45" :stop-color="colorLight" />
        <stop offset="1" :stop-color="colorDeep" />
      </radialGradient>
      <!-- 縁: 上辺が明るく下辺が沈む -->
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="colorLight" />
        <stop offset="1" :stop-color="colorDark" />
      </linearGradient>
    </defs>

    <!-- 縁(外側の菱形: 面よりわずかに大きい) -->
    <polygon :points="diamond.rim" :fill="`url(#${rimGradId})`" />
    <!-- 面(内側の菱形) -->
    <polygon :points="diamond.body" :fill="`url(#${faceGradId})`" />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
interface Props {
  /** large=🔷相当(キャンバスいっぱい)、medium=中間、small=🔸相当(余白大きめ) */
  variant?: 'large' | 'medium' | 'small';
  /** 文字サイズ */
  size?: number | string;
  /** 菱形の色。🔷なら#153aac、🔸なら#f09536 */
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'large',
  size: '1.2em',
  color: '#1a44b6'
});

const uid = (useId() ?? 'dm').replace(/[^a-zA-Z0-9_-]/g, '') || 'dm';
const faceGradId = `diamond-face-${uid}`;
const rimGradId = `diamond-rim-${uid}`;

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

/** 面の中央の光(白に近い) */
const colorGlow = computed((): string => shiftColor(props.color, 118));
/** 面の中間色 */
const colorLight = computed((): string => shiftColor(props.color, 42));
/** 面の外周の濃色 */
const colorDeep = computed((): string => shiftColor(props.color, -30));
/** 縁の下辺の最暗色 */
const colorDark = computed((): string => shiftColor(props.color, -64));

const CX = 32;
const CY = 32;

/** 菱形(縁と面の二重)をvariantに応じた半径から生成する */
const diamond = computed(() => {
  const r = props.variant === 'large' ? 27 : props.variant === 'medium' ? 22 : 17;
  const rimW = Math.max(1.6, r * 0.09); // 縁の太さ(smallでも潰れない下限を確保)
  const ri = r - rimW;
  const pts = (rr: number): string =>
    `${CX},${CY - rr} ${CX + rr},${CY} ${CX},${CY + rr} ${CX - rr},${CY}`;
  return {
    rim: pts(r),
    body: pts(ri)
  };
});
</script>
