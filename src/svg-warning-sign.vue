<!--
UTF-8絵文字⚠️(WARNING SIGN)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 面: 上の明るい黄→下の濃いアンバー -->
      <linearGradient :id="faceGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd94d" />
        <stop offset="0.6" stop-color="#fbbf2e" />
        <stop offset="1" stop-color="#eda515" />
      </linearGradient>
      <!-- 縁: 面よりわずかに濃い同系色 -->
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f2b81f" />
        <stop offset="1" stop-color="#d18f0a" />
      </linearGradient>
    </defs>

    <!-- 縁: 太いstroke+round joinで大きな角丸を作る -->
    <polygon
      :points="trianglePoints"
      :fill="`url(#${rimGradId})`"
      :stroke="`url(#${rimGradId})`"
      stroke-width="13"
      stroke-linejoin="round"
    />
    <!-- 面: 同じ形を一段細いstrokeで内側に重ねる -->
    <polygon
      :points="trianglePoints"
      :fill="`url(#${faceGradId})`"
      :stroke="`url(#${faceGradId})`"
      stroke-width="9.5"
      stroke-linejoin="round"
      transform="translate(0 -0.5)"
    />

    <!-- エクスクラメーション(棒: 上太→下細のテーパー形) -->
    <path
      d="M32 24.5
        C 33.9 24.5, 35.4 26, 35.2 27.9
        L 34 40.5
        C 33.9 41.6, 33 42.4, 32 42.4
        C 31 42.4, 30.1 41.6, 30 40.5
        L 28.8 27.9
        C 28.6 26, 30.1 24.5, 32 24.5
        Z"
      fill="#262a30"
    />
    <!-- エクスクラメーション(点) -->
    <circle cx="32" cy="48.5" r="2.9" fill="#262a30" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'ws').replace(/[^a-zA-Z0-9_-]/g, '') || 'ws';
const faceGradId = `warning-face-${uid}`;
const rimGradId = `warning-rim-${uid}`;

/**
 * 三角形の3頂点。stroke-width 13のround joinが外側に約6.5px張り出すため、
 * 頂点は最終的な見た目より内側に置く(上10, 左下・右下は底辺52基準)。
 */
const trianglePoints = '32,13 57,53 7,53';
</script>
