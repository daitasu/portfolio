// Astro は build のたびに outDir を空にするので、public/ に置いて dist/ へコピーさせる（dev でも配信される）。
// apps/portfolio は og.png の有無を見てサムネイルを決めるので、このビルドを先に走らせる。

import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { findDecks, type Deck } from "@daitasu/shared/decks";
import { SITE_URL, toSlidesPath, toTalkPath } from "@daitasu/shared/talks";
import { talks } from "../talks.config.ts";

const TALKS_DIR = join(fileURLToPath(import.meta.url), "../..");
const REPO_ROOT = join(TALKS_DIR, "../..");
const SLIDES_DIST = join(REPO_ROOT, "apps", "portfolio", "public", "slides");
const OG_TMP = join(TALKS_DIR, ".og-tmp");
// ローカルでも本番と同じ成果物にするため、既定で OGP を生成する。headless ブラウザが必要。省略は SKIP_OG=1。
const GEN_OG = !process.env.SKIP_OG;
// og.png（1960x1104）は一覧カードには大きすぎるので、カード幅（最大 380px 前後）の 2 倍の縮小版を別に吐く。
// ファイル名は apps/portfolio/src/lib/talks.ts の THUMBNAIL_NAME と合わせる。
const THUMBNAIL_NAME = "thumb.webp";
const THUMBNAIL_WIDTH = 800;
const THUMBNAIL_QUALITY = 80;

const esc = (s: string): string =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

const outDirOf = (deck: Deck): string => join(SLIDES_DIST, deck.slug);

// hash router: 静的配信で SPA fallback 設定が不要。
// --base 由来のナビゲーションバグはテーマ側で補正し、画像などの asset はテーマの $public() で base を前置して解決する。
const buildDeck = (deck: Deck): void => {
  execFileSync(
    "npx",
    ["slidev", "build", deck.slidesPath, "--base", toSlidesPath(deck.slug), "--router-mode", "hash", "--out", outDirOf(deck)],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
};

// slidev export は --output のディレクトリを丸ごとクリーンするので、必ず一時ディレクトリに吐いてから og.png だけコピーする。
const exportCover = (deck: Deck): void => {
  const tmp = join(OG_TMP, deck.slug);
  rmSync(tmp, { recursive: true, force: true });
  // --wait-until load: 既定の networkidle は常時アニメの deck で発火せず固まるため。
  execFileSync(
    "npx",
    ["slidev", "export", deck.slidesPath, "--format", "png", "--range", "1",
      "--wait-until", "load", "--wait", "800", "--timeout", "60000", "--output", tmp],
    { stdio: "inherit", cwd: TALKS_DIR },
  );
  copyFileSync(join(tmp, "1.png"), join(outDirOf(deck), "og.png")); // png export は "<n>.png" で吐く
};

const writeThumbnail = async (deck: Deck): Promise<void> => {
  await sharp(join(outDirOf(deck), "og.png"))
    .resize({ width: THUMBNAIL_WIDTH })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toFile(join(outDirOf(deck), THUMBNAIL_NAME));
};

// デッキ単体の URL は詳細ページの埋め込み元なので、canonical を詳細ページに向けて検索エンジンの評価をそちらへ寄せる。
// Slidev は lang="en" 固定で吐き、title に " - Slidev" を付けるので直す。
// Web フォントの CSS は Google Fonts から読むので、フォント本体の配信元へ先に接続しておく。
const injectHead = (deck: Deck): void => {
  const htmlPath = join(outDirOf(deck), "index.html");
  const html = readFileSync(htmlPath, "utf-8")
    .replace('<html lang="en">', '<html lang="ja">')
    .replace(/(<(?:title|meta property="og:title" content=")[^<]*?)\s*-\s*Slidev/g, "$1")
    .replace("<head>", '<head>\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>')
    .replace("</head>", `<link rel="canonical" href="${esc(SITE_URL + toTalkPath(deck.slug))}">\n</head>`);
  writeFileSync(htmlPath, html);
};

const processDeck = async (deck: Deck): Promise<void> => {
  console.log(`\n▸ ${toSlidesPath(deck.slug)}  —  ${deck.title}`);
  buildDeck(deck);
  if (GEN_OG) {
    try {
      exportCover(deck);
      await writeThumbnail(deck);
      console.log("  + OGP image and thumbnail generated");
    } catch (e) {
      console.warn(`  ! OGP image 生成に失敗（一覧はプレースホルダ表示になる）: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  injectHead(deck);
};

// 詳細ページは talks.config.ts のエントリからしか作られないので、載っていないデッキをビルドすると
// canonical が 404 を指す。config に足し忘れたデッキは警告して飛ばす。
const configuredSlugs = new Set(talks.filter((talk) => talk.kind === "slidev").map((talk) => talk.slug));
const allDecks = findDecks(TALKS_DIR);
allDecks
  .filter((deck) => !configuredSlugs.has(deck.slug))
  .forEach((deck) => console.warn(`! talks.config.ts に無いのでスキップ: ${deck.slug}`));
const decks = allDecks.filter((deck) => configuredSlugs.has(deck.slug));
rmSync(SLIDES_DIST, { recursive: true, force: true });
mkdirSync(SLIDES_DIST, { recursive: true });
// slidev build / export は重いので 1 デッキずつ順に回す
for (const deck of decks) {
  await processDeck(deck);
}
rmSync(OG_TMP, { recursive: true, force: true });

console.log(`\n✓ Built ${decks.length} deck(s) → ${relative(REPO_ROOT, SLIDES_DIST)}/`);
