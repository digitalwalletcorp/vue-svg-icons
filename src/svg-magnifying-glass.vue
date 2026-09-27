<!--
UTF-8絵文字🔍(LEFT-POINTING MAGNIFYING GLASS)をイメージしたアイコン
direction: 虫眼鏡の方向を変えることができる
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle, ...iconSizeStyle(props.size) }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- レンズ: 水色のガラス(svg-cameraのレンズと同じ配色) -->
      <radialGradient :id="lenzGlassId" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stop-color="#d8f3fc" />
        <stop offset="0.35" stop-color="#6cc3e3" />
        <stop offset="0.75" stop-color="#2a7fa6" />
        <stop offset="1" stop-color="#17506b" />
      </radialGradient>
      <!-- 枠: 銀の金属。左上が明るく右下が沈む -->
      <linearGradient :id="lenzFrameId" gradientUnits="userSpaceOnUse" x1="12" y1="12" x2="42" y2="42">
        <stop offset="0" stop-color="#f4f6f8" />
        <stop offset="0.5" stop-color="#aab1b9" />
        <stop offset="1" stop-color="#66757F" />
      </linearGradient>
      <!-- 柄: 木製風の円柱シェーディング(線に対して垂直方向) -->
      <linearGradient :id="handleWoodId" gradientUnits="userSpaceOnUse" x1="44" y1="52" x2="52" y2="44">
        <stop offset="0%" stop-color="#5A3A24" />
        <stop offset="45%" stop-color="#A9744C" />
        <stop offset="100%" stop-color="#64402A" />
      </linearGradient>
    </defs>
    <!-- 柄。光が常に上から当たって見えるよう、下向きは上下反転ではなく回転で作る(上下反転だと柄のハイライトが下側に来る) -->
    <g :transform="handleTransform">
      <!-- 繋ぎ目(柄より細い首。柄に合わせて暗めの茶) -->
      <line x1="38.5" y1="38.5" x2="43" y2="43" stroke="#4E3320" stroke-width="5.5" />
      <!-- 柄(本体) -->
      <line x1="42.5" y1="42.5" x2="55" y2="55" :stroke="`url(#${handleWoodId})`" stroke-width="9" stroke-linecap="round" />
      <!-- 柄のハイライト(上側エッジ。木なので控えめ) -->
      <line x1="44.5" y1="41.8" x2="53" y2="50.3" stroke="#FFD9B0" stroke-width="1.4" stroke-linecap="round" opacity="0.25" />
    </g>
    <!-- レンズ。円なので向きによらず形は同じ。平行移動だけにして、光沢が常に左上から当たって見えるようにする -->
    <g :transform="lensTransform">
      <!-- 枠の外縁(白背景でも輪郭が埋もれないように) -->
      <circle cx="27" cy="27" r="19" fill="none" stroke="#55616A" stroke-width="0.8" />
      <!-- レンズ(枠 + ガラス) -->
      <circle cx="27" cy="27" r="17" :fill="`url(#${lenzGlassId})`" :stroke="`url(#${lenzFrameId})`" stroke-width="4" />
      <!-- 枠の光沢(枠の外寄り。ガラスのハイライトと同じ200°〜250°の範囲) -->
      <path d="M10.09 20.84 A 18 18 0 0 1 20.84 10.09" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.85" />
      <!-- ガラス内側の反射リング -->
      <circle cx="27" cy="27" r="14.2" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.25" />
      <!-- ガラスのハイライト(レンズと同心の円弧。枠の光沢と角度を揃える) -->
      <path d="M15.72 22.9 A 12 12 0 0 1 22.9 15.72" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" fill="none" opacity="0.55" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { iconSizeStyle, toCssSize } from '@/internal/icon-size';

interface Props {
  direction?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'top-left',
  size: '1.2em'
});

const uid = (useId() ?? 'hg').replace(/[^a-zA-Z0-9_-]/g, '') || 'hg';
const lenzGlassId = `lens-glass-${uid}`;
const lenzFrameId = `lens-frame-${uid}`;
const handleWoodId = `handle-wood-${uid}`;

const sizeStyle = computed((): string => toCssSize(props.size));

const handleTransform = computed((): string => {
  switch (props.direction) {
    case 'top-right':
      return 'scale(-1,1) translate(-64,0)';
    case 'bottom-left':
      return 'rotate(-90 32 32)';
    case 'bottom-right':
      return 'rotate(90 32 32) scale(-1,1) translate(-64,0)';
    case 'top-left':
    default:
      return '';
  }
});

/** レンズの中心は左上(27,27)基準。右向き・下向きはそれぞれ10ずらす */
const lensTransform = computed((): string => {
  const dx = props.direction === 'top-right' || props.direction === 'bottom-right' ? 10 : 0;
  const dy = props.direction === 'bottom-left' || props.direction === 'bottom-right' ? 10 : 0;
  return `translate(${dx},${dy})`;
});
</script>
