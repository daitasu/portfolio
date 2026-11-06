---
theme: ../../themes/daitasu
colorSchema: dark
title: Semantic Version 単位で戦略を柔軟に変えて、パッケージアップデートを自動化する
description: "2026年6月12日 「多摩.dev #3」における登壇資料です。"
talk:
  date: "2026-06-12"
  event: "多摩.dev #3"
layout: cover
dino: /dino_cover_transparent.webp
---

# Semantic Version 単位で戦略を柔軟に変えて、パッケージアップデートを自動化する

<div class="mt-8 text-xl color-gray">2026.06.12 多摩.dev #3 〜半年記念回〜 @daitasu</div>

---
layout: intro
---

<div class="flex items-center gap-12">
  <div>
    <img src="https://avatars.githubusercontent.com/u/28728602" class="w-48 h-48 rounded-full" />
    <div class="mt-2 flex gap-2 items-end w-full">
      <div class="flex flex-col items-center">
        <p>X</p>
        <p>
          <img :src="$public('/qrcode_x.com.png')" class="mt-1 rounded-1 h-24" />
        </p>
      </div>
      <div class="flex flex-col items-center">
        <p>
          <img src="https://media.connpass.com/thumbs/54/39/5439d93cdc71a42279d5aa1415c9c39e.png" class="w-16 rounded-2" />
        </p>
        <p>
          <img :src="$public('/qrcode_discord.gg.png')" class="mt-1 rounded-1 h-24" />
        </p>
      </div>
    </div>
  </div>
  <div class="text-xl space-y-2">
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
      <p class="ml-3">TypeScript, Sauna, Dinosaurs</p>
    </div>
    <div>
      <p>Community:</p>
      <p class="ml-3">Tachikawa.any</p>
    </div>
  </div>
</div>

---

# 今日話すこと

<div class="mt-8 text-xl">

- dependabot の PR が**滞納する問題**
- Semantic Version ごとの**マージ戦略**の考え方
- AIレビュー＆自動マージする**GitHub Action を作った**話
- 導入して**どう変わったか**

</div>

---
layout: section
---

# dependabotのPR<br>溜まっていませんか？

---

# パッケージアップデートの滞留問題

<div class="mt-6 text-lg">

- dependabot が PR を作ってくれる → **しかし、レビュー時間がない**
  - 運用の仕組みの整備の形骸化、誰かしらの勇姿で解決してしまう
  - うまく回せても、対応コストが大きい
- 放置するほどに、**バージョン差異が肥大化**
  - 重い腰が着実に重たくなり、負債になってしまう
- 脆弱性の露出、LTS切れの危険性

</div>

---
layout: section
---

# AIでなんとかならないの？


---

# AIレビューの問題点

<div class="mt-6 text-lg">

- dependabot はビジネスロジックを含むものではない
  - AI レビューとの相性はいいはず
- しかし昨今、**サプライチェーン侵害**が多発している
  - 変更差分がOKでも、安易に信頼してマージできるかが分からない
- メジャーリリースなど、AIで見たいもの、人が必ず見たいものなど、レベルによって**求める段階**が違う

</div>

---
layout: section
---

# 状況に合わせて、AIのレビュー戦略をさくっと切り替えられたらいいのに 🤔

---
layout: two-cols
---

::left::
<img :src="$public('/capture_github.webp')" class="mt-2 rounded-1" />

::right::

<div class="flex items-center justify-center h-full w-full text-40">action つくった</div>

---

# cc-deps-patrol とは

<div class="mt-6 text-lg">

