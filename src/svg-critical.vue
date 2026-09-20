<!--
光沢のある赤い円に白い×のアイコン
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
      <radialGradient :id="faceGradId" cx="0.4" cy="0.3" r="0.85">
        <stop offset="0" stop-color="#ff8a7a" />
        <stop offset="0.45" stop-color="#f02b1d" />
        <stop offset="0.8" stop-color="#d40f0f" />
        <stop offset="1" stop-color="#9c0202" />
      </radialGradient>
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffb3a8" />
        <stop offset="0.5" stop-color="#b30b0b" />
        <stop offset="1" stop-color="#6e0000" />
      </linearGradient>
      <linearGradient :id="glossGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.05" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="28" :fill="`url(#${faceGradId})`" :stroke="`url(#${rimGradId})`" stroke-width="2.5" />
    <path d="M23 23 L41 41 M41 23 L23 41" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" fill="none" />
    <ellipse cx="32" cy="17.5" rx="19" ry="10.5" :fill="`url(#${glossGradId})`" />
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

const uid = (useId() ?? 'ct').replace(/[^a-zA-Z0-9_-]/g, '') || 'ct';
const rimGradId = `critical-rim-${uid}`;
const faceGradId = `critical-face-${uid}`;
const glossGradId = `critical-gloss-${uid}`;
</script>
