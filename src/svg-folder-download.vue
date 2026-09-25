<!--
フォルダにダウンロードの矢印を重ねたアイコン
UTF-8絵文字に該当するものは存在しない
arrowColor: 未指定なら矢印と横棒を切り抜いて下地の色を見せる。指定するとその色で塗る
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
        <rect v-bind="BAR" fill="#000000" />
      </mask>
    </defs>
    <!-- 左上の台形のタブと角丸の本体を1つの塗りにする -->
    <path
      d="M13 17 L18 10 H35 L40 17 H53 Q58 17 58 22 V49 Q58 54 53 54 H11 Q6 54 6 49 V22 Q6 17 11 17 Z"
      :fill="props.color"
      :mask="props.arrowColor == null ? `url(#${maskId})` : undefined"
    />
    <template v-if="props.arrowColor != null">
      <path :d="ARROW" :fill="props.arrowColor" />
      <rect v-bind="BAR" :fill="props.arrowColor" />
    </template>
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

const uid = (useId() ?? 'fd').replace(/[^a-zA-Z0-9_-]/g, '') || 'fd';
const maskId = `folder-download-mask-${uid}`;

/** 下向き矢印(軸+矢じり) */
const ARROW = 'M28 20 H36 V32 H45 L32 44 L19 32 H28 Z';
/** 矢印の下の横棒 */
const BAR = { x: 19, y: 47, width: 26, height: 4.67, rx: 1 };
</script>
