type SvgIcons = typeof import('./lib/icons');

declare module 'vue' {
  interface GlobalComponents extends SvgIcons {}
}

export {};
