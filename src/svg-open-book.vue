<!--
UTF-8絵文字📖(OPEN BOOK)をイメージしたアイコン
linearGradient/useのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="16 20 128 128"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <linearGradient :id="bookPageId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.8" stop-color="#f2f3f5" />
        <stop offset="1" stop-color="#e4e7eb" />
      </linearGradient>
      <linearGradient :id="bookCreaseId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#c9cdd4" stop-opacity="0" />
        <stop offset="0.5" stop-color="#aab1bb" stop-opacity="0.9" />
        <stop offset="1" stop-color="#c9cdd4" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- 接地影(ふんわり大きめ) -->
    <ellipse cx="80" cy="126" rx="62" ry="9" fill="#000000" opacity="0.13" />

    <!-- 本の下面の影: ページの輪郭を少し下にずらした形 -->
    <path
      d="M80 52 C 63 41, 38 39, 22 44 L 22 112 C 38 107, 63 110, 80 122
        C 97 110, 122 107, 138 112 L 138 44 C 122 39, 97 41, 80 52 Z"
      fill="#000000"
      opacity="0.10"
    />

    <!-- ページの束(小口): ページ下端に覗くグレーの段 -->
    <path
      d="M80 48 C 64 37, 38 35, 22 40 L 22 108 C 38 103, 64 106, 80 118 Z"
      fill="#d7dade"
      stroke="#c2c6cc"
      stroke-width="1.5"
    />
    <path
      d="M80 48 C 96 37, 122 35, 138 40 L 138 108 C 122 103, 96 106, 80 118 Z"
      fill="#d7dade"
      stroke="#c2c6cc"
      stroke-width="1.5"
    />

    <!-- 左ページ -->
    <path
      d="M80 46 C 64 35, 40 33, 25 38 L 25 105 C 40 100, 64 103, 80 114 Z"
      :fill="`url(#${bookPageId})`"
    />
    <!-- 右ページ -->
    <path
      d="M80 46 C 96 35, 120 33, 135 38 L 135 105 C 120 100, 96 103, 80 114 Z"
      :fill="`url(#${bookPageId})`"
    />

    <!-- 中央の綴じ目(ノド)の陰影 -->
    <path d="M74 47 h12 v66 h-12 Z" :fill="`url(#${bookCreaseId})`" opacity="0.8" />

    <!-- 本文の行(左ページ) -->
    <g stroke="#aeb6c2" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M33 52 C 46 48, 60 49, 71 54" />
      <path d="M33 64 C 46 60, 60 61, 71 66" />
      <path d="M33 76 C 46 72, 60 73, 71 78" />
      <path d="M33 88 C 44 84, 54 85, 63 89" />
    </g>
    <!-- 本文の行(右ページ) -->
    <g stroke="#aeb6c2" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M89 54 C 100 49, 114 48, 127 52" />
      <path d="M89 66 C 100 61, 114 60, 127 64" />
      <path d="M89 78 C 100 73, 114 72, 127 76" />
      <path d="M89 89 C 98 85, 108 84, 117 87" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
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
const bookPageId = `book-page-${uid}`;
const bookCreaseId = `book-crease-${uid}`;

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
