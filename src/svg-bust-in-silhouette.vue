<!--
UTF-8絵文字👤(BUST IN SILHOUETTE)をイメージしたアイコン
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
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 頭と胴で同じ明暗になるよう、図形ごとではなく座標系基準で上薄め→下濃めにする -->
      <linearGradient :id="bodyGradId" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="58">
        <stop offset="0" stop-color="#9dbbdf" />
        <stop offset="1" stop-color="#58799f" />
      </linearGradient>
    </defs>
    <!-- 左肩→首→頭(楕円の弧)→首→右肩を1本の輪郭にし、縁取りが頭と首の境目に出ないようにする -->
    <path
      d="M8 58 Q8 45 23 41.5 Q27.5 40.5 27.5 34.42 A11.5 13.5 0 1 1 36.5 34.42 Q36.5 40.5 41 41.5 Q56 45 56 58 Z"
      :fill="`url(#${bodyGradId})`"
      stroke="#a9c4e4"
      stroke-width="1"
    />
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

const uid = (useId() ?? 'bs').replace(/[^a-zA-Z0-9_-]/g, '') || 'bs';
const bodyGradId = `bust-in-silhouette-body-${uid}`;
</script>
