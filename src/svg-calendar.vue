<!--
UTF-8絵文字📅(CALENDAR)をイメージしたアイコン(アニメーションサポート)
id参照があるため、複数インスタンスでの衝突を避けてuseId()でidを一意化する。
-->
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="svg-inline--vue-svg-icons"
    viewBox="19 21 122 122"
    :role="props.title == null ? undefined : 'img'"
    :aria-hidden="props.title == null ? 'true' : undefined"
    :style="{ height: sizeStyle, ...iconSizeStyle(props.size) }"
  >
    <title v-if="props.title != null">{{ props.title }}</title>
    <defs>
      <!-- ヘッダー: 赤茶 -->
      <linearGradient :id="headerGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#b06a66" />
        <stop offset="1" stop-color="#96504c" />
      </linearGradient>
      <!-- 台紙: 白 -->
      <linearGradient :id="sheetGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffffff" />
        <stop offset="0.85" stop-color="#eceef1" />
        <stop offset="1" stop-color="#dfe2e7" />
      </linearGradient>
      <!-- めくり中の陰: 回転軸から遠いほど紙が傾いて暗くなる -->
      <linearGradient :id="shadeGradId" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#000000" stop-opacity="0" />
        <stop offset="1" stop-color="#000000" stop-opacity="1" />
      </linearGradient>
    </defs>

    <!-- 接地影 -->
    <ellipse cx="80" cy="137" rx="50" ry="6" fill="#000000" opacity="0.12" />

    <!--
      紙は「翌日の紙」「めくれる現在の紙」の順に重ねる。
      現在の紙は綴じリングを軸に畳まれて消え、下から翌日の紙が現れる。
      静止中は現在の紙だけを描く
    -->
    <g v-for="page in pages" :key="page.key" :transform="page.transform">
      <!-- 台紙(全体) -->
      <rect
        x="30" y="36" width="100" height="99" rx="8"
        :fill="`url(#${sheetGradId})`"
        stroke="#c9ccd2"
        stroke-width="1.5"
      />

      <!-- ヘッダー(上部の赤茶の帯。上辺だけ角丸) -->
      <path
        d="M30 44 a8 8 0 0 1 8 -8 h84 a8 8 0 0 1 8 8 v26 h-100 Z"
        :fill="`url(#${headerGradId})`"
        stroke="#7f423e"
        stroke-width="1.5"
      />
      <!-- ヘッダー下端の落ち影 -->
      <rect x="31" y="70" width="98" height="3.5" fill="#000000" opacity="0.10" />

      <!-- 月ラベル(ストローク文字) -->
      <g
        fill="none"
        stroke="#f3e9e8"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          v-for="(glyph, i) in page.monthGlyphs"
          :key="i"
          :transform="`translate(${glyph.x} ${LABEL_TOP})`"
          :d="glyph.d"
        />
      </g>

      <!-- ヘッダー右のミニ月間グリッド(装飾。月には連動しない) -->
      <g stroke="#e6d5d4" stroke-width="1.6" stroke-linecap="round" opacity="0.9">
        <line
          v-for="(c, i) in miniCells"
          :key="i"
          :x1="c.x - 1.2" :y1="c.y"
          :x2="c.x + 1.2" :y2="c.y"
        />
      </g>

      <!-- 日付(ストローク数字) -->
      <g
        fill="none"
        stroke="#3d4148"
        stroke-width="7"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          v-for="(glyph, i) in page.dayGlyphs"
          :key="i"
          :transform="`translate(${glyph.x} ${DAY_TOP})`"
          :d="glyph.d"
        />
      </g>

      <!-- めくり中の陰 -->
      <rect
        v-if="0 < page.shade"
        x="30" y="36" width="100" height="99" rx="8"
        :fill="`url(#${shadeGradId})`"
        :opacity="page.shade"
      />
    </g>

    <!-- 綴じリング(破れた紙の跡を挟む金属ループ。紙とは別なのでめくっても動かない) -->
    <g v-for="x in ringXs" :key="x">
      <path :d="tornPaper(x)" fill="#e9e2d6" stroke="#b8ab94" stroke-width="1" />
      <path
        :d="`M ${x - 2.5} 42 v-10 a2.5 2.5 0 0 1 5 0 v10`"
        fill="none"
        stroke="#8f959e"
        stroke-width="3.5"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, useId } from 'vue';
