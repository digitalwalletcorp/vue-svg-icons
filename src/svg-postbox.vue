<!--
UTF-8絵文字📮(POSTBOX)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="0 0 160 160"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 本体: 左寄りを明るくして丸みを出す -->
      <linearGradient :id="bodyId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#e01a0a" />
        <stop offset="0.3" stop-color="#ff5040" />
        <stop offset="1" stop-color="#e01a0a" />
      </linearGradient>
      <linearGradient :id="eaveId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ec2410" />
        <stop offset="1" stop-color="#c2170a" />
      </linearGradient>
      <linearGradient :id="poleId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#b01408" />
        <stop offset="0.4" stop-color="#e02010" />
        <stop offset="1" stop-color="#b01408" />
      </linearGradient>
      <linearGradient :id="baseId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b9bcc1" />
        <stop offset="1" stop-color="#7f838a" />
      </linearGradient>
    </defs>

    <!-- 本体の影 -->
    <rect x="37" y="11" width="92" height="104" rx="12" fill="#000000" opacity="0.12" />
    <!-- 支柱と台座 -->
    <rect x="68" y="108" width="24" height="34" :fill="`url(#${poleId})`" />
    <rect x="56" y="138" width="48" height="14" rx="4" :fill="`url(#${baseId})`" />
    <!-- 本体と上部の光沢 -->
    <rect x="34" y="8" width="92" height="104" rx="12" :fill="`url(#${bodyId})`" />
    <rect x="40" y="12" width="80" height="10" rx="5" fill="#ffffff" opacity="0.28" />
    <!-- 庇 -->
    <path d="M44 24 L116 24 L122 38 L38 38 Z" :fill="`url(#${eaveId})`" />
    <!-- 投函口(2つ) -->
    <rect x="42" y="40" width="34" height="13" fill="#c4c4c4" />
    <rect x="45" y="43" width="28" height="7" fill="#333333" />
    <rect x="84" y="40" width="34" height="13" fill="#c4c4c4" />
    <rect x="87" y="43" width="28" height="7" fill="#333333" />
    <!-- 〒マーク -->
    <rect x="62" y="64" width="36" height="6" fill="#f7f7f7" />
    <rect x="62" y="74" width="36" height="6" fill="#f7f7f7" />
    <rect x="76" y="80" width="8" height="19" fill="#f7f7f7" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'pb').replace(/[^a-zA-Z0-9_-]/g, '') || 'pb';
const bodyId = `postbox-body-${uid}`;
const eaveId = `postbox-eave-${uid}`;
const poleId = `postbox-pole-${uid}`;
const baseId = `postbox-base-${uid}`;
</script>
