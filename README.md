# portfolio.daitasu.work

daitasu のポートフォリオサイトと、登壇スライドを管理する monorepo。

- ポートフォリオ: [Astro](https://astro.build)。`/`（プロフィール）、`/resume/`（職歴）、`/talks/`（登壇一覧と詳細ページ）
- 登壇スライド: [Slidev](https://sli.dev)。詳細ページから iframe で埋め込む

## 使い方

タスクランナーに [just](https://github.com/casey/just) を利用。未インストールなら `brew install just`。

パッケージマネージャは pnpm（バージョンは `package.json` の `packageManager` を参照）。Node.js 25 以降は corepack が同梱されないため、`npm install -g pnpm@10.12.1` などで別途入れる。asdf で Node.js を管理している場合は、入れたあとに `asdf reshim nodejs` を実行する。

```bash
pnpm install

# レシピ一覧を表示
just

# トーク一覧を表示
just list

# スライドの開発サーバー起動（引数なしで対話式、SLUG 指定で直起動）
just dev
just dev 0708_nihonbashijs

# ポートフォリオの開発サーバー起動
just dev-portfolio

# 全体をビルドしてローカル配信（SKIP_OG=1 で表紙 OGP 画像の生成を省略）
just build
just start

# PDF エクスポート（引数なしで対話式、SLUG 指定で直エクスポート）
just pdf
just pdf 0708_nihonbashijs

# テストと型チェック
just test
just check
```

`just dev-portfolio` の詳細ページに埋め込まれるスライドは、`just build` で `apps/portfolio/public/slides/` に出力したもの。
スライドを直したら `just build` をやり直す。
一覧の OGP サムネイルは開発サーバーの起動時に読み込むため、`just build` をやり直したら `just dev-portfolio` も再起動する。

## 構成

```
apps/
├── portfolio/          # Astro。一覧・詳細ページ・プロフィール・職歴
│   └── src/
│       ├── content.config.ts  # README / resume.md と登壇データの取得
│       ├── lib/nav.ts         # サイドナビの項目
│       └── pages/
└── talks/              # Slidev
    ├── talks.config.ts # 一覧に並べる登壇（slidev / SpeakerDeck）の master リスト
    ├── themes/daitasu/ # 共通テーマ
    ├── scripts/        # ヘルパースクリプト
    └── 2026/<dir>/slides.md
packages/
└── shared/             # 登壇データの型、デッキ探索、URL 規約
```

URL は次のとおり。

| パス | 中身 |
| --- | --- |
| `/talks/<year>/<dir>/` | 詳細ページ（Astro） |
| `/slides/<year>/<dir>/` | スライド本体（Slidev。詳細ページの iframe の中身） |

プロフィール（`/`）と職歴（`/resume/`）は `apps/portfolio/src/content/profile/` の `readme.md` / `resume.md` に書く。
GitHub プロフィールの [daitasu/daitasu](https://github.com/daitasu/daitasu) とは独立していて、同期しない。

## 新しいトークを追加する

```bash
# 雛形作成 → そのまま dev サーバーを起動
just new my-talk "タイトル" 2026-07-01 "イベント名"

# 雛形のみ作成
just scaffold my-talk "タイトル" 2026-07-01 "イベント名"

# 年を指定する場合は最後に渡す（デフォルトは 2026）
just new my-talk "タイトル" 2027-01-01 "イベント名" 2027
```

`apps/talks/<year>/<slug>/slides.md` が以下の frontmatter で生成され、`apps/talks/talks.config.ts` に draft として登録される。
`eventUrl` にイベントページの URL を書くと、詳細ページのイベント名がリンクになる。

```yaml
---
theme: ../../themes/daitasu
colorSchema: light
title: "タイトル"
talk:
  date: "2026-07-01"
  event: "イベント名"
  eventUrl: ""
layout: cover
---
```

> [!WARNING]
> frontmatter は YAML なので、半角スペースに続く `#` 以降はコメントとして捨てられる。
> `#` を含む値（例: `多摩.dev #3`）は必ず引用符で囲む。

draft は詳細ページとスライドだけがビルドされ、一覧と sitemap には出ない（詳細ページは noindex）。
公開するときは、`talks.config.ts` の該当エントリから `status: "draft"` を消す。
`talks.config.ts` に無いデッキはビルドされない。

SpeakerDeck の登壇は `kind: "speakerdeck"` で `slug`（詳細ページの URL）、`url`、`date` を書く。
タイトルと表紙画像、埋め込みプレイヤーはビルド時に SpeakerDeck から取得する。

## デプロイ

main への push で `.github/workflows/deploy.yml` が Cloudflare Pages にデプロイする。
仕組みの詳細は [apps/talks/docs/cloudflare-pages-deploy.md](apps/talks/docs/cloudflare-pages-deploy.md)、
talks.daitasu.work からの移行手順は [docs/migration.md](docs/migration.md) を参照。
