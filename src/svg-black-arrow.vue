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
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <!-- 中抜き時は2倍幅の線を矢印の形で切り抜き、外形を変えずに内側へだけ太らせる -->
    <defs v-if="!props.filled">
      <clipPath :id="clipId">
        <polygon :points="points" />
      </clipPath>
    </defs>
    <!-- 軸+矢じりの右向き矢印(中心32,32)。directionはrotateで表現 -->
    <g :transform="`rotate(${angle} 32 32)`">
      <polygon
        :points="points"
        :fill="props.filled ? props.color : 'none'"
        :stroke="props.filled ? 'none' : props.color"
        :stroke-width="props.filled ? undefined : props.strokeWidth * 2"
        :clip-path="props.filled ? undefined : `url(#${clipId})`"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

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
const points = '6,24 34,24 34,10 58,32 34,54 34,40 6,40';

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
</script>
