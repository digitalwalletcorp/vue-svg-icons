<!--
UTF-8絵文字🔞(NO ONE UNDER EIGHTEEN)をイメージしたアイコン
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
      <!-- 黒地 -->
      <linearGradient :id="faceGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4a4e55" />
        <stop offset="1" stop-color="#1d2025" />
      </linearGradient>
      <!-- 禁止リング: 赤 -->
      <linearGradient :id="ringGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ef5350" />
        <stop offset="1" stop-color="#c62828" />
      </linearGradient>
    </defs>

    <!-- 黒地(下地の円) -->
    <circle cx="32" cy="32" r="27" :fill="`url(#${faceGradId})`" />

    <!-- 18 (ストローク数字: 白、リング内周から2px程度のpaddingを確保) -->
    <g
      fill="none"
      stroke="#ffffff"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- 1 -->
      <path d="M17.5 23.5 l6.5 -5.5 v28" />
      <!-- 8 (上下2つの輪) -->
      <circle cx="40" cy="25.5" r="6.5" />
      <circle cx="40" cy="39.5" r="7.5" />
    </g>

    <!-- 禁止リング -->
    <circle
      cx="32" cy="32" r="25.5"
      fill="none"
      :stroke="`url(#${ringGradId})`"
      stroke-width="7"
    />
    <!-- 斜線(左上→右下、リングの内周を貫く) -->
    <line
      x1="13.97" y1="13.97" x2="50.03" y2="50.03"
      :stroke="`url(#${ringGradId})`"
      stroke-width="7"
      opacity="0.92"
    />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'nu').replace(/[^a-zA-Z0-9_-]/g, '') || 'nu';
const faceGradId = `nounder18-face-${uid}`;
const ringGradId = `nounder18-ring-${uid}`;
</script>
