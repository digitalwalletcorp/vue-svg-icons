<!--
UTF-8絵文字📖(OPEN BOOK)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="16 14.5 128 128"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle, ...iconSizeStyle(props.size) }"
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
      <!-- 表紙: 上端を明るく下端を暗くして厚みを出す -->
      <linearGradient :id="bookCoverId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#dcb3d6" />
        <stop offset="0.6" stop-color="#c690bf" />
        <stop offset="1" stop-color="#a86f9f" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="80" cy="120" rx="60" ry="5" fill="#000000" opacity="0.13" />

    <!-- 表紙: ページの輪郭に沿って湾曲させ、左右と下にはみ出させて見せる -->
    <path
      d="M80 54 C 68 44, 44 38, 20 42 V 117 C 38 112, 64 111, 80 119
        C 96 111, 122 112, 140 117 V 42 C 116 38, 92 44, 80 54 Z"
      :fill="`url(#${bookCoverId})`"
      stroke="#9a6190"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    <!-- ページの束(小口): ページ下端に覗くグレーの段 -->
    <path d="M80 52 C 68 42, 45 37, 24 40 V 113 C 40 108, 64 107, 80 115 Z" fill="#d7dade" stroke="#c2c6cc" stroke-width="1.5" />
    <path d="M80 52 C 92 42, 115 37, 136 40 V 113 C 120 108, 96 107, 80 115 Z" fill="#d7dade" stroke="#c2c6cc" stroke-width="1.5" />

    <!-- 左ページ -->
    <path d="M80 50 C 68 40, 46 36, 27 38 V 109 C 42 104, 64 103, 80 111 Z" :fill="`url(#${bookPageId})`" stroke="#d4d7dc" stroke-width="1" />
    <!-- 右ページ -->
    <path d="M80 50 C 92 40, 114 36, 133 38 V 109 C 118 104, 96 103, 80 111 Z" :fill="`url(#${bookPageId})`" stroke="#d4d7dc" stroke-width="1" />

    <!-- 中央の綴じ目(ノド)の陰影 -->
    <path d="M74 49 h12 v62 h-12 Z" :fill="`url(#${bookCreaseId})`" opacity="0.8" />

    <!-- 本文の行(左ページ) -->
    <g stroke="#aeb6c2" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M35 49 C 47 46, 60 48, 71 55" />
      <path d="M35 61 C 47 58, 60 60, 71 67" />
      <path d="M35 73 C 47 70, 60 72, 71 79" />
      <path d="M35 85 C 47 82, 60 84, 71 91" />
      <path d="M35 97 C 44 94, 53 95, 61 99" />
    </g>
    <!-- 本文の行(右ページ) -->
    <g stroke="#aeb6c2" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M89 55 C 100 48, 113 46, 125 49" />
      <path d="M89 67 C 100 60, 113 58, 125 61" />
      <path d="M89 79 C 100 72, 113 70, 125 73" />
      <path d="M89 91 C 100 84, 113 82, 125 85" />
      <path d="M99 99 C 107 95, 116 94, 125 97" />
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
const bookPageId = `book-page-${uid}`;
const bookCreaseId = `book-crease-${uid}`;
const bookCoverId = `book-cover-${uid}`;

const sizeStyle = computed((): string => toCssSize(props.size));
</script>
