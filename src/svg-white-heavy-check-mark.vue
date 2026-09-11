<!--
UTF-8絵文字✅(WHITE HEAVY CHECK MARK)をイメージしたアイコン
linearGradientのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
  >
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
interface Props {
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'cb').replace(/[^a-zA-Z0-9_-]/g, '') || 'cb';
const checkMarkBgId = `check-mark-bg-${uid}`;
</script>
