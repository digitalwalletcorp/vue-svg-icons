/**
 * SFC(.vue)をレンダー関数のTypeScriptへコンパイルし、tscでCJS/ESMの2系統を出力する。
 *
 * viteを使わない理由:
 *   - 配布物に必要なのはSFCのコンパイルだけで、バンドルもCSSも不要
 *   - @vue/compiler-sfc と tsc だけなら純JS依存で完結し、ネイティブバイナリを持ち込まない
 *
 * 型定義だけは vue-tsc に `.vue` を直接読ませる。
 * tscが読むのはコンパイル後のランタイムprops定義で、その時点で
 * `defineProps<Props>()` のリテラル型とJSDocが失われているため。
 *
 * 出力:
 *   lib/**            CommonJS + 型定義 (main/types。jestもこちらを読む)
 *   lib/esm/**        ESM (バンドラがtree-shakingできるようにするため)
 *   docs/catalog.svg  READMEに貼るアイコン一覧の画像
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, compileScript } from '@vue/compiler-sfc';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const BUILD = join(ROOT, '.build');
const DTS = join(ROOT, '.dts');
const LIB = join(ROOT, 'lib');

rmSync(BUILD, { recursive: true, force: true });
mkdirSync(BUILD, { recursive: true });

/** SFCをレンダー関数を内包したTypeScriptへ変換する */
const compileSfc = (fileName) => {
  const filePath = join(SRC, fileName);
  const source = readFileSync(filePath, 'utf8');
  const { descriptor, errors } = parse(source, { filename: fileName });
  if (errors.length > 0) {
    throw new Error(`${fileName}: ${errors.map((e) => e.message).join(', ')}`);
  }
  if (descriptor.styles.length > 0) {
    // スタイルを出力する仕組みを持たないため、rootへのインラインstyleで表現する運用にしている
    throw new Error(`${fileName}: <style>ブロックは未対応。rootのstyle属性へインライン化すること`);
  }
  const compiled = compileScript(descriptor, {
    id: fileName.replace(/\.vue$/, ''),
    inlineTemplate: true
  });
  return compiled.content;
};

/** ディレクトリ配下のファイルを、baseからの相対パス(区切りは/)で再帰的に集める */
const collectFiles = (base, filter, dir = '') => readdirSync(join(base, dir), { withFileTypes: true })
  .flatMap((entry) => {
    const relPath = dir === '' ? entry.name : `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      return collectFiles(base, filter, relPath);
    }
    return filter(entry.name) ? [relPath] : [];
  })
  .sort();

/**
 * import文をビルド後の配置に合わせて書き換える。
 * - tscは`@/`エイリアスを出力JSに残してしまうため、ここで相対パスへ変換する
 * - `.vue`はコンパイル後には存在しないので拡張子を落とす
 */
const rewriteImports = (code, outRelPath) => {
  const dir = posix.dirname(outRelPath);
  return code
    .replace(/(from\s+['"])@\/([^'"]+)(['"])/g, (_, head, target, tail) => {
      const relative = posix.relative(dir === '.' ? '' : dir, target);
      return `${head}${relative.startsWith('.') ? relative : `./${relative}`}${tail}`;
    })
    .replace(/(from\s+['"][^'"]+)\.vue(['"])/g, '$1$2');
};

const sourceFiles = collectFiles(SRC, (name) => name.endsWith('.vue') || name.endsWith('.ts'));
let componentCount = 0;

for (const relPath of sourceFiles) {
  const isComponent = relPath.endsWith('.vue');
  const outRelPath = isComponent ? relPath.replace(/\.vue$/, '.ts') : relPath;
  const code = isComponent ? compileSfc(relPath) : readFileSync(join(SRC, relPath), 'utf8');

  mkdirSync(dirname(join(BUILD, outRelPath)), { recursive: true });
  writeFileSync(join(BUILD, outRelPath), rewriteImports(code, outRelPath));
  componentCount += isComponent ? 1 : 0;
}

console.log(`compiled ${componentCount} components (${sourceFiles.length - componentCount} other source files copied)`);

const tsc = join(ROOT, 'node_modules', '.bin', 'tsc');
execFileSync(tsc, ['--project', 'tsconfig.build.json'], { cwd: ROOT, stdio: 'inherit' });
execFileSync(tsc, ['--project', 'tsconfig.build.esm.json'], { cwd: ROOT, stdio: 'inherit' });

// lib/esm を Node からもESMとして解釈させる
writeFileSync(join(LIB, 'esm', 'package.json'), `${JSON.stringify({ type: 'module' }, null, 2)}\n`);

// NodeのESM解決は拡張子を省略できない。tscは相対importを書き換えないので、ここで.jsを補う
for (const relPath of collectFiles(join(LIB, 'esm'), (name) => name.endsWith('.js'))) {
  const filePath = join(LIB, 'esm', relPath);
  const rewritten = readFileSync(filePath, 'utf8').replace(/(from '\.{1,2}\/[^']+?)(\.js)?'/g, "$1.js'");
  writeFileSync(filePath, rewritten);
}

// 型定義を .vue から生成する。出力名は `<name>.vue.d.ts` になるのでJSの名前に合わせる
rmSync(DTS, { recursive: true, force: true });
const vueTsc = join(ROOT, 'node_modules', '.bin', 'vue-tsc');
execFileSync(vueTsc, ['--project', 'tsconfig.dts.json'], { cwd: ROOT, stdio: 'inherit' });

for (const relPath of collectFiles(DTS, (name) => name.endsWith('.d.ts'))) {
  const outRelPath = relPath.replace(/\.vue\.d\.ts$/, '.d.ts');
  const declaration = rewriteImports(readFileSync(join(DTS, relPath), 'utf8'), outRelPath);
  mkdirSync(dirname(join(LIB, outRelPath)), { recursive: true });
  writeFileSync(join(LIB, outRelPath), declaration);
}

// READMEのアイコン一覧を作り直す。ブラウザを使わずSSRの出力をそのまま1枚のSVGへ並べる
const require_ = createRequire(join(ROOT, 'package.json'));
const { createSSRApp } = require_('vue');
const { renderToString } = require_('@vue/server-renderer');
const icons = require_(join(LIB, 'index.js'));

const COLS = 6;
const CELL_W = 190;
const CELL_H = 150;
const ICON_BOX = 76;
const LABEL_MAX = 21;

/**
 * id参照を名前空間化する。
 * アイコンごとに別のVueアプリで描くためuseId()のカウンタが振り直され、
 * 1枚のSVGにまとめると異なるアイコンのid同士が衝突する。
 */
const namespaceIds = (svg, prefix) => svg
  .replace(/id="([^"]+)"/g, (_, id) => `id="${prefix}-${id}"`)
  .replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${prefix}-${id})`)
  .replace(/\b(xlink:href|href)="#([^"]+)"/g, (_, attr, id) => `${attr}="#${prefix}-${id}"`);

