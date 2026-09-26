<!--
蓋付きのゴミ箱をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="27 28.5 106 106"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle, ...iconSizeStyle(props.size) }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <linearGradient :id="binBodyId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#c8cdd4" />
        <stop offset="0.25" stop-color="#eceef1" />
        <stop offset="0.6" stop-color="#c2c7cf" />
        <stop offset="1" stop-color="#9aa0a9" />
      </linearGradient>
      <linearGradient :id="binLidId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e8eaed" />
        <stop offset="0.5" stop-color="#c2c7cf" />
        <stop offset="1" stop-color="#9aa0a9" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="80" cy="130" rx="46" ry="4" fill="#000000" opacity="0.13" />

    <!-- 持ち手(フタの奥に潜らせる) -->
    <path
      d="M68 42 v-2 a5 5 0 0 1 5 -5 h14 a5 5 0 0 1 5 5 v2"
      fill="none"
      stroke="#9aa0a9"
      stroke-width="6"
    />

    <!-- フタ -->
    <rect x="38" y="42" width="84" height="12" rx="6" :fill="`url(#${binLidId})`" stroke="#8b9099" stroke-width="1.5" />

    <!-- 本体(下すぼまりの台形+角丸の底) -->
    <path
      d="M46 60 h68 l-5.5 62 a9 9 0 0 1 -9 8.2 h-39 a9 9 0 0 1 -9 -8.2 Z"
      :fill="`url(#${binBodyId})`"
      stroke="#8b9099"
      stroke-width="1.5"
    />

    <!-- フタ直下の落ち影 -->
    <path d="M46 60 h68 l-0.6 6 h-66.8 Z" fill="#000000" opacity="0.10" />

    <!-- 縦の溝 -->
    <g stroke="#8f959e" stroke-width="4" stroke-linecap="round" fill="none">
      <line x1="63" y1="72" x2="65.5" y2="118" />
      <line x1="80" y1="72" x2="80" y2="118" />
      <line x1="97" y1="72" x2="94.5" y2="118" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { iconSizeStyle, toCssSize } from '@/internal/icon-size';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const binBodyId = `bin-body-${uid}`;
const binLidId = `bin-lid-${uid}`;

const sizeStyle = computed((): string => toCssSize(props.size));
</script>
