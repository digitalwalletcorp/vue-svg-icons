<!--
UTF-8絵文字📅(CALENDAR)をイメージしたアイコン
linearGradientのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="19 21 122 122"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- ヘッダー: 赤茶 -->
      <linearGradient :id="headerGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b06a66" />
        <stop offset="1" stop-color="#96504c" />
      </linearGradient>
      <!-- 台紙: 白 -->
      <linearGradient :id="sheetGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.85" stop-color="#eceef1" />
        <stop offset="1" stop-color="#dfe2e7" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="80" cy="137" rx="50" ry="6" fill="#000000" opacity="0.12" />

    <!-- 台紙(全体) -->
    <rect x="30" y="36" width="100" height="99" rx="8" :fill="`url(#${sheetGradId})`" stroke="#c9ccd2" stroke-width="1.5" />

    <!-- ヘッダー(上部の赤茶の帯。上辺だけ角丸) -->
    <path
      d="M30 44 a8 8 0 0 1 8 -8 h84 a8 8 0 0 1 8 8 v26 h-100 Z"
      :fill="`url(#${headerGradId})`"
      stroke="#7f423e"
      stroke-width="1.5"
    />
    <!-- ヘッダー下端の落ち影 -->
    <rect x="31" y="70" width="98" height="3.5" fill="#000000" opacity="0.10" />

    <!-- 綴じリング(破れた紙の跡を挟む金属ループ) -->
    <g v-for="x in ringXs" :key="x">
      <path :d="tornPaper(x)" fill="#e9e2d6" stroke="#b8ab94" stroke-width="1" />
      <path
        :d="`M ${x - 2.5} 42 v-10 a2.5 2.5 0 0 1 5 0 v10`"
        fill="none"
        stroke="#8f959e"
        stroke-width="3.5"
        stroke-linecap="round"
      />
    </g>

    <!-- FEB (ストローク文字) -->
    <g
      fill="none"
      stroke="#f3e9e8"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- F -->
      <path d="M46 63 v-19 h11 m-11 9 h8" />
      <!-- E -->
      <path d="M74 44 h-10 v19 h10 m-10 -10 h8" />
      <!-- B -->
      <path d="M81 44 v19 m0 -19 h6 a4.5 4.5 0 0 1 0 9 h-6 m6 0 a5 5 0 0 1 0 10 h-6" />
    </g>

    <!-- ヘッダー右のミニ月間グリッド -->
    <g stroke="#e6d5d4" stroke-width="1.6" stroke-linecap="round" opacity="0.9">
      <line
        v-for="(c, i) in miniCells"
        :key="i"
        :x1="c.x - 1.2" :y1="c.y"
        :x2="c.x + 1.2" :y2="c.y"
      />
    </g>

    <!-- 29 (ストローク数字) -->
    <g
      fill="none"
      stroke="#3d4148"
      stroke-width="7"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- 2 -->
      <path d="M56 92 a10 9 0 0 1 20 0 c0 7 -16 14 -20 32 h21" />
      <!-- 9 (上の輪+右から下へ抜く尾) -->
      <circle cx="95" cy="94" r="10" />
      <path d="M105 94 c0 14 -3 22 -9 30" />
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
const headerGradId = `calendar-header-${uid}`;
const sheetGradId = `calendar-sheet-${uid}`;

/** 綴じリングのx座標(2個) */
const ringXs = [55, 105];

/** リング根元の破れた紙の跡(ギザギザの小片) */
const tornPaper = (x: number): string =>
  `M ${x - 5} 42 l1.5 -3 l2 2 l1.5 -3.5 l2 3 l1.5 -2.5 l1.5 4 Z`;

/** ミニ月間グリッド(6列×4行、右上に配置。先頭2/末尾3を空白) */
const M_COLS = 6;
const M_ROWS = 4;
const M_LEFT = 100;
const M_TOP = 44;
const M_STEP_X = 4.6;
const M_STEP_Y = 5.4;
const SKIP_HEAD = 2;
const SKIP_TAIL = 3;
const miniCells = Array.from({ length: M_COLS * M_ROWS }, (_, i) => i)
  .filter((i) => i >= SKIP_HEAD && i < M_COLS * M_ROWS - SKIP_TAIL)
  .map((i) => ({
    x: M_LEFT + M_STEP_X * (i % M_COLS),
    y: M_TOP + M_STEP_Y * Math.floor(i / M_COLS)
  }));

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
