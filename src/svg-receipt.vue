<!--
UTF-8絵文字🧾(RECEIPT)をイメージしたアイコン
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
    <defs>
      <!-- 用紙: 白。右側へわずかに沈める -->
      <linearGradient :id="paperGradId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="1" stop-color="#eceff2" />
      </linearGradient>
    </defs>

    <!-- 用紙の影 -->
    <path :d="PAPER_PATH" transform="translate(1.2 1.2)" fill="#000000" opacity="0.12" />
    <!-- 用紙(上下の切り口は歯の幅4・高さ3のギザギザ) -->
    <path :d="PAPER_PATH" :fill="`url(#${paperGradId})`" stroke="#9aa3ad" stroke-width="0.9" stroke-linejoin="round" />

    <!-- 見出し・合計の文字(ストローク文字) -->
    <g
      fill="none"
      stroke="#3d4650"
      :stroke-width="TEXT_STROKE"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <g :transform="`translate(${headline.left} ${HEADLINE_TOP}) scale(${TEXT_SCALE})`">
        <path v-for="(glyph, i) in headline.glyphs" :key="i" :transform="`translate(${glyph.x} 0)`" :d="glyph.d" />
      </g>
      <g :transform="`translate(${TOTAL_LEFT} ${TOTAL_TOP}) scale(${TEXT_SCALE})`">
        <path v-for="(glyph, i) in total.glyphs" :key="i" :transform="`translate(${glyph.x} 0)`" :d="glyph.d" />
      </g>
    </g>

    <!-- 見出しと明細の区切り(明細と同じ幅) -->
    <line x1="19" y1="17.4" x2="45" y2="17.4" stroke="#9aa3ad" stroke-width="0.7" stroke-linecap="round" />
    <!-- 明細3行(左: 品名、右: 金額) -->
    <g fill="#9aa3ad">
      <rect x="19" y="21" width="13" height="2.2" rx="1.1" />
      <rect x="38" y="21" width="7" height="2.2" rx="1.1" />
      <rect x="19" y="27" width="10" height="2.2" rx="1.1" />
      <rect x="38" y="27" width="7" height="2.2" rx="1.1" />
      <rect x="19" y="33" width="15" height="2.2" rx="1.1" />
      <rect x="38" y="33" width="7" height="2.2" rx="1.1" />
    </g>
    <!-- 明細と合計の区切り -->
    <line x1="18.5" y1="39" x2="45.5" y2="39" stroke="#b6bdc4" stroke-width="1.1" stroke-dasharray="2 1.6" />
    <!-- 合計金額 -->
    <rect x="40" y="45.5" width="5" height="3" rx="1.5" fill="#3d4650" />
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { iconSizeStyle } from '@/internal/icon-size';

interface Props {
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: '1.2em'
});

const uid = (useId() ?? 'rc').replace(/[^a-zA-Z0-9_-]/g, '') || 'rc';
const paperGradId = `receipt-paper-${uid}`;

const PAPER_PATH = 'M14 7 L16 4 L18 7 L20 4 L22 7 L24 4 L26 7 L28 4 L30 7 L32 4 L34 7 L36 4 L38 7 L40 4 L42 7 L44 4 L46 7 L48 4 L50 7 L50 57 L48 60 L46 57 L44 60 L42 57 L40 60 L38 57 L36 60 L34 57 L32 60 L30 57 L28 60 L26 57 L24 60 L22 57 L20 60 L18 57 L16 60 L14 57 Z';

interface GlyphShape {
  /** 字形のpath(ストロークで描く) */
  d: string;
  /** 字送り幅 */
  w: number;
}

/**
 * 文字の字形。高さ19の枠に左上原点で描く(svg-calendarの月ラベルと同じ字形。Iのみ追加)。
 * フォントに頼らないのは、利用側の環境で字形が変わるのを避けるため
 */
const LETTER_GLYPHS: Record<string, GlyphShape> = {
  A: { d: 'M0 19 L5.5 0 L11 19 M2.3 12 H8.7', w: 11 },
  C: { d: 'M8.3 1.3 A5.5 9.5 0 1 0 8.3 17.7', w: 11 },
  E: { d: 'M10 0 H0 v19 h10 M0 9.5 H8', w: 10 },
  I: { d: 'M0 0 v19', w: 0 },
  L: { d: 'M0 0 v19 h9', w: 9 },
  O: { d: 'M0 9.5 a5.5 9.5 0 1 0 11 0 a5.5 9.5 0 1 0 -11 0', w: 11 },
  P: { d: 'M0 19 V0 h5 a5 5 0 0 1 0 10 H0', w: 10 },
  R: { d: 'M0 19 V0 h5 a5 5 0 0 1 0 10 H0 m5 0 l6 9', w: 11 },
  T: { d: 'M0 0 h11 M5.5 0 v19', w: 11 }
};

/** 字形の縮小率(高さ19 → 約4.4)と線の太さ(字形の座標系での値。表示上は約1) */
const TEXT_SCALE = 0.23;
const TEXT_STROKE = 4.2;
/** 字間(字形の座標系での値) */
const LETTER_GAP = 6;
/** 見出しは用紙の中央に置く。合計の文字は明細の品名と左端を揃える */
const HEADLINE_CX = 32;
const HEADLINE_TOP = 11;
const TOTAL_LEFT = 19;
const TOTAL_TOP = 45;

/** 文字列を字形の並びに直す。xと全体の幅は字形の座標系での値 */
const layoutGlyphs = (text: string): { glyphs: { d: string; x: number }[]; width: number } => {
  const glyphs: { d: string; x: number }[] = [];
  let x = 0;
  for (const char of text) {
    const shape = LETTER_GLYPHS[char];
    glyphs.push({ d: shape.d, x });
    x += shape.w + LETTER_GAP;
  }
  return { glyphs, width: x - LETTER_GAP };
};

const headlineLayout = layoutGlyphs('RECEIPT');
const headline = {
  glyphs: headlineLayout.glyphs,
  left: +(HEADLINE_CX - (headlineLayout.width * TEXT_SCALE) / 2).toFixed(2)
};
const total = layoutGlyphs('TOTAL');
</script>
