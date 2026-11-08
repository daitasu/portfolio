---
theme: ../../themes/daitasu
colorSchema: light
title: hoverより先に、確率で。予測型 prefetch、Jevを添えて
description: 2026年10月19日 「Ginza.js#12」における登壇資料です。
talk:
  date: "2026-10-19"
  event: "Ginza.js#12"
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: /daitasaurus-bolt-lord.png
---

# hover より先に、確率で。
<p class="cover-sub">~ 予測型 prefetch、Jev を添えて ~</p>
<div>
  <span class="cover-eyebrow">Ginza.js#12 ・ 2026.10.19</span>
  <span class="cover-by">@daitasu</span>
</div>

<style>
:global(.slidev-layout.cover .dino-img) {
  height: 18rem !important;
  width: 18rem;
  bottom: 1.5rem !important;
  right: 1.5rem !important;
  border-radius: 50%;
  object-fit: cover;
}
.cover-sub { margin-top: 0.5rem; font-size: 1.1rem; color: var(--dt-text-muted); }
</style>

---
layout: intro
---

<div class="flex items-center gap-12">
  <div>
    <img src="https://avatars.githubusercontent.com/u/28728602" class="w-48 h-48 rounded-full" style="box-shadow: 0 18px 44px -18px rgba(30, 64, 128, 0.45); background: #fff;" />
    <div class="mt-3 flex gap-3 items-end justify-center">
      <div class="flex flex-col items-center">
        <p>X</p>
        <img :src="$public('/qrcode_x.com.png')" class="mt-1 rounded-1 h-24" />
      </div>
      <div class="flex flex-col items-center">
        <p>Tachikawa.any</p>
        <img :src="$public('/qrcode_discord.png')" class="mt-1 rounded-1 h-24" />
      </div>
    </div>
  </div>
  <div class="text-xl space-y-1.5">
    <h2 class="!text-2xl">自己紹介</h2>
    <div>
      <p>Name:</p>
      <p class="ml-3">@daitasu</p>
    </div>
    <div>
      <p>Favorite:</p>
      <p class="ml-3">TypeScript, Onsen, Dinosaurs</p>
    </div>
    <div>
      <p>Career:</p>
      <p class="ml-3">SIer(2年)→ Frontend (3年) → EM (4年) → IC</p>
    </div>
    <div>
      <p>Community:</p>
      <a class="ml-3" href="https://tachikawaany.connpass.com/" target="_blank">
        Tachikawa.any
      </a>
      <a class="ml-3" href="https://gotanda--ts.connpass.com/event/402821/" target="_blank">
        五反田.ts
      </a>
    </div>
  </div>
</div>

---

# 投機的読み込み（Speculative loading）とは？

<div class="mt-10 text-xl">

- ユーザーが**次に必要としそうなもの**を予測して、**実際に必要になる前に**接続・取得・描画を進めておくこと
- 当たれば速い。外れれば**帯域とサーバ負荷のムダ**

</div>

<p class="src mt-12">参考: <a href="https://developer.mozilla.org/ja/docs/Web/Performance/Guides/Speculative_loading" target="_blank">MDN 投機的読み込み</a></p>

<style>
.src { font-size: 0.65rem !important; color: var(--dt-text-muted); }
</style>

<!--
ここから 3 枚は 1 枚 10 秒くらいで流す。
-->

---
layout: two-cols
---

# `rel="preconnect"`

::left::

<div class="mt-6 text-lg">

- 別オリジンへの**接続を先に済ませる**
  - DNS + TCP + TLS のハンドシェイク
- 「このオリジンから、そのうち何か取る」と分かっているときに

</div>

::right::

```html
<link rel="preconnect" href="https://example.com" />
```

```http
Link: <https://example.com>; rel="preconnect"
```

<p class="src mt-4">MDN: <a href="https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Attributes/rel/preconnect" target="_blank">rel="preconnect"</a></p>

<style>
.slidev-code, .slidev-code * { font-size: 12px !important; line-height: 1.55 !important; }
.src { font-size: 0.65rem !important; color: var(--dt-text-muted); }
</style>

---
layout: two-cols
---

# `rel="modulepreload"`

::left::

<div class="mt-6 text-lg">

