<!--
光沢のある青い円に白い?のアイコン
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
    <!-- ? (フック+点) -->
    <path
      d="M24.5 24.5 a8 8 0 1 1 11.5 8.5 c-2.8 1.6 -4 3.2 -4 6"
      fill="none"
      stroke="#ffffff"
      stroke-width="6"
      stroke-linecap="round"
    />
    <circle cx="32" cy="47" r="3.5" fill="#ffffff" />
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

const uid = (useId() ?? 'qm').replace(/[^a-zA-Z0-9_-]/g, '') || 'qm';
const rimGradId = `question-rim-${uid}`;
const faceGradId = `question-face-${uid}`;
const glossGradId = `question-gloss-${uid}`;
</script>
