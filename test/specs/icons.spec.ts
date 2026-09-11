import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { createSSRApp, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';
import * as icons from '../../lib/index.js';

const entries = Object.entries(icons) as [string, Component][];

describe('exported icons', () => {
  it('exports one component per SFC under src/', () => {
    // 件数を直書きするとアイコン追加のたびに更新が要るため、src/を数えて突き合わせる
    const sfcCount = readdirSync(join(import.meta.dirname, '../../src')).filter((name) => name.endsWith('.vue')).length;
    expect(entries.length).toBe(sfcCount);
  });

  describe.each(entries)('%s', (_name, component) => {
    it('renders without error and has a viewBox', async () => {
      const html = await renderToString(createSSRApp(component));
      expect(html).toMatch(/^<svg /);
      expect(html).toContain('viewBox=');
    });
  });
});
