<!--
UTF-8絵文字📍(ROUND PUSHPIN)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="16 20 128 128"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 球: 左上の光→右下の深い赤 -->
      <radialGradient :id="ballGradId" cx="0.38" cy="0.32" r="0.78">
        <stop offset="0" stop-color="#f89b94" />
        <stop offset="0.35" stop-color="#e8534b" />
        <stop offset="0.75" stop-color="#c9302a" />
        <stop offset="1" stop-color="#9e211c" />
      </radialGradient>
      <!-- 針: 金属(左明→右暗) -->
      <linearGradient :id="pinGradId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#d4d7dc" />
        <stop offset="0.45" stop-color="#9aa0a9" />
        <stop offset="1" stop-color="#6f757e" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="80" cy="138" rx="16" ry="4" fill="#000000" opacity="0.15" />

    <!-- 針(球の下から垂直に) -->
    <polygon
      points="75.5,88 84.5,88 83.5,132 80,137 76.5,132"
      :fill="`url(#${pinGradId})`"
    />
    <!-- 針の左縁の光 -->
    <line x1="77.3" y1="90" x2="77.8" y2="128" stroke="#ffffff" stroke-width="1.2" opacity="0.55" />

    <!-- 球 -->
    <circle cx="80" cy="58" r="34" :fill="`url(#${ballGradId})`" />
    <!-- 球のハイライト(左上の強い光) -->
    <ellipse cx="67" cy="44" rx="10" ry="7.5" fill="#ffffff" opacity="0.5" transform="rotate(-32 67 44)" />
    <!-- 球の下縁の照り返し -->
    <path
      d="M 58 82 A 34 34 0 0 0 102 82"
      fill="none"
      stroke="#f0847d"
      stroke-width="2.5"
      opacity="0.4"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'rp').replace(/[^a-zA-Z0-9_-]/g, '') || 'rp';
const ballGradId = `roundpin-ball-${uid}`;
const pinGradId = `roundpin-pin-${uid}`;

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
