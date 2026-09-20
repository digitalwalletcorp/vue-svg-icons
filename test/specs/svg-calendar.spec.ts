import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SvgCalendar from '@/svg-calendar.vue';
import {
  DEFAULT_DATE,
  daysInMonth,
  isLeapYear,
  nextDay,
  parseYmd,
  resolveYmd,
  type CalendarDate
} from '@/internal/calendar-date';

/** 月ラベルはstroke-width=4、日付数字はstroke-width=7のグループに描かれる */
const monthGlyphCount = (html: string): number => (html.match(/stroke-width="4"/g) ?? []).length;

const format = (date: CalendarDate): string =>
  `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

describe('svg-calendar', () => {
  describe('isLeapYear', () => {
    it('judges leap years by the Gregorian rule', () => {
      expect([1900, 2000, 2024, 2026, 2028].map(isLeapYear)).toEqual([false, true, true, false, true]);
    });
  });

  describe('daysInMonth', () => {
    it('returns the number of days for each month', () => {
      expect(daysInMonth(2028, 2)).toBe(29);
      expect(daysInMonth(2026, 2)).toBe(28);
      expect(daysInMonth(2026, 4)).toBe(30);
      expect(daysInMonth(2026, 12)).toBe(31);
    });
  });

  describe('nextDay', () => {
    it.each([
      ['2028-02-28', { year: 2028, month: 2, day: 28 }, '2028-02-29'],
      ['2028-02-29', { year: 2028, month: 2, day: 29 }, '2028-03-01'],
      ['2026-02-28', { year: 2026, month: 2, day: 28 }, '2026-03-01'],
      ['2026-04-30', { year: 2026, month: 4, day: 30 }, '2026-05-01'],
      ['2026-12-31', { year: 2026, month: 12, day: 31 }, '2027-01-01']
    ])('advances %s to the next day', (_label, from, want) => {
      expect(format(nextDay(from))).toBe(want);
    });

    it('keeps matching Date over a long run of days', () => {
      // 繰り上がりの積み重ねでずれないことを、標準のDateを正解として突き合わせる
      let date: CalendarDate = DEFAULT_DATE;
      for (let i = 0; i < 1500; i++) {
        date = nextDay(date);
      }
      const expected = new Date(Date.UTC(DEFAULT_DATE.year, DEFAULT_DATE.month - 1, DEFAULT_DATE.day + 1500));
      expect(format(date)).toBe(expected.toISOString().slice(0, 10));
    });
  });

  describe('parseYmd', () => {
    it.each(['2026022', '202602290', 'yyyyMMdd', '20261301', '20260200', '20260232', ''])(
      'rejects %s as a malformed date',
      (text) => {
        expect(parseYmd(text)).toBeNull();
      }
    );

    it('parses a well-formed date', () => {
      expect(parseYmd('20260229')).toEqual({ year: 2026, month: 2, day: 29 });
    });
  });

  describe('resolveYmd', () => {
    it('falls back to the default date when nothing is given', () => {
      expect(resolveYmd(undefined)).toEqual({ date: DEFAULT_DATE, real: true });
    });

    it('falls back to the default date and blocks animation on a malformed date', () => {
      expect(resolveYmd('nonsense')).toEqual({ date: DEFAULT_DATE, real: false });
    });

    it('keeps a non-existent date as given but blocks animation', () => {
      // 黙って別の日付へ化けるより、指定した値が見えたほうが誤りに気づける
      expect(resolveYmd('20260229')).toEqual({
        date: { year: 2026, month: 2, day: 29 },
        real: false
      });
    });
  });

  describe('SvgCalendar', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    /** めくり中だけ、現在の紙にscaleのtransformが付く */
    const flipping = (wrapper: VueWrapper): boolean => wrapper.find('g[transform*="scale"]').exists();

    it('shows FEB 29 when no date is given', () => {
      const wrapper = mount(SvgCalendar);
      expect(monthGlyphCount(wrapper.html())).toBe(1);
      expect(wrapper.findAll('g[stroke-width="4"] path')).toHaveLength(3);
      expect(wrapper.findAll('g[stroke-width="7"] path')).toHaveLength(2);
    });

    it('shows a single digit for a one-digit day', () => {
      const wrapper = mount(SvgCalendar, { props: { date: '20280301' } });
      expect(wrapper.findAll('g[stroke-width="7"] path')).toHaveLength(1);
    });

    it('draws only one sheet while it is not animating', () => {
      const wrapper = mount(SvgCalendar, { props: { duration: 0 } });
      expect(wrapper.findAll('g[stroke-width="4"]')).toHaveLength(1);
    });

    it('stacks the next sheet underneath once it animates', () => {
      const wrapper = mount(SvgCalendar, { props: { duration: 1 } });
      expect(wrapper.findAll('g[stroke-width="4"]')).toHaveLength(2);
    });

    it('does not animate a date that does not exist in that year', () => {
      const wrapper = mount(SvgCalendar, { props: { date: '20260229', duration: 1 } });
      expect(wrapper.findAll('g[stroke-width="4"]')).toHaveLength(1);
    });

    it('advances the day after one duration has passed', async () => {
      vi.useFakeTimers();
      const wrapper = mount(SvgCalendar, { props: { date: '20280228', duration: 1 } });
      // アニメ中は「翌日の紙」「現在の紙」の2枚が重なる。紙はpagesの順(翌日→現在)に描かれるため、
      // 日送りの判定に使う現在の紙はg[stroke-width="7"]の末尾になる
      const frontDayGlyphCount = (): number => {
        const sheets = wrapper.findAll('g[stroke-width="7"]');
        return sheets[sheets.length - 1].findAll('path').length;
      };
      expect(frontDayGlyphCount()).toBe(2);

      // 2/28 -> 2/29 は桁数が変わらないので、2/29 -> 3/1 まで進めて1桁になることで判定する
      await vi.advanceTimersByTimeAsync(2100);
      await wrapper.vm.$nextTick();
      expect(frontDayGlyphCount()).toBe(1);
    });

    it('keeps the flip length when a day takes longer', async () => {
      vi.useFakeTimers();
      // 1日が4秒でも、めくりに使うのは末尾の0.5秒だけ
      const wrapper = mount(SvgCalendar, { props: { date: '20280228', duration: 4, flipSeconds: 0.5 } });
      await vi.advanceTimersByTimeAsync(3400);
      await wrapper.vm.$nextTick();
      expect(flipping(wrapper)).toBe(false);

      await vi.advanceTimersByTimeAsync(200);
      await wrapper.vm.$nextTick();
      expect(flipping(wrapper)).toBe(true);
    });

    it('starts the flip earlier when flipSeconds is longer', async () => {
      vi.useFakeTimers();
      // 同じ1日4秒でも、めくりに2秒使うなら2秒経過した時点で始まる
      const wrapper = mount(SvgCalendar, { props: { date: '20280228', duration: 4, flipSeconds: 2 } });
      await vi.advanceTimersByTimeAsync(1800);
      await wrapper.vm.$nextTick();
      expect(flipping(wrapper)).toBe(false);

      await vi.advanceTimersByTimeAsync(400);
      await wrapper.vm.$nextTick();
      expect(flipping(wrapper)).toBe(true);
    });

    it('spends the whole day flipping when a day is shorter than flipSeconds', async () => {
      vi.useFakeTimers();
      // めくりが1日に収まらないので、これ以上は速くできない
      const wrapper = mount(SvgCalendar, { props: { date: '20280228', duration: 0.5, flipSeconds: 2 } });
      await vi.advanceTimersByTimeAsync(100);
      await wrapper.vm.$nextTick();
      expect(flipping(wrapper)).toBe(true);
    });
  });
});
