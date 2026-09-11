<!--
クリップボードコピーのアイコン(木製バインダー+挟まれた紙+手前の折れた紙)
UTF-8絵文字に対応する定番絵文字は存在しない(📋は意味がズレるため不採用)。
グラデーションのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="27 14 112 112"
    :style="{ height: sizeStyle }"
  >
    <defs>
      <!-- バインダー: 木材(明るい飴色→濃い茶) -->
      <linearGradient :id="boardGradId" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="#d9a45c" />
        <stop offset="0.55" stop-color="#c08a41" />
        <stop offset="1" stop-color="#9c6c2c" />
      </linearGradient>
      <!-- 紙: 白 -->
      <linearGradient :id="paperGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.85" stop-color="#eef0f4" />
        <stop offset="1" stop-color="#e2e5ec" />
      </linearGradient>
      <!-- クリップ金具: 明るいシルバー -->
      <linearGradient :id="clipGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e8edf6" />
        <stop offset="1" stop-color="#b9c4d9" />
      </linearGradient>
      <!-- 折れたページ角の裏面 -->
      <linearGradient :id="curlGradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#cdd2dc" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="82" cy="122" rx="48" ry="4" fill="#000000" opacity="0.13" />

    <!-- バインダー板(木材) -->
    <rect
      x="30" y="26" width="72" height="94" rx="9"
      :fill="`url(#${boardGradId})`"
      stroke="#7d5424"
      stroke-width="2"
    />
    <!-- 木目(縦に流れる細い曲線) -->
    <g fill="none" stroke="#9c6c2c" stroke-width="1.2" opacity="0.5" stroke-linecap="round">
      <path d="M36 34 c2 20 -2 44 1 78" />
      <path d="M97 36 c-2 24 2 46 -1 76" />
    </g>

    <!-- バインダーに挟まれた紙(端が覗く) -->
    <rect x="37" y="36" width="58" height="78" rx="4" fill="#e8ebf1" stroke="#c3c9d4" stroke-width="1.2" />
    <!-- 挟まれた紙のテキスト行(手前の紙に隠れない左側だけ) -->
    <g stroke="#b3bdd4" stroke-width="3.5" stroke-linecap="round" opacity="0.9">
      <line x1="43" y1="46" x2="80" y2="46" />
      <line x1="43" y1="56" x2="72" y2="56" />
      <line x1="43" y1="66" x2="52" y2="66" />
      <line x1="43" y1="76" x2="52" y2="76" />
      <line x1="43" y1="86" x2="52" y2="86" />
    </g>

    <!-- 手前の紙の落ち影 -->
    <rect x="56" y="50" width="70" height="76" rx="6" fill="#000000" opacity="0.14" />

    <!-- 手前の紙(右下の角が折れる: 角を欠いた輪郭) -->
    <path
      d="M58 54 a6 6 0 0 1 6 -6 h52 a6 6 0 0 1 6 6 v50 l-18 18 h-40 a6 6 0 0 1 -6 -6 Z"
      :fill="`url(#${paperGradId})`"
      stroke="#c3c9d4"
      stroke-width="1.5"
    />
    <!-- 折れたページ角(裏面のめくれ) -->
    <path
      d="M122 104 l-18 18 c-1 -8 3 -15 10 -17 Z"
      :fill="`url(#${curlGradId})`"
      stroke="#b6bcc8"
      stroke-width="1.2"
      stroke-linejoin="round"
    />
    <!-- 折れ根元の落ち影 -->
    <path d="M122 104 l-18 18 l-2 -1 l17 -18 Z" fill="#000000" opacity="0.08" />

    <!-- 手前の紙のテキスト行(青系の丸帯) -->
    <g stroke="#aebadb" stroke-width="5" stroke-linecap="round">
      <line x1="68" y1="64" x2="112" y2="64" />
      <line x1="68" y1="76" x2="112" y2="76" />
      <line x1="68" y1="88" x2="112" y2="88" />
      <line x1="68" y1="100" x2="102" y2="100" />
      <line x1="68" y1="111" x2="90" y2="111" />
    </g>

    <!-- クリップ金具(バインダー上部: 紙の上に重なる) -->
    <path
      d="M52 32 v-6 a6 6 0 0 1 6 -6 h16 a6 6 0 0 1 6 6 v6 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4 Z"
      :fill="`url(#${clipGradId})`"
      stroke="#98a3ba"
      stroke-width="1.8"
    />
    <!-- 金具の穴(木材色が覗く) -->
    <circle cx="66" cy="25" r="3.2" fill="#9c6c2c" stroke="#98a3ba" stroke-width="1" />
    <!-- 金具の上縁ハイライト -->
    <path d="M56 22 a4 4 0 0 1 4 -3.5 h12" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.7" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});

const uid = (useId() ?? 'cc').replace(/[^a-zA-Z0-9_-]/g, '') || 'cc';
const boardGradId = `clipcopy-board-${uid}`;
const paperGradId = `clipcopy-paper-${uid}`;
const clipGradId = `clipcopy-clip-${uid}`;
const curlGradId = `clipcopy-curl-${uid}`;
</script>
