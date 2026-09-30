<!--
UTF-8絵文字💰(MONEY BAG)をイメージしたアイコン
縄で細く絞った口+上へ広がるフリル状の布+麻袋型の袋(しわに影と光)+ストローク描画の$記号。
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="17 12.5 130 130"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle, ...iconSizeStyle(props.size) }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 袋: 左上の光→右下の深い金茶(明暗を強めに) -->
      <radialGradient :id="bagGradId" cx="0.38" cy="0.32" r="0.85">
        <stop offset="0" stop-color="#f3dea6" />
        <stop offset="0.4" stop-color="#d6b066" />
        <stop offset="0.75" stop-color="#a47838" />
        <stop offset="1" stop-color="#6e4a1c" />
      </radialGradient>
      <!-- 絞り口の上の布: 袋より暗めの金 -->
      <linearGradient :id="topGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e2c47e" />
        <stop offset="1" stop-color="#9c7232" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="82" cy="132.5" rx="50" ry="4" fill="#000000" opacity="0.13" />

    <!-- 袋本体(麻袋型: 細く絞った首から肩を張って裾へ広がる) -->
    <path
      d="M69 55.5
        C 54 61.5, 38 71.5, 35 91.5
        C 32 109.5, 36 123.5, 46 128.5
        C 62 133.5, 102 133.5, 118 128.5
        C 128 123.5, 132 109.5, 129 91.5
        C 126 71.5, 110 61.5, 95 55.5
        Z"
      :fill="`url(#${bagGradId})`"
      stroke="#7d5a24"
      stroke-width="2.5"
      stroke-linejoin="round"
    />

    <!-- しわ: 絞り口から放射状に落ちる折り目。影(暗い細長い面) + その脇の光(明るい線)で凹凸を出す -->
    <!-- 首の下の絞りの陰 -->
    <ellipse cx="82" cy="60.5" rx="15" ry="4" fill="#5a3d16" opacity="0.3" />
    <g fill="#5a3d16" opacity="0.32">
      <!-- 左右の大きなしわ -->
      <path d="M70 58.5 C 59 70.5, 52 85.5, 51 105.5 C 55 91.5, 62 75.5, 74 59.5 Z" />
      <path d="M94 58.5 C 105 70.5, 112 85.5, 113 105.5 C 109 91.5, 102 75.5, 90 59.5 Z" />
      <!-- 首の下の短いしわ -->
      <path d="M77 59.5 C 74 65.5, 72 71.5, 71 78.5 C 74 72.5, 77 66.5, 80 59.5 Z" />
      <path d="M87 59.5 C 90 65.5, 92 71.5, 93 78.5 C 90 72.5, 87 66.5, 84 59.5 Z" />
    </g>
    <g fill="none" stroke="#f6e3b2" stroke-width="1.6" stroke-linecap="round" opacity="0.65">
      <path d="M67 59.5 C 57 71.5, 49 86.5, 48 102.5" />
      <path d="M97 59.5 C 107 71.5, 115 86.5, 116 102.5" />
      <path d="M75 59.5 C 72 65.5, 70 71.5, 69 76.5" />
      <path d="M89 59.5 C 92 65.5, 94 71.5, 95 76.5" />
    </g>

    <!-- $記号(ストローク描画: S字+縦棒。袋の膨らみの中心に配置) -->
    <g fill="none" stroke="#3a3d33" stroke-linecap="round" transform="translate(82 96.5) scale(0.85) translate(-82 -96.5)">
      <path d="M82 67 v59" stroke-width="6.5" />
      <path
        d="M96.5 83
          C 96.5 75.5, 90.5 72, 82 72
          C 73.5 72, 67.5 76, 67.5 83
          C 67.5 90.5, 74.5 93.5, 82 96.5
          C 89.5 99.5, 96.5 102.5, 96.5 110
          C 96.5 117, 90.5 121, 82 121
          C 73.5 121, 67.5 117, 67.5 110"
        stroke-width="8"
      />
    </g>

    <!-- 絞り口の上の布(縄で細く絞られ、上へフリル状に広がる) -->
    <path
      d="M71 56.5
        C 65 49.5, 55 41.5, 50 33.5
        C 54 28.5, 59 31.5, 62 28.5
        C 66 23.5, 72 27.5, 75 25.5
        C 79 21.5, 85 21.5, 89 25.5
        C 92 27.5, 98 23.5, 102 28.5
        C 105 31.5, 110 28.5, 114 33.5
        C 109 41.5, 99 49.5, 93 56.5
        Z"
      :fill="`url(#${topGradId})`"
      stroke="#7d5a24"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <!-- 布のひだ(絞り口へ集まる折り目): 影の線 + 左脇の光の線 -->
    <g stroke="#6b4a1c" stroke-width="1.4" fill="none" opacity="0.6" stroke-linecap="round">
      <path d="M62 29.5 C 65 39.5, 69 47.5, 74 54.5" />
      <path d="M75 26.5 C 77 37.5, 78 46.5, 79 54.5" />
      <path d="M89 25.5 C 88 36.5, 86 46.5, 85 54.5" />
      <path d="M102 29.5 C 99 39.5, 95 47.5, 90 54.5" />
    </g>
    <g stroke="#f6e3b2" stroke-width="1.2" fill="none" opacity="0.7" stroke-linecap="round">
      <path d="M60.5 30.5 C 63 39.5, 67 47.5, 72.5 54.5" />
      <path d="M73.5 27.5 C 75.5 37.5, 76.5 46.5, 77.5 54.5" />
      <path d="M87.5 26.5 C 86.5 36.5, 84.5 46.5, 83.5 54.5" />
      <path d="M100.5 30.5 C 97.5 39.5, 93.5 47.5, 88.5 54.5" />
    </g>

    <!-- 絞りの縄(太い線に明るい縞を重ねて、ねじれを表す) -->
    <path d="M65 55.5 C 74 59.5, 90 59.5, 99 55.5" fill="none" stroke="#7a5a2e" stroke-width="5.5" stroke-linecap="round" />
    <path d="M65 55.5 C 74 59.5, 90 59.5, 99 55.5" fill="none" stroke="#b8925a" stroke-width="4" stroke-dasharray="2 2" />
    <!-- 右側の結び目から垂れる縄の端(先がほつれた房) -->
    <path d="M98 56.5 C 108 63.5, 112 74.5, 110 85.5" fill="none" stroke="#7a5a2e" stroke-width="4.5" stroke-linecap="round" />
    <path d="M98 56.5 C 108 63.5, 112 74.5, 110 85.5" fill="none" stroke="#b8925a" stroke-width="3.2" stroke-dasharray="2 2" />
    <circle cx="98" cy="56.5" r="4" fill="#9a764a" stroke="#6b4e24" stroke-width="1.2" />
    <circle cx="110" cy="84.5" r="3" fill="#9a764a" stroke="#6b4e24" stroke-width="1.2" />
    <g stroke="#7a5a2e" stroke-width="1.3" stroke-linecap="round">
      <path d="M110 87.5 l-2.2 6" />
      <path d="M110 87.5 l0 6.5" />
      <path d="M110 87.5 l2.2 6" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { iconSizeStyle, toCssSize } from '@/internal/icon-size';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const sizeStyle = computed((): string => toCssSize(props.size));

const uid = (useId() ?? 'mb').replace(/[^a-zA-Z0-9_-]/g, '') || 'mb';
const bagGradId = `moneybag-bag-${uid}`;
const topGradId = `moneybag-top-${uid}`;
</script>
