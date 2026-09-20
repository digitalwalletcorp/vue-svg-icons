<!--
三角形のアイコン
▲(U+25B2 BLACK UP-POINTING TRIANGLE)を模しているが、
この文字は絵文字リスト(RGI)に含まれずカラー絵文字字形が存在しない
direction: 三角の向きを変更可能
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
    <!-- 上向き三角(中心32,32)。directionはrotateで表現 -->
    <polygon
      points="32,12 56,50 8,50"
      :fill="props.color"
      :transform="`rotate(${rotation} 32 32)`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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

const rotation = computed(() => {
  switch (props.direction) {
    case 'right': return 90;
    case 'down': return 180;
    case 'left': return -90;
    default: return 0; // up
  }
});
</script>
