---
theme: ../../themes/daitasu
colorSchema: light
title: 立川市は如何にして今の発展を遂げたのか -旧地図から見た地政の歴史-
description: "2026年10月16日 「多摩.dev #5 秋の夜長のトーク会」における登壇資料です。"
talk:
  date: "2026-10-16"
  event: "多摩.dev #5 秋の夜長のトーク会"
fonts:
  sans: Zen Kaku Gothic New
  mono: JetBrains Mono
  weights: "300,400,500,700"
layout: cover
dino: /daitasaurus-autumn.jpeg
---

# 立川市は如何にして<br>今の発展を遂げたのか
<p class="cover-sub">~ 旧地図から見た地政の歴史 ~</p>
<div>
  <span class="cover-eyebrow">多摩.dev #5 秋の夜長のトーク会 ・ 2026.10.16</span>
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
layout: center
---

<div class="text-center">
  <div style="font-size: 2.2rem; line-height: 1.6;">多摩.dev #5、<strong>開催おめでとうございます！</strong><br>今回は<strong>初の立川開催</strong></div>
  <div class="mt-14 font-bold" style="font-size: 3.6rem;">Welcome to <span style="color: var(--dt-accent, #4a90d9);">立川</span> 🎉</div>
</div>

---
layout: center
---

<div class="text-left greet" style="font-size: 1.8rem;">

- **Tachikawa.any** をしてる身として、お隣の多摩.dev さんが<br>せっかく立川に来てくれたこと、嬉しい限りです
- せっかくなので、**「立川」の話**をします

</div>

---
layout: two-cols
---

# 立川って、昔からこうだった？

::left::

<div class="mt-4 text-lg">

- 明治の頃まで、多摩の中心といえば
  - **八王子**：甲州街道の宿場町・織物の町
  - **府中**：古代から武蔵国の国府
- 一方、立川は**小さな農村**だった
- それが今や、昼間人口が夜間人口を上回る<br>**東京郊外屈指の商業都市**
- その理由は **地形** と **地図の変遷** に残っている

</div>

::right::

<img :src="$public('/map-now.webp')" class="rounded-lg" style="max-height: 22rem;" />

<p class="src">出典：地図タイムマシン（local-historia.jp）／国土地理院・OpenStreetMap</p>

<!--
フック。「なぜ八王子や府中じゃなくて立川なのか？」を最初に投げる。
就従比 1.25 は多摩地域で最も高い（東京都都市整備局 tama_07.pdf / 平成17年国勢調査）
-->

---

# 今日の話

<div class="mt-12 agenda">

1. **地形** — 崖と平坦な台地が作った初期条件
2. **交通** — 鉄道がもたらした十字路
3. **軍都** — 平坦な台地が呼び込んだ飛行場と基地
4. **返還** — 巨大な空白地帯が「未来の都市」に

</div>

---
layout: two-cols
---

# 立川崖線が街を南北に分ける

::left::

<div class="mt-4 text-lg">

- 北：**武蔵野台地（立川面）**
- ↓ **立川崖線**（富士見町〜柴崎町を東西に走る）
- 南：青柳面 → **多摩川の低地**

<div class="mt-6 text-base">

| 地点 | 標高 |
|---|---|
| 西砂町（北西の台地） | 約 110 m |
| 昭和記念公園 みんなの原っぱ | 約 98 m |
| 立川駅 | 約 83 m |
| 日野橋北詰（多摩川沿い） | 約 71 m |

</div>

市内だけで **約 40 m** の高低差

</div>

::right::

<img :src="$public('/relief-color.webp')" class="rounded-lg mx-auto" style="max-height: 23rem;" />

<p class="src">出典：国土地理院 地理院タイル（数値標高モデル・陰影起伏図・淡色地図）を筆者加工<br>標高値は国土地理院 標高API（DEM1A）で筆者計測</p>

<!--
地理院地図: https://maps.gsi.go.jp/#14/35.700000/139.410000/&base=std&ls=std%7Chillshademap%2C0.6%7Crelief%2C0.6&disp=111
段丘区分: https://smtrc.jp/drr/city/tokyo-tachikawa/index.html
崖線のすぐ下は水が得やすい（旧立川村側）、台地上は水が乏しいが洪水が来ない（砂川側）
-->

