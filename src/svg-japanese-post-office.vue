<!--
UTF-8絵文字🏣(JAPANESE POST OFFICE)をイメージしたアイコン
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
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <linearGradient :id="roofId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f26b5b" />
        <stop offset="1" stop-color="#c9302c" />
      </linearGradient>
      <linearGradient :id="wallId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.7" stop-color="#f1efe9" />
        <stop offset="1" stop-color="#e2ded4" />
      </linearGradient>
      <linearGradient :id="glassId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#bfe3f7" />
        <stop offset="1" stop-color="#6fb2dc" />
      </linearGradient>
    </defs>

    <!-- 建物の影 -->
    <rect x="25" y="60" width="116" height="92" rx="4" fill="#000000" opacity="0.12" />
    <!-- 壁 -->
    <rect x="22" y="56" width="116" height="90" rx="4" :fill="`url(#${wallId})`" stroke="#cfcac0" stroke-width="1.5" />
    <!-- 屋根(平らな板)と光沢 -->
    <rect x="14" y="34" width="132" height="24" rx="5" :fill="`url(#${roofId})`" />
    <rect x="18" y="37" width="124" height="5" rx="2.5" fill="#ffffff" opacity="0.35" />
    <!-- 〒マーク -->
    <g stroke="#d13a2b" stroke-width="4.16" stroke-linecap="round" fill="none">
      <line x1="67" y1="66.3" x2="93" y2="66.3" />
      <line x1="67" y1="75.4" x2="93" y2="75.4" />
      <line x1="80" y1="75.4" x2="80" y2="92.3" />
    </g>
    <!-- 窓 -->
    <rect x="32" y="100" width="24" height="20" rx="2" :fill="`url(#${glassId})`" stroke="#8fa9bb" stroke-width="1.5" />
    <rect x="104" y="100" width="24" height="20" rx="2" :fill="`url(#${glassId})`" stroke="#8fa9bb" stroke-width="1.5" />
    <!-- 扉 -->
    <rect x="66" y="100" width="28" height="46" rx="2" :fill="`url(#${glassId})`" stroke="#8fa9bb" stroke-width="1.5" />
    <line x1="80" y1="100" x2="80" y2="146" stroke="#8fa9bb" stroke-width="1.5" />
    <!-- 地面 -->
    <line x1="14" y1="147" x2="146" y2="147" stroke="#9aa1ab" stroke-width="3" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'po').replace(/[^a-zA-Z0-9_-]/g, '') || 'po';
const roofId = `japanese-post-office-roof-${uid}`;
const wallId = `japanese-post-office-wall-${uid}`;
const glassId = `japanese-post-office-glass-${uid}`;
</script>
