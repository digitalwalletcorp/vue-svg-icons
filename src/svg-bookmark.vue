<!--
UTF-8絵文字🔖(BOOKMARK)をイメージしたアイコン
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
      <linearGradient :id="paperId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fffaf0" />
        <stop offset="0.6" stop-color="#f6ecd6" />
        <stop offset="1" stop-color="#e9dcbd" />
      </linearGradient>
      <linearGradient :id="ribbonId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#b79ad8" />
        <stop offset="0.5" stop-color="#d6c2ee" />
        <stop offset="1" stop-color="#a687cc" />
      </linearGradient>
      <!-- 花びら: 付け根を白く、先端に向かって桜色を濃くする -->
      <radialGradient :id="petalId" cx="0.5" cy="1" r="1" fx="0.5" fy="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.6" stop-color="#f9c6d4" />
        <stop offset="1" stop-color="#f08aa6" />
      </radialGradient>
    </defs>

    <!-- しおり全体を右に傾ける -->
    <g transform="rotate(38 80 86)">
      <!-- 紙の影と紙 -->
      <rect x="61" y="29" width="44" height="118" rx="4" fill="#000000" opacity="0.14" />
      <rect x="58" y="26" width="44" height="118" rx="4" :fill="`url(#${paperId})`" stroke="#d6c9a8" stroke-width="1.2" />
      <!-- 桜の枝 -->
      <path d="M60 136 Q72 118 70 100 Q69 90 78 82" fill="none" stroke="#8a6a4a" stroke-width="1.8" stroke-linecap="round" />
      <path d="M70 108 Q80 104 86 96" fill="none" stroke="#8a6a4a" stroke-width="1.4" stroke-linecap="round" />
      <!-- 桜の花(5枚の花びら+芯) -->
      <g v-for="(flower, i) in flowers" :key="i" :transform="`translate(${flower.cx} ${flower.cy})`">
        <path
          v-for="angle in flower.angles"
          :key="angle"
          :d="flower.petal"
          :transform="`rotate(${angle})`"
          :fill="`url(#${petalId})`"
        />
        <circle :r="flower.r * 0.22" fill="#f4c542" />
      </g>
      <!-- 紐を通す穴 -->
      <circle cx="80" cy="38" r="4" fill="#cdbf9c" />
      <!-- 紐: 穴を通って上に2本出る -->
      <path d="M80 38 Q74 22 66 6" fill="none" :stroke="`url(#${ribbonId})`" stroke-width="5" stroke-linecap="round" />
      <path d="M80 38 Q86 22 92 6" fill="none" :stroke="`url(#${ribbonId})`" stroke-width="5" stroke-linecap="round" />
      <circle cx="80" cy="38" r="3.2" fill="#b79ad8" />
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

const uid = (useId() ?? 'bm').replace(/[^a-zA-Z0-9_-]/g, '') || 'bm';
const paperId = `bookmark-paper-${uid}`;
const ribbonId = `bookmark-ribbon-${uid}`;
const petalId = `bookmark-petal-${uid}`;

/** 先端に切れ込みのある花びら(付け根を原点に、長さrで上向き) */
const petalPath = (r: number): string =>
  `M0 0 C${-r * 0.55} ${-r * 0.35} ${-r * 0.5} ${-r * 0.95} ${-r * 0.18} ${-r} L0 ${-r * 0.85} L${r * 0.18} ${-r} C${r * 0.5} ${-r * 0.95} ${r * 0.55} ${-r * 0.35} 0 0 Z`;

/** 桜の花の位置・大きさ・向き(rotは1枚目の花びらの角度) */
const flowers = [
  { cx: 78, cy: 80, r: 9, rot: 10 },
  { cx: 88, cy: 98, r: 7, rot: 40 },
  { cx: 70, cy: 118, r: 8, rot: 25 },
  { cx: 91, cy: 124, r: 5.5, rot: 60 }
].map((flower) => ({
  ...flower,
  petal: petalPath(flower.r),
  angles: [0, 1, 2, 3, 4].map((i) => flower.rot + i * 72)
}));
</script>
