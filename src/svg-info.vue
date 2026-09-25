<!--
光沢のある青い円に白いiのアイコン
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
      <radialGradient :id="faceGradId" cx="0.4" cy="0.3" r="0.85">
        <stop offset="0" stop-color="#7fb0ff" />
        <stop offset="0.45" stop-color="#2764e8" />
        <stop offset="0.8" stop-color="#1747cc" />
        <stop offset="1" stop-color="#0a2a96" />
      </radialGradient>
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b8d2ff" />
        <stop offset="0.5" stop-color="#1c46b8" />
        <stop offset="1" stop-color="#061f78" />
      </linearGradient>
      <linearGradient :id="glossGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.05" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="28" :fill="`url(#${faceGradId})`" :stroke="`url(#${rimGradId})`" stroke-width="2.5" />
    <!-- i (点+セリフ付きの棒) -->
    <g fill="none" stroke="#ffffff" stroke-linecap="round">
      <path d="M28.5 27 h4 v15" stroke-width="5" stroke-linejoin="round" />
      <path d="M27 43.5 h11" stroke-width="5" />
    </g>
    <circle cx="32" cy="18.5" r="3.8" fill="#ffffff" />
    <ellipse cx="32" cy="17.5" rx="19" ry="10.5" :fill="`url(#${glossGradId})`" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'if').replace(/[^a-zA-Z0-9_-]/g, '') || 'if';
const rimGradId = `info-rim-${uid}`;
const faceGradId = `info-face-${uid}`;
const glossGradId = `info-gloss-${uid}`;
</script>
