<!--
UTF-8絵文字⚙️(GEAR)をイメージしたアイコン
linearGradient/useのid参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- 本体: 左上からの光 -->
      <linearGradient :id="gearBodyId" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0" stop-color="#c6cbd2" />
        <stop offset="0.5" stop-color="#9aa0a9" />
        <stop offset="1" stop-color="#767c86" />
      </linearGradient>
      <!-- 面盤: 本体より一段明るい(盛り上がり) -->
      <linearGradient :id="gearFaceId" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0" stop-color="#d6dae0" />
        <stop offset="1" stop-color="#8f959e" />
      </linearGradient>
      <!-- ハブ: 光方向を反転(凹み) -->
      <linearGradient :id="gearHub" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0" stop-color="#7d838c" />
        <stop offset="1" stop-color="#aab0b8" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="33" cy="59" rx="24" ry="3" fill="#000000" opacity="0.12" />

    <!-- 歯車本体(歯付き輪郭) -->
    <path
      :d="gearOutline"
      :fill="`url(#${gearBodyId})`"
      stroke="#666c75"
      stroke-width="1.5"
      stroke-linejoin="round"
    />

    <!-- 面盤: 歯底より内側の一段高い円盤 -->
    <circle :cx="CX" :cy="CY" r="17.5" :fill="`url(#${gearFaceId})`" stroke="#7d838c" stroke-width="1" />
    <!-- 面盤の上縁ハイライト(段差の稜線) -->
    <path d="M 15.5 29 A 17.5 17.5 0 0 1 47 26" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5" stroke-linecap="round" />

    <!-- 軽量化穴: 面盤に開いた小穴で機械らしさを出す -->
    <g fill="#82878f">
      <circle v-for="(p, i) in spokeHoles" :key="i" :cx="p.x" :cy="p.y" r="2.6" />
    </g>

    <!-- ハブ(中央の凹んだ台座) -->
    <circle :cx="CX" :cy="CY" r="10" :fill="`url(#${gearHub})`" stroke="#6f757e" stroke-width="1" />

    <!-- 軸穴 -->
    <circle :cx="CX" :cy="CY" r="5.5" fill="#565c66" />
    <!-- 軸穴の下縁ハイライト(穴の内側に光が回り込む) -->
    <path d="M 27.5 34.5 A 5.5 5.5 0 0 0 36.5 34" fill="none" stroke="#c6cbd2" stroke-width="1.2" opacity="0.7" />
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

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const gearBodyId = `gear-body-${uid}`;
const gearFaceId = `gear-face-${uid}`;
const gearHub = `gear-hub-${uid}`;

/** 歯車パス生成の定数 */
const CX = 32;
const CY = 32;
const TEETH = 10;         // 歯数
const TIP_R = 27;         // 歯先円の半径
const ROOT_R = 21;        // 歯底円の半径
const TIP_HALF = (7 * Math.PI) / 180;    // 歯先の角度半幅
const ROOT_HALF = (10.5 * Math.PI) / 180; // 歯底側の角度半幅(>TIP_HALFで台形の歯になる)

const pt = (r: number, a: number): { x: number; y: number } => ({
  x: CX + r * Math.cos(a),
  y: CY + r * Math.sin(a)
});
const ptStr = (r: number, a: number): string => {
  const p = pt(r, a);
  return `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
};

const buildGearOutline = (): string => {
  const step = (2 * Math.PI) / TEETH;
  let d = '';
  for (let i = 0; i < TEETH; i++) {
    const c = i * step;
    const p1 = ptStr(ROOT_R, c - ROOT_HALF);
    const p2 = ptStr(TIP_R, c - TIP_HALF);
    const p3 = ptStr(TIP_R, c + TIP_HALF);
    const p4 = ptStr(ROOT_R, c + ROOT_HALF);
    const next = ptStr(ROOT_R, c + step - ROOT_HALF);
    if (i === 0) {
      d += `M ${p1} `;
    }
    d += `L ${p2} A ${TIP_R} ${TIP_R} 0 0 1 ${p3} L ${p4} A ${ROOT_R} ${ROOT_R} 0 0 1 ${next} `;
  }
  return d + 'Z';
};

const gearOutline = buildGearOutline();

/** 面盤上の軽量化穴の位置(5個を等間隔、歯とは半ピッチずらす) */
const spokeHoles = Array.from({ length: 5 }, (_, i) => {
  const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
  return pt(14, a);
});
</script>
