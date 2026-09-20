/**
 * svg-calendar.vueの日付計算。
 * うるう年のためだけに外部ライブラリへ依存せず、Dateオブジェクトも使わない。
 * Dateを介するとタイムゾーンで結果が変わり、SSRとクライアントで表示がずれるため。
 */

/** 年月日。yearはアイコンに表示しないが、うるう年の判定に使う */
export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

/** props.dateを解釈した結果 */
export interface ResolvedDate {
  date: CalendarDate;
  /** 指定された日がその年に実在するか。実在しない場合はアニメーションさせない */
  real: boolean;
}

/** date未指定時の日付。2月29をデフォルトにするが、アニメーションとの関連で2028年を固定で付与 */
export const DEFAULT_DATE: CalendarDate = {
  year: 2028,
  month: 2,
  day: 29
};

/** 各月の最終日。2月は暫定で28 */
const MONTH_DAYS: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** グレゴリオ暦のうるう年判定 */
export const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/** その年その月の日数 */
export const daysInMonth = (year: number, month: number): number =>
  month === 2 && isLeapYear(year)
    ? MONTH_DAYS[month - 1] + 1 // うるう年の2月は+1日で29
    : MONTH_DAYS[month - 1]; // その他の場合はMONTH_DAYSどおり

/** その年その月に実在する日かどうか(2026年2月29日、4月31日などを弾く) */
export const isRealDate = (date: CalendarDate): boolean =>
  date.day <= daysInMonth(date.year, date.month);

/** 翌日。月末・年末は繰り上がる */
export const nextDay = (date: CalendarDate): CalendarDate => {
  let year = date.year;
  let month = date.month;
  let day = date.day + 1;
  if (daysInMonth(year, month) < day) {
    day = 1;
    month += 1;
    if (12 < month) {
      month = 1;
      year += 1;
    }
  }
  return {
    year,
    month,
    day
  };
};

/**
 * 'yyyyMMdd'を年月日に分解する。8桁の数字でない、または月日が範囲外ならnull
 * 外部ライブラリを使用しない方針のため、文字列切り出しによる実装にする
 */
export const parseYmd = (text: string): CalendarDate | null => {
  if (!/^\d{8}$/.test(text)) {
    return null;
  }
  const year = Number(text.slice(0, 4));
  const month = Number(text.slice(4, 6));
  const day = Number(text.slice(6, 8));
  if (month < 1 || 12 < month || day < 1 || 31 < day) {
    return null;
  }
  return {
    year,
    month,
    day
  };
};

/**
 * props.dateを表示用の日付に解決する。
 * 未指定は既定日、形式不正は既定日へ戻しつつアニメーション無効、
 * 実在しない日は指定どおり表示しつつアニメーション無効とする。
 */
export const resolveYmd = (text?: string): ResolvedDate => {
  if (text == null) {
    return {
      date: DEFAULT_DATE,
      real: true
    };
  }
  const parsed = parseYmd(text);
  if (parsed == null) {
    return {
      date: DEFAULT_DATE,
      real: false
    };
  }
  return {
    date: parsed,
    real: isRealDate(parsed)
  };
};
