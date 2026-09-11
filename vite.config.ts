import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const SRC = fileURLToPath(new URL('./src', import.meta.url));

/**
 * アイコンを1つずつエントリにする。
 * 1ファイルにまとめると、1つimportしただけで全アイコンがバンドルされてしまう。
 */
const entries: Record<string, string> = { index: 'src/index.ts' };
for (const fileName of readdirSync(SRC).filter((name) => name.endsWith('.vue')).sort()) {
  entries[fileName.replace(/\.vue$/, '')] = `src/${fileName}`;
}

export default defineConfig({
  plugins: [
    vue(),
    // 型定義は`.vue`から起こす。`defineProps<Props>()`のリテラル型とJSDocを保つため
    dts({
      include: ['src'],
      outDirs: ['lib'],
      // 出力側は`.vue`を落とした名前なので、型定義のファイル名と参照も合わせる
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace(/\.vue\.d\.ts$/, '.d.ts'),
        content: content.replace(/(from\s+['"][^'"]+)\.vue(['"])/g, '$1$2')
      })
    })
  ],
  build: {
    outDir: 'lib',
    // 出力する構文を固定する。バンドラの既定値に引きずられないように
    target: 'es2022',
    emptyOutDir: true,
    lib: { entry: entries },
    rollupOptions: {
      external: ['vue'],
      output: [
        { format: 'es', entryFileNames: '[name].js' },
        { format: 'cjs', entryFileNames: '[name].cjs', exports: 'named' }
      ]
    }
  }
});
