<!--
UTF-8絵文字👀(EYES)をイメージしたアイコン
左右同形の目を定数(中心座標)から2つ生成する。
linearGradientのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="8 10 148 148"
    :style="{ height: sizeStyle }"
  >
    <defs>
      <!-- 白目: 上が明るく下がわずかに沈む -->
      <linearGradient :id="scleraGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.75" stop-color="#f2f4f6" />
        <stop offset="1" stop-color="#dfe3e8" />
      </linearGradient>
      <!-- 瞳: 紺〜黒 -->
      <linearGradient :id="pupilGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#3d4a61" />
        <stop offset="1" stop-color="#20262f" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="82" cy="148" rx="56" ry="6" fill="#000000" opacity="0.12" />

    <g v-for="e in eyes" :key="e.key">
      <!-- 白目 -->
      <ellipse
        :cx="e.cx" cy="82" rx="33" ry="44"
        :fill="`url(#${scleraGradId})`"
        stroke="#c3c9d1"
        stroke-width="2"
      />
      <!-- 白目の内側上部の落ち影(まぶたの陰) -->
      <path
        :d="`M ${e.cx - 26} 62 A 30 36 0 0 1 ${e.cx + 26} 62`"
        fill="none"
        stroke="#aeb6c2"
        stroke-width="3"
        opacity="0.45"
        stroke-linecap="round"
      />
      <!-- 瞳(左寄り) -->
      <ellipse
        :cx="e.cx - 12" cy="88" rx="13" ry="17"
        :fill="`url(#${pupilGradId})`"
      />
      <!-- 瞳のハイライト -->
      <ellipse
        :cx="e.cx - 17" cy="80" rx="4" ry="5.5"
        fill="#ffffff"
        opacity="0.85"
      />
    </g>
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

const uid = (useId() ?? 'ey').replace(/[^a-zA-Z0-9_-]/g, '') || 'ey';
const scleraGradId = `eyes-sclera-${uid}`;
const pupilGradId = `eyes-pupil-${uid}`;

/** 左右の目(中心xのみ異なる) */
const eyes = [
  { key: 'left', cx: 46 },
  { key: 'right', cx: 118 }
] as const;

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
