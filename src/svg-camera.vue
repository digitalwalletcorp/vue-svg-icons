<!--
UTF-8絵文字📷(CAMERA)をイメージしたアイコン
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
      <!-- 銀の金属部分(ボディ・上部の部品・レンズの外周) -->
      <linearGradient :id="bodyId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f4f6f8" />
        <stop offset="0.5" stop-color="#c3c8cf" />
        <stop offset="1" stop-color="#9aa0a8" />
      </linearGradient>
      <linearGradient :id="topId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f7f8fa" />
        <stop offset="0.6" stop-color="#bfc4cb" />
        <stop offset="1" stop-color="#8e949c" />
      </linearGradient>
      <linearGradient :id="ringId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#f4f6f8" />
        <stop offset="1" stop-color="#8e949c" />
      </linearGradient>
      <!-- 革の帯 -->
      <linearGradient :id="leatherId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#55595f" />
        <stop offset="1" stop-color="#383b40" />
      </linearGradient>
      <radialGradient :id="barrelId" cx="0.5" cy="0.4" r="0.6">
        <stop offset="0" stop-color="#4a4e54" />
        <stop offset="1" stop-color="#26282c" />
      </radialGradient>
      <radialGradient :id="glassId" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#d8f3fc" />
        <stop offset="0.35" stop-color="#6cc3e3" />
        <stop offset="0.75" stop-color="#2a7fa6" />
        <stop offset="1" stop-color="#17506b" />
      </radialGradient>
    </defs>

    <!-- ボディの影 -->
    <rect x="17" y="56" width="132" height="86" rx="10" fill="#000000" opacity="0.15" />
    <!-- 左上のダイヤル -->
    <rect x="22" y="40" width="22" height="14" rx="3" :fill="`url(#${topId})`" stroke="#8e949c" stroke-width="1" />
    <rect x="46" y="44" width="14" height="10" rx="3" :fill="`url(#${topId})`" stroke="#8e949c" stroke-width="1" />
    <!-- ペンタプリズムの山とホットシュー -->
    <path d="M56 56 L66 30 H94 L104 56 Z" :fill="`url(#${topId})`" stroke="#7a8088" stroke-width="1" />
    <rect x="70" y="24" width="20" height="7" rx="1.5" fill="#6b7078" />
    <!-- 右のダイヤル -->
    <rect x="112" y="42" width="24" height="12" rx="3" :fill="`url(#${topId})`" stroke="#8e949c" stroke-width="1" />
    <!-- ボディ・上部の光沢・中央の革の帯(上下は銀の金属が見える) -->
    <rect x="14" y="52" width="132" height="86" rx="10" :fill="`url(#${bodyId})`" stroke="#7a8088" stroke-width="1.5" />
    <rect x="20" y="55" width="120" height="6" rx="3" fill="#ffffff" opacity="0.6" />
    <rect x="14" y="72" width="132" height="54" :fill="`url(#${leatherId})`" />
    <!-- 左上のランプ -->
    <circle cx="30" cy="64" r="3" fill="#5a5f66" />

    <!-- レンズ: 影・銀の外周・鏡筒・刻み・内枠・ガラス -->
    <circle cx="80" cy="98" r="45" fill="#0b0c0d" opacity="0.5" />
    <circle cx="80" cy="98" r="42" :fill="`url(#${ringId})`" stroke="#7a8088" stroke-width="1.5" />
    <circle cx="80" cy="98" r="39" :fill="`url(#${barrelId})`" />
    <g stroke="#6b7078" stroke-width="1.4">
      <line v-for="(tick, i) in knurl" :key="i" v-bind="tick" />
    </g>
    <circle cx="80" cy="98" r="30" fill="#1d1f22" stroke="#9aa0a8" stroke-width="1.5" />
    <circle cx="80" cy="98" r="25" :fill="`url(#${glassId})`" />
    <!-- ガラスの反射 -->
    <ellipse cx="71.25" cy="88" rx="8" ry="4.5" fill="#ffffff" opacity="0.55" transform="rotate(-30 71.25 88)" />
    <circle cx="88.75" cy="105.5" r="2.5" fill="#ffffff" opacity="0.35" />
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

const uid = (useId() ?? 'cm').replace(/[^a-zA-Z0-9_-]/g, '') || 'cm';
const bodyId = `camera-body-${uid}`;
const topId = `camera-top-${uid}`;
const ringId = `camera-ring-${uid}`;
const leatherId = `camera-leather-${uid}`;
const barrelId = `camera-barrel-${uid}`;
const glassId = `camera-glass-${uid}`;

/** レンズの刻み(中心80,98から放射状に48本) */
const knurl = Array.from({ length: 48 }, (_, i) => {
  const angle = (i / 48) * Math.PI * 2;
  return {
    x1: (80 + 37 * Math.cos(angle)).toFixed(1),
    y1: (98 + 37 * Math.sin(angle)).toFixed(1),
    x2: (80 + 32 * Math.cos(angle)).toFixed(1),
    y2: (98 + 32 * Math.sin(angle)).toFixed(1)
  };
});
</script>