---

# 羽村から 43 km、玉川上水

<img :src="$public('/tamagawa-route.webp')" class="rounded-lg mt-1 mx-auto" style="max-height: 17rem;" />

<div class="grid grid-cols-2 gap-8 mt-1 text-base tight">
<div>

- **1653年**：玉川兄弟が着工、約8か月で完成
- **1654年**：通水、江戸へ給水開始

</div>
<div>

- **標高差わずか約 92 m**で自然流下
- 分水が**武蔵野台地の新田開発**を支えた

</div>
</div>

<p class="src">地図：国土地理院 地理院タイル（数値標高モデル・陰影起伏図・淡色地図）を筆者加工。破線は概略で実際の水路ではない<br>出典：東京都水道局「玉川上水」／文化遺産オンライン「玉川上水」</p>

<!--
羽村取水口 標高約130m、四谷大木戸 約35m（標高APIで筆者計測）。公称の標高差は東京都水道局の「92m」を使う。
小ネタ：途中で水が地中に吸い込まれた「水喰らう土（みずくらいど）」の伝承（伝承として話す）。
その後：1870年 通船（約2年で廃止）→ 1898年 淀橋浄水場への導水路に → 1965年 小平監視所より下流の通水停止 → 1986年 清流復活事業 → 2003年 国史跡指定（開渠部 約30km）
https://www.waterworks.metro.tokyo.lg.jp/documents/d/waterworks/01_setsumei
https://online.bunka.go.jp/db/heritages/detail/218289
-->

---
layout: two-cols
---

# 上水が拓いた砂川新田

::left::

<div class="mt-4 text-lg">

- 台地の上は**水が乏しく**、長く未開の地
- **慶長年間**：村野三右衛門が砂川新田を開墾
- **1657年**：玉川上水から**砂川分水**が開通<br>→ 開発が本格化
- 五日市街道沿いに**屋敷**が並び、<br>その裏に**細長い畑＝短冊地割**

</div>

::right::

<img :src="$public('/sunagawa-tanzaku.webp')" class="rounded-lg mx-auto" style="max-height: 21rem;" />

<p class="src">1974年頃の砂川（右下は現在）：地図タイムマシン／国土地理院・OSM を筆者加工<br>出典：立川市「立川市の歴史（〜1700年代）」／東京都水道局「玉川上水」／文化遺産オンライン「玉川上水」</p>

<!--
「一番町」〜「八番」の地名はこの組の名残。砂川七番駅とか。
-->

---
layout: two-cols
---

# 1889年、甲武鉄道がやってきた

::left::

<div class="mt-2 text-base tight">

- **1889年4月**：新宿〜立川 開通、立川駅開業
  - 同年8月に八王子まで延伸
- 東中野〜立川は**約 25 km の直線**
  - 丘陵だらけの南（町田・横浜方面）と違い、<br>平坦な台地なので一直線に引けた
- 「府中など街道筋が反対した」説は<br>**史料で裏付けられていない俗説**

</div>

<div class="flex gap-3 mt-3 items-end">
  <img :src="$public('/kobu-sl.webp')" class="rounded" style="height: 8rem;" />
  <img :src="$public('/tachikawa-station-old.png')" class="rounded" style="height: 8rem;" />
</div>

<p class="src">左：甲武鉄道初期の蒸気機関車／右：当時の立川駅北口駅舎（立川市歴史民俗資料館 所蔵資料より引用）</p>

::right::

<img :src="$public('/kobu-route.webp')" class="rounded-lg mx-auto" style="max-height: 21rem;" />

<p class="src">地図：国土地理院 地理院タイル（赤色立体地図）を筆者加工。路線は駅間を結んだ概略<br>出典：このまちアーカイブス 立川／乗りものニュース「中央線の東中野～立川間はなぜ直線なのか」</p>

