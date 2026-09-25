<!--
雲にダウンロードの矢印を重ねたアイコン
UTF-8絵文字に該当するものは存在しない
arrowColor: 未指定なら矢印を切り抜いて下地の色を見せる。指定するとその色で塗る
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
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
    <defs v-if="props.arrowColor == null">
      <mask :id="maskId" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
        <rect width="64" height="64" fill="#ffffff" />
        <path :d="ARROW" fill="#000000" />
      </mask>
    </defs>
    <!-- 3つの円と底の角丸長方形を重ねて雲の形にする -->
    <g :fill="props.color" :mask="props.arrowColor == null ? `url(#${maskId})` : undefined">
      <circle cx="16" cy="38" r="12" />
      <circle cx="32" cy="27" r="16" />
      <circle cx="48" cy="36" r="12" />
      <rect x="3" y="36" width="58" height="18" rx="9" />
    </g>
    <path v-if="props.arrowColor != null" :d="ARROW" :fill="props.arrowColor" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  size?: number | string;
  color?: string;
  arrowColor?: string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em',
  color: 'currentColor'
});

const uid = (useId() ?? 'cd').replace(/[^a-zA-Z0-9_-]/g, '') || 'cd';
const maskId = `cloud-download-mask-${uid}`;

/** 下向き矢印(軸+矢じり)。フォルダ版と同じ形で、横棒がない分だけ下げている */
const ARROW = 'M28 26 H36 V38 H45 L32 50 L19 38 H28 Z';
</script>
