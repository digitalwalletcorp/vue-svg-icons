<!--
UTF-8絵文字➡(BLACK RIGHTWARDS ARROW)のテキスト表示(台座なし)をイメージしたアイコン
direction: 矢印の向きを8方向で変更可能
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
    <!-- 中抜き時は2倍幅の線を矢印の形で切り抜き、外形を変えずに内側へだけ太らせる -->
    <defs v-if="!props.filled">
      <clipPath :id="clipId">
        <polygon :points="points" />
      </clipPath>
    </defs>
    <polygon
      :points="points"
      :fill="props.filled ? props.color : 'none'"
      :stroke="props.filled ? 'none' : props.color"
      :stroke-width="props.filled ? undefined : props.strokeWidth * 2"
      :clip-path="props.filled ? undefined : `url(#${clipId})`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  direction?: 'up' | 'down' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'right',
  size: '1.2em',
  color: 'currentColor',
  strokeWidth: 2,
  filled: true
});

const uid = (useId() ?? 'ba').replace(/[^a-zA-Z0-9_-]/g, '') || 'ba';
const clipId = `black-arrow-clip-${uid}`;
/** 軸+矢じりの右向き矢印の頂点(中心32,32) */
const BASE: readonly [number, number][] = [[6, 24], [34, 24], [34, 10], [58, 32], [34, 54], [34, 40], [6, 40]];

/** 右向きを基準にした時計回りの回転角 */
const angle = computed(() => {
  switch (props.direction) {
    case 'bottom-right': return 45;
    case 'down': return 90;
    case 'bottom-left': return 135;
    case 'left': return 180;
    case 'top-left': return 225;
    case 'up': return 270;
    case 'top-right': return 315;
    default: return 0; // right
  }
});

/**
 * 頂点をdirectionの向きへ回転して矢印の形を求める。
 * 矢印は点対称でないため、斜め向きでは回転だけだと外接矩形の中心が(32,32)からずれる。外接矩形が中央に来るよう平行移動する
 */
const points = computed((): string => {
  const t = angle.value * Math.PI / 180;
  const rotated = BASE.map(([x, y]): [number, number] => [
    32 + (x - 32) * Math.cos(t) - (y - 32) * Math.sin(t),
    32 + (x - 32) * Math.sin(t) + (y - 32) * Math.cos(t)
  ]);
  const xs = rotated.map((p) => p[0]);
  const ys = rotated.map((p) => p[1]);
  const dx = 32 - (Math.min(...xs) + Math.max(...xs)) / 2;
  const dy = 32 - (Math.min(...ys) + Math.max(...ys)) / 2;
  return rotated.map(([x, y]) => `${(x + dx).toFixed(2)},${(y + dy).toFixed(2)}`).join(' ');
});
</script>
