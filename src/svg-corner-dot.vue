<!--
リサイズするときのコーナーアイコン
UTF-8絵文字に類似のアイコンは存在しない
三点のドットで表現する
direction: ドットの配置位置を変更可能
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
    <g :transform="`rotate(${angle} 32 32)`">
      <circle
        v-for="(dot, idx) in dots"
        :key="idx"
        :cx="dot[0]"
        :cy="dot[1]"
        r="6.4"
        :fill="props.color"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * コーナー系: 隅に寄せたリサイズグリップ(3-2-1のドット三角)。
 * directionは寄せる角。基準の右下版を回転させて4隅を表現する
 */
interface Props {
  direction?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number | string;
  color?: string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'bottom-right',
  size: '1.2em',
  color: 'currentColor'
});

// 基準となる右下版のドット座標(3-2-1の三角)。他の角はrotateで導出する
const dots: readonly [number, number][] = [
  [50, 14],
  [32, 32], [50, 32],
  [14, 50], [32, 50], [50, 50]
];

const angle = computed(() => {
  switch (props.direction) {
    case 'top-right': return 270;
    case 'top-left': return 180;
    case 'bottom-left': return 90;
    default: return 0;
  }
});
</script>
