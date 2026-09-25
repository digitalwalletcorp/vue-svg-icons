<!--
UTF-8絵文字📝(MEMO)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="0 0 160 160"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle, ...iconSizeStyle(props.size) }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <linearGradient :id="paperId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.75" stop-color="#f4f5f7" />
        <stop offset="1" stop-color="#e9ebee" />
      </linearGradient>
      <linearGradient :id="bodyId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd54a" />
        <stop offset="0.5" stop-color="#fbb03b" />
        <stop offset="1" stop-color="#ef8d1f" />
      </linearGradient>
      <linearGradient :id="ferruleId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e8eaed" />
        <stop offset="0.5" stop-color="#b7bcc4" />
        <stop offset="1" stop-color="#8e939b" />
      </linearGradient>
      <linearGradient :id="eraserId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7a6b4" />
        <stop offset="1" stop-color="#e0798d" />
      </linearGradient>
      <linearGradient :id="woodId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f3d3a5" />
        <stop offset="1" stop-color="#d9a86b" />
      </linearGradient>
    </defs>

    <!-- 紙の影 -->
    <rect x="28" y="18" width="108" height="128" rx="7" fill="#000000" opacity="0.12" />

    <!-- 紙 -->
    <rect x="25" y="14" width="108" height="128" rx="7" :fill="`url(#${paperId})`" stroke="#d4d7dc" stroke-width="1.5" />

    <!-- 書かれたテキスト行 -->
    <g stroke="#aeb6c2" stroke-width="4.5" stroke-linecap="round">
      <line x1="38" y1="34" x2="118" y2="34" />
      <line x1="38" y1="49" x2="118" y2="49" />
      <line x1="38" y1="64" x2="104" y2="64" />
      <line x1="38" y1="79" x2="88" y2="79" />
      <line x1="38" y1="94" x2="68" y2="94" />
    </g>

    <!-- 書きかけの線（ペン先付近） -->
    <path d="M38 112 q8 -5 16 0" fill="none" stroke="#8f98a6" stroke-width="4" stroke-linecap="round" />

    <!-- 鉛筆の影 -->
    <g transform="translate(58,124) rotate(-45)" opacity="0.15">
      <rect x="6" y="6" width="118" height="17" rx="4" fill="#000000" />
    </g>

    <!-- 鉛筆（先端を原点にして右上方向へ） -->
    <g transform="translate(55,120) rotate(-45)">
      <!-- 木の削り部分 -->
      <path d="M0 8.5 L24 0 L24 17 Z" :fill="`url(#${woodId})`" />
      <!-- 芯 -->
      <path d="M0 8.5 L9 5.4 L9 11.6 Z" fill="#4d4d55" />
      <!-- 本体（六角の面を3帯で表現） -->
      <rect x="24" y="0" width="80" height="17" :fill="`url(#${bodyId})`" />
      <rect x="24" y="0" width="80" height="5.5" fill="#ffe082" opacity="0.85" />
      <rect x="24" y="11.5" width="80" height="5.5" fill="#e07f14" opacity="0.8" />
      <!-- 金属バンド -->
      <rect x="104" y="-0.5" width="10" height="18" rx="1.5" :fill="`url(#${ferruleId})`" />
      <line x1="107" y1="0" x2="107" y2="17" stroke="#7d828a" stroke-width="1" />
      <line x1="111" y1="0" x2="111" y2="17" stroke="#7d828a" stroke-width="1" />
      <!-- 消しゴム -->
      <path d="M114 0 h6 a7 8.5 0 0 1 0 17 h-6 Z" :fill="`url(#${eraserId})`" />
      <!-- ハイライト -->
      <rect x="26" y="1.5" width="76" height="2.5" rx="1.25" fill="#ffffff" opacity="0.55" />
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
const paperId = `paper-${uid}`;
const bodyId = `body-${uid}`;
const ferruleId = `ferrule-${uid}`;
const eraserId = `eraser-${uid}`;
const woodId = `wood-${uid}`;

const sizeStyle = computed((): string => toCssSize(props.size));
</script>
