// eslint-disable-next-line spaced-comment
/// <reference types='vitest' />
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), vue()],
  test: {
    // このプロジェクトはvueコンポーネントを含むため、テスト環境はDOM(happy-dom)にする
    environment: 'happy-dom',
    include: [
      'test/specs/**/*.spec.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: [
        'lcov',
        'text-summary'
      ],
      reportsDirectory: 'test/coverage',
      include: [
        'src/**'
      ]
    }
  }
});
