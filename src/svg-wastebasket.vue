<!--
UTF-8絵文字🗑(WASTEBASKET)をイメージしたアイコン
linearGradient/useのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="29 40 102 102"
    :style="{ height: sizeStyle }"
  >
    <defs>
      <linearGradient :id="wbBodyId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#b9bec6" />
        <stop offset="0.22" stop-color="#e9ebee" />
        <stop offset="0.55" stop-color="#c6cbd2" />
        <stop offset="1" stop-color="#8f959e" />
      </linearGradient>
      <linearGradient :id="wbRimId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#9aa0a9" />
        <stop offset="0.25" stop-color="#f0f2f4" />
        <stop offset="0.6" stop-color="#b7bcc4" />
        <stop offset="1" stop-color="#7d838c" />
      </linearGradient>
      <clipPath :id="wbClipId">
        <path d="M42 50 h76 l-7 76 a8 8 0 0 1 -8 7 h-46 a8 8 0 0 1 -8 -7 Z" />
      </clipPath>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="80" cy="134" rx="44" ry="6" fill="#000000" opacity="0.13" />

    <!-- 奥側のメッシュ(透けて見える背面) -->
    <g :clip-path="`url(#${wbClipId})`" stroke="#6f757e" stroke-width="1.4" opacity="0.22" transform="translate(6 0)">
      <path d="M20 58 l60 66 M32 52 l60 66 M44 46 l60 66 M56 46 l60 66 M68 46 l60 66 M80 46 l52 58 M92 46 l40 44" fill="none" />
      <path d="M140 58 l-60 66 M128 52 l-60 66 M116 46 l-60 66 M104 46 l-60 66 M92 46 l-60 66 M80 46 l-52 58 M68 46 l-40 44" fill="none" />
    </g>

    <!-- 胴体(半透明: 金属の照りを薄く残す) -->
    <path
      d="M42 50 h76 l-7 76 a8 8 0 0 1 -8 7 h-46 a8 8 0 0 1 -8 -7 Z"
      :fill="`url(#${wbBodyId})`"
      fill-opacity="0.3"
      stroke="#83898f"
      stroke-width="1.5"
    />

    <!-- 手前側のメッシュ -->
    <g :clip-path="`url(#${wbClipId})`" stroke="#6f757e" stroke-width="1.8" opacity="0.7">
      <path d="M20 58 l60 66 M32 52 l60 66 M44 46 l60 66 M56 46 l60 66 M68 46 l60 66 M80 46 l52 58 M92 46 l40 44" fill="none" />
      <path d="M140 58 l-60 66 M128 52 l-60 66 M116 46 l-60 66 M104 46 l-60 66 M92 46 l-60 66 M80 46 l-52 58 M68 46 l-40 44" fill="none" />
    </g>

    <!-- 底の帯 -->
    <path d="M52 122 h56 l-1 4 a8 8 0 0 1 -8 7 h-46 a8 8 0 0 1 -8 -7 l-0.2 -1 Z" fill="#9aa0a9" opacity="0.5" transform="translate(4 0)" />

    <!-- 上部リム -->
    <rect x="38" y="42" width="84" height="11" rx="5.5" :fill="`url(#${wbRimId})`" stroke="#7d838c" stroke-width="1.5" />
    <rect x="42" y="44" width="76" height="2.5" rx="1.25" fill="#ffffff" opacity="0.6" />
    <path d="M43 53 h74 l-0.5 5 h-73 Z" fill="#000000" opacity="0.10" />
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

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const wbBodyId = `wb-body-${uid}`;
const wbRimId = `wb-rim-${uid}`;
const wbClipId = `wb-clip-${uid}`;

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
