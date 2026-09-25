<!--
UTF-8絵文字🔁(CLOCKWISE RIGHTWARDS AND LEFTWARDS OPEN CIRCLE ARROWS)をイメージしたアイコン
orientation: horizontalは横長、verticalは縦長
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
      <!-- 背景: 上薄め→下濃め(objectBoundingBox基準の縦グラデーション) -->
      <linearGradient :id="bgGradientId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="bgColorLight" />
        <stop offset="100%" :stop-color="bgColorDark" />
      </linearGradient>
      <!-- 背景の光沢: 下端で透明へ落として面へなじませる -->
      <linearGradient :id="glossGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.6" />
        <stop offset="0.55" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <filter :id="glossBlurId" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.1" />
      </filter>
    </defs>
    <rect
      x="4"
      y="4"
      width="56"
      height="56"
      :rx="props.cornerRadius"
      :fill="`url(#${bgGradientId})`"
      :stroke="props.borderColor"
      stroke-width="4"
    />
    <rect x="8.5" y="8" width="47" height="17.5" :rx="glossRound" :fill="`url(#${glossGradId})`" :filter="`url(#${glossBlurId})`" />

    <!-- 矢印だけを回して縦向きにする(背景の光沢は上に残す) -->
    <g :transform="props.orientation === 'vertical' ? 'rotate(90 32 32)' : undefined">
      <!-- 上半分: 左端の半円から上辺を通り、右向きの矢じりへ -->
      <g :id="arrowHalfId">
        <path
          d="M12 32 A 9 9 0 0 1 21 23 H39"
          fill="none"
          :stroke="props.arrowColor"
          stroke-width="5"
          stroke-linecap="round"
        />
        <polygon points="38,16 49,23 38,30" :fill="props.arrowColor" />
      </g>
      <!-- 下半分は180度回転コピー -->
      <use :href="`#${arrowHalfId}`" transform="rotate(180 32 32)" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  orientation?: 'horizontal' | 'vertical';
  size?: number | string;
  bgColor?: string;
  borderColor?: string;
  arrowColor?: string;
  cornerRadius?: number;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  size: '1.2em',
  bgColor: '#738aa5',
  borderColor: '#738aa5',
  arrowColor: '#ffffff',
  cornerRadius: 8
});

const uid = (useId() ?? 'co').replace(/[^a-zA-Z0-9_-]/g, '') || 'co';
const bgGradientId = `clockwise-arrows-bg-${uid}`;
const glossGradId = `clockwise-arrows-gloss-${uid}`;
const glossBlurId = `clockwise-arrows-gloss-blur-${uid}`;
const arrowHalfId = `clockwise-arrows-half-${uid}`;

/** #RRGGBB を明暗方向に amount(-255〜255)だけシフトする */
const shiftColor = (hex: string, amount: number): string => {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (m === null) {
    return hex; // #RGB等の想定外形式はそのまま返す
  }
  const num = parseInt(m[1], 16);
  const clamp = (v: number): number => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16 & 0xff) + amount);
  const g = clamp((num >> 8 & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const bgColorLight = computed((): string => shiftColor(props.bgColor, 24));
const bgColorDark = computed((): string => shiftColor(props.bgColor, -28));

/** 光沢の角丸。背景のcornerRadiusからインセット分を引いて丸みを追従させる */
const glossRound = computed((): number => Math.max(props.cornerRadius - 4.5, 2));
</script>