<!--
https://smtrc.jp/town-archives/city/tachikawa/p02.html
https://trafficnews.jp/post/79734 , https://trafficnews.jp/post/79734/2
南口ができるのは1929-30年の南武・五日市鉄道乗り入れ時。
小ネタ（時間があれば口頭で）：駅が北口だけだった理由。村の中心は甲州街道沿い（南）で駅は北の外れ。
機関車用の水を柴崎分水から出すのを立川村がためらい、砂川村が用水を提供。見返りに出入口は砂川村側＝北口に。
-->

---
layout: two-cols
---

# 通過点から「十字路」へ

::left::

<div class="mt-0 text-base summary compact">

| 年 | 路線 | 役割 |
|---|---|---|
| 1889 | 甲武鉄道 | 東西：都心〜八王子 |
| 1894 | 青梅鉄道 | 奥多摩の石灰石 |
| 1929 | 南武鉄道 | 川崎の工業地帯へ |
| 1930 | 五日市鉄道 | 西：五日市方面 |
| 1998 | 多摩モノレール | 南北をつなぐ |

- 南武線・五日市線の乗り入れで**南口**が開設
- 多摩の東西と南北が交わる**交通結節点**に

</div>

::right::

<svg viewBox="0 0 420 342" class="mx-auto" style="max-height: 21rem; width: 100%;" font-family="inherit" font-weight="700">
  <g stroke-width="9" stroke-linecap="round" fill="none">
    <line x1="210" y1="165" x2="405" y2="150" stroke="#e06000" />
    <line x1="210" y1="165" x2="20" y2="225" stroke="#e06000" />
    <line x1="210" y1="165" x2="45" y2="40" stroke="#1060c0" />
    <line x1="210" y1="165" x2="20" y2="120" stroke="#5a8fd0" stroke-dasharray="14 10" />
    <line x1="210" y1="165" x2="380" y2="310" stroke="#c09000" />
    <line x1="210" y1="15" x2="225" y2="315" stroke="#0a8a5a" stroke-width="6" />
  </g>
  <circle cx="210" cy="165" r="26" fill="#fff" stroke="#d10000" stroke-width="7" />
  <text x="210" y="171" text-anchor="middle" style="font-size: 15px;" fill="#d10000">立川</text>
  <g font-size="14" paint-order="stroke" stroke="#fff" stroke-width="5">
    <text x="405" y="138" text-anchor="end" fill="#e06000">中央線 1889 → 新宿</text>
    <text x="20" y="250" fill="#e06000">中央線 1889 → 八王子</text>
    <text x="40" y="28" fill="#1060c0">青梅線 1894 → 奥多摩</text>
    <text x="10" y="108" fill="#5a8fd0">五日市鉄道 1930</text>
    <text x="415" y="336" text-anchor="end" fill="#c09000">南武線 1929 → 川崎</text>
    <text x="232" y="30" fill="#0a8a5a">モノレール 1998 → 上北台</text>
    <text x="214" y="300" text-anchor="end" fill="#0a8a5a">2000 → 多摩センター</text>
  </g>
</svg>

<p class="src">模式図（方向は概略）。出典：立川市「立川市の歴史」／このまちアーカイブス 立川 p02・p06</p>

---
layout: two-cols
---

# 陸軍飛行場から米軍基地へ

::left::

<div class="mt-2 text-lg tight">

- **1922年**：**日本陸軍**の立川飛行場 開設
- **1929年**：「東京飛行場」で日本初の定期航空
- 航空機産業が集まり**軍都**に
- **1945年**：敗戦で**米軍が接収** → **立川基地**
- **1950年**：朝鮮戦争で**極東最大の輸送基地**に
- **1955年**：拡張計画 → **砂川闘争**<br>（1959年 伊達判決）
- **1968年** 拡張中止 → **1969年** 飛行停止

</div>

::right::

<img :src="$public('/aerial-1979.webp')" class="rounded-lg mx-auto" style="max-height: 16rem;" />

<div class="flex gap-3 mt-2 items-center">
  <img :src="$public('/c121-tachikawa.jpg')" class="rounded" style="height: 5rem;" />
  <p class="src">上：1979〜83年頃の空中写真（返還直後、基地の跡が市街地の真ん中に残る）地図タイムマシン／国土地理院・OSM<br>左：立川基地の米空軍 C-121C / Public Domain（USAF）</p>
