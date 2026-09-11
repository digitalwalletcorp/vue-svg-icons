// eslint-disable-next-line spaced-comment
/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // テスト対象はビルド済みのlib/。配布物そのものを検証する
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
        'lib/**/*.js'
      ]
    }
  }
});