/** ルートの<svg>をセル内へ配置し直す。viewBoxは残すので拡縮はブラウザに任せる */
const placeSvg = (svg, x, y) => svg.replace(/^<svg([^>]*)>/, (_, attrs) => {
  const kept = attrs
    .replace(/\s(width|height|style)="[^"]*"/g, '')
    .trim();
  return `<svg ${kept} x="${x}" y="${y}" width="${ICON_BOX}" height="${ICON_BOX}" preserveAspectRatio="xMidYMid meet">`;
});

/** PascalCaseの名前を単語で折り返す */
const wrapLabel = (name) => {
  const lines = [''];
  for (const word of name.match(/[A-Z][a-z0-9]*/g) ?? [name]) {
    if (lines[lines.length - 1].length + word.length > LABEL_MAX && lines[lines.length - 1] !== '') {
      lines.push(word);
    } else {
      lines[lines.length - 1] += word;
    }
  }
  return lines;
};

const names = Object.keys(icons);
const rows = Math.ceil(names.length / COLS);
const width = COLS * CELL_W;
const height = rows * CELL_H;
const cells = [];

for (const [index, name] of names.entries()) {
  const col = index % COLS;
  const row = Math.floor(index / COLS);
  const cellX = col * CELL_W;
  const cellY = row * CELL_H;

  const rendered = await renderToString(createSSRApp(icons[name]));
  const icon = placeSvg(namespaceIds(rendered, `i${index}`), cellX + (CELL_W - ICON_BOX) / 2, cellY + 22);

  const label = wrapLabel(name)
    .map((line, i) => `<text x="${cellX + CELL_W / 2}" y="${cellY + 118 + i * 13}" class="label">${line}</text>`)
    .join('');

  cells.push(`<g><rect x="${cellX + 6}" y="${cellY + 6}" width="${CELL_W - 12}" height="${CELL_H - 12}" rx="8" class="cell"/>${icon}${label}</g>`);
}

// colorを明示する。currentColor既定のアイコンは、これが無いと埋め込み先の文字色に左右される
const catalog = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="color:#333c47">
<style>
  .bg { fill: #f4f5f7; }
  .cell { fill: #ffffff; stroke: #d9dce1; stroke-width: 1; }
  .label { fill: #555c66; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 10px; text-anchor: middle; }
</style>
<rect class="bg" x="0" y="0" width="${width}" height="${height}"/>
${cells.join('\n')}
</svg>
`;

mkdirSync(join(ROOT, 'docs'), { recursive: true });
writeFileSync(join(ROOT, 'docs', 'catalog.svg'), catalog);
console.log(`catalog written: docs/catalog.svg (${names.length} icons)`);

console.log('build done');
