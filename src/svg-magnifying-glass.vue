<!--
UTF-8絵文字🔍(LEFT-POINTING MAGNIFYING GLASS)をイメージしたアイコン
direction: 虫眼鏡の方向を変えることができる
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- レンズ: 白ベースのガラス -->
      <radialGradient :id="lenzGlassId" cx="0.35" cy="0.3" r="0.95">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="55%" stop-color="#EDF4F9" />
        <stop offset="100%" stop-color="#C8D9E4" />
      </radialGradient>
      <!-- 柄: 木製風の円柱シェーディング(線に対して垂直方向) -->
      <linearGradient :id="handleWoodId" gradientUnits="userSpaceOnUse" x1="44" y1="52" x2="52" y2="44">
        <stop offset="0%" stop-color="#5A3A24" />
        <stop offset="45%" stop-color="#A9744C" />
        <stop offset="100%" stop-color="#64402A" />
      </linearGradient>
    </defs>
    <g :transform="transform">
      <!-- 繋ぎ目(柄より細い首。柄に合わせて暗めの茶) -->
      <line x1="38.5" y1="38.5" x2="43" y2="43" stroke="#4E3320" stroke-width="5.5" />
      <!-- 柄(本体) -->
      <line x1="42.5" y1="42.5" x2="55" y2="55" :stroke="`url(#${handleWoodId})`" stroke-width="9" stroke-linecap="round" />
      <!-- 柄のハイライト(上側エッジ。木なので控えめ) -->
      <line x1="44.5" y1="41.8" x2="53" y2="50.3" stroke="#FFD9B0" stroke-width="1.4" stroke-linecap="round" opacity="0.25" />
      <!-- レンズ(枠 + ガラス) -->
      <circle cx="27" cy="27" r="17" :fill="`url(#${lenzGlassId})`" stroke="#66757F" stroke-width="4" />
      <!-- ガラス内側の反射リング -->
      <circle cx="27" cy="27" r="14.2" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.25" />
      <!-- ガラスのハイライト -->
      <path d="M17 22 A 12 12 0 0 1 25 14" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.9" />
      <!-- 小さなキラッと -->
      <circle cx="33" cy="34" r="1.6" fill="#FFFFFF" opacity="0.6" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  direction?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'top-left',
  size: '1.2em'
});

const uid = (useId() ?? 'hg').replace(/[^a-zA-Z0-9_-]/g, '') || 'hg';
const lenzGlassId = `lens-glass-${uid}`;
const handleWoodId = `handle-wood-${uid}`;

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});

const transform = computed((): string => {
  switch (props.direction) {
    case 'top-right':
      return 'scale(-1,1) translate(-64,0)';
    case 'bottom-left':
      return 'scale(1,-1) translate(0,-64)';
    case 'bottom-right':
      return 'scale(-1,-1) translate(-64,-64)';
    case 'top-left':
    default:
      return '';
  }
});
</script>
