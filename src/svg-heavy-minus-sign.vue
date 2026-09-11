<!--
UTF-8絵文字➖(HEAVY MINUS SIGN)をイメージしたアイコン
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    :width="props.size"
    :height="props.size"
  >
    <path
      d="M12 32 H52"
      :stroke="props.color"
      stroke-width="13"
      stroke-linecap="round"
      fill="none"
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
  color: 'gray'
});
</script>
