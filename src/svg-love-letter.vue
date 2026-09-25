<!--
UTF-8絵文字💌(LOVE LETTER)をイメージしたアイコン
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
      <radialGradient :id="heartId" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#ff8a93" />
        <stop offset="0.5" stop-color="#e8323f" />
        <stop offset="1" stop-color="#b3131f" />
      </radialGradient>
    </defs>

    <!-- 封筒の影と本体 -->
    <rect x="15" y="40" width="136" height="92" rx="8" fill="#000000" opacity="0.13" />
    <rect x="12" y="36" width="136" height="92" rx="8" :fill="`url(#${paperId})`" stroke="#c9cdd4" stroke-width="1.5" />
    <!-- 下側の折り返し線 -->
    <path d="M14 126 L66 84 M146 126 L94 84" stroke="#c2c6cd" stroke-width="2" stroke-linecap="round" fill="none" />
    <!-- ふた(上から三角に閉じる) -->
    <path d="M14 40 L80 90 L146 40" :fill="`url(#${flapId})`" stroke="#c9cdd4" stroke-width="1.5" stroke-linejoin="round" />
    <!-- 上部の光沢 -->
    <rect x="20" y="40" width="120" height="5" rx="2.5" fill="#ffffff" opacity="0.7" />
    <!-- ハートの封緘シール(小さいサイズでも読めるよう1.5倍に拡大) -->
    <g transform="translate(80 86) scale(1.5) translate(-80 -86)">
      <path :d="HEART" fill="#000000" opacity="0.15" transform="translate(2 2)" />
      <path :d="HEART" :fill="`url(#${heartId})`" stroke="#9e0f1a" stroke-width="1.2" stroke-linejoin="round" />
      <path d="M68 76 Q71 72 75 74" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.7" />
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

const uid = (useId() ?? 'll').replace(/[^a-zA-Z0-9_-]/g, '') || 'll';
const paperId = `love-letter-paper-${uid}`;
const flapId = `love-letter-flap-${uid}`;
const heartId = `love-letter-heart-${uid}`;

/** ハート(中心80,86) */
const HEART = 'M80 102 C62 90 58 80 64 73 C69 67 77 69 80 75 C83 69 91 67 96 73 C102 80 98 90 80 102 Z';
</script>