- モジュールスクリプトと**その依存を先に取得**して、モジュールマップに入れておく
- `import` の連鎖を、上から順に待たずに済む

</div>

::right::

```html
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>Basic JavaScript module example</title>
    <link rel="modulepreload" href="main.js" />
    <link rel="modulepreload" href="modules/canvas.js" />
    <link rel="modulepreload" href="modules/square.js" />
    <script type="module" src="main.js"></script>
  </head>
  <body></body>
</html>
```

<p class="src mt-4">MDN: <a href="https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Attributes/rel/modulepreload" target="_blank">rel="modulepreload"</a></p>

<style>
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.5 !important; }
.src { font-size: 0.65rem !important; color: var(--dt-text-muted); }
</style>

---
layout: two-cols
---

# Speculation Rules API

::left::

<div class="mt-6 text-lg">

- **次のページ**を prefetch / prerender するルールを JSON で書く
- `eagerness` で「どれだけ先に取るか」を指定する
- 文書 URL が対象なので、**SPA では意味がない**（MDN）

</div>

::right::

```html
<script type="speculationrules">
  {
    "prerender": [
      {
        "where": {
          "and": [
            { "href_matches": "/*" },
            { "not": { "href_matches": "/logout" } },
            { "not": { "href_matches": "/*\\?*(^|&)add-to-cart=*" } },
            { "not": { "selector_matches": ".no-prerender" } },
            { "not": { "selector_matches": "[rel~=nofollow]" } }
          ]
        }
      }
    ],
    "prefetch": [
      {
        "urls": ["next.html", "next2.html"],
        "requires": ["anonymous-client-ip-when-cross-origin"],
        "referrer_policy": "no-referrer"
      }
    ]
  }
</script>
```

<p class="src mt-2">MDN: <a href="https://developer.mozilla.org/ja/docs/Web/API/Speculation_Rules_API" target="_blank">投機ルール API</a></p>

<style>
.slidev-code, .slidev-code * { font-size: 9px !important; line-height: 1.45 !important; }
.src { font-size: 0.65rem !important; color: var(--dt-text-muted); }
</style>

<!--
SPA では意味がない → だから Next.js / React Router は、クライアント遷移用の prefetch を自前で持っている。次へ。
-->

---

# じゃあ、Next.js / React Router の prefetch は？

<div class="summary text-base mt-4">

| | Next.js（App Router） | React Router（Framework mode） |
|---|---|---|
| 書き方 | `<Link prefetch>` | `<Link prefetch>` |
| 既定 | **viewport に入ったら** | **しない**（`"none"`） |
| 選べるもの | `auto` / `true` / `false` | `intent` / `viewport` / `render` / `none` |
| hover | 期限切れなら取り直し<br><span class="sub">hover だけにしたいなら <code>false</code>→<code>null</code> を自前で切り替え</span> | `intent` で hover / focus 時に |
| 何を取る | RSC payload（static: 全体 / dynamic: `loading.js` まで） | route module と data |
| しくみ | `fetch` で取り、ルーターのキャッシュへ | `<link rel="prefetch">` を差し込む |
| 注意 | production のみ | Framework mode のみ |

</div>

<p class="src mt-3">参考: <a href="https://nextjs.org/docs/app/guides/prefetching" target="_blank">nextjs.org/docs/app/guides/prefetching</a> / <a href="https://reactrouter.com/api/components/Link" target="_blank">reactrouter.com/api/components/Link</a></p>

<style>
.summary table { width: 100%; }
.summary th, .summary td { padding: 0.4rem 0.7rem !important; border-bottom: 1px solid var(--dt-border); vertical-align: top; }
.summary td:first-child { color: var(--dt-text-muted); white-space: nowrap; }
.sub { font-size: 0.75rem; color: var(--dt-text-muted); }
.src { font-size: 0.65rem !important; color: var(--dt-text-muted); }
</style>

<!--
どちらも Speculation Rules API は使っていない。Next.js は ?_rsc= 付きの fetch、React Router は <link rel="prefetch">。
ざっくり「画面に入ったら」と「hover したら」の 2 系統。
App Router の prefetch={false} は hover でも取らない（Pages Router とは違う）ので注意。
-->

---

