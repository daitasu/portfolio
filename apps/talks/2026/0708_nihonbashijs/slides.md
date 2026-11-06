---
theme: ../../themes/daitasu
colorSchema: light
title: Generative UI の逐次描画はどうなっている？ ~json-render と A2UI の思想を比べる~
description: "2026年7月8日 「Nihonbashi.js #11」における登壇資料です。"
talk:
  date: "2026-07-08"
  event: "Nihonbashi.js #11"
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: /dino_cover.webp
---

# Generative UI の逐次描画は<br>どうなっている？

<div>
  <span class="cover-sub">〜 json-render と A2UI の思想を比べる 〜</span>
</div>
<div>
  <span class="cover-eyebrow">Nihonbashi.js #11 ・ 2026.07.08</span>
  <span class="cover-by">@daitasu</span>
</div>
<div class="mt-6 text-sm" style="opacity:0.65;">
  ※ 今日は <b>json-render の仕組みを軸に</b>、A2UI の思想と対比します
</div>

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
      <p>Belong to:</p>
      <p class="ml-3">コミューン株式会社</p>
    </div>
    <div>
      <p>Favorite:</p>
      <p class="ml-3">TypeScript, Onsen, Dinosaurs</p>
    </div>
    <div>
      <p>Community:</p>
      <p class="ml-3">Tachikawa.any</p>
      <a class="ml-3">https://tachikawaany.connpass.com/</a>
    </div>
  </div>
</div>

---
layout: two-cols
---

# Generative UI ってなに？

::left::

<div class="mt-4 text-lg">

- LLM が**その場で UI を生成**して返すアプローチ
- 返答が「文章」ではなく、**ボタン・カード・フォーム**そのものになる
- 「今日の天気は？」→ テキストの説明ではなく**天気カード**が返ってくる
- ユーザーは読むだけでなく、返ってきた UI を**そのまま操作**できる

</div>

::right::

<div class="mt-8 flex justify-center">
  <img :src="$public('/mcp_apps_color_picker.webp')" class="rounded-lg" style="max-height: 20rem;" />
</div>

---
layout: two-cols
---

# Generative UI の 2つの解法

::left::

<div class="compare-box compare-left mr-2">

**MCP Appsのアプローチ**

<div class="mt-2 text-base">

- AI がテキストだけでなくインタラクティブなUIを返却するMCPサーバを提供
- UI の実体は**開発者が登録した HTML**（`ui://`）、AI はデータを渡す
- HTMLを**iframe サンドボックス**で隔離して描画
  - アプリ独自の**デザインシステムには沿えにくい**

</div>
</div>

::right::

<div class="compare-box compare-right ml-2">

**json-render / A2UIのアプローチ**

<div class="mt-2 text-base">

- 宣言的なJSONスキーマを返却
- **スキーマ制約**に従うため、AI が誤るリスクが軽減される
- アプリケーションの**一部として統合された UI** を提供
- アプリ状態・イベントハンドラと**直結**できる
- プロトコル(A2UI)、フレームワーク(json-render)なので層は異なる

</div>

<div class="today-badge">👉 今日はこちらの話をします</div>

</div>

