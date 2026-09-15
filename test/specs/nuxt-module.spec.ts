// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import { loadNuxt } from 'nuxt';
import type { Component } from '@nuxt/schema';
import * as icons from '@/index';

const FIXTURE = fileURLToPath(new URL('../fixtures/nuxt-app', import.meta.url));

describe('nuxt module', () => {
  // Nuxtの起動を伴うため、既定のタイムアウトでは足りない
  it('registers every icon as an auto-imported component', async () => {
    const nuxt = await loadNuxt({ cwd: FIXTURE, dev: false });
    try {
      // addComponent()の登録結果は components:extend フックに集まる
      const components: Component[] = [];
      await nuxt.callHook('components:extend', components);

      const registered = components.filter((component) => component.pascalName.startsWith('Svg'));
      expect(registered.map((component) => component.pascalName).sort()).toEqual(Object.keys(icons).sort());
      // 自動importの解決先が、このパッケージのエントリになっていること
      expect(registered[0].filePath).toMatch(/vue-svg-icons[/\\]lib[/\\]index/);
    } finally {
      await nuxt.close();
    }
  }, 120_000);
});
