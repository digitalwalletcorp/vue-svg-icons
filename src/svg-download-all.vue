<!--
全件ダウンロードアイコン
UTF-8絵文字に類似のアイコンは存在しない
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
    fill="none"
  >
    <path
      d="M32 8v32m0 0L20 28m12 12l12-12M8 48h48"
      :stroke="props.color"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 18V8h32v10"
      :stroke="props.color"
      :stroke-width="props.topLineWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  topLineWidth?: number;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  color: 'currentColor',
  strokeWidth: 6,
  topLineWidth: 4.8
});
</script>
