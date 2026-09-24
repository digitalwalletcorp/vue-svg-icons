<!--
表示/非表示を表す目のアイコン
slashedを指定すると斜線を重ねて非表示を表す。
UTF-8絵文字👀をイメージしたsvg-eyesとは別物
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
    fill="none"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <path
      d="M6 32Q32 4 58 32Q32 60 6 32Z"
      :stroke="props.color"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle
      cx="32"
      cy="32"
      r="8"
      :fill="props.color"
    />
    <path
      v-if="props.slashed"
      d="M10 54L54 10"
      :stroke="props.color"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  /** 斜線を重ねるか */
  slashed?: boolean;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  color: 'currentColor',
  strokeWidth: 5,
  slashed: false
});
</script>
