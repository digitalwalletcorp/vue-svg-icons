<!--
UTF-8絵文字📨(INCOMING ENVELOPE)をイメージしたアイコン
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
      <linearGradient :id="paperId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#e6e8ec" />
      </linearGradient>
      <linearGradient :id="flapId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f4f5f7" />
        <stop offset="1" stop-color="#dcdfe4" />
      </linearGradient>
      <!-- トレイの内側(青い底): 奥を濃く手前を明るく -->
      <linearGradient :id="insideId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#2f78c8" />
        <stop offset="1" stop-color="#7cbcf0" />
      </linearGradient>
      <linearGradient :id="rimId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#d9dde3" />
      </linearGradient>
      <linearGradient :id="frontId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fbfcfd" />
        <stop offset="0.6" stop-color="#e9ecf0" />
        <stop offset="1" stop-color="#c9ced6" />
      </linearGradient>
    </defs>

    <!-- トレイの影・縁・内側 -->
    <rect x="17" y="98" width="132" height="54" rx="8" fill="#000000" opacity="0.14" />
    <rect x="14" y="94" width="132" height="54" rx="8" :fill="`url(#${rimId})`" stroke="#c3c8cf" stroke-width="1.5" />
    <rect x="24" y="101" width="112" height="24" rx="3" :fill="`url(#${insideId})`" />
    <!-- 封筒(右上がりに傾け、下半分は手前の板に隠れる) -->
    <g transform="translate(80 66) rotate(-20) scale(0.8) translate(-80 -82)">
      <rect x="15" y="40" width="136" height="92" rx="8" fill="#000000" opacity="0.13" />
      <rect x="12" y="36" width="136" height="92" rx="8" :fill="`url(#${paperId})`" stroke="#c9cdd4" stroke-width="2" />
      <path d="M14 40 L80 90 L146 40" :fill="`url(#${flapId})`" stroke="#c9cdd4" stroke-width="2" stroke-linejoin="round" />
      <rect x="20" y="40" width="120" height="5" rx="2.5" fill="#ffffff" opacity="0.7" />
    </g>
    <!-- トレイの手前の板(中央に手を掛けるくぼみ)と光沢 -->
    <path
      d="M14 120 H54 Q80 134 106 120 H146 V140 Q146 148 138 148 H22 Q14 148 14 140 Z"
      :fill="`url(#${frontId})`"
      stroke="#c3c8cf"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path d="M20 124 H52 M108 124 H140" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
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

const uid = (useId() ?? 'ie').replace(/[^a-zA-Z0-9_-]/g, '') || 'ie';
const paperId = `incoming-envelope-paper-${uid}`;
const flapId = `incoming-envelope-flap-${uid}`;
const insideId = `incoming-envelope-inside-${uid}`;
const rimId = `incoming-envelope-rim-${uid}`;
const frontId = `incoming-envelope-front-${uid}`;
</script>
