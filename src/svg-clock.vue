<!--
UTF-8絵文字🕓(CLOCK FACE FOUR OCLOCK)をイメージしたアイコン(アニメーションサポート)
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
      <!-- 外周ベゼル: 紺 -->
      <linearGradient :id="bezelGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#4a5f80" />
        <stop offset="1" stop-color="#2c3d57" />
      </linearGradient>
      <!-- 文字盤: 白 -->
      <linearGradient :id="faceGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#e9ebee" />
      </linearGradient>
    </defs>

    <!-- ベゼル -->
    <circle cx="32" cy="32" r="29" :fill="`url(#${bezelGradId})`" />
    <!-- 文字盤 -->
    <circle cx="32" cy="32" r="24" :fill="`url(#${faceGradId})`" />
    <!-- 文字盤上縁の落ち影(ベゼルの内側に沈む表現) -->
    <path d="M 10 27 A 24 24 0 0 1 54 27" fill="none" stroke="#000000" stroke-width="2" opacity="0.08" />

    <!-- 目盛り(12本: 3,6,9,12時は長く太く) -->
    <g stroke="#3d4a61" stroke-linecap="round">
      <line
        v-for="t in ticks"
        :key="t.key"
        :x1="t.x1" :y1="t.y1" :x2="t.x2" :y2="t.y2"
        :stroke-width="t.major ? 2.5 : 1.5"
      />
    </g>

    <!-- 時針(経過周回数に応じて1時間ずつ進む) -->
    <line
      x1="32" y1="32" :x2="hourHand.x" :y2="hourHand.y"
      stroke="#2c3d57" stroke-width="4" stroke-linecap="round"
    />

    <!-- 分針(12時位置で定義し、transformで回す) -->
    <line
      x1="32" y1="32" x2="32" y2="15"
      stroke="#2c3d57" stroke-width="3" stroke-linecap="round"
      :transform="`rotate(${minuteDeg} 32 32)`"
    />

    <!-- 中心軸 -->
    <circle cx="32" cy="32" r="2.5" fill="#2c3d57" />
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
  hour: 4,
  minute: 0,
  duration: 60,
  size: '1.2em'
});

// linearGradientのid参照が複数インスタンスで衝突しないよう一意化する
const uid = (useId() ?? 'ck').replace(/[^a-zA-Z0-9_-]/g, '') || 'ck';
const bezelGradId = `clock-bezel-${uid}`;
const faceGradId = `clock-face-${uid}`;

const CX = 32;
const CY = 32;

/** 時計角度(12時=0, 時計回り)をSVG座標の点に変換する */
const clockPt = (r: number, clockDeg: number): { x: number; y: number } => {
  const rad = ((clockDeg - 90) * Math.PI) / 180;
  return {
    x: +(CX + r * Math.cos(rad)).toFixed(2),
    y: +(CY + r * Math.sin(rad)).toFixed(2)
  };
};

/** 目盛り12本(外側r=21.5、通常は長さ3、主要4本は長さ5) */
const ticks = Array.from({ length: 12 }, (_, i) => {
  const deg = i * 30;
  const major = i % 3 === 0;
  const outer = clockPt(21.5, deg);
  const inner = clockPt(major ? 16.5 : 18.5, deg);
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
const hourHand = computed(() => clockPt(11, ((props.hour + progress.value) % 12) * 30));

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