<style>
.compare-box { margin-top: 1rem; padding: 1.1rem 1.3rem; border-radius: 12px; min-height: 340px; font-size: 1.125rem; }
.compare-left { background: #e9f6ec; border: 1.5px solid #6cbf7d; }
.compare-right { background: #fdedeb; border: 1.5px solid #e58c80; }
.today-badge { display: block; width: fit-content; margin-top: 0.6rem; margin-left: auto; padding: 0.25rem 0.7rem; border-radius: 999px; background: #e58c80; color: #fff; font-size: 0.9rem; font-weight: 700; }
</style>

---
layout: two-cols
---

# json-render の How to

::left::

<div class="mt-6 text-lg space-y-5">
  <div class="howto-step active">① カタログを定義する</div>
  <div class="howto-step">② 実態（コンポーネント）を定義する</div>
  <div class="howto-step">③ カタログからシステムプロンプトを生成</div>
</div>

::right::

```ts
import { defineCatalog } from "@json-render/core";
import { z } from "zod";

export const catalog = defineCatalog({
  components: {
    Stack: {
      props: z.object({
        direction: z.enum(["row", "column"]),
      }),
      hasChildren: true,
    },
    WeatherWidget: {
      props: z.object({
        city: z.string(),
        temperature: z.number(),
        condition: z.string(),
      }),
    },
  },
});
```

<style>
.howto-step { opacity: 0.35; }
.howto-step.active { opacity: 1; font-weight: 700; }
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.5 !important; }
</style>

---
layout: two-cols
---

# json-render の How to

::left::

<div class="mt-6 text-lg space-y-5">
  <div class="howto-step">① カタログを定義する</div>
  <div class="howto-step active">② 実態（コンポーネント）を定義する</div>
  <div class="howto-step">③ カタログからシステムプロンプトを生成</div>
</div>

::right::

```tsx
import { defineRegistry } from "@json-render/react";
import { catalog } from "./catalog";

export const { registry } = defineRegistry(catalog, {
  components: {
    Stack: ({ props, children }) => (
      <div
        className={
          props.direction === "row"
            ? "flex flex-row gap-2"
            : "flex flex-col gap-2"
        }
      >
        {children}
      </div>
    ),
    WeatherWidget: ({ props }) => (
      <WeatherCard
        city={props.city}
        temperature={props.temperature}
        condition={props.condition}
      />
    ),
  },
});
```

<style>
.howto-step { opacity: 0.35; }
.howto-step.active { opacity: 1; font-weight: 700; }
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.5 !important; }
</style>

---
layout: two-cols
---

# json-render の How to

::left::

<div class="mt-6 text-lg space-y-5">
  <div class="howto-step">① カタログを定義する</div>
  <div class="howto-step">② 実態（コンポーネント）を定義する</div>
  <div class="howto-step active">③ カタログからシステムプロンプトを生成</div>
</div>

::right::

```ts
const systemPrompt = catalog.prompt();

const result = streamText({
  model: anthropic("claude-haiku-4-5"),
  system: systemPrompt,
  prompt,
});
```

<div class="text-sm color-gray mt-4">

catalog の「使っていい部品と props」が、そのまま LLM への契約になる。

</div>

<style>
.howto-step { opacity: 0.35; }
.howto-step.active { opacity: 1; font-weight: 700; }
.slidev-code, .slidev-code * { font-size: 12px !important; line-height: 1.55 !important; }
</style>

---
layout: section
---

# json-render と A2UI で何が違う？

---
layout: two-cols
---

# 同じ「天気 UI」を組み立てると

::left::

<div class="text-sm mt-2 text-center font-bold">json-render</div>

<div class="mt-2 flex justify-center">
  <img :src="$public('/json-render.gif')" class="rounded-lg" style="max-height: 20rem;" />
</div>

::right::

<div class="text-sm mt-2 text-center font-bold">A2UI</div>

<div class="mt-2 flex justify-center">
  <img :src="$public('/a2ui.gif')" class="rounded-lg" style="max-height: 20rem;" />
</div>

---
layout: section
---

# 逐次描画はどうやっている？

---

# json-render: サーバは JSON Patch を 1 行ずつ流す

<div class="mt-2 text-base">

ワイヤ形式は **RFC 6902（JSON Patch）の JSONL**。1 行 = 1 オペレーション。

```json
{"op":"add","path":"/root","value":"main"}
{"op":"add","path":"/elements/main","value":{"type":"Stack","props":{"direction":"column"},"children":[]}}
{"op":"add","path":"/elements/widget","value":{"type":"WeatherWidget","props":{"city":"東京","temperature":22,"condition":"sunny"},"children":[]}}
{"op":"add","path":"/elements/main/children/-","value":"widget"}
```

- `path` を少しずつ深くしながら **`add` を積む**だけ
- LLM がトークンを吐くそばから `res.write` → 1 行完成するたび届く

</div>

<style>
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.55 !important; }
</style>

---

# json-render: クライアントは届いた分だけ spec に積む

<div class="mt-2 text-base">

```ts
const compiler = createSpecStreamCompiler<Spec>({ elements: {} });
for (;;) {
  const { done, value } = await reader.read();
  if (done) break;
  // 完成した JSONL 行だけをパッチ化して spec に適用
  const { result, newPatches } = compiler.push(decoder.decode(value));
  if (newPatches.length > 0) setSpec(result); // ← 差分が出たら再レンダー
}
```

- `compiler.push()` がチャンク境界を吸収し、**完成した行だけ**を適用
- partial spec を許容：新しいパッチが出たら `setState` → **React 再レンダー**

