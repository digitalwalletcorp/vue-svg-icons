<!--
V字アイコン
UTF-8絵文字に類似のアイコンは存在しない
折りたたみなどを示すときの記号
direction: 鏃の向きを変更可能
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
    :fill="props.filled ? props.color : 'none'"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <path
      :d="props.filled ? `${pathData} Z` : pathData"
      :stroke="props.filled ? 'none' : props.color"
      :stroke-width="props.filled ? undefined : props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
interface Props {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'down',
  size: '1.2em',
  color: 'currentColor',
  strokeWidth: 6,
  filled: false
});

const pathData = computed(() => {
  switch (props.direction) {
    case 'up': return 'M16 40l16-16 16 16';
    case 'left': return 'M40 12l-20 20 20 20';
    case 'right': return 'M24 12l20 20-20 20';
    default: return 'M16 24l16 16 16-16';
  }
});
</script>
