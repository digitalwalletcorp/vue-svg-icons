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
    <ellipse cx="82" cy="137" rx="50" ry="4" fill="#000000" opacity="0.13" />

    <!-- 袋本体(麻袋型: 細く絞った首から肩を張って裾へ広がる) -->
    <path
      d="M69 60
        C 54 66, 38 76, 35 96
        C 32 114, 36 128, 46 133
        C 62 138, 102 138, 118 133
        C 128 128, 132 114, 129 96
        C 126 76, 110 66, 95 60
        Z"
      :fill="`url(#${bagGradId})`"
      stroke="#7d5a24"
      stroke-width="2.5"
      stroke-linejoin="round"
    />

    <!-- しわ: 絞り口から放射状に落ちる折り目。影(暗い細長い面) + その脇の光(明るい線)で凹凸を出す -->
    <!-- 首の下の絞りの陰 -->
    <ellipse cx="82" cy="65" rx="15" ry="4" fill="#5a3d16" opacity="0.3" />
    <g fill="#5a3d16" opacity="0.32">
      <!-- 左右の大きなしわ -->
      <path d="M70 63 C 59 75, 52 90, 51 110 C 55 96, 62 80, 74 64 Z" />
      <path d="M94 63 C 105 75, 112 90, 113 110 C 109 96, 102 80, 90 64 Z" />
      <!-- 首の下の短いしわ -->
      <path d="M77 64 C 74 70, 72 76, 71 83 C 74 77, 77 71, 80 64 Z" />
      <path d="M87 64 C 90 70, 92 76, 93 83 C 90 77, 87 71, 84 64 Z" />
    </g>
    <g fill="none" stroke="#f6e3b2" stroke-width="1.6" stroke-linecap="round" opacity="0.65">
      <path d="M67 64 C 57 76, 49 91, 48 107" />
      <path d="M97 64 C 107 76, 115 91, 116 107" />
      <path d="M75 64 C 72 70, 70 76, 69 81" />
      <path d="M89 64 C 92 70, 94 76, 95 81" />
    </g>

    <!-- $記号(ストローク描画: S字+縦棒。袋の膨らみの中心に配置) -->
    <g fill="none" stroke="#3a3d33" stroke-linecap="round" transform="translate(82 101) scale(0.85) translate(-82 -96.5)">
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
      d="M71 61
        C 65 54, 55 46, 50 38
        C 54 33, 59 36, 62 33
        C 66 28, 72 32, 75 30
        C 79 26, 85 26, 89 30
        C 92 32, 98 28, 102 33
        C 105 36, 110 33, 114 38
        C 109 46, 99 54, 93 61
        Z"
      :fill="`url(#${topGradId})`"
      stroke="#7d5a24"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <!-- 布のひだ(絞り口へ集まる折り目): 影の線 + 左脇の光の線 -->
    <g stroke="#6b4a1c" stroke-width="1.4" fill="none" opacity="0.6" stroke-linecap="round">
      <path d="M62 34 C 65 44, 69 52, 74 59" />
      <path d="M75 31 C 77 42, 78 51, 79 59" />
      <path d="M89 30 C 88 41, 86 51, 85 59" />
      <path d="M102 34 C 99 44, 95 52, 90 59" />
    </g>
    <g stroke="#f6e3b2" stroke-width="1.2" fill="none" opacity="0.7" stroke-linecap="round">
      <path d="M60.5 35 C 63 44, 67 52, 72.5 59" />
      <path d="M73.5 32 C 75.5 42, 76.5 51, 77.5 59" />
      <path d="M87.5 31 C 86.5 41, 84.5 51, 83.5 59" />
      <path d="M100.5 35 C 97.5 44, 93.5 52, 88.5 59" />
    </g>

    <!-- 絞りの縄(太い線に明るい縞を重ねて、ねじれを表す) -->
    <path d="M65 60 C 74 64, 90 64, 99 60" fill="none" stroke="#7a5a2e" stroke-width="5.5" stroke-linecap="round" />
    <path d="M65 60 C 74 64, 90 64, 99 60" fill="none" stroke="#b8925a" stroke-width="4" stroke-dasharray="2 2" />
    <!-- 右側の結び目から垂れる縄の端(先がほつれた房) -->
    <path d="M98 61 C 108 68, 112 79, 110 90" fill="none" stroke="#7a5a2e" stroke-width="4.5" stroke-linecap="round" />
    <path d="M98 61 C 108 68, 112 79, 110 90" fill="none" stroke="#b8925a" stroke-width="3.2" stroke-dasharray="2 2" />
    <circle cx="98" cy="61" r="4" fill="#9a764a" stroke="#6b4e24" stroke-width="1.2" />
    <circle cx="110" cy="89" r="3" fill="#9a764a" stroke="#6b4e24" stroke-width="1.2" />
    <g stroke="#7a5a2e" stroke-width="1.3" stroke-linecap="round">
      <path d="M110 92 l-2.2 6" />
      <path d="M110 92 l0 6.5" />
      <path d="M110 92 l2.2 6" />
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
