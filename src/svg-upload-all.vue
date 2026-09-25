<!--
全件アップロードアイコン
UTF-8絵文字に類似のアイコンは存在しない
svg-download-allを上下反転した形
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
    fill="none"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <path
      d="M32 56V24m0 0L20 36m12-12l12 12M8 16h48"
      :stroke="props.color"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 46v10h32V46"
      :stroke="props.color"
      :stroke-width="props.bottomLineWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  bottomLineWidth?: number;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  color: 'currentColor',
  strokeWidth: 6,
  bottomLineWidth: 4.8
});
</script>