import { nextDay, resolveYmd, type CalendarDate, type ResolvedDate } from '@/internal/calendar-date';
import { iconSizeStyle, toCssSize } from '@/internal/icon-size';

interface Props {
  /**
   * 表示する日付('yyyyMMdd')。
   * 年は表示しないがうるう年の判定に使う。未指定なら2月29日。
   * dateが実在しない日付(2026年2月29日など)のときは、durationを指定してもアニメーションしない
   */
  date?: string;
  /** 1日が進む秒数。小さいほど速い。0以下で静止 */
  duration?: number;
  /** 1枚めくるのにかける秒数。durationがこれより短い場合は1日いっぱいを使う */
  flipSeconds?: number;
  /** 表示サイズ(高さ)。数値はpxとして扱う */
  size?: number | string;
  /** 読み上げ名。指定するとrole="img"と<title>を出力する。未指定なら装飾アイコンとして扱う */
  title?: string;
}

/** 字形1文字ぶんの定義。wは字送り幅 */
interface GlyphShape {
  d: string;
  w: number;
}

/** 配置済みの字形 */
interface Glyph {
  d: string;
  x: number;
}

/** 重ねて描く紙1枚ぶんの描画データ */
interface Page {
  key: string;
  /** めくり中だけ設定する。静止している紙には付けない */
  transform: string | undefined;
  /** めくり中の陰の不透明度。0なら陰を描かない */
  shade: number;
  monthGlyphs: Glyph[];
  dayGlyphs: Glyph[];
}

const props = withDefaults(defineProps<Props>(), {
  duration: 0,
  flipSeconds: 0.45,
  size: '1.2em'
});

/** 表示中の日付 */
const currentDate = ref<CalendarDate>(resolveYmd(props.date).date);
/** 1日ぶんの進行度(0〜1) */
const dayProgress = ref(0);

const uid = (useId() ?? 'ab').replace(/[^a-zA-Z0-9_-]/g, '') || 'ab';
const headerGradId = `calendar-header-${uid}`;
const sheetGradId = `calendar-sheet-${uid}`;
const shadeGradId = `calendar-shade-${uid}`;

/** 綴じリングのx座標(2個) */
const ringXs = [55, 105];

/** リング根元の破れた紙の跡(ギザギザの小片) */
const tornPaper = (x: number): string =>
  `M ${x - 5} 42 l1.5 -3 l2 2 l1.5 -3.5 l2 3 l1.5 -2.5 l1.5 4 Z`;

/** ミニ月間グリッド(6列×4行、右上に配置。先頭2/末尾3を空白) */
const M_COLS = 6;
const M_ROWS = 4;
const M_LEFT = 100;
const M_TOP = 44;
const M_STEP_X = 4.6;
const M_STEP_Y = 5.4;
const SKIP_HEAD = 2;
const SKIP_TAIL = 3;
const miniCells = Array.from({ length: M_COLS * M_ROWS }, (_, i) => i)
  .filter((i) => i >= SKIP_HEAD && i < M_COLS * M_ROWS - SKIP_TAIL)
  .map((i) => ({
    x: M_LEFT + M_STEP_X * (i % M_COLS),
    y: M_TOP + M_STEP_Y * Math.floor(i / M_COLS)
  }));

/**
 * 月ラベルの字形。高さ19の枠に左上原点で描く。
 * フォントに頼らないのは、利用側の環境で字形が変わるのを避けるため
 */
