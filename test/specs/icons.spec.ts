import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import type { Component } from 'vue';
import * as icons from '@/index';

const entries = Object.entries(icons) as [string, Component][];

describe('exported icons', () => {
  it('exports one component per SFC under src/', () => {
    // 件数を直書きするとアイコン追加のたびに更新が要るため、src/を数えて突き合わせる
    const sfcCount = readdirSync(join(import.meta.dirname, '../../src')).filter((name) => name.endsWith('.vue')).length;
    expect(entries.length).toBe(sfcCount);
  });

  describe.each(entries)('%s', (_name, component) => {
    it('renders an svg with a viewBox', () => {
      const html = mount(component).html();
      expect(html).toMatch(/^<svg/);
      expect(html).toContain('viewBox=');
    });

    it('has the inline class so that style.css can align it with the surrounding text', () => {
      const wrapper = mount(component, { attrs: { class: 'extra' } });
      expect(wrapper.classes()).toEqual(expect.arrayContaining(['svg-inline--vue-svg-icons', 'extra']));
    });

    it('is decorative when no title is given', () => {
      const html = mount(component).html();
      expect(html).toContain('aria-hidden="true"');
      expect(html).not.toContain('role="img"');
      expect(html).not.toMatch(/<title>/);
    });

    it('exposes the title as an accessible name when given', () => {
      const html = mount(component, { props: { title: 'Accessible name' } }).html();
      expect(html).toContain('role="img"');
      expect(html).toContain('<title>Accessible name</title>');
      expect(html).not.toContain('aria-hidden');
    });
  });
});
