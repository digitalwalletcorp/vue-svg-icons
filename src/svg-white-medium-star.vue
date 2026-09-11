<!--
UTF-8絵文字⭐️(WHITE MEDIUM STAR)をイメージしたアイコン
グラデーションのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
  >
    <defs>
      <!-- 面: 中央の光(クリーム)→外周のオレンジ -->
      <radialGradient :id="faceGradId" cx="0.5" cy="0.42" r="0.62">
        <stop offset="0" stop-color="#fdf6d8" />
        <stop offset="0.45" stop-color="#fbe289" />
        <stop offset="0.8" stop-color="#f6b845" />
        <stop offset="1" stop-color="#ef9b2d" />
      </radialGradient>
      <!-- 縁: 上が明るく下が濃いオレンジ -->
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f6c04e" />
        <stop offset="1" stop-color="#e08b1f" />
      </linearGradient>
    </defs>

    <!-- 縁: 太いstroke+round joinで角の丸みを作る -->
    <polygon
      :points="starPoints"
      :fill="`url(#${rimGradId})`"
      :stroke="`url(#${rimGradId})`"
      stroke-width="5"
      stroke-linejoin="round"
    />
    <!-- 面: 同じ形を細いround joinで内側に重ねる -->
    <polygon
      :points="starPoints"
      :fill="`url(#${faceGradId})`"
      :stroke="`url(#${faceGradId})`"
      stroke-width="1.5"
      stroke-linejoin="round"
      transform="translate(0 -0.5)"
    />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
interface Props {
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'st').replace(/[^a-zA-Z0-9_-]/g, '') || 'st';
const faceGradId = `star-face-${uid}`;
const rimGradId = `star-rim-${uid}`;

const CX = 32;
const CY = 33;
const OUTER_R = 26;  // 外周(星の先端)の半径
const INNER_R = 12;  // 内周(谷)の半径

/** 星形10頂点(先端5+谷5)を生成する。上向き=先端が-90度から開始 */
const starPoints = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 === 0 ? OUTER_R : INNER_R;
  const a = (-90 + i * 36) * (Math.PI / 180);
  return `${(CX + r * Math.cos(a)).toFixed(2)},${(CY + r * Math.sin(a)).toFixed(2)}`;
}).join(' ');
</script>