const LETTER_GLYPHS: Record<string, GlyphShape> = {
  A: { d: 'M0 19 L5.5 0 L11 19 M2.3 12 H8.7', w: 11 },
  B: { d: 'M0 0 v19 m0 -19 h6 a4.5 4.5 0 0 1 0 9 h-6 m6 0 a5 5 0 0 1 0 10 h-6', w: 11 },
  C: { d: 'M8.3 1.3 A5.5 9.5 0 1 0 8.3 17.7', w: 11 },
  D: { d: 'M0 19 V0 h4 a6.5 9.5 0 0 1 0 19 H0', w: 10.5 },
  E: { d: 'M10 0 H0 v19 h10 M0 9.5 H8', w: 10 },
  F: { d: 'M0 19 V0 h11 M0 9 H8', w: 11 },
  G: { d: 'M9 2 A5.5 9.5 0 1 0 9 17 V10 H5.5', w: 11 },
  J: { d: 'M9 0 V12 a4.5 5.5 0 0 1 -9 0', w: 9 },
  L: { d: 'M0 0 v19 h9', w: 9 },
  M: { d: 'M0 19 V0 L5.5 10 L11 0 V19', w: 11 },
  N: { d: 'M0 19 V0 l11 19 V0', w: 11 },
  O: { d: 'M0 9.5 a5.5 9.5 0 1 0 11 0 a5.5 9.5 0 1 0 -11 0', w: 11 },
  P: { d: 'M0 19 V0 h5 a5 5 0 0 1 0 10 H0', w: 10 },
  R: { d: 'M0 19 V0 h5 a5 5 0 0 1 0 10 H0 m5 0 l6 9', w: 11 },
  S: { d: 'M10.5 3.5 C10.5 0.5 0.5 0 0.5 5 C0.5 9.5 10.5 9.5 10.5 14 C10.5 19 0.5 18.5 0.5 15.5', w: 11 },
  T: { d: 'M0 0 h11 M5.5 0 v19', w: 11 },
  U: { d: 'M0 0 v13 a5.5 6 0 0 0 11 0 V0', w: 11 },
  V: { d: 'M0 0 l5.5 19 L11 0', w: 11 },
  Y: { d: 'M0 0 l5.5 9.5 L11 0 M5.5 9.5 V19', w: 11 }
};

/** 日付数字の字形。高さ41の枠に左上原点で描く。桁の揃いを保つため字送り幅は共通 */
const DIGIT_W = 21;
const DIGIT_GLYPHS: Record<string, GlyphShape> = {
  0: { d: 'M0 20.5 a10.5 20.5 0 1 0 21 0 a10.5 20.5 0 1 0 -21 0', w: DIGIT_W },
  1: { d: 'M7 8 L14.5 0 V41', w: DIGIT_W },
  2: { d: 'M0 9 a10 9 0 0 1 20 0 c0 7 -16 14 -20 32 h21', w: DIGIT_W },
  3: { d: 'M1 7 C3 0 20 0 20 9.5 C20 16 12 19.5 8 20.5 C13 21 21 24 21 31 C21 40 3 42 0.5 34', w: DIGIT_W },
  4: { d: 'M15 41 V0 L0 28 H21', w: DIGIT_W },
  5: { d: 'M19 0 H3.5 L2 16 C10 11 21 15 21 26 C21 36 9 41 1 35', w: DIGIT_W },
  6: { d: 'M0 31 a10.5 10 0 1 0 21 0 a10.5 10 0 1 0 -21 0 M0 31 C0 12 8 0 18 2', w: DIGIT_W },
  7: { d: 'M0 0 H21 L7 41', w: DIGIT_W },
  8: { d: 'M1.5 10 a9 10 0 1 0 18 0 a9 10 0 1 0 -18 0 M0 30.5 a10.5 10.5 0 1 0 21 0 a10.5 10.5 0 1 0 -21 0', w: DIGIT_W },
  9: { d: 'M0 10.5 a10.5 10.5 0 1 0 21 0 a10.5 10.5 0 1 0 -21 0 M21 10.5 C21 26 18 34 12 41', w: DIGIT_W }
};

const MONTH_LABELS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** 月ラベルの字間・中心x・上端y */
const LABEL_GAP = 7;
const LABEL_CX = 69;
const LABEL_TOP = 44;
/** 日付数字の字間・中心x・上端y */
const DAY_GAP = 8;
const DAY_CX = 80;
const DAY_TOP = 83;

