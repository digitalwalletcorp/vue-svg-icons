<!--
UTF-8絵文字🕰(MANTELPIECE CLOCK)をイメージしたアイコン(アニメーションサポート)
hour: 時針の指す時刻(0〜23。12以上は12を引いた位置)
minute: 分針の指す分(0〜59)。hourと合わせて開始時刻になる
duration: 分針が1周する秒数(=時計の1時間)。小さいほど速い。0以下で静止
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
    :style="iconSizeStyle(props.size)"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 本体: 木製。左から光が当たり右側が沈む -->
      <linearGradient :id="caseGradId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#8a5530" />
        <stop offset="0.4" stop-color="#b67a47" />
        <stop offset="1" stop-color="#6a3f22" />
      </linearGradient>
      <!-- 台座: 木製。上面が明るく下へ沈む -->
      <linearGradient :id="baseGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b67a47" />
        <stop offset="1" stop-color="#4e2e18" />
      </linearGradient>
      <!-- 文字盤の縁・頂上の飾り玉: 金 -->
      <linearGradient :id="bezelGradId" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fbe7a1" />
        <stop offset="0.5" stop-color="#d9ad48" />
        <stop offset="1" stop-color="#9a7020" />
      </linearGradient>
      <!-- 文字盤: クリーム色 -->
      <linearGradient :id="faceGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffdf6" />
        <stop offset="1" stop-color="#efe8d6" />
      </linearGradient>
    </defs>

    <!-- 台座と脚 -->
    <rect x="9" y="49" width="46" height="6" rx="1.5" :fill="`url(#${baseGradId})`" stroke="#3b2413" stroke-width="0.6" />
    <rect x="12" y="54.5" width="6" height="3" rx="1" fill="#3b2413" />
    <rect x="46" y="54.5" width="6" height="3" rx="1" fill="#3b2413" />
    <!-- 本体(上部が半円のアーチ) -->
    <path d="M13 49 L13 27 A19 19 0 0 1 51 27 L51 49 Z" :fill="`url(#${caseGradId})`" stroke="#3b2413" stroke-width="0.8" />
    <!-- 本体のハイライト(アーチ左上。木なので控えめ) -->
    <path d="M16 27 A16 16 0 0 1 30 11.2" fill="none" stroke="#ffe2c0" stroke-width="1.2" stroke-linecap="round" opacity="0.35" />
    <!-- 頂上の飾り玉 -->
    <circle cx="32" cy="9" r="2.2" :fill="`url(#${bezelGradId})`" stroke="#6b4d12" stroke-width="0.5" />

    <!-- 文字盤の縁 -->
    <circle :cx="CX" :cy="CY" r="14.2" :fill="`url(#${bezelGradId})`" stroke="#6b4d12" stroke-width="0.6" />
    <!-- 文字盤 -->
    <circle :cx="CX" :cy="CY" r="12" :fill="`url(#${faceGradId})`" />
    <!-- 文字盤上縁の落ち影(縁の内側に沈む表現) -->
    <path d="M 21.5 28 A 10.5 10.5 0 0 1 42.5 28" fill="none" stroke="#000000" stroke-width="1.2" opacity="0.08" />

    <!-- 目盛り(12本: 3,6,9,12時は長く太く) -->
    <g stroke="#3a2a1c" stroke-linecap="round">
      <line
        v-for="t in ticks"
        :key="t.key"
        :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
        :stroke-width="t.major ? 1.6 : 1"
      />
    </g>

    <!-- 時針(経過周回数に応じて1時間ずつ進む) -->
    <line
      :x1="CX" :y1="CY" :x2="hourHand.x" :y2="hourHand.y"
      stroke="#2a1d12" stroke-width="2.6" stroke-linecap="round"
    />

    <!-- 分針(12時位置で定義し、transformで回す) -->
    <line
      :x1="CX" :y1="CY" :x2="CX" y2="20.6"
      stroke="#2a1d12" stroke-width="1.8" stroke-linecap="round"
      :transform="`rotate(${minuteDeg} ${CX} ${CY})`"
    />

    <!-- 中心軸 -->
    <circle :cx="CX" :cy="CY" r="1.6" fill="#c9a03a" />
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  /** 時針の指す時刻(0〜23) */
  hour?: number;
  /** 分針の指す分(0〜59) */
  minute?: number;
  /** 分針が1周する秒数(=時計の1時間)。小さいほど速い。0以下で静止 */
  duration?: number;
  /** 表示サイズ */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  hour: 10,
  minute: 10,
  duration: 60,
  size: '1.2em'
});

// linearGradientのid参照が複数インスタンスで衝突しないよう一意化する
const uid = (useId() ?? 'mc').replace(/[^a-zA-Z0-9_-]/g, '') || 'mc';
const caseGradId = `mantelpiece-clock-case-${uid}`;
const baseGradId = `mantelpiece-clock-base-${uid}`;
const bezelGradId = `mantelpiece-clock-bezel-${uid}`;
const faceGradId = `mantelpiece-clock-face-${uid}`;

/** 文字盤の中心(本体のアーチの中に収まるよう、中央より少し下) */
const CX = 32;
const CY = 30;

/** 時計角度(12時=0, 時計回り)をSVG座標の点に変換する */
const clockPt = (r: number, clockDeg: number): { x: number; y: number } => {
  const rad = ((clockDeg - 90) * Math.PI) / 180;
  return {
    x: +(CX + r * Math.cos(rad)).toFixed(2),
    y: +(CY + r * Math.sin(rad)).toFixed(2)
  };
};

/** 目盛り12本(外側r=10.4、通常は長さ1.4、主要4本は長さ2.4) */
const ticks = Array.from({ length: 12 }, (_, i) => {
  const deg = i * 30;
  const major = i % 3 === 0;
  const outer = clockPt(10.4, deg);
  const inner = clockPt(major ? 8 : 9, deg);
  return { key: i, major, x1: outer.x, y1: outer.y, x2: inner.x, y2: inner.y };
});

/** アニメーション経過時間(ms) */
const elapsed = ref(0);
let rafId = 0;
let startTs = 0;

const tick = (ts: number): void => {
  if (startTs === 0) {
    startTs = ts;
  }
  elapsed.value = ts - startTs;
  rafId = requestAnimationFrame(tick);
};

/** 経過した周回数(=進んだ時間数)。時針を連続で動かすため小数のまま扱う */
const turns = computed((): number =>
  props.duration > 0 ? elapsed.value / (props.duration * 1000) : 0
);

/** 開始時刻(minute)を含めた進行量。1.0で分針1周(=時計の1時間) */
const progress = computed((): number => props.minute / 60 + turns.value);

/** 分針の角度(0〜360) */
const minuteDeg = computed((): number => (progress.value % 1) * 360);

/** 時針: 基準hour + 進行量。30分の時点では数字の中間を指す */
const hourHand = computed(() => clockPt(6, ((props.hour + progress.value) % 12) * 30));

const stop = (): void => {
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
};

/** requestAnimationFrameはブラウザにしか無いため、開始はonMounted以降に限る */
const restart = (duration: number): void => {
  stop();
  startTs = 0;
  elapsed.value = 0;
  if (duration > 0) {
    rafId = requestAnimationFrame(tick);
  }
};

onMounted(() => {
  restart(props.duration);
});

onUnmounted(stop);

watch(() => props.duration, restart);
</script>
