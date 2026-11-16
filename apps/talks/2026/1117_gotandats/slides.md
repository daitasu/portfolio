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
- 形式の決まっていない文章やデータを渡すと、**型の決まった判断**が確率付きで返ってくる
  - 文章を書かない代わりに、**速く**（70〜500ms）、**安い**（入力 $0.042 / MTok、出力は無料）
  - System One はカーネマンの「システム 1（速い思考）」、Jev は経済学者ジェヴォンズが由来
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
layout: two-cols
---

# 「型安全」は 2 段構え

::left::

<div class="mt-6 text-base">

- **モデル側**: 文章を生成しない
  - 答えは確率、ラベル、点数のどれかに限られる
  - LLM のように、生成した文章を後から型に合わせるわけではない
- **SDK 側**: 問いから答えの型を推論
  - `const` 型パラメータで、criteria のキーをリテラル型のまま受け取る
  - 聞いていない質問は**型エラー**になる

</div>

::right::

```ts
import { choice, noul, score } from "@typesafe-ai/sdk";

const { answers } = await jev.systemOne({
  state: "サブスクが二重に請求されてました。返金して！",
  questions: {
    tone: choice("What is the tone?", {
      angry: null, calm: null, excited: null,
    }),
    urgency: score("How urgent?", ["Later", "Week", "Today"]),
    billing: noul("Is this about billing?"),
  },
});

answers.tone.choice;       // "angry" | "calm" | "excited"
answers.urgency.legend;    // キーは "0" | "1" | "2"
answers.billing.noul;      // number

answers.refund;            // ❌ 聞いていない質問
answers.urgency.legend["3"]; // ❌ rubric は 3 段階
score("Q", ["Only one"]);  // ❌ rubric は 2 段階以上
```

<style>
.slidev-code, .slidev-code * { font-size: 10px !important; line-height: 1.5 !important; }
</style>

---

# Jev があると何が嬉しい？

<div class="grid grid-cols-5 gap-6 mt-4 items-center">
<div class="col-span-2 text-base">

- **判断だけ**なら、正答率が同じくらいの LLM より**ずっと安い**
  - グラフでは費用が 1/8 以下
- 文章を生成しないので、答えが**型から外れることがない**
- 1 リクエストに複数の質問をまとめても、速度はほぼ変わらない
- LLM に聞くほどではないが if 文では書けない分岐に使える

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

# 判定ロジック

<div class="judge-grid">
<div class="text-base">

- **Noul** を 3 つ、1 回で聞く
  - **建前** `literal`: 字面は Yes か
  - **本音** `intent`: 本心は Yes か
  - **妥当性** `onTopic`: 返事になっているか
- 妥当性 50% 未満は **0 点**
- 建前と本音の**平均**が 50:50 に近いほど高得点

</div>
<div>

```ts
questions: {
  literal: {
    type: "noul",
    instructions:
      "Read the reply to the situation, including what it implies. " +
      "Does it mean yes?",
    criteria: { true: topic.yesCriteria, false: topic.noCriteria },
  },
  intent: {
    type: "noul",
    instructions:
      "Read between the lines, including sarcasm, reluctance, " +
      "and conditions that may never be met. " +
      "Does the speaker truly want to say yes?",
    criteria: {
      true: `deep down, ${topic.yesCriteria}`,
      false: `deep down, ${topic.noCriteria}`,
    },
  },
  onTopic: {
    type: "noul",
    instructions: "Is the reply a response to the situation?",
    criteria: {
      true: "a reply to the situation, even a vague or evasive one",
      false: "unrelated, meaningless, or only repeats the situation",
    },
  },
},
```

</div>
</div>

<style>
.judge-grid { display: grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; margin-top: 0.5rem; }
.judge-grid ul { line-height: 1.9; }
.slidev-code, .slidev-code * { font-size: 9.5px !important; line-height: 1.4 !important; }
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
  - 文章を書かない代わりに、判断だけを速く安く返す AI モデル
  - 問いは `Choice`（どれ？）/ `Noul`（Yes / No？）/ `Score`（どのくらい？）の 3 種
  - 前払い制なので個人でも安心（自動チャージをオンにしない限り、追加の請求はない）
- **Jev は何に使えそう？**

</div>

| アイデア | 問い | どう使う |
| --- | --- | --- |
| エラーアラートの前段分岐 | `Choice` | アラートを種類で振り分け、AI に読ませるか、どのモデルに渡すかを変えて費用を抑える |
| プロンプトに入れる資料の選別 | `Noul` | 候補の資料ごとに質問と関係があるかを聞き、関係があるものだけプロンプトに入れる |
| 危ないツール実行の確認 | `Score` | エージェントが使うツールの危険度を測り、閾値を超えたものだけ人間に確認させる |

<style>
table { margin-top: 0.5rem; font-size: 0.85rem; border-collapse: collapse; }
th, td { padding: 0.45rem 0.8rem; border-bottom: 1px solid var(--dt-border); text-align: left; vertical-align: top; }
th { color: var(--dt-text-muted); font-weight: 600; }
td:first-child { font-weight: 700; color: var(--dt-accent); white-space: nowrap; }
td:nth-child(2) { white-space: nowrap; }
</style>