/** めくりの回転軸(綴じリングの位置) */
const HINGE_Y = 40;
/** めくり終わりの陰の濃さ */
const SHADE_MAX = 0.3;

/** 0〜1を緩急のあるカーブに写す(easeInOutCubic) */
const ease = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** 文字列を字形の並びに直し、cxを中心に置いたときのx座標を付ける */
const layoutGlyphs = (text: string, table: Record<string, GlyphShape>, gap: number, cx: number): Glyph[] => {
  const shapes: GlyphShape[] = [];
  for (const char of text) {
    shapes.push(table[char]);
  }
  const total = shapes.reduce((sum, shape) => sum + shape.w, 0) + gap * (shapes.length - 1);
  const glyphs: Glyph[] = [];
  let x = cx - total / 2;
  for (const shape of shapes) {
    glyphs.push({
      d: shape.d,
      x: Math.round(x * 100) / 100
    });
    x += shape.w + gap;
  }
  return glyphs;
};

/** 紙1枚ぶんの描画データを組み立てる */
const buildPage = (date: CalendarDate, key: string, transform: string | undefined, shade: number): Page => ({
  key,
  transform,
  shade,
  monthGlyphs: layoutGlyphs(MONTH_LABELS[date.month - 1], LETTER_GLYPHS, LABEL_GAP, LABEL_CX),
  dayGlyphs: layoutGlyphs(String(date.day), DIGIT_GLYPHS, DAY_GAP, DAY_CX)
});

const resolved = computed((): ResolvedDate => resolveYmd(props.date));

const animating = computed((): boolean => resolved.value.real && 0 < props.duration);

/** 1日のうち、めくりに使う割合 */
const flipRatio = computed((): number => Math.min(1, props.flipSeconds / props.duration));

/** 紙の畳まれ具合。1で平ら、0で軸まで畳まれて見えなくなる */
const foldScale = computed((): number => {
  const ratio = flipRatio.value;
  const flipStart = 1 - ratio;
  if (!animating.value || dayProgress.value < flipStart) {
    return 1;
  }
  return 1 - ease(Math.min(1, (dayProgress.value - flipStart) / ratio));
});

const pages = computed((): Page[] => {
  const fold = foldScale.value;
  const transform = fold < 1
    ? `translate(0 ${HINGE_Y}) scale(1 ${fold.toFixed(4)}) translate(0 ${-HINGE_Y})`
    : undefined;
  const current = buildPage(currentDate.value, 'current', transform, (1 - fold) * SHADE_MAX);
  if (!animating.value) {
    return [current];
  }
  return [buildPage(nextDay(currentDate.value), 'next', undefined, 0), current];
});

const sizeStyle = computed((): string => toCssSize(props.size));

let rafId = 0;
let startTs = 0;

const tick = (ts: number): void => {
  if (startTs === 0) {
    startTs = ts;
  }
  const dayMs = props.duration * 1000;
  if (dayMs <= ts - startTs) {
    currentDate.value = nextDay(currentDate.value);
    // タブが非表示の間はrequestAnimationFrameが止まり、復帰時に大きく飛ぶ。
    // 見えていない日送りを追いかけても意味がないので、その場合は時間の基準を引き直す
    startTs = 2 * dayMs <= ts - startTs ? ts : startTs + dayMs;
  }
  dayProgress.value = (ts - startTs) / dayMs;
  rafId = requestAnimationFrame(tick);
};

const stop = (): void => {
  if (rafId !== 0) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
};

/** requestAnimationFrameはブラウザにしか無いため、開始はonMounted以降に限る */
const restart = (): void => {
  stop();
  startTs = 0;
  currentDate.value = resolved.value.date;
  dayProgress.value = 0;
  if (animating.value) {
    rafId = requestAnimationFrame(tick);
  }
};

onMounted(restart);

onUnmounted(stop);

watch([() => props.date, () => props.duration], restart);
</script>
