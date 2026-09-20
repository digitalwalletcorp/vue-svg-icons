import type { App } from 'vue';
import * as icons from '@/icons';

type SvgIcons = typeof icons;

declare module 'vue' {
  interface GlobalComponents extends SvgIcons {}
}

export function registerIcons(app: App) {
  for (const [name, component] of Object.entries(icons)) {
    app.component(name, component);
  }
}
