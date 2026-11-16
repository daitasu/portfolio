---
theme: ../../themes/daitasu
colorSchema: light
themeConfig:
  motif: wind
title: "判断特化AIモデル Jev で、判断させないゲームを作る"
description: "2026年11月17日 「五反田.ts #2」における登壇資料です。"
talk:
  date: "2026-11-17"
  event: "五反田.ts #2"
  eventUrl: ""
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: /gotanda.png
---

# 判断特化AIモデル Jev で、<br>判断させないゲームを作る
<div>
  <span class="cover-eyebrow">五反田.ts #2 ・ 2026.11.17</span>
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
</style>

---
layout: intro
---

<div class="flex items-center gap-12">
  <div>
    <img src="https://avatars.githubusercontent.com/u/28728602" class="w-48 h-48 rounded-full" style="box-shadow: var(--dt-shadow-card); background: #fff;" />
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
      <a class="ml-3" href="https://gotanda--ts.connpass.com/" target="_blank">
        五反田.ts
      </a>
    </div>
  </div>
</div>

---
layout: center
---

<div class="text-center text-xl" style="color: var(--dt-text-muted);">今日のお話</div>
<div class="text-center font-bold accent mt-6" style="font-size: 8rem; line-height: 1;">Jev</div>

---

# 判断特化型 AI モデル Jev

<div class="mt-6 text-lg">

- テキストを生成しない、**判断特化**の AI モデル（System One Model）
- 2026/9/15 に **TypeSafe AI** がリリース
- 「非構造な状態を入れると、**型付きの確率的な判断**が返ってくる」
  - 文章は書かない代わりに、**速い**（70〜500ms）・**安い**（入力 $0.042 / MTok、出力は無料）
  - 名前の由来は、カーネマンの「システム 1（速い思考）」と経済学者ジェヴォンズ
- 扱える質問は 3 種類
  - `Choice`（どれ？）、`Noul`（Yes / No？）、`Score`（どのくらい？）

</div>

---
layout: two-cols
---

# Choice（どれ？）

::left::

<div class="mt-6 text-lg">

- 名前付きの選択肢から **1 つを選ぶ**
- 選択肢は最大 255 個
- 選ばれたラベルに加えて、**選択肢ごとの確率**と confidence が返る
- 用途: 問い合わせの分類、感情分析、メールの振り分け

</div>

::right::

```ts
const body = {
  model: "jev-latest",
  state: "サブスクが二重に請求されてました。返金して！",
  questions: {
    tone: {
      type: "choice",
      instructions: "What is the tone of this message?",
      criteria: {
        angry: "An upset or hostile message",
        calm: "A neutral or polite message",
        excited: "An enthusiastic or eager message",
      },
    },
  },
};

// answers.tone
// { type: "choice", choice: "calm", confidence: 0.7,
//   probabilities: { angry: 0.15, calm: 0.8, excited: 0.05 } }
```

<style>
.slidev-code, .slidev-code * { font-size: 10.5px !important; line-height: 1.5 !important; }
</style>

---
layout: two-cols
---

# Noul（Yes / No？）

::left::

<div class="mt-6 text-lg">

- Yes / No で答えられる問いに、**Yes である確率**（0〜1）を返す
- `criteria` で「何をもって true / false とするか」を書ける（任意）
- 用途: スパム判定、返金条件を満たすか、緊急か

</div>

::right::

```ts
const body = {
  model: "jev-latest",
  state: "サブスクが二重に請求されてました。返金して！",
  questions: {
    billing: {
      type: "noul",
      instructions: "Is this message about billing?",
    },
  },
};

// answers.billing
// { type: "noul", noul: 0.98 }
```

<style>
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.55 !important; }
</style>

---
layout: two-cols
---

# Score（どのくらい？）

::left::

<div class="mt-6 text-lg">

- **順序のある尺度**（最大 10 段階）で評価する
- 配列の位置がそのまま点数（0 始まり）
- 返る `score` は確率の加重平均なので、**1.7 のような中間値**にもなる
- 用途: レビューの品質評価、リスク評価、優先度づけ

</div>

::right::

```ts
const body = {
  model: "jev-latest",
  state: "サブスクが二重に請求されてました。返金して！",
  questions: {
    urgency: {
      type: "score",
      instructions: "How urgent is this message?",
      criteria: [
        "Can wait",
        "Needs attention this week",
        "Needs attention today",
      ],
    },
  },
};

// answers.urgency
// { type: "score", score: 1.7, confidence: 0.55,
//   probabilities: { "0": 0.1, "1": 0.1, "2": 0.8 } }
```

<style>
.slidev-code, .slidev-code * { font-size: 10.5px !important; line-height: 1.5 !important; }
</style>

---

# Jev があると何が嬉しい？

<div class="grid grid-cols-5 gap-6 mt-4 items-center">
<div class="col-span-2 text-base">

- **判断だけ**なら、LLM と同程度の精度を**桁違いに安く**出せる
- 文章を生成しないので、**型崩れ（ハルシネーション）が構造上起きない**
- 1 リクエストに複数の質問をまとめても、速度はほぼ変わらない
- → 「この分岐、LLM に聞くほどでもないけど if 文では書けない」を埋める

