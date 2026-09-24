<!--
UTF-8絵文字❌(CROSS MARK)をイメージしたアイコン
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
      <!-- 面: 中央の明るい赤→端の深い赤 -->
      <radialGradient :id="faceGradId" cx="0.5" cy="0.42" r="0.65">
        <stop offset="0" stop-color="#f98b85" />
        <stop offset="0.5" stop-color="#ef5350" />
        <stop offset="1" stop-color="#d5312e" />
      </radialGradient>
      <!-- 縁: 上が明るく下が沈む -->
      <linearGradient :id="rimGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#e2504c" />
        <stop offset="1" stop-color="#b02421" />
      </linearGradient>
    </defs>

    <!-- 縁 -->
    <polygon
      :points="crossPoints"
      :fill="`url(#${rimGradId})`"
      :stroke="`url(#${rimGradId})`"
      stroke-width="3"
      stroke-linejoin="round"
    />

    <!-- 面 -->
    <polygon
      :points="crossPoints"
      :fill="`url(#${faceGradId})`"
      :stroke="`url(#${faceGradId})`"
      stroke-width="1.5"
      stroke-linejoin="round"
      transform="translate(0 -0.5)"
    />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

interface Props {
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'cm').replace(/[^a-zA-Z0-9_-]/g, '') || 'cm';
const faceGradId = `crossmark-face-${uid}`;
const rimGradId = `crossmark-rim-${uid}`;

const CX = 32;
const CY = 32;
const ARM = 24;     // 中心から腕の先端までの距離(45度方向)
const HALF_W = 4.7; // 腕の太さの半分

/**
 * Xの輪郭12頂点を生成する。
 * 45度回転した「+」として計算する: 各腕の先端に3点(角/先端中央は角2点)、
 * 腕の付け根の凹み4点。対角方向の単位ベクトルから機械的に導出する。
 */
const buildCrossPoints = (): string => {
  const s = Math.SQRT1_2; // sin45 = cos45
  // 4本の腕の方向(右上, 右下, 左下, 左上)
  const dirs = [
    { x: s, y: -s },
    { x: s, y: s },
    { x: -s, y: s },
    { x: -s, y: -s }
  ];
  const pts: string[] = [];
  for (let i = 0; i < 4; i++) {
    const d = dirs[i];
    const n = { x: -d.y, y: d.x }; // 腕の法線(進行方向右手)
    // 腕の先端の2角(左角 → 右角の順で外周を時計回りに)
    const tipL = {
      x: CX + d.x * ARM - n.x * HALF_W,
      y: CY + d.y * ARM - n.y * HALF_W
    };
    const tipR = {
      x: CX + d.x * ARM + n.x * HALF_W,
      y: CY + d.y * ARM + n.y * HALF_W
    };
    // 次の腕との間の付け根の凹み(2本の腕の内側縁の交点)
    const nd = dirs[(i + 1) % 4];
    const rootDist = HALF_W / s; // 交点は中心から HALF_W/sin45 の距離
    const mid = { x: (d.x + nd.x) / 2, y: (d.y + nd.y) / 2 };
    const midLen = Math.hypot(mid.x, mid.y);
    const root = {
      x: CX + (mid.x / midLen) * rootDist,
      y: CY + (mid.y / midLen) * rootDist
    };
    pts.push(
      `${tipL.x.toFixed(2)},${tipL.y.toFixed(2)}`,
      `${tipR.x.toFixed(2)},${tipR.y.toFixed(2)}`,
      `${root.x.toFixed(2)},${root.y.toFixed(2)}`
    );
  }
  return pts.join(' ');
};

const crossPoints = buildCrossPoints();
</script>
