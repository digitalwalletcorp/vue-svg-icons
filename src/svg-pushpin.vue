<!--
UTF-8絵文字📌(PUSHPIN)をイメージしたアイコン
direction: 針の向き(left=針が左下、right=針が右下)
linearGradientのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="16 20 128 128"
    :style="{ height: sizeStyle }"
  >
    <defs>
      <!-- 赤いプラスチック: 左が明るく右が沈む(円筒の照り) -->
      <linearGradient :id="bodyGradId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f0706a" />
        <stop offset="0.35" stop-color="#e13f38" />
        <stop offset="1" stop-color="#b32821" />
      </linearGradient>
      <!-- 天面: 中央が明るいドーム -->
      <radialGradient :id="capGradId" cx="0.42" cy="0.35" r="0.75">
        <stop offset="0" stop-color="#f58f89" />
        <stop offset="0.6" stop-color="#e13f38" />
        <stop offset="1" stop-color="#c02e27" />
      </radialGradient>
      <!-- 針: 金属 -->
      <linearGradient :id="pinGradId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#e8eaed" />
        <stop offset="0.5" stop-color="#aab0b8" />
        <stop offset="1" stop-color="#83898f" />
      </linearGradient>
    </defs>

    <!-- 接地影(針先の下: directionに応じて左右反転) -->
    <ellipse :cx="shadowCx" cy="138" rx="30" ry="5" fill="#000000" opacity="0.13" />

    <!-- ミラーレイヤー: rightのとき全体を左右反転する -->
    <g :transform="mirrorTransform">
      <!-- 画鋲全体(垂直に組み立てて32度傾ける=針が左下へ) -->
      <g transform="rotate(32 80 84)">
        <!-- 針 -->
        <polygon
          points="77,96 83,96 80.6,136 80,138"
          :fill="`url(#${pinGradId})`"
        />
        <!-- 針の光 -->
        <line x1="78.6" y1="98" x2="80" y2="132" stroke="#ffffff" stroke-width="1" opacity="0.6" />

        <!-- 台座(下の返し: 上すぼまりの逆円錐台) -->
        <path
          d="M62 82 h36 l-8 12 a4 4 0 0 1 -3.5 2 h-13 a4 4 0 0 1 -3.5 -2 Z"
          :fill="`url(#${bodyGradId})`"
          stroke="#9e221c"
          stroke-width="1"
        />
        <!-- 首(くびれた軸) -->
        <path
          d="M71 52 h18 c-1.5 10, -1.5 20, 2 30 h-22 c3.5 -10, 3.5 -20, 2 -30 Z"
          :fill="`url(#${bodyGradId})`"
          stroke="#9e221c"
          stroke-width="1"
        />
        <!-- 頭(上の太い円筒) -->
        <path
          d="M58 30 a22 8 0 0 1 44 0 v16 a22 8 0 0 1 -44 0 Z"
          :fill="`url(#${bodyGradId})`"
          stroke="#9e221c"
          stroke-width="1"
        />
        <!-- 頭の天面(ドーム) -->
        <ellipse cx="80" cy="30" rx="22" ry="8" :fill="`url(#${capGradId})`" stroke="#9e221c" stroke-width="1" />
        <!-- 天面のハイライト -->
        <ellipse cx="74" cy="28" rx="8" ry="2.8" fill="#ffffff" opacity="0.45" />
        <!-- 頭の左側面の縦ハイライト -->
        <path d="M62 34 v10" stroke="#ffffff" stroke-width="2.5" opacity="0.35" stroke-linecap="round" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
interface Props {
  /** 針の向き(left=針が左下、right=針が右下) */
  direction?: 'left' | 'right';
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'left',
  size: '1.2em'
});

const uid = (useId() ?? 'pp').replace(/[^a-zA-Z0-9_-]/g, '') || 'pp';
const bodyGradId = `pushpin-body-${uid}`;
const capGradId = `pushpin-cap-${uid}`;
const pinGradId = `pushpin-pin-${uid}`;

/** viewBox(16〜144)の中心x=80を軸に左右反転する(rightのとき) */
const mirrorTransform = computed((): string =>
  props.direction === 'right' ? 'translate(160 0) scale(-1 1)' : ''
);

/** 接地影のx位置(針先に追従) */
const shadowCx = computed((): number =>
  props.direction === 'right' ? 108 : 52
);

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