</div>
<div class="col-span-3">
  <img :src="$public('/jev-accuracy-vs-cost.png')" class="rounded-lg" />
  <p class="mt-1" style="font-size: 0.7rem; color: var(--dt-text-muted);">出典: TypeSafe AI「Introducing System One Models &amp; Jev」</p>
</div>
</div>

---
layout: section
---

# 判断特化の AI モデルと聞いてしまうと、

<div class="mt-10 text-2xl text-center">
  <span class="accent font-bold">「判断できない」</span>ことをさせたいのが人の心
</div>

---
layout: two-cols
---

# AIMAI

::left::

<div class="mt-6 text-lg">

- 日本語は「**どっちやねん**」という曖昧な言葉が得意
- AI の問いに曖昧な返事をして、**50:50 の判断**をさせるゲーム
  - 例: 友人に「1 万円貸してくれない？」
  - → 「ええよええよ、返ってこうへんのはもう慣れとるし」

</div>

::right::

<div class="mt-6 flex justify-center">
  <img :src="$public('/aimai-ogp.png')" class="rounded-lg" style="box-shadow: var(--dt-shadow-card);" />
</div>

---

# プレイ動画

<div class="mt-4 flex justify-center">
  <video :src="$public('/aimai-play.mp4')" controls muted playsinline class="rounded-lg" style="max-height: 24rem;" />
</div>

---
layout: two-cols
---

# 判定ロジック

::left::

<div class="mt-6 text-base">

- Jev の **Noul** を 3 つ並べて、1 リクエストで聞く
  - **建前**（`literal`）: 言葉の上では Yes か
  - **本音**（`intent`）: 嫌味や渋々も読んだ上で、本心は Yes か
  - **妥当性**（`onTopic`）: お題への返事になっているか
- 妥当性が 50% 未満なら **0 点**
- 建前と本音の Yes% を**平均**し、50:50 に近いほど高得点
  - Yes 60% なら 80 点、50% で満点

</div>

::right::

```ts
questions: {
  literal: {
    type: "noul",
    instructions: "... Does it mean yes?",
    criteria: { true: topic.yesCriteria, false: topic.noCriteria },
  },
  intent: {
    type: "noul",
    instructions: "Read between the lines ... truly say yes?",
    criteria: {
      true: `deep down, ${topic.yesCriteria}`,
      false: `deep down, ${topic.noCriteria}`,
    },
  },
  onTopic: {
    type: "noul",
    instructions: "Is the reply a response to the situation?",
    criteria: { true: "a reply ...", false: "unrelated ..." },
  },
},
```

```ts
const yesPercent = (literalYesPercent + intentYesPercent) / 2;
const score = isOnTopic ? 100 - Math.abs(2 * yesPercent - 100) : 0;
```

<style>
.slidev-code, .slidev-code * { font-size: 9.5px !important; line-height: 1.45 !important; }
</style>

---

# （余談）パチンコカラーは盛り上がる

<div class="mt-2 text-lg">

- **80 点以上**は「ええ塩梅」の赤、**90 点超**は「ちょうどええ！」のパチンコカラー

</div>

<div class="grid grid-cols-2 gap-6 mt-4">
  <!-- TODO: ええ塩梅のキャプチャを public/aimai-anbai.png に置いて img に差し替える -->
  <div class="capture-placeholder">ええ塩梅（80 点〜）のキャプチャ</div>
  <!-- TODO: ちょうどええのキャプチャを public/aimai-jackpot.png に置いて img に差し替える -->
  <div class="capture-placeholder">ちょうどええ！（90 点超）のキャプチャ</div>
</div>

<style>
.capture-placeholder { height: 16rem; display: flex; align-items: center; justify-content: center; border: 2px dashed var(--dt-border); border-radius: 12px; color: var(--dt-text-muted); }
</style>

---

# まとめ・アイデア

<div class="mt-2 text-base">

- **Jev 楽しい！**
  - 文章を書かない代わりに、速く・安く「判断」だけを返す AI モデル
  - 問いは `Choice`（どれ？）/ `Noul`（Yes / No？）/ `Score`（どのくらい？）の 3 種
- **Jev は何に使えそう？**

</div>

| アイデア | 問い | どう使う |
| --- | --- | --- |
| エラーアラートの前段分岐 | `Choice` | 生成 AI に直接読ませず、まず振り分ける。AI を挟むか・どのモデルに渡すかを変えてコスト削減 |
| LLM に渡す前の文脈選び | `Noul` | 候補ドキュメントごとに「関係あるか」を聞き、効くものだけプロンプトに入れる |
| エージェントの承認ゲート | `Score` | ツール実行の危険度を測り、閾値を超えたものだけ人間に確認させる |

<style>
table { margin-top: 0.5rem; font-size: 0.85rem; border-collapse: collapse; }
th, td { padding: 0.45rem 0.8rem; border-bottom: 1px solid var(--dt-border); text-align: left; vertical-align: top; }
th { color: var(--dt-text-muted); font-weight: 600; }
td:first-child { font-weight: 700; color: var(--dt-accent); white-space: nowrap; }
td:nth-child(2) { white-space: nowrap; }
</style>