- Claude Code Action で dependabot PR を**パトロール**する GitHub Action
- Semantic Version に応じて**4つの戦略**を使い分けできる
- npm provenance チェック + AI レビューで**セキュリティも考慮**
- 🔗 [github.com/daitasu/cc-deps-patrol](https://github.com/daitasu/cc-deps-patrol)

</div>

---

# 従来の dependabot がマージされるまで

<img :src="$public('/flow_original.png')" class="mt-6 rounded-lg w-2/3 mx-auto" />

<div class="mt-6">

- dependabot が PR を作成してからマージされるまでの一般的な流れ
- **人間**がレビューし、マージまで持っていく
- この**レビューがボトルネック**となり、停滞要因となってしまう

</div>

---

# レビューで抑えたい観点

<div class="mt-6 text-lg">

- セキュリティの危険性を担保する(**信頼できる開発元**かどうかを確認する)
- バージョンアップデートに**クリティカル**な影響がないか
- 人が見たい重要な変更は、**自動マージは決してしない**

</div>

---
layout: section
---

# 4つの戦略に分けて<br>AIの対応範囲を決めていく

---
layout: two-cols
---

# Semantic Version レベルで4つの戦略を選べるように

::left::

<div class="text-14">

- マージ戦略は4つのストラテジーから選択可能
   - `review-only` ... AIがレビューコメントのみ残す(マージはしない)
   - `review-and-merge` ... AIがレビューを行い、問題ないと判断した場合は自動マージ
   - `verify-and-merge` ... 信頼できる開発元かどうかのチェックのみ行い、問題なければ自動マージ
   - `auto-merge` ... AIレビュー、開発元チェックは行わず、自動マージ(非推奨)
- 対応Agent は Claude Code

</div>

::right::

<img :src="$public('/strategy_overview.png')" class="mt-4 rounded-lg mx-auto" />

---

# ① verify-and-merge（patch向け）

<img :src="$public('/verify_merge.png')" class="mt-2 rounded-lg w-3/4 mx-auto" />

<div class="mt-6">

- AI レビューは**実施しない**（トークン削減）。開発元の**信頼性チェックのみ**で判断
- 確認項目：
  - **npm provenance**（由来検証）／ **install スクリプト**の有無 ／ **リリース経過日数**
  - 後で話しますが、**これで安心**というわけではないです

</div>

---

# ② review-and-merge（minor向け）

<img :src="$public('/review_merge.png')" class="mt-2 rounded-lg w-3/4 mx-auto" />

<div class="mt-6">

- patch より影響範囲が広いため、**AI の目を通してから**マージする
- npm provenance 前段チェック → AI がアップデート影響をレビュー
  - 問題なければ **Approve + 自動マージ**

</div>

---

# ③ review-only（major向け）

<img :src="$public('/review_only.png')" class="mt-2 rounded-lg w-3/4 mx-auto" />

<div class="mt-6">

- AI が**レビューコメントのみ**を残す。Approve も自動マージも**しない**
- 破壊的変更は**人間が最終判断**。コメントがあるだけでも調査工数は大幅に減る

</div>

---

# 使用例

```yaml
- uses: daitasu/cc-deps-patrol@v1
  with:
    github-token: ${{ steps.app-token.outputs.token }}
    anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude-github-token: ${{ steps.app-token.outputs.token }}
    patch-strategy: "verify-and-merge"   # patch バージョンの戦略
    minor-strategy: "review-and-merge"   # minor バージョンの戦略
    major-strategy: "review-only"        # major バージョンの戦略
    reviewer-login: "deps-keeper"        # github app の名前
    review-language: "ja"                # レビューコメントの言語
```

<div class="mt-4 text-base text-gray-400">

- 戦略はバージョン種別ごとに柔軟に組み替え可能

</div>

<style>
.slidev-code,
.slidev-code * {
  font-size: 12px !important;
  line-height: 1.5 !important;
}
</style>

---
layout: section
---

# 導入結果

---

# 導入結果: verify / review-and-merge

<div class="grid grid-cols-2 gap-4 mt-2">
  <img src="https://static.zenn.studio/user-upload/596fded58ab0-20260609.png" class="rounded-lg" />
  <img src="https://static.zenn.studio/user-upload/d409ca6c9dbe-20260609.png" class="rounded-lg" />
</div>

<div class="mt-4 text-base text-gray-400">

AI がレビュー → Approve → 自動マージまで完了

</div>

---
layout: two-cols
---

# 導入結果: review-only（Major）

::left::

<img src="https://static.zenn.studio/user-upload/e04584c8989b-20260609.png" class="mt-2 rounded-lg h-full" />

::right::

<div class="flex h-full justify-center items-center">

AI のレビューコメントが残り、人間が最終判断する

</div>

---

# 導入後の変化

<div class="mt-6 text-lg">

- 個人開発に入れてみた
  - **滞っていた dependabot PR が消化**されるようになった
- `review-only` のコメントだけでも**調査の支援**になる
- ケースに応じて**戦略を柔軟に組み替え**られる

</div>

---
layout: section
---

# 👍️

---
layout: section
---

# ⚠️

---

# 今回の信頼元チェックは完璧ではない

<div class="mt-6 text-lg">

- 今回は信頼できる開発元のチェックとして、下記を検出した
  - **npm provenance**（由来検証）／ **install スクリプト**の有無 ／ **リリース経過日数**
- npm provenance は「**由来の透明性**」を証明するだけ
  - メンテナ認証情報が奪取された場合は防げない（例：🔗[2025年9月の chalk/debug 汚染](https://unit42.paloaltonetworks.com/monitoring-npm-supply-chain-attacks/)）
- install スクリプト検査は**回避手法**に対応しきれない
  - 🔗[binding.gyp + node-gyp 経由での任意コード実行されるケース](https://snyk.io/jp/blog/node-gyp-supply-chain-compromise-self-propagating-npm-worm-binding-gyp/)も観測されている

</div>

<MessageBox>過信禁物。最低限のスクリーニングに過ぎない</MessageBox>

---
layout: two-cols
---

# まとめ

::left::

<div class="text-left mt-5 space-y-2 text-16">

- dependabot PR の滞納は**AI で解決できる**
- Semantic Version ごとに**戦略を分けるのが肝**
- セキュリティは**過信せず、最低限のスクリーニング**
- `review-only` だけでも十分**開発体験が改善**する

</div>

::right::

zenn にもまとめています！

<img :src="$public('/zenn.png')" class="mt-2" />

<div class="mt-3">
🔗 <a href="https://zenn.dev/dev_commune/articles/85e6cf7049a4ce" style="font-size: 12px">https://zenn.dev/dev_commune/articles/85e6cf7049a4ce</a>
</div>
