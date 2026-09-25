<!--
UTF-8絵文字🔐(CLOSED LOCK WITH KEY)をイメージしたアイコン
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
      <!-- 胴: 横方向の明暗で円筒の丸みを出す -->
      <linearGradient :id="bodyId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#9c8438" />
        <stop offset="0.22" stop-color="#e3cf80" />
        <stop offset="0.4" stop-color="#f7edbd" />
        <stop offset="0.7" stop-color="#d6c06c" />
        <stop offset="1" stop-color="#9a8236" />
      </linearGradient>
      <!-- 胴の上端を明るく下端を暗くして厚みを出す -->
      <linearGradient :id="bodyShadeId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="0.3" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="0.8" stop-color="#000000" stop-opacity="0" />
        <stop offset="1" stop-color="#000000" stop-opacity="0.18" />
      </linearGradient>
      <linearGradient :id="shackleId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8f969f" />
        <stop offset="0.35" stop-color="#eef1f4" />
        <stop offset="0.7" stop-color="#b3b9c1" />
        <stop offset="1" stop-color="#7d848d" />
      </linearGradient>
      <!-- 鍵: 途中に明るい帯を挟んで金属の照りを出す -->
      <linearGradient :id="keyId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff2c2" />
        <stop offset="0.25" stop-color="#f7c649" />
        <stop offset="0.45" stop-color="#ffe796" />
        <stop offset="0.7" stop-color="#e9a728" />
        <stop offset="1" stop-color="#c2800f" />
      </linearGradient>
    </defs>

    <!-- ツル(胴の裏から出るU字)。胴の中心x=62に揃える -->
    <path d="M32 74 V52 a30 30 0 0 1 60 0 V74" fill="none" stroke="#6f767f" stroke-width="15" />
    <path d="M32 74 V52 a30 30 0 0 1 60 0 V74" fill="none" :stroke="`url(#${shackleId})`" stroke-width="11" />
    <!-- 胴の影・胴・胴の上下の明暗。辺をわずかに膨らませて樽型にする -->
    <path :d="BODY" fill="#000000" opacity="0.14" transform="translate(3 3)" />
    <path :d="BODY" :fill="`url(#${bodyId})`" stroke="#8f7a2e" stroke-width="1.5" />
    <path :d="BODY" :fill="`url(#${bodyShadeId})`" />
    <!-- 横溝(胴の膨らみに沿って曲げる) -->
    <g fill="none" stroke="#9c843a" stroke-width="2" opacity="0.6">
      <path d="M22 83 Q62 78 102 83" />
      <path d="M22 130 Q62 135 102 130" />
    </g>
    <g fill="none" stroke="#fff7d6" stroke-width="1.5" opacity="0.6">
      <path d="M22 85 Q62 80 102 85" />
      <path d="M22 132 Q62 137 102 132" />
    </g>
    <!-- 鍵穴 -->
    <circle cx="62" cy="101" r="7" fill="#3b3320" />
    <path d="M58.5 104 H65.5 L68 118 H56 Z" fill="#3b3320" />

    <!-- 鍵の影 -->
    <g transform="translate(3 3)" opacity="0.18">
      <path :d="KEY_HEAD" fill-rule="evenodd" fill="#000000" />
      <path d="M113 62 H131 V146 H113 Z" fill="#000000" />
    </g>
    <!-- 鍵: 軸と歯 -->
    <path
      d="M113 62 H131 V144 Q122 152 113 144 V136 H102 V127 H113 V119 H105 V110 H113 Z"
      :fill="`url(#${keyId})`"
      stroke="#b07a10"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <!-- 鍵: 頭(穴はevenoddで抜く) -->
    <path :d="KEY_HEAD" fill-rule="evenodd" :fill="`url(#${keyId})`" stroke="#b07a10" stroke-width="1.5" />
    <!-- 鍵の光沢: 頭の反射と軸の左縁のハイライト -->
    <path d="M104 36 a20 20 0 0 1 26 -12" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.75" />
    <path d="M133 58 a18 18 0 0 0 9 -10" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.45" />
    <line x1="115.5" y1="72" x2="115.5" y2="104" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.6" />
    <!-- 軸の溝(濃い線と明るい線の組) -->
    <line x1="123" y1="72" x2="123" y2="140" stroke="#b07a10" stroke-width="2" stroke-linecap="round" />
    <line x1="125" y1="72" x2="125" y2="140" stroke="#fff0b8" stroke-width="1.2" stroke-linecap="round" opacity="0.8" />
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

const uid = (useId() ?? 'lk').replace(/[^a-zA-Z0-9_-]/g, '') || 'lk';
const bodyId = `closed-lock-with-key-body-${uid}`;
const bodyShadeId = `closed-lock-with-key-body-shade-${uid}`;
const shackleId = `closed-lock-with-key-shackle-${uid}`;
const keyId = `closed-lock-with-key-key-${uid}`;

/** 胴の輪郭(上下左右の辺をわずかに膨らませた樽型) */
const BODY = 'M22 72 Q62 66 102 72 Q112 74 112 86 Q114 106 112 126 Q112 139 100 141 Q62 148 24 141 Q12 139 12 126 Q10 106 12 86 Q12 74 22 72 Z';
/** 鍵の頭(外周の円と穴の円) */
const KEY_HEAD = 'M122 20 a24 24 0 1 1 0 48 a24 24 0 1 1 0 -48 Z M122 35 a9 9 0 1 0 0 18 a9 9 0 1 0 0 -18 Z';
</script>
