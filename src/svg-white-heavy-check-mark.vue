<!--
UTF-8絵文字✅(WHITE HEAVY CHECK MARK)をイメージしたアイコン
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
      <linearGradient :id="checkMarkBgId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#5dd879" />
        <stop offset="1" stop-color="#2eab4e" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="14" :fill="`url(#${checkMarkBgId})`" />
    <path
      d="M19 33 L28 42 L45 21"
      stroke="#ffffff"
      stroke-width="7"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
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

const uid = (useId() ?? 'cb').replace(/[^a-zA-Z0-9_-]/g, '') || 'cb';
const checkMarkBgId = `check-mark-bg-${uid}`;
</script>
