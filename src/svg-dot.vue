<!--
ドットアイコンで単なるドットを描画する
UTF-8絵文字に類似のアイコンは存在しない
sizeを大きくすれば⚫︎にもなる
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
  >
    <circle
      cx="32"
      cy="32"
      r="24"
      :fill="props.color"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string;
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  color: 'currentColor'
});
</script>
