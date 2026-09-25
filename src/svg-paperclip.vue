<!--
UTF-8絵文字📎(PAPERCLIP)をイメージしたアイコン
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
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 金属の明暗: 途中に光る帯を挟んで金属らしさを出す -->
      <linearGradient :id="metalId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fbfcfd" />
        <stop offset="0.3" stop-color="#a3aab4" />
        <stop offset="0.55" stop-color="#e6e9ee" />
        <stop offset="0.8" stop-color="#a3aab4" />
        <stop offset="1" stop-color="#737b86" />
      </linearGradient>
    </defs>
    <!-- 針金を縁・本体・影・ハイライトの4層で重ねて丸い線に見せる。右上がりに40°傾ける -->
    <g
      transform="rotate(40 32 32) translate(32 32) scale(0.92) translate(-32 -32)"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path :d="WIRE" stroke="#5b626c" stroke-width="4.4" />
      <path :d="WIRE" :stroke="`url(#${metalId})`" stroke-width="3" />
      <path :d="WIRE" stroke="#4a5059" stroke-width="0.7" opacity="0.45" transform="translate(0.6 0.6)" />
      <path :d="WIRE" stroke="#ffffff" stroke-width="0.9" opacity="0.85" transform="translate(-0.5 -0.5)" />
    </g>
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

const uid = (useId() ?? 'pc').replace(/[^a-zA-Z0-9_-]/g, '') || 'pc';
const metalId = `paperclip-metal-${uid}`;

/** 針金の中心線(直立時)。外側のU→上のU→内側のUの順に1本でつなぐ */
const WIRE = 'M20 22 V48 A12 12 0 0 0 44 48 V12 A8 8 0 0 0 28 12 V44 A4 4 0 0 0 36 44 V18';
</script>
