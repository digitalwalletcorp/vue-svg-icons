type SvgIcons = typeof import('../icons');

declare module 'vue' {
  interface GlobalComponents extends SvgIcons {}
}

export {};
