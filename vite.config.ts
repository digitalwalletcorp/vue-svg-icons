import { copyFileSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const SRC = fileURLToPath(new URL('./src', import.meta.url));

/**
 * アイコンを1つずつエントリにする。
 * 1ファイルにまとめると、1つimportしただけで全アイコンがバンドルされてしまう。
 */
const entries: Record<string, string> = {
  index: 'src/index.ts',
  nuxt: 'src/nuxt.ts',
  register: 'src/register.ts'
};
for (const fileName of readdirSync(SRC).filter((name) => name.endsWith('.vue')).sort()) {
  entries[fileName.replace(/\.vue$/, '')] = `src/${fileName}`;
}

/**
 * グローバル型定義とスタイルシートをlibに出力する。
 * グローバル型定義はsrc/types/からlib/直下へ置き場所が変わるため、相対参照を付け替える
 */
const copyStaticFiles = {
  name: 'copy-static-files',
  writeBundle() {
    const source = readFileSync('src/types/global.d.ts', 'utf8');
    const output = source.replace(`import('../icons')`, `import('./icons')`);
    // 付け替え漏れは利用側で型が壊れるだけで気づきにくいため、ビルドを止める
    if (output === source) {
      throw new Error(`src/types/global.d.ts: import('../icons') not found`);
    }
    writeFileSync('lib/global.d.ts', output);
    // 利用側がnuxt.configのcssやimportで明示的に読み込む(読み込まなければ従来どおりの表示)
    copyFileSync(
      'src/style.css',
      'lib/style.css'
    );
  }
};

export default defineConfig({
  // tsconfigのpathsはビルドに効かないため、同じ対応をここでも与える
  resolve: {
    alias: { '@': SRC }
  },
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
    }),
    copyStaticFiles
  ],
  build: {
    outDir: 'lib',
    // 出力する構文を固定する。バンドラの既定値に引きずられないように
    target: 'es2022',
    emptyOutDir: true,
    lib: { entry: entries },
    rollupOptions: {
      external: [
        'vue',
        '@nuxt/kit'
      ],
      output: [
        { format: 'es', entryFileNames: '[name].js' },
        { format: 'cjs', entryFileNames: '[name].cjs', exports: 'named' }
      ]
    }
  }
});
