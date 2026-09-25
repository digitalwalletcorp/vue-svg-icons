<!--
ドットアイコンで単なるドットを描画する
UTF-8絵文字に類似のアイコンは存在しない
sizeを大きくすれば⚫︎にもなる
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
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <circle
      cx="32"
      cy="32"
      r="24"
      :fill="props.color"
    />
  </svg>
</template>

<script setup lang="ts">
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  size?: number | string;
  color?: string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  color: 'currentColor'
});
</script>