<div class="mt-3 text-xs color-gray px-3 py-2 rounded-md" style="background: #f2f3f5;">

※ React なら `@json-render/react` の `useUIStream` が楽。今回は仕組み説明のため core を直接使用。

</div>

</div>

<style>
.slidev-code, .slidev-code * { font-size: 12px !important; line-height: 1.55 !important; }
</style>

---

# A2UI はどう描く？

<div class="mt-3 text-base">

- AIが返すJSONの **“メッセージ形式を担う” プロトコル**（Agent-to-UI）。
  - `createSurface` … 描画面をつくる / `updateComponents` … **構造** / `updateDataModel` … **データ**
- **構造とデータが別メッセージ**で届き、client は `path` で data model に **subscribe**
- `updateComponents` はツリーを **flat な配列**で表現
  - **まとめて描画**も**分割送信での逐次描画**も可能

```json
{"createSurface":{"surfaceId":"s1","catalogId":".../catalog.json"}}
{"updateDataModel":{"surfaceId":"s1","path":"/","value":{"summary":"晴れ時々くもり"}}}
{"updateComponents":{"surfaceId":"s1","components":[
  {"id":"root","component":"Column","children":["summary","widget","forecast"]},
  {"id":"summary","component":"Text","text":{"path":"/summary"}},
  {"id":"widget","component":"WeatherWidget","city":"東京","temperature":22,"condition":"sunny"},
  {"id":"forecast","component":"WeeklyForecastList","days":[ /* ...7日分... */ ]}
]}}
```

</div>

<style>
.slidev-code, .slidev-code * { font-size: 10.5px !important; line-height: 1.5 !important; }
</style>

---

# 対比：json-render vs A2UI

<div class="mt-4 text-sm">

|                     | json-render                                              | A2UI                                                   |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------------ |
| レイヤ              | **フレームワーク**（schema-agnostic・A2UI 形式も描ける） | **プロトコル**（メッセージ仕様のみ）                   |
| ストリームの 1 単位 | **1 パッチ = 1 ノード**（極小・大量）                    | **1 メッセージ**（複数ノードをまとめられる）           |
| 逐次描画            | パッチ適用ごとに **node 単位で生える**                   | メッセージを**分割すれば同様に逐次**（粒度は実装次第） |
| 構造とデータ        | 同じ spec に**同梱**（state 内包）                       | `updateComponents` と `updateDataModel` に**分離**     |

</div>

<div class="grid grid-cols-2 gap-4 mt-3 text-xs">
<div>

**json-render** — 極小パッチが大量

```json
{"op":"add","path":"/root",...}
{"op":"add","path":"/elements/main",...}
{"op":"add","path":".../children/-",...}
… (十数行つづく)
```

</div>
<div>

**A2UI** — 構造とデータを分けて送る

```json
{"createSurface":{...}}
{"updateDataModel":{...}}
{"updateComponents":{"components":[ /* まとめても分割してもよい */ ]}}
```

</div>
</div>

<style>
.slidev-code, .slidev-code * { font-size: 10px !important; line-height: 1.45 !important; }
table { width: 100%; border-collapse: separate; border-spacing: 0; border-radius: 10px; overflow: hidden; border: 1px solid #dde4ee; }
th, td { border: 1px solid #e6ebf3; padding: 8px 14px; }
td:first-child { background: #f6f8fb; font-weight: 500; }
th:nth-child(2) { background: #cfe3f8; color: #1e4080; }
td:nth-child(2) { background: #eaf3fc; }
th:nth-child(3) { background: #fbe3d9; color: #a04a2c; }
td:nth-child(3) { background: #fdf1ea; }
</style>

---

# まとめ

<div class="mt-6 text-lg">

- AIがUIを設計する時代になった
- 逐次描画の実現思想
  - **json-render** = RFC 6902 の JSON Patch を 1 行ずつ適用し、**node 単位で spec を修正**
  - **A2UI** = 構造(`updateComponents`)とデータ(`updateDataModel`)を**分離**し、粒度は送り方次第
- どちらもAIが見る制約(catalog)、実際のUI(component)、AIが出す中間表現(spec)の構図になっている
  - これらの設計の考え方をプロダクト転用できると、**UIをユーザーが動的に組める体験**を提供できうる
- 逐次描画の仕組みはまだ発展途上。**今後いろんなアプローチが出てきそう**で楽しみ
</div>