# Next.js: hover したら（ライブ）

<DemoFrame src="http://localhost:3456/hover" height="370px" label="localhost:3456/hover（next start）" native class="mt-1" />

<!--
事前に ~/pjt_personal/ginzajs-prefetch で `pnpm demo` しておく。
hover した link だけ右に出る。ただし hover → click の数百 ms で 200KB 取り切れるかは回線次第。
viewport 版を見せたいときは iframe 内で localhost:3456/ を開く。
リセットしたいときは iframe 内で再読み込み（Cmd+R）。
※ iframe をクリックするとキー操作が iframe に取られる。スライド送りは iframe の外をクリックしてから。
-->

---

# 重い！

<div class="mt-8 text-xl">

- viewport 型: 見えた link を全部取る。50 本あっても、開くのは 1 本
- hover 型: 来ると分かってから取る。click までの数百 ms では間に合わない

</div>

<p class="big">もっと「<span class="accent">可能性</span>」で判定できないか？</p>

<style>
.big { margin-top: 3.5rem; text-align: center; font-size: 2.4rem !important; font-weight: 700; line-height: 1.4 !important; }
</style>

---

# 量子力学のシュレディンガー方程式を考えてみる

<div class="grid grid-cols-[1fr_20rem] gap-8 mt-2 items-center">
<div>

$$
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \left[ -\frac{\hbar^2}{2m} \nabla^2 + V(\mathbf{r}, t) \right] \Psi(\mathbf{r}, t)
$$

<div class="text-base mt-2">

- 状態 Ψ はいくつもの状態の**重ね合わせ**。どれが観測されるかは $|\Psi|^2$ の**確率**で決まる
- 箱を開ける（観測する）まで、猫は「生きている」と「死んでいる」が重なったまま
- **クリックされるその瞬間まで、A も B もありうる**

</div>
</div>
<div>
  <img :src="$public('/schrodingers-cat.svg')" alt="シュレディンガーの猫の思考実験" class="w-full" />
  <p class="credit">Schrödinger's cat / Dhatfield / CC BY-SA 3.0（Wikimedia Commons）</p>
</div>
</div>

<p class="note">※ 比喩です。方程式を解くわけではなく、中身は幾何計算 + softmax</p>

<style>
.credit { font-size: 0.6rem !important; color: var(--dt-text-muted); text-align: center; }
.note { margin-top: 0.8rem; font-size: 0.75rem !important; color: var(--dt-text-muted); }
</style>

<!--
物理ガチ勢へのツッコミ回避: 方程式そのものは決定論的な波動方程式で、確率が出てくるのは |Ψ|²（ボルン則）。
今日のは「観測するまで、どちらの事象もありうる」という考え方だけ借りる。
-->

---

# しくみ: 速度ベクトルから、各 link の確率を出す

<div class="grid grid-cols-2 gap-8 mt-4">
<div class="text-base tight">

- 直近 50ms の `pointermove` から速度を出す
- 各 link について
  - 進行方向と link の方向の `cos`
  - 今の速さで着くまでの時間 `eta`
  - `score = exp(-eta / τ) × cos`
  - 止まっているときは、縁までの距離で
- 「どれにも向かっていない」も候補に入れて **softmax**
- **p ≥ 0.5 で prefetch / p ≤ 0.2 で abort**
  - 閾値をずらして、境界でバタつかせない

</div>
<div>

```ts
// requestAnimationFrame で 1 フレーム 1 回
const p = softmaxWithNull(scores, TEMP, NULL)

targets.forEach((_, key) => {
  if (p[key] >= 0.5 && s !== 'committed') {
    start(key) // AbortController つきで prefetch
  } else if (p[key] <= 0.2 && s === 'prefetching') {
    abort(key) // 外れたら捨てる
  }
})
```

</div>
</div>

<style>
.tight li { margin-top: 2px !important; line-height: 1.75 !important; }
</style>

---

# 先月、<span class="accent">Jev</span> が出た

<p class="mt-1 text-base color-gray">TypeSafe AI / 2026.09.15 early access / 「System One モデル」</p>

