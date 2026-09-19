<!--
UTF-8絵文字🖨(PRINTER)をイメージしたアイコン
背面給紙の用紙+本体+前面排紙の紙の3層構成。
linearGradientのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="17 26 126 126"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 本体: 上面が明るい金属灰色 -->
      <linearGradient :id="bodyGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#d4d7dc" />
        <stop offset="0.35" stop-color="#b7bcc4" />
        <stop offset="1" stop-color="#8f959e" />
      </linearGradient>
      <!-- 紙: ごく薄い縦グラデーション -->
      <linearGradient :id="paperGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#eef0f2" />
      </linearGradient>
      <!-- 排紙口の奥の暗がり -->
      <linearGradient :id="slotGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4a4f57" />
        <stop offset="1" stop-color="#6b7079" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="80" cy="142" rx="56" ry="7" fill="#000000" opacity="0.13" />

    <!-- 給紙の紙(本体の奥に立っている) -->
    <g>
      <rect x="52" y="32" width="56" height="42" rx="3" :fill="`url(#${paperGradId})`" stroke="#c5c9cf" stroke-width="1.5" />
      <!-- 紙のテキスト行 -->
      <g stroke="#b3bac4" stroke-width="3" stroke-linecap="round">
        <line x1="60" y1="42" x2="100" y2="42" />
        <line x1="60" y1="51" x2="100" y2="51" />
        <line x1="60" y1="60" x2="92" y2="60" />
      </g>
    </g>

    <!-- 本体 -->
    <rect x="26" y="72" width="108" height="46" rx="9" :fill="`url(#${bodyGradId})`" stroke="#7d838c" stroke-width="1.5" />
    <!-- 本体上面のハイライト -->
    <rect x="32" y="75" width="96" height="3" rx="1.5" fill="#ffffff" opacity="0.5" />
    <!-- 給紙口(本体上面のスリット) -->
    <rect x="48" y="70" width="64" height="5" rx="2.5" fill="#6b7079" />

    <!-- インジケーターランプ -->
    <circle cx="118" cy="86" r="3.5" fill="#57d06a" stroke="#3fa04f" stroke-width="1" />
    <!-- 操作ボタン -->
    <rect x="103" y="83" width="8" height="6" rx="2" fill="#767c86" stroke="#666c75" stroke-width="1" />

    <!-- 排紙口 -->
    <rect x="40" y="104" width="80" height="7" rx="3.5" :fill="`url(#${slotGradId})`" />

    <!-- 排紙された紙(手前へ出てくる) -->
    <g>
      <rect x="46" y="108" width="68" height="34" rx="3" :fill="`url(#${paperGradId})`" stroke="#c5c9cf" stroke-width="1.5" />
      <!-- 印刷された行 -->
      <g stroke="#8f98a6" stroke-width="3" stroke-linecap="round">
        <line x1="54" y1="117" x2="106" y2="117" />
        <line x1="54" y1="126" x2="106" y2="126" />
        <line x1="54" y1="135" x2="90" y2="135" />
      </g>
    </g>

    <!-- 排紙口の縁(紙より手前に重ねて、紙が口から出ている表現) -->
    <rect x="40" y="104" width="80" height="4" rx="2" fill="#575c64" />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const bodyGradId = `printer-body-${uid}`;
const paperGradId = `printer-paper-${uid}`;
const slotGradId = `printer-slot-${uid}`;

const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
