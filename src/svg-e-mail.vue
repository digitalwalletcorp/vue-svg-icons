<!--
UTF-8絵文字📧(E-MAIL SYMBOL)をイメージしたアイコン
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

const uid = (useId() ?? 'em').replace(/[^a-zA-Z0-9_-]/g, '') || 'em';
const paperId = `e-mail-paper-${uid}`;
const flapId = `e-mail-flap-${uid}`;
</script>
