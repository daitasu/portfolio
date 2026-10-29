# talks.daitasu.work から portfolio.daitasu.work への移行手順

このリポジトリのコードは移行後の構成に対応済み。
ここでは、GitHub と Cloudflare で手作業が必要な作業を順に並べる。

## 移行後の URL

| 移行前 | 移行後 |
| --- | --- |
| `talks.daitasu.work/` | `portfolio.daitasu.work/talks/` |
| `talks.daitasu.work/talks/<year>/<dir>/` | `portfolio.daitasu.work/talks/<year>/<dir>/`（詳細ページ） |
| （なし） | `portfolio.daitasu.work/slides/<year>/<dir>/`（スライド本体。詳細ページの iframe の中身） |

旧デッキの URL と新しい詳細ページはパスが同じなので、ドメインを差し替える 301 だけで済む。
`#/12` のようなスライド番号はブラウザがリダイレクト後も保持し、詳細ページが iframe に引き継ぐ。

## 1. Cloudflare Pages にカスタムドメインを足す

マージ後のページは canonical と OGP を `portfolio.daitasu.work` に向ける。
マージより先にドメインを繋いでおかないと、検索エンジンと SNS が解決できない URL を拾う。

1. Workers & Pages → `daitasu-talks` → Custom domains → Set up a custom domain。
2. `portfolio.daitasu.work` を追加する。`daitasu.work` が同じアカウントのゾーンなら DNS レコードは自動で作られる。
3. `talks.daitasu.work` はプロジェクトから外さない。外すと旧 URL が解決できなくなり、手順 3 のリダイレクトが届かない。

この時点では、どちらのドメインでも移行前のサイトが表示される。

## 2. main にマージしてデプロイする

マージすると `.github/workflows/deploy.yml` が Pages プロジェクト `daitasu-talks` にデプロイする。
`talks.daitasu.work` でも新しいサイトが表示されるようになる（トップはプロフィール）。

## 3. talks.daitasu.work を 301 で転送する

Pages の `_redirects` はホスト名で条件分岐できないので、ゾーン側の Redirect Rules を使う。
`daitasu.work` ゾーン → Rules → Redirect Rules で、次の 3 本をこの順に作る。
Redirect Rules は上から評価し、最初に一致したルールで転送する。
ルール 3 は他のすべてに一致するので最後に置く。先に置くと `/` も旧 OGP 画像もルール 3 で転送され、旧トップはプロフィールへ、旧 OGP 画像は 404 へ飛ぶ。

### ルール 1: トップを一覧へ

- 条件（Custom filter expression）:
  ```
  (http.host eq "talks.daitasu.work" and http.request.uri.path eq "/")
  ```
- 転送先: Static、`https://portfolio.daitasu.work/talks/`、ステータス 301。

### ルール 2: 旧 OGP 画像を /slides/ へ

SNS が共有済みカードの画像（`talks.daitasu.work/talks/<year>/<dir>/og.png`）を取り直したときに 404 にしないためのルール。
新しい og.png は `/slides/<year>/<dir>/og.png` にある。

- 条件:
  ```
  (http.request.full_uri wildcard "https://talks.daitasu.work/talks/*/og.png")
  ```
- 転送先: Dynamic、式は `wildcard_replace(http.request.full_uri, "https://talks.daitasu.work/talks/*/og.png", "https://portfolio.daitasu.work/slides/${1}/og.png")`、ステータス 301。
- 正規表現（`matches` / `regex_replace`）は上位プラン限定のため、どのプランでも使える wildcard で書いている。

### ルール 3: それ以外はパスを保ったままドメインだけ差し替え

- 条件:
  ```
  (http.host eq "talks.daitasu.work")
  ```
- 転送先: Dynamic、式は `concat("https://portfolio.daitasu.work", http.request.uri.path)`、ステータス 301、Preserve query string をオン。

確認:

```bash
curl -sI https://talks.daitasu.work/ | grep -i location
# location: https://portfolio.daitasu.work/talks/
curl -sI https://talks.daitasu.work/talks/2026/0708_nihonbashijs/ | grep -i location
# location: https://portfolio.daitasu.work/talks/2026/0708_nihonbashijs/
curl -sI https://talks.daitasu.work/talks/2026/0708_nihonbashijs/og.png | grep -i location
# location: https://portfolio.daitasu.work/slides/2026/0708_nihonbashijs/og.png
```

## 4. GitHub リポジトリをリネームする

`daitasu-talks` → `portfolio`。

```bash
gh repo rename portfolio --repo daitasu/daitasu-talks
git remote set-url origin git@github.com:daitasu/portfolio.git
```

GitHub は旧名からのアクセスをリダイレクトするが、手元の remote は新しい名前に向け直しておく。
リポジトリの About にある Website も `https://portfolio.daitasu.work/` に変える。
Cloudflare Pages のプロジェクト名（`daitasu-talks`）は GitHub のリポジトリ名と無関係なので、変えない。

## 5. 後片付け

- daitasu/daitasu の `README.md` / `resume.md` にある `talks.daitasu.work` へのリンクを `portfolio.daitasu.work/talks/` に書き換える（301 で辿れるが、リダイレクトを挟まない方がよい）。
- プロフィールはこのリポジトリで管理するようになったので、daitasu/daitasu の `.github/workflows/notify-portfolio.yml` と Secret の `PORTFOLIO_DISPATCH_TOKEN` を消し、PAT も失効させる。
- Google Search Console を使っているなら、`portfolio.daitasu.work` を登録して `sitemap-index.xml` を送信し、`talks.daitasu.work` にはアドレス変更ツールを使う。
