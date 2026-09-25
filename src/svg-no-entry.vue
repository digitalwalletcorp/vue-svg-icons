<!--
UTF-8絵文字⛔(NO ENTRY)をイメージしたアイコン
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
      <!-- 面: 中央上部の光→外周の濃色(objectBoundingBox基準) -->
      <radialGradient :id="faceGradId" cx="0.5" cy="0.32" r="0.75">
        <stop offset="0" stop-color="#ffb0a1" />
        <stop offset="0.45" stop-color="#fb6455" />
        <stop offset="1" stop-color="#b31c0d" />
      </radialGradient>
      <!-- 縁: 上辺が明るく下辺が沈む -->
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fb6455" />
        <stop offset="1" stop-color="#910000" />
      </linearGradient>
      <!-- 横棒: 下辺をわずかに沈めて立体感を出す -->
      <linearGradient :id="barGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#e9e3e2" />
      </linearGradient>
      <!-- 上部の光沢: 下へ向かって消える白 -->
      <linearGradient :id="glossGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.6" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0.05" />
      </linearGradient>
    </defs>

    <!-- 縁(外側の円: 面よりわずかに大きい) -->
    <circle cx="32" cy="32" r="27" :fill="`url(#${rimGradId})`" />
    <!-- 面(内側の円) -->
    <circle cx="32" cy="32" r="24.57" :fill="`url(#${faceGradId})`" />
    <!-- 白い横棒 -->
    <rect x="14" y="27" width="36" height="10" rx="2" :fill="`url(#${barGradId})`" />
    <!-- 上部の光沢 -->
    <ellipse cx="32" cy="19.22" rx="16.71" ry="9.34" :fill="`url(#${glossGradId})`" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'ne').replace(/[^a-zA-Z0-9_-]/g, '') || 'ne';
const faceGradId = `no-entry-face-${uid}`;
const rimGradId = `no-entry-rim-${uid}`;
const barGradId = `no-entry-bar-${uid}`;
const glossGradId = `no-entry-gloss-${uid}`;
</script>
