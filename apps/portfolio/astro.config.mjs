import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL, toTalkPath } from "@daitasu/shared/talks";
import { talks } from "talks/config";

// draft の詳細ページは URL 直開き用なので、検索エンジンに渡さない（ページ側でも noindex を出す）
const draftTalkUrls = new Set(
  talks.filter((talk) => talk.kind === "slidev" && talk.status === "draft").map((talk) => `${SITE_URL}${toTalkPath(talk.slug)}`),
);

const PUBLIC_DIR = fileURLToPath(new URL("./public/", import.meta.url));
const SLIDES_PATH_PREFIX = "/slides/";

/**
 * 本番（Cloudflare Pages）は /slides/<slug>/ に対して index.html を返すが、astro dev は public 配下の
 * ディレクトリ index を返さず 404 ページを出す。詳細ページの iframe にサイト全体が映らないよう、開発時だけ書き換える。
 */
const serveSlidesIndex = () => ({
  name: "serve-slides-index",
  configureServer: (server) => {
    server.middlewares.use((req, _res, next) => {
      const [pathname, query] = (req.url ?? "").split("?");
      if (pathname.startsWith(SLIDES_PATH_PREFIX) && pathname.endsWith("/") && existsSync(join(PUBLIC_DIR, pathname, "index.html"))) {
        req.url = `${pathname}index.html${query === undefined ? "" : `?${query}`}`;
      }
      next();
    });
  },
});

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  // CSS は全ページ共通で 6KB 程度なので、外部ファイルの往復を待たずに描画できるよう HTML に埋め込む
  build: { inlineStylesheets: "always" },
  // ホバー / フォーカスした時点で遷移先の HTML を取りに行き、ページ遷移の待ちを減らす
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [sitemap({ filter: (page) => !draftTalkUrls.has(page) })],
  vite: { plugins: [serveSlidesIndex()] },
});
