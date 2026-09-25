<!--
UTF-8絵文字🔆(HIGH BRIGHTNESS SYMBOL)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
    :style="iconSizeStyle(props.size)"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <radialGradient :id="sunGradId" gradientUnits="userSpaceOnUse" cx="32" cy="30" r="28">
        <stop offset="0" stop-color="#ffdf70" />
        <stop offset="0.4" stop-color="#fbb03b" />
        <stop offset="1" stop-color="#e8831a" />
      </radialGradient>
    </defs>

    <!-- 光線(先細りの花弁8本、round joinで角を丸める) -->
    <g :fill="`url(#${sunGradId})`" :stroke="`url(#${sunGradId})`" stroke-width="2" stroke-linejoin="round">
      <polygon v-for="(r, i) in rayPoints" :key="i" :points="r" />
    </g>

    <!-- 中央の円 -->
    <circle cx="32" cy="32" r="10.5" :fill="`url(#${sunGradId})`" />
    <!-- 中央のハイライト -->
    <ellipse cx="29" cy="28" rx="4.5" ry="3.5" fill="#ffffff" opacity="0.35" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'hb').replace(/[^a-zA-Z0-9_-]/g, '') || 'hb';
const sunGradId = `brightness-sun-${uid}`;

const CX = 32;
const CY = 32;
/** 光線の基部半径・先端半径・基部の半幅 */
const RAY_BASE = 16.5;
const RAY_TIP = 27.5;
const RAY_HALF_W = 2.6;

/** 光線8本(45度間隔の先細り三角形)を生成する */
const rayPoints = Array.from({ length: 8 }, (_, i) => {
  const a = (i * 45 * Math.PI) / 180;
  const t = { x: Math.cos(a), y: Math.sin(a) };
  const n = { x: -t.y, y: t.x };
  const bx = CX + t.x * RAY_BASE;
  const by = CY + t.y * RAY_BASE;
  const p1 = `${(bx + n.x * RAY_HALF_W).toFixed(2)},${(by + n.y * RAY_HALF_W).toFixed(2)}`;
  const p2 = `${(bx - n.x * RAY_HALF_W).toFixed(2)},${(by - n.y * RAY_HALF_W).toFixed(2)}`;
  const tip = `${(CX + t.x * RAY_TIP).toFixed(2)},${(CY + t.y * RAY_TIP).toFixed(2)}`;
  return `${p1} ${tip} ${p2}`;
});
</script>