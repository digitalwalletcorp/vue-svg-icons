import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit';
import * as icons from './icons';

/**
 * アイコンをNuxtのコンポーネント自動importへ登録するモジュール。
 * グローバル登録(registerIcons)と違い、テンプレートで使ったアイコンだけがバンドルされ、
 * 型は Nuxt が .nuxt/components.d.ts へ生成するため、利用側に型定義は要らない。
 *
 * 名前の一覧を得るためだけに ./icons をimportしている。
 * このモジュールはビルド時にNuxtが読み込むもので、アプリの実行時バンドルには入らない
 */
export default defineNuxtModule({
  meta: {
    name: '@digitalwalletcorp/vue-svg-icons',
    configKey: 'vueSvgIcons'
  },
  setup() {
    const resolver = createResolver(import.meta.url);
    for (const name of Object.keys(icons)) {
      addComponent({ name, export: name, filePath: resolver.resolve('./index') });
    }
  }
});
