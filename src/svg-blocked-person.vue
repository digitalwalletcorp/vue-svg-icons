<!--
人のシルエットに禁止マークを重ねたアイコン
UTF-8絵文字に該当するものは存在しない(🚫と👤を重ねたイメージ)
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
      <!-- 頭と胴で同じ明暗になるよう、図形ごとではなく座標系基準で上薄め→下濃めにする -->
      <linearGradient :id="bodyGradId" gradientUnits="userSpaceOnUse" x1="0" y1="8" x2="0" y2="58">
        <stop offset="0" stop-color="#9dbbdf" />
        <stop offset="1" stop-color="#58799f" />
      </linearGradient>
      <linearGradient :id="ringGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f0503f" />
        <stop offset="1" stop-color="#b3180b" />
      </linearGradient>
    </defs>
    <!-- 人のシルエット(左肩→首→頭→首→右肩を1本の輪郭で描く) -->
    <path
      d="M8 58 Q8 45 23 41.5 Q27.5 40.5 27.5 34.42 A11.5 13.5 0 1 1 36.5 34.42 Q36.5 40.5 41 41.5 Q56 45 56 58 Z"
      :fill="`url(#${bodyGradId})`"
      stroke="#a9c4e4"
      stroke-width="1"
    />
    <!-- 禁止マーク(円と、左上から右下への斜線) -->
    <g fill="none" :stroke="`url(#${ringGradId})`" stroke-width="6" stroke-linecap="round">
      <circle cx="32" cy="32" r="26" />
      <line x1="13.62" y1="13.62" x2="50.38" y2="50.38" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'bp').replace(/[^a-zA-Z0-9_-]/g, '') || 'bp';
const bodyGradId = `blocked-person-body-${uid}`;
const ringGradId = `blocked-person-ring-${uid}`;
</script>
