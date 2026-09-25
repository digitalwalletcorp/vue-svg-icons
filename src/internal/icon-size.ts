/**
 * アイコンの高さ(size)を、同梱のstyle.cssが縦位置の計算に使うCSS変数として渡す。
 * style.cssはこの変数からvertical-alignを求め、sizeを変えても周囲の文字の中央に揃える。
 * CSSからはwidth/height属性の値を読めないため、コンポーネント側から変数で渡す。
 */

/** sizeをCSSの長さに変換する(数値はpxとして扱う) */
export function toCssSize(size: number | string): string {
  return typeof size === 'number' ? `${size}px` : size;
}

/** ルートの<svg>に付与するstyle */
export function iconSizeStyle(size: number | string): Record<string, string> {
  return { '--vue-svg-icons-size': toCssSize(size) };
}
