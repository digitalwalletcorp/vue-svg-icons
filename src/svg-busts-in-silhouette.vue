<!--
UTF-8絵文字👥(BUSTS IN SILHOUETTE)をイメージしたアイコン
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
      <!-- 手前の人: 👤と同じ配色 -->
      <linearGradient :id="frontGradId" gradientUnits="userSpaceOnUse" x1="0" y1="6.5" x2="0" y2="56.5">
        <stop offset="0" stop-color="#9dbbdf" />
        <stop offset="1" stop-color="#58799f" />
      </linearGradient>
      <!-- 奥の人: 手前より一段濃くして前後関係を出す -->
      <linearGradient :id="backGradId" gradientUnits="userSpaceOnUse" x1="0" y1="6.5" x2="0" y2="56.5">
        <stop offset="0" stop-color="#7d9cc2" />
        <stop offset="1" stop-color="#45648a" />
      </linearGradient>
      <!-- 縮小すると胴の下端が上がるため、胴を下へ延ばしておき、2人の下端をここで👤と同じy=56.5に揃える -->
      <clipPath :id="bottomClipId">
        <rect x="0" y="0" width="64" height="56.5" />
      </clipPath>
    </defs>
    <g :clip-path="`url(#${bottomClipId})`">
      <!-- 奥の人(右上に0.75倍) -->
      <path
        :d="BUST_PATH"
        transform="translate(19 1.5) scale(0.75)"
        :fill="`url(#${backGradId})`"
        stroke="#8fabcf"
        stroke-width="1.25"
      />
      <!-- 手前の人(左下に0.85倍) -->
      <path
        :d="BUST_PATH"
        transform="translate(-3 7.2) scale(0.85)"
        :fill="`url(#${frontGradId})`"
        stroke="#a9c4e4"
        stroke-width="1.1"
      />
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

const uid = (useId() ?? 'bs').replace(/[^a-zA-Z0-9_-]/g, '') || 'bs';
const frontGradId = `busts-in-silhouette-front-${uid}`;
const backGradId = `busts-in-silhouette-back-${uid}`;
const bottomClipId = `busts-in-silhouette-bottom-${uid}`;

/**
 * 1人分の輪郭。svg-bust-in-silhouetteのpathを1.5下げ、両肩の下端(y=58)をy=72まで縦に延ばしたもの。
 * 縁取りの太さは縮小率で割り戻し、表示上は👤とほぼ同じ太さになるようにしている
 */
const BUST_PATH = 'M8 72 L8 58 Q8 45 23 41.5 Q27.5 40.5 27.5 34.42 A11.5 13.5 0 1 1 36.5 34.42 Q36.5 40.5 41 41.5 Q56 45 56 58 L56 72 Z';
</script>