<div class="jev-body">
<dl class="spec">
  <dt>入力</dt><dd>状態（非構造テキスト）+ 型付きの質問</dd>
  <dt>出力</dt><dd>選択肢と<strong>確率</strong>。文章は書かない</dd>
  <dt>速度</dt><dd>0.1 秒台（公称）</dd>
</dl>
<img :src="$public('/typesafe-ai.png')" alt="TypeSafe AI" class="rounded-lg" />
</div>

<div class="grid grid-cols-2 gap-6 mt-5 text-base">
<div class="box"><strong>できる</strong>: 軌跡に加えて<strong>閲覧履歴・カート</strong>も読んで、マウスが動く前に当てる</div>
<div class="box"><strong>できない</strong>: 往復 70ms〜。毎フレーム（16ms）の追従は無理</div>
</div>

<style>
.jev-body { display: grid; grid-template-columns: 1fr 14rem; gap: 2.5rem; align-items: center; }
.jev-body img { width: 100%; }
.spec { display: grid; grid-template-columns: 6rem 1fr; margin-top: 0.8rem; border-top: 1px solid var(--dt-border); }
.spec dt, .spec dd { margin: 0; padding: 0.5rem 0; border-bottom: 1px solid var(--dt-border); font-size: 1rem; }
.spec dt { color: var(--dt-text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; display: flex; align-items: center; }
.box { padding: 0.7rem 1rem; border-radius: 12px; background: var(--dt-bg-soft); line-height: 1.7; }
</style>

<!--
「A〜D のどれに行く？」を確率で返すなら、AI に任せればよくない？ という問い。
次のデモの Jev はモック（往復 70〜300ms・500ms 間引き）。実 API キーがあれば TYPESAFE_API_KEY で本物に切り替わる。
-->

---
class: full
---

<div class="fit"><iframe src="http://127.0.0.1:3100/" title="確率式 vs Jev デモ" /></div>

<style>
:global(.slidev-layout.full) { padding: 0 !important; display: grid; place-items: center; background: #0b0d12 !important; }
.fit { width: 883px; height: 552px; overflow: hidden; }
.fit iframe { width: 1440px; height: 900px; border: 0; transform: scale(0.6133); transform-origin: 0 0; }
</style>

<!--
事前に ~/pjt_personal/ginzajs-prefetch で `pnpm demo` しておく（127.0.0.1:3100）。
1. 静止したまま → ローカルは「どこにも向いていない」。Jev は閲覧履歴・カートから B / D を推す。
2. 商品に向かって動かす → ローカルは毎フレーム追従、Jev は 500ms ごとに遅れて追う。合成は両方を足した事後分布。
3. 左下の文脈テキストを書き換えると Jev の分布が変わる。
4. 商品を hover → クリックで、命中とリード時間（何 ms 前から最有力だったか）が右下に溜まる。
-->

---

# 比べてみると

<div class="summary mt-6 text-base">

| | viewport | hover | 確率式 | Jev |
|---|---|---|---|---|
| 動き出すタイミング | 見えた瞬間 | hover 後 | **向かっている途中** | **動く前**（文脈） |
| 無駄な取得 | 多い | ほぼなし | 少ない（abort あり） | 文脈次第 |
| 追従性 | - | - | **毎フレーム** | 往復ぶん遅れる |
| コスト | 帯域 | なし | CPU 少し | API 呼び出し |

</div>

<MessageBox>軌跡はローカルで、文脈は AI で。<code>log(Jev の分布) + ローカルの logit</code> で合成もできる</MessageBox>

<style>
.summary table { width: 100%; }
.summary th, .summary td { padding: 0.5rem 0.8rem !important; border-bottom: 1px solid var(--dt-border); }
</style>

---

# まとめ

<div class="mt-6 text-lg">

- 投機的読み込みは「**当たれば速い、外れればムダ**」のさじ加減
- Next.js / React Router の prefetch は「**画面に入ったら**」と「**hover したら**」の 2 系統
- **重い docs だらけ**のサイトなら、確率で投機的に取って外れたら捨てる考え方はアリかも
- AI（Jev）は軌跡の追従より、**文脈から事前分布を出す役**が向いている
- 先行事例: ForesightJS（マウス軌跡から予測）
- 普段ライブラリが**よしなにやってくれている裏側**を知るのは、それだけで勉強になる

</div>
