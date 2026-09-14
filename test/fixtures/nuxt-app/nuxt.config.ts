import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

/** 配布するNuxtモジュール(ビルド済みのlib/nuxt.js)を、利用者と同じ経路で読み込む */
export default defineNuxtConfig({
  modules: [fileURLToPath(new URL('../../../lib/nuxt.js', import.meta.url))],
  compatibilityDate: '2025-01-01'
});
