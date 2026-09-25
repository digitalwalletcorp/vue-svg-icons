<!--
UTF-8絵文字📊(BAR CHART)をイメージしたアイコン
bgColor: 紙(背景)の色。transparentを指定すると紙・縁・影を描かずグラフだけになる
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
      <linearGradient :id="paperId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="paperLight" />
        <stop offset="0.75" :stop-color="paperMid" />
        <stop offset="1" :stop-color="paperDark" />
      </linearGradient>
      <linearGradient
        v-for="bar in bars"
        :id="bar.gradientId"
        :key="bar.gradientId"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0" :stop-color="bar.top" />
        <stop offset="1" :stop-color="bar.bottom" />
      </linearGradient>
    </defs>

    <!-- 紙の影と紙。transparentのときは描かず、グラフだけにする -->
    <template v-if="!transparent">
      <rect x="11" y="10" width="142" height="146" rx="10" fill="#000000" opacity="0.12" />
      <rect x="8" y="6" width="142" height="146" rx="10" :fill="`url(#${paperId})`" :stroke="paperBorder" stroke-width="1.5" />
    </template>

    <!-- 目盛り線 -->
    <g stroke="#dde1e7" stroke-width="2">
      <line x1="20" y1="40" x2="138" y2="40" />
      <line x1="20" y1="71" x2="138" y2="71" />
      <line x1="20" y1="102" x2="138" y2="102" />
    </g>

    <!-- 棒(左側に細いハイライト) -->
    <g v-for="bar in bars" :key="bar.gradientId">
      <rect :x="bar.x" :y="BASE_Y - bar.height" :width="BAR_WIDTH" :height="bar.height" rx="3" :fill="`url(#${bar.gradientId})`" />
      <rect :x="bar.x + 3" :y="BASE_Y - bar.height + 3" width="5" :height="bar.height - 6" rx="2.5" fill="#ffffff" opacity="0.35" />
    </g>

    <!-- 軸 -->
    <line x1="20" :y1="BASE_Y" x2="138" :y2="BASE_Y" stroke="#8f98a6" stroke-width="3" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { resolveNamedColor } from '@/internal/named-color';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 紙(背景)の色。transparentを指定すると紙を描かない */
  bgColor?: string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  bgColor: '#ffffff'
});

const uid = (useId() ?? 'bc').replace(/[^a-zA-Z0-9_-]/g, '') || 'bc';
const paperId = `bar-chart-paper-${uid}`;

/** 色を明暗方向に amount(-255〜255)だけシフトする。カラーネームは16進数へ解決してから処理する */
const shiftColor = (color: string, amount: number): string => {
  const hex = resolveNamedColor(color);
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (m === null) {
    return hex; // #RGB等の想定外形式はそのまま返す
  }
  const num = parseInt(m[1], 16);
  const clamp = (v: number): number => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16 & 0xff) + amount);
  const g = clamp((num >> 8 & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const transparent = computed((): boolean => props.bgColor.toLowerCase() === 'transparent');
/** 紙の上端 */
const paperLight = computed((): string => shiftColor(props.bgColor, 0));
/** 紙の中間 */
const paperMid = computed((): string => shiftColor(props.bgColor, -11));
/** 紙の下端 */
const paperDark = computed((): string => shiftColor(props.bgColor, -22));
/** 紙の縁 */
const paperBorder = computed((): string => shiftColor(props.bgColor, -43));

/** 棒の下端(軸)のy座標 */
const BASE_Y = 134;
const BAR_WIDTH = 28;

const bars = [
  { x: 30, height: 56, top: '#f26b5b', bottom: '#c9302c' },
  { x: 70, height: 106, top: '#5b9bee', bottom: '#2f6fd0' },
  { x: 110, height: 80, top: '#5fd07a', bottom: '#2e9d4a' }
].map((bar, i) => ({ ...bar, gradientId: `bar-chart-bar${i}-${uid}` }));
</script>
