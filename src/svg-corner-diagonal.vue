<!--
リサイズするときのコーナーアイコン
UTF-8絵文字に類似のアイコンは存在しない
三本の斜線で表現する
direction: 斜線の配置位置を変更可能
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
    fill="none"
  >
    <g :transform="`rotate(${angle} 32 32)`">
      <line
        v-for="(l, idx) in lines"
        :key="idx"
        :x1="l[0]"
        :y1="l[1]"
        :x2="l[2]"
        :y2="l[3]"
        :stroke="props.color"
        :stroke-width="props.strokeWidth"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
/**
 * コーナー系: 隅に寄せたリサイズグリップ(斜線3本)。
 * directionは寄せる角。基準の右下版を回転させて4隅を表現する
 */
interface Props {
  direction?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'bottom-right',
  size: '1.2em',
  color: 'currentColor',
  strokeWidth: 4.8
});

// 基準となる右下版の斜線(右上→左下方向)。角に近い線ほど短く、左上へ向かうほど長い。他の角はrotateで導出する
const lines: readonly [number, number, number, number][] = [
  [56, 44, 44, 56],
  [56, 32, 32, 56],
  [56, 20, 20, 56]
];

const angle = computed(() => {
  switch (props.direction) {
    case 'top-right': return 90;
    case 'top-left': return 180;
    case 'bottom-left': return 270;
    default: return 0;
  }
});
</script>
