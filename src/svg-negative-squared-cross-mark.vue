<!--
UTF-8絵文字❎(NEGATIVE SQUARED CROSS MARK)をイメージしたアイコン
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
      <linearGradient :id="crossMarkBgId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5dd879" />
        <stop offset="1" stop-color="#2eab4e" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="14" :fill="`url(#${crossMarkBgId})`" />
    <path d="M22 22 L42 42 M42 22 L22 42" stroke="#ffffff" stroke-width="7" stroke-linecap="round" fill="none" />
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

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const crossMarkBgId = `cross-mark-bg-${uid}`;
</script>
