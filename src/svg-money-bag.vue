<!--
UTF-8絵文字💰(MONEY BAG)をイメージしたアイコン
絞り口+ひだ+洋梨型の袋+ストローク描画の$記号。
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="17 16 130 130"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 袋: 左上の光→右下の深い金茶 -->
      <radialGradient :id="bagGradId" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stop-color="#e8cd8a" />
        <stop offset="0.5" stop-color="#cfa95e" />
        <stop offset="0.85" stop-color="#a97f3c" />
        <stop offset="1" stop-color="#8c6428" />
      </radialGradient>
      <!-- 絞り口の上のひだ: 袋より暗めの金 -->
      <linearGradient :id="topGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d3b26a" />
        <stop offset="1" stop-color="#a67c39" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="82" cy="140" rx="46" ry="6" fill="#000000" opacity="0.13" />

    <!-- 絞り口の上のひだ(口から溢れる布の房: ふくらみ3つの塊) -->
    <path
      d="M60 48
        C 54 40, 55 30, 63 24
        C 68 21, 74 22, 77 26
        C 78 20, 84 16, 90 17
        C 96 18, 100 23, 99 29
        C 104 26, 111 27, 115 32
        C 119 38, 117 45, 111 48
        C 96 54, 70 54, 60 48
        Z"
      :fill="`url(#${topGradId})`"
      stroke="#7d5a24"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <!-- ひだの布の折り目(房の内側の陰) -->
    <g stroke="#7d5a24" stroke-width="1.5" fill="none" opacity="0.55">
      <path d="M77 27 c-1 7 -1 13 1 19" />
      <path d="M98 30 c-1 6 -2 11 -4 16" />
    </g>

    <!-- 袋本体(洋梨型: 絞り口から裾へ膨らむ) -->
    <path
      d="M64 46 h34
        C 104 52, 112 56, 120 66
        C 132 82, 136 102, 128 118
        C 120 132, 100 138, 82 138
        C 64 138, 44 132, 36 118
        C 28 102, 32 82, 44 66
        C 52 56, 60 52, 64 46
        Z"
      :fill="`url(#${bagGradId})`"
      stroke="#7d5a24"
      stroke-width="2.5"
      stroke-linejoin="round"
    />

    <!-- 絞り口の結び目(くびれの帯) -->
    <path
      d="M60 46 c7 5 35 5 42 0 c-2 6 -8 9 -21 9 c-13 0 -19 -3 -21 -9 Z"
      fill="#a67c39"
      stroke="#7d5a24"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- 絞りから裾へ落ちるしわ(左右) -->
    <g stroke="#8c6428" stroke-width="2" fill="none" opacity="0.55" stroke-linecap="round">
      <path d="M62 58 c-8 12 -12 24 -11 38" />
      <path d="M102 58 c8 12 12 24 11 38" />
    </g>

    <!-- $記号(ストローク描画: S字+縦棒。袋の膨らみの中心に配置) -->
    <g
      fill="none"
      stroke="#3a3d33"
      stroke-linecap="round"
    >
      <!-- 縦棒(S字の上下に5pxずつ突き出す) -->
      <path d="M82 67 v59" stroke-width="6.5" />
      <!-- S字 -->
      <path
        d="M96.5 83
          C 96.5 75.5, 90.5 72, 82 72
          C 73.5 72, 67.5 76, 67.5 83
          C 67.5 90.5, 74.5 93.5, 82 96.5
          C 89.5 99.5, 96.5 102.5, 96.5 110
          C 96.5 117, 90.5 121, 82 121
          C 73.5 121, 67.5 117, 67.5 110"
        stroke-width="8"
      />
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

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});

const uid = (useId() ?? 'mb').replace(/[^a-zA-Z0-9_-]/g, '') || 'mb';
const bagGradId = `moneybag-bag-${uid}`;
const topGradId = `moneybag-top-${uid}`;
</script>
