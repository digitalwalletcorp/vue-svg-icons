<!--
UTF-8絵文字⏳(HOURGLASS WITH FLOWING SAND)をイメージしたアイコン(アニメーションサポート)。
duration: 砂が落ち切るまでの秒数。1分計とみなし60で実時間。小さいほど速い。0以下で静止
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="250 40 180 260"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle, display: 'inline-block', width: 'auto', verticalAlign: '-0.2em' }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <desc>Hourglass emoji style illustration with sand flowing in an endless loop</desc>
    <defs>
      <clipPath :id="topClipId">
        <path d="M275 78 L405 78 L405 100 C405 130 355 152 348 170 L332 170 C325 152 275 130 275 100 Z" transform="translate(-1,0)" />
      </clipPath>
      <clipPath :id="botClipId">
        <path d="M332 170 L348 170 C355 188 405 210 405 240 L405 262 L275 262 L275 240 C275 210 325 188 332 170 Z" transform="translate(-1,0)" />
      </clipPath>
      <clipPath :id="glassClipId">
        <path d="M275 78 L405 78 L405 100 C405 130 355 152 348 170 C355 188 405 210 405 240 L405 262 L275 262 L275 240 C275 210 325 188 332 170 C325 152 275 130 275 100 Z" transform="translate(-1,0)" />
      </clipPath>
    </defs>
    <g transform="translate(1,0)">
      <rect x="255" y="46" width="168" height="26" rx="8" fill="#5f3c22" />
      <rect x="276" y="46" width="126" height="26" fill="#8a5a34" />
      <rect x="276" y="46" width="126" height="8" fill="#a06c40" />
      <rect x="276" y="50" width="126" height="3" fill="#4a2d15" />
      <rect x="255" y="268" width="168" height="26" rx="8" fill="#5f3c22" />
      <rect x="276" y="268" width="126" height="26" fill="#8a5a34" />
      <rect x="276" y="286" width="126" height="6" fill="#6e4526" />
      <rect x="276" y="287" width="126" height="3" fill="#4a2d15" />
      <path d="M275 78 L405 78 L405 100 C405 130 355 152 348 170 C355 188 405 210 405 240 L405 262 L275 262 L275 240 C275 210 325 188 332 170 C325 152 275 130 275 100 Z" fill="#e8f4fb" fill-opacity="0.35" stroke="#9cc4d8" stroke-width="2" />
      <g :clip-path="`url(#${topClipId})`">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 72;0 72" keyTimes="0;0.88;1" :dur="durValue" repeatCount="indefinite" />
          <path d="M300 118 C315 133 330 140 340 145 C350 140 365 133 380 118 L405 100 L405 78 L275 78 L275 100 Z" fill="#b57b3e" />
          <ellipse cx="340" cy="118" rx="68" ry="12" fill="#b57b3e" />
        </g>
      </g>
      <g :clip-path="`url(#${botClipId})`">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 54;0 0;0 0" keyTimes="0;0.88;1" :dur="durValue" repeatCount="indefinite" />
          <path d="M275 262 L405 262 L405 240 C390 226 360 216 340 212 C320 216 290 226 275 240 Z" fill="#b57b3e" />
          <ellipse cx="340" cy="240" rx="52" ry="10" fill="#a56a32" />
        </g>
      </g>
      <g :clip-path="`url(#${glassClipId})`">
        <g>
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.86;0.9;1" :dur="durValue" repeatCount="indefinite" />
          <line x1="340" y1="148" x2="340" y2="238" stroke="#b57b3e" stroke-width="5" stroke-dasharray="7 5">
            <animate attributeName="stroke-dashoffset" from="0" to="-24" :dur="streamDur(0.45)" repeatCount="indefinite" />
          </line>
          <circle cx="336" cy="200" r="2" fill="#b57b3e">
            <animate attributeName="cy" values="176;236" :dur="streamDur(0.55)" repeatCount="indefinite" />
          </circle>
          <circle cx="344" cy="190" r="2" fill="#b57b3e">
            <animate attributeName="cy" values="182;236" :dur="streamDur(0.7)" begin="0.2s" repeatCount="indefinite" />
          </circle>
        </g>
        <path d="M286 78 L306 78 C306 104 316 122 330 136 C322 142 314 148 308 156 C292 138 286 116 286 96 Z" fill="#ffffff" />
        <path d="M286 262 L306 262 C306 244 316 232 330 222 L316 214 C298 226 286 242 286 254 Z" fill="#ffffff" />
        <path d="M394 92 C394 110 388 122 380 132 L390 140 C398 128 402 112 402 96 L402 84 L394 84 Z" fill="#ffffff" fill-opacity="0.6" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  /** 砂が落ち切るまでの秒数(SMILのdurにバインド。同期する3アニメに適用)。0以下で静止 */
  duration?: number;
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  duration: 12,
  size: '1.2em'
});

// clip-pathのid参照が複数インスタンスで衝突しないよう一意化する
const uid = (useId() ?? 'hg').replace(/[^a-zA-Z0-9_-]/g, '') || 'hg';
const topClipId = `hg-top-${uid}`;
const botClipId = `hg-bot-${uid}`;
const glassClipId = `hg-glass-${uid}`;

// SMILのdurに0sは渡せない。indefiniteにすると開始値のまま止まる
const durValue = computed((): string => props.duration > 0 ? `${props.duration}s` : 'indefinite');

/** 砂の流れ(点線と粒)はdurationに連動しない固定速度。静止時だけ止める */
const streamDur = (seconds: number): string => props.duration > 0 ? `${seconds}s` : 'indefinite';
const sizeStyle = computed((): string => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>
