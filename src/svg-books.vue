<!--
UTF-8絵文字📚(BOOKS)をイメージしたアイコン
linearGradient/useのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="21.5 22.5 120 120"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <linearGradient
        v-for="b in books"
        :id="b.id"
        :key="b.name"
        x1="0" y1="0" x2="0" y2="1"
      >
        <stop offset="0" :stop-color="b.light" />
        <stop offset="0.55" :stop-color="b.color" />
        <stop offset="1" :stop-color="b.dark" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="83" cy="128" rx="52" ry="6" fill="#000000" opacity="0.13" />

    <!-- 下の本から順に描画(上の本が天面を覆う) -->
    <g v-for="b in books" :key="b.name">
      <!-- 天面 -->
      <polygon :points="b.topFace" :fill="b.light" stroke="#00000022" stroke-width="1" />
      <!-- 天面手前の縁 -->
      <line
        :x1="b.x" :y1="b.y" :x2="b.x + b.w" :y2="b.y"
        :stroke="b.dark" stroke-width="2" opacity="0.5"
      />
      <!-- 側面: 表紙の縁(濃色) -->
      <polygon :points="b.sideFace" :fill="b.dark" stroke="#00000033" stroke-width="1" />
      <!-- ページ(白): 表紙の縁に挟まれた一段内側 -->
      <polygon :points="b.pageFace" fill="#fbf8ee" stroke="#b8b19a" stroke-width="1.2" />
      <!-- 小口のページ線 -->
      <g stroke="#c5bda4" stroke-width="1.2" fill="none">
        <line v-for="(ln, i) in b.pageLines" :key="i" :x1="ln.x1" :y1="ln.y1" :x2="ln.x2" :y2="ln.y2" />
      </g>
      <!-- 前面(背表紙) -->
      <rect
        :x="b.x" :y="b.y" :width="b.w" :height="b.h"
        :fill="`url(#${b.id})`"
        stroke="#00000033" stroke-width="1"
      />
      <!-- 背表紙の金の飾り(‖) -->
      <g fill="#e8c04a" stroke="#a8842a" stroke-width="0.8">
        <rect :x="b.x + 10" :y="b.y + 7" width="4" :height="b.h - 14" rx="1.5" />
        <rect :x="b.x + 17" :y="b.y + 7" width="4" :height="b.h - 14" rx="1.5" />
      </g>
      <!-- 背の丸み: 前面左端のハイライト -->
      <rect :x="b.x + 1.5" :y="b.y + 2" width="2.5" :height="b.h - 4" rx="1.25" fill="#ffffff" opacity="0.25" />
    </g>

    <!-- 最上段の天面エンブレム(金の平行四辺形) -->
    <path d="M44 40 l16 -8 l14 0 l-16 8 Z" fill="#e8c04a" stroke="#a8842a" stroke-width="0.8" />
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

/** 奥行きベクトル(右上方向) */
const DX = 22;
const DY = -11;

/** 表紙の縁の厚み(側面でページを挟む帯の太さ) */
const EDGE = 3.5;

/** #RRGGBB を明暗方向に amount(-255〜255)だけシフトする */
const shiftColor = (hex: string, amount: number): string => {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (m === null) {
    return hex;
  }
  const num = parseInt(m[1], 16);
  const clamp = (v: number): number => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16 & 0xff) + amount);
  const g = clamp((num >> 8 & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

/** 本の定義(下から順)。x/yは前面左上、w/hは前面サイズ */
const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const BOOK_DEFS = [
  { name: 'green', id: `green-book-spine-${uid}`, x: 29, y: 98, w: 84, h: 26, color: '#3faf46' },
  { name: 'blue', id: `bulu-book-spine-${uid}`, x: 33, y: 72, w: 84, h: 26, color: '#2f52c9' },
  { name: 'purple', id: `purple-book-spine-${uid}`, x: 26, y: 46, w: 84, h: 26, color: '#a8579d' }
] as const;

const books = BOOK_DEFS.map((b) => {
  const topFace = [
    [b.x, b.y],
    [b.x + b.w, b.y],
    [b.x + b.w + DX, b.y + DY],
    [b.x + DX, b.y + DY]
  ].map((p) => p.join(',')).join(' ');

  // 側面全体(表紙の縁: 濃い表紙色で塗る)
  const sideFace = [
    [b.x + b.w, b.y],
    [b.x + b.w + DX, b.y + DY],
    [b.x + b.w + DX, b.y + DY + b.h],
    [b.x + b.w, b.y + b.h]
  ].map((p) => p.join(',')).join(' ');

  // ページ部分(側面から上下EDGEを除いた内側)
  const pageFace = [
    [b.x + b.w, b.y + EDGE],
    [b.x + b.w + DX, b.y + DY + EDGE],
    [b.x + b.w + DX, b.y + DY + b.h - EDGE],
    [b.x + b.w, b.y + b.h - EDGE]
  ].map((p) => p.join(',')).join(' ');

  // 小口のページ線: ページ部分を横切る奥行き方向の線3本
  const pageLines = [0.33, 0.5, 0.67].map((t) => ({
    x1: b.x + b.w,
    y1: b.y + b.h * t,
    x2: b.x + b.w + DX,
    y2: b.y + DY + b.h * t
  }));

  return {
    ...b,
    light: shiftColor(b.color, 36),
    dark: shiftColor(b.color, -40),
    topFace,
    sideFace,
    pageFace,
    pageLines
  };
});

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
