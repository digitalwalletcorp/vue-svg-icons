<!--
外部リンクアイコン
UTF-8絵文字に類似のアイコンは存在しない
別タブ・別ウィンドウで開くことを示すときの記号(□の角から矢印が外へ抜ける)
direction: 矢印が抜ける角を変更可能
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :width="props.size"
    :height="props.size"
    fill="none"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <path
      d="M28 16H16a6 6 0 0 0-6 6v26a6 6 0 0 0 6 6h26a6 6 0 0 0 6-6V36M38 10h16v16M54 10L32 32"
      :stroke="props.color"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      :transform="`rotate(${angle} 32 32)`"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * directionは矢印が抜ける角。基準の右上版を回転させて4隅を表現する
 */
interface Props {
  direction?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'top-right',
  size: '1.2em',
  color: 'currentColor',
  strokeWidth: 6
});

const angle = computed(() => {
  switch (props.direction) {
    case 'bottom-right': return 90;
    case 'bottom-left': return 180;
    case 'top-left': return -90;
    default: return 0; // top-right
  }
});
</script>