</div>

<!--
https://smtrc.jp/town-archives/city/tachikawa/p04.html
地形（平坦）と交通（鉄道）の条件がここで効いてくる。1章2章の伏線回収ポイント。
https://smtrc.jp/town-archives/city/tachikawa/p05.html , p07.html
https://kotobank.jp/word/砂川事件
https://www.shugiin.go.jp/internet/itdb_shitsumona.nsf/html/shitsumon/a068007.htm
1956年 強制測量で警官隊と反対派が衝突（口頭で）。
写真の真ん中の滑走路と基地施設が、今の昭和記念公園・自衛隊駐屯地・グリーンスプリングス。
-->

---
layout: two-cols
---

# 1963年、砂川町と合併

::left::

<div class="mt-4 text-lg">

- 合併前の立川市：**約 8.8 km²**
  - 「全国で二番目に狭い市」
- 現在の立川市：**24.36 km²**
- つまり今の立川市の **約 6 割強は旧砂川町**

<div class="mt-6 box">

立川市民でも「北側は砂川町だった」をイメージできる人は少ないかも

</div>

</div>

::right::

<img :src="$public('/merge-1963.webp')" class="rounded-lg mx-auto" style="max-height: 20rem;" />

<p class="src">境界：ROIS-DS人文学オープンデータ共同利用センター「歴史的行政区域データセットβ版」（CC BY 4.0、国土数値情報を加工）、背景：地理院タイル（淡色地図）<br>出典：立川市図書館「立川と砂川の合併について調べる」（『立川市議会史』8.79 km²）／立川市「立川市の概要」<br>面積比は筆者による概算（24.36 − 8.79 = 15.57 km² ≒ 64%）</p>

---
layout: two-cols
---

# 返還が生んだ、都心並みの再開発用地

::left::

<div class="mt-0 text-base summary compact">

| 年 | できごと |
|---|---|
| 1977 | 立川基地 全面返還 |
| 1983 | 国営昭和記念公園 開園 |
| 1994 | ファーレ立川 まちびらき |
| 1995 | 立川広域防災基地 完成 |
| 1998 | 多摩モノレール 開業 |
| 2020 | GREEN SPRINGS 開業 |

- 駅前に**巨大な一団の土地**が出現
- モノレールが**南北の分断**をつないだ

</div>

::right::

<img :src="$public('/base-1974.webp')" class="rounded-lg mx-auto" style="max-height: 21rem;" />

<p class="src">1974年 全面返還前の立川基地<br>国土地理院（CKT7416 を結合）/ CC BY 4.0 / Wikimedia Commons</p>

<!--
今の昭和記念公園・GREEN SPRINGS は、かつての滑走路と基地施設。
昭和記念公園 公式: https://www.showakinen-koen.jp/about/
現代ビジネス: https://gendai.media/articles/-/158916（立飛ホールディングスなど地元企業が跡地を主体的に活用）
-->

---

# まとめ

<div class="mt-4 text-lg summary">

| | 地勢の条件 | 起きたこと | 今の立川 |
|---|---|---|---|
| **地形** | 平坦な台地・崖線 | 玉川上水で砂川を開墾 | 北の 6 割強は旧砂川町 |
| **交通** | 平坦で一直線に引ける | 甲武鉄道 → 4 路線が交わる | 多摩の交通結節点 |
| **軍都** | 平坦・鉄道あり・都心に近い | 陸軍飛行場 → 米軍基地 | 街が南北に分断 |
| **返還** | 巨大な一団の土地 | 公園・防災基地・商業街区 | 東京郊外屈指の商業都市 |

</div>

<p class="mt-6 text-xl">立川の発展は偶然ではなく、<strong>地理環境が幕府や軍事の利点と合致する</strong>という、歴史が積み重なった結果</p>
<p class="mt-2 text-lg">地理から歴史を学び、<strong>街歩き</strong>を楽しもう！</p>
