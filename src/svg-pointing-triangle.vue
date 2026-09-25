<!--
三角形のアイコン
▲(U+25B2 BLACK UP-POINTING TRIANGLE)を模しているが、
この文字は絵文字リスト(RGI)に含まれずカラー絵文字字形が存在しない
direction: 三角の向きを変更可能
color: 図形の色。16進数カラーコードまたはredなどのカラーネームを指定でき、どちらも図形にグラデーションがかかる。解釈できない値はグラデーションのない単色になる。
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
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 面: 上がやや明るく下が濃い -->
      <linearGradient :id="faceGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="colorLight" />
        <stop offset="1" :stop-color="colorDeep" />
      </linearGradient>
      <!-- 縁: 下辺が沈む -->
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" :stop-color="colorRim" />
        <stop offset="1" :stop-color="colorDark" />
      </linearGradient>
      <!-- 上部の光沢: 下端で透明へ落とす -->
      <linearGradient :id="glossGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.7" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <!-- 底辺の光沢: 底辺から先端方向へ透明に落とす -->
      <linearGradient
        v-if="triangle.back"
        :id="backGradId"
        :x1="triangle.back.x1"
        y1="0"
        :x2="triangle.back.x2"
        y2="0"
      >
        <stop offset="0" stop-color="#ffffff" stop-opacity="0.45" />
        <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
      </linearGradient>
      <filter :id="glossBlurId" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="0.6" />
      </filter>
      <clipPath :id="faceClipId">
        <polygon :points="triangle.face" />
      </clipPath>
    </defs>
    <!-- 縁と面。角を丸めるため塗りと同じ色で線も引く -->
    <polygon :points="triangle.rim" :fill="`url(#${rimGradId})`" :stroke="`url(#${rimGradId})`" stroke-width="5" stroke-linejoin="round" />
    <polygon :points="triangle.face" :fill="`url(#${faceGradId})`" :stroke="`url(#${faceGradId})`" stroke-width="3" stroke-linejoin="round" />
    <g :clip-path="`url(#${faceClipId})`">
      <rect v-bind="triangle.gloss" rx="2" :fill="`url(#${glossGradId})`" :filter="`url(#${glossBlurId})`" />
      <rect v-if="triangle.back" v-bind="triangle.back.rect" :fill="`url(#${backGradId})`" :filter="`url(#${glossBlurId})`" />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { resolveNamedColor } from '@/internal/named-color';

interface Props {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: number | string;
  color?: string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'up',
  size: '1.2em',
  color: 'currentColor'
});

const uid = (useId() ?? 'pt').replace(/[^a-zA-Z0-9_-]/g, '') || 'pt';
const faceGradId = `pointing-triangle-face-${uid}`;
const rimGradId = `pointing-triangle-rim-${uid}`;
const glossGradId = `pointing-triangle-gloss-${uid}`;
const backGradId = `pointing-triangle-back-${uid}`;
const glossBlurId = `pointing-triangle-gloss-blur-${uid}`;
const faceClipId = `pointing-triangle-face-clip-${uid}`;

/** 上向き三角の頂点 */
const BASE: [number, number][] = [[32, 12], [56, 50], [8, 50]];

/** 色を明暗方向に amount(-255〜255)だけシフトする。カラーネームは16進数へ解決してから処理する */
const shiftColor = (color: string, amount: number): string => {
  const hex = resolveNamedColor(color);
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex);
  if (m === null) {
    return hex; // #RGB等の想定外形式はそのまま返す
  }
  const num = parseInt(m[1], 16);
  const clamp = (v: number): number => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16 & 0xff) + amount);
  const g = clamp((num >> 8 & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

const rotation = computed(() => {
  switch (props.direction) {
    case 'right': return 90;
    case 'down': return 180;
    case 'left': return -90;
    default: return 0; // up
  }
});

/** 面の上側 */
const colorLight = computed((): string => shiftColor(props.color, 36));
/** 面の下側 */
const colorDeep = computed((): string => shiftColor(props.color, -18));
/** 縁の上側 */
const colorRim = computed((): string => shiftColor(props.color, 10));
/** 縁の下側 */
const colorDark = computed((): string => shiftColor(props.color, -60));

/**
 * 光が常に上から当たるよう、rotateではなく頂点を回転して図形を求める。
 * 左右向きは上からの光だけでは向きが読み取りにくいため、底辺(後ろ側の縦の辺)の内側も明るくする
 */
const triangle = computed(() => {
  const t = rotation.value * Math.PI / 180;
  const rim = BASE.map(([x, y]): [number, number] => [
    32 + (x - 32) * Math.cos(t) - (y - 32) * Math.sin(t),
    32 + (x - 32) * Math.sin(t) + (y - 32) * Math.cos(t)
  ]);
  // 面は縁を重心中心に縮めたもの
  const cx = rim.reduce((sum, p) => sum + p[0], 0) / 3;
  const cy = rim.reduce((sum, p) => sum + p[1], 0) / 3;
  const face = rim.map(([x, y]): [number, number] => [cx + (x - cx) * 0.9, cy + (y - cy) * 0.9]);
  const xs = face.map((p) => p[0]);
  const ys = face.map((p) => p[1]);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  const width = Math.max(...xs) - left;
  const height = Math.max(...ys) - top;
  const toPoints = (points: [number, number][]): string => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const bandWidth = width * 0.16;
  const back = props.direction === 'right' || props.direction === 'left'
    ? {
      x1: props.direction === 'right' ? 0 : 1,
      x2: props.direction === 'right' ? 1 : 0,
      rect: {
        x: props.direction === 'right' ? left : left + width - bandWidth,
        y: top + height * 0.1,
        width: bandWidth,
        height: height * 0.8
      }
    }
    : null;
  return {
    rim: toPoints(rim),
    face: toPoints(face),
    gloss: {
      x: left + width * 0.06,
      y: top + height * 0.03,
      width: width * 0.88,
      height: height * 0.14
    },
    back
  };
});
</script>
