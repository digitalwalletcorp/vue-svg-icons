<!--
UTF-8絵文字💳(CREDIT CARD)をイメージしたアイコン
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="0 0 160 160"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
    :style="iconSizeStyle(props.size)"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <linearGradient :id="cardId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fbe6a2" />
        <stop offset="0.45" stop-color="#e3be5c" />
        <stop offset="1" stop-color="#b8892e" />
      </linearGradient>
      <linearGradient :id="chipId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f2f3f5" />
        <stop offset="1" stop-color="#aeb3ba" />
      </linearGradient>
    </defs>

    <!-- カードの影 -->
    <rect x="11" y="38" width="144" height="92" rx="9" fill="#000000" opacity="0.14" />
    <!-- カード本体と上部の光沢 -->
    <rect x="8" y="34" width="144" height="92" rx="9" :fill="`url(#${cardId})`" stroke="#a87c28" stroke-width="1.5" />
    <rect x="14" y="38" width="132" height="14" rx="7" fill="#ffffff" opacity="0.3" />
    <!-- 左上の三角マーク -->
    <path d="M26 44 L18 48.5 L26 53 Z" fill="#5a4a1c" opacity="0.85" />
    <!-- ICチップ -->
    <rect x="20" y="60" width="30" height="24" rx="4" :fill="`url(#${chipId})`" stroke="#7d838c" stroke-width="1.2" />
    <g stroke="#7d838c" stroke-width="1.4" fill="none">
      <line x1="20" y1="68" x2="30" y2="68" />
      <line x1="20" y1="76" x2="30" y2="76" />
      <line x1="40" y1="68" x2="50" y2="68" />
      <line x1="40" y1="76" x2="50" y2="76" />
      <path d="M30 60 V84 M40 60 V84 M30 72 H40" />
    </g>
    <!-- カード名の文字(文字要素は使わず横線で表す) -->
    <rect x="62" y="60" width="76" height="8" rx="2" fill="#5a4a1c" opacity="0.85" />
    <rect x="62" y="74" width="56" height="8" rx="2" fill="#5a4a1c" opacity="0.85" />
    <!-- カード番号(4桁×4) -->
    <g fill="#5a4a1c" opacity="0.85">
      <rect v-for="digit in digits" :key="digit" :x="digit" y="98" width="5" height="9" rx="1" />
    </g>
    <!-- 名義 -->
    <rect x="22" y="114" width="54" height="4" rx="2" fill="#5a4a1c" opacity="0.7" />
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

const uid = (useId() ?? 'cc').replace(/[^a-zA-Z0-9_-]/g, '') || 'cc';
const cardId = `credit-card-card-${uid}`;
const chipId = `credit-card-chip-${uid}`;

/** カード番号の各桁のx座標(4桁×4グループ) */
const digits = [0, 1, 2, 3].flatMap((group) => [0, 1, 2, 3].map((digit) => 22 + group * 32 + digit * 7));
</script>
