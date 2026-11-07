---
theme: ../../themes/daitasu
colorSchema: light
title: CSS だけでFPS視点スクロールアクションを実現する
description: "2026年7月10日 「Tamagawa.dev #2」における登壇資料です。"
talk:
  date: "2026-07-10"
  event: "Tamagawa.dev #2"
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: /daitasaurus-bolt-lord.webp
---

# CSS だけでFPS視点<br>スクロールアクションを実現する

<div>
  <span class="cover-eyebrow">Tamagawa.dev #2 ・ 2026.07.10</span>
  <span class="cover-by">@daitasu</span>
</div>

<style>
:global(.slidev-layout.cover .dino-img) { height: 18rem !important; bottom: 1.5rem !important; right: 1.5rem !important; }
</style>

---

# 今日話すこと

<div class="mt-8 text-xl">

- **① Scroll-driven Animations** … スクロール量で `@keyframes` を進める
  - `animation-timeline: scroll()` / `view()`
- **② 3D Transform** … 奥行きのある空間をつくる
  - `perspective` / `transform-style: preserve-3d` / `translateZ`

</div>

---
layout: two-cols
---

# animation-timeline とは

::left::

<div class="text-sm">

- アニメの進行を制御する timeline を作る CSS プロパティ
- **スクロール駆動アニメーションを CSS だけ**で実現できる
- スクロール位置の**始点〜終点**でアニメを進める

```css
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.card {
  animation: reveal linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

</div>

::right::

<DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/001-fade-in/" height="360px" class="mt-2" />

<style>
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.5 !important; }
</style>

---
layout: two-cols
---

# Sample: animation-timeline: scroll()

::left::

<div class="text-sm">

- `scroll(root)` = **ページ全体の縦スクロール進捗 0〜100%** をタイムライン化
- `scaleX` を伸ばすだけ。**レイアウト再計算が起きず**軽い
- 読み進みバーや円形インジケーターなど「**進捗 UI**」に最適

```css
.progress {
  position: fixed;
  inset: 0 0 auto 0;
  transform-origin: 0 50%;
  animation: grow-x linear both;
  animation-timeline: scroll(root);
}
@keyframes grow-x {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
```

</div>

::right::

<DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/002-progress-bar/" height="360px" class="mt-2" />

<style>
.slidev-code, .slidev-code * { font-size: 10.5px !important; line-height: 1.45 !important; }
</style>

---

# 3D Transform とは?

<div class="mt-6 text-lg">

- `perspective` … **カメラの焦点距離**。小さいほど広角＝遠近が強調され、没入感が出る
- `transform-style: preserve-3d` … 子要素を平面に潰さず **3D 空間に配置**する宣言
- `translateZ` / `rotateX・Y` … **奥行き方向の移動・回転**。面を組めば立体になる

</div>

---
layout: two-cols
---

# Sample: 3D Transform で立方体をつくる

::left::

<div class="text-sm">

- 6 枚の面を **回転 → `translateZ`（一辺の半分）** で押し出す
- 親に `perspective`、立方体に `preserve-3d`
- あとは `@keyframes` で **rotateX/Y を回し続ける**だけ

```css
.scene {
  perspective: 900px;
}
.cube {
  transform-style: preserve-3d;
  animation: tumble 14s linear infinite;
}
@keyframes tumble {
  to { transform: rotateX(360deg) rotateY(360deg); }
}
.front { transform: translateZ(100px); }
.right { transform: rotateY(90deg) translateZ(100px); }
.top   { transform: rotateX(90deg) translateZ(100px); }
/* back / left / bottom も同様に組む */
```

</div>

::right::

<DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/004-3d-cube/" height="380px" class="mt-2" />

<style>
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.5 !important; }
</style>

---
layout: section
---

# これはもしや
# CSS だけでFPS視点を作れるのでは？　🙄


---

# FPS視点スクロールアクションとは

<div class="text-base mt-2">

- スクロール量を **カメラの前進・首振り** にマッピングする体験
  - 縦スクロール = 前進、進むにつれて **視点が回り込む**
- ゲームの一人称視点（FPS）を、**Web ページのスクロール**で再現する
- 「読む」ではなく「**進む**」インタラクション
  - ストーリーテリング LP、ポートフォリオ、ゲーム風の導入に相性がいい

</div>

---
layout: two-cols
---

# やってみた：FPS視点「迫りくる恐竜」

::left::

<div class="text-sm">

- **カメラ** = `position: fixed` + `perspective`
- 奥の `.world` を `scroll(root)` で **`translateZ` 前進**
- 進むほど迫る → **一人称で突っ込む**感覚
- 実 DOM は **縦長ダミー（`1000vh`）だけ**

```css
.viewport {        /* カメラ */
  position: fixed;
  inset: 0;
  perspective: 760px;
}
.world {           /* 世界ごと前進 */
  transform-style: preserve-3d;
  animation: fly linear both;
  animation-timeline: scroll(root);
}
@keyframes fly {
  to { transform: translateZ(8200px); }
}
.scroll-track { height: 1000vh; } /* 距離稼ぎ */
```

</div>

::right::

<DemoFrame src="https://daitasu.github.io/css-scroll-fps/patterns/005-fps-flythrough/" height="380px" class="mt-2" />

<style>
.slidev-code, .slidev-code * { font-size: 11px !important; line-height: 1.5 !important; }
</style>

---

# CSS だけで、FPS視点は実現できる　👍️

<div class="mt-4 text-base">

- スクロール = カメラ操作の FPS 体験が **CSS だけ**で作れる
- 肝は **scroll-driven animation（`scroll()` / `view()`）× 3D transform**
- カメラは `position: fixed` + `perspective`、前進は `translateZ` を scroll で駆動
- JS のスクロール処理を捨てて、**コンポジタ任せ**で滑らかに

</div>

<div class="flex items-center justify-center gap-10 mt-3">
  <GithubCard owner="daitasu" repo="css-scroll-fps" desc="CSS だけで作る FPS 視点スクロールアクションの実験場" />
  <div class="flex flex-col items-center gap-2">
    <span class="text-base font-bold color-gray">デモサイト</span>
    <img :src="$public('/qrcode_scroll_driven_playground.png')" class="rounded-lg w-44 h-44" />
  </div>
</div>
