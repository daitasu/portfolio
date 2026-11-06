import type { Deck } from "@daitasu/shared/decks";
import type { TalkEntry } from "@daitasu/shared/talks";
import { describe, expect, it, vi } from "vitest";
import { describeTalk, resolveTalks, type ResolveTalksDeps, type TalkItem } from "./talks.ts";

const DECK: Deck = {
  slug: "2026/0708_nihonbashijs",
  slidesPath: "/repo/apps/talks/2026/0708_nihonbashijs/slides.md",
  title: "Generative UI の逐次描画",
  date: "2026-07-08",
  event: "Nihonbashi.js #11",
  eventUrl: "https://example.com/events/11",
  description: "",
};

const SPEAKERDECK_ENTRY: TalkEntry = {
  kind: "speakerdeck",
  slug: "2025/0911_dplus-tokyo",
  url: "https://speakerdeck.com/daitasu/dplus",
  date: "2025-09-11",
  event: "D-Plus Tokyo #18",
};

const EMBED = {
  title: "職種の壁を溶かして",
  playerUrl: "https://speakerdeck.com/player/abc123",
  image: "https://files.speakerdeck.com/presentations/abc123/slide_0.jpg",
  thumbnail: "https://files.speakerdeck.com/presentations/abc123/preview_slide_0.jpg",
};

const createDeps = (overrides: Partial<ResolveTalksDeps> = {}): ResolveTalksDeps => ({
  decks: [DECK],
  hasSlideFile: () => true,
  fetchSpeakerdeckEmbed: vi.fn().mockResolvedValue(EMBED),
  warn: vi.fn(),
  ...overrides,
});

const resolveOne = async (entry: TalkEntry, deps: ResolveTalksDeps = createDeps()): Promise<TalkItem | undefined> =>
  (await resolveTalks([entry], deps))[0];

describe("describeTalk", () => {
  it("イベント名があれば文中に入れること", () => {
    expect(describeTalk("2026-07-08", "Nihonbashi.js #11")).toBe("2026年7月8日 「Nihonbashi.js #11」における登壇資料です。");
  });

  it("イベント名が無ければ日付だけで説明すること", () => {
    expect(describeTalk("2026-07-08", "")).toBe("2026年7月8日の登壇資料です。");
  });

  it("日付が無ければイベント名だけで説明すること", () => {
    expect(describeTalk("", "Nihonbashi.js #11")).toBe("「Nihonbashi.js #11」における登壇資料です。");
  });

  it("どちらも無ければ汎用の説明にすること", () => {
    expect(describeTalk("", "")).toBe("登壇資料です。");
  });
});

describe("resolveTalks", () => {
  describe("slidev", () => {
    it("デッキの frontmatter から title を解決すること", async () => {
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }))?.title).toBe(DECK.title);
    });

    it("デッキの eventUrl を引き継ぐこと", async () => {
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }))?.eventUrl).toBe(DECK.eventUrl);
    });

    it("埋め込み先を /slides/ 配下のデッキにすること", async () => {
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }))?.embedUrl).toBe("/slides/2026/0708_nihonbashijs/");
    });

    it("表紙画像があれば og.png を image にすること", async () => {
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }))?.image).toBe("/slides/2026/0708_nihonbashijs/og.png");
    });

    it("表紙画像が無ければ image を空にすること", async () => {
      const deps = createDeps({ hasSlideFile: () => false });
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }, deps))?.image).toBe("");
    });

    it("縮小画像があれば thumb.webp を thumbnail にすること", async () => {
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }))?.thumbnail).toBe(
        "/slides/2026/0708_nihonbashijs/thumb.webp",
      );
    });

    it("縮小画像が無ければ og.png を thumbnail にすること", async () => {
      const deps = createDeps({ hasSlideFile: (_slug, fileName) => fileName === "og.png" });
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }, deps))?.thumbnail).toBe(
        "/slides/2026/0708_nihonbashijs/og.png",
      );
    });

    it("表紙画像も縮小画像も無ければ thumbnail を空にすること", async () => {
      const deps = createDeps({ hasSlideFile: () => false });
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }, deps))?.thumbnail).toBe("");
    });

    it("description が無ければ日付とイベント名から作ること", async () => {
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug }))?.description).toBe(
        "2026年7月8日 「Nihonbashi.js #11」における登壇資料です。",
      );
    });

    it("draft は一覧に出さないこと", async () => {
      expect((await resolveOne({ kind: "slidev", slug: DECK.slug, status: "draft" }))?.listed).toBe(false);
    });

    it("デッキが見つからないエントリを除くこと", async () => {
      expect(await resolveTalks([{ kind: "slidev", slug: "2026/missing" }], createDeps())).toEqual([]);
    });

    it("デッキが見つからないエントリを警告すること", async () => {
      const warn = vi.fn();
      await resolveTalks([{ kind: "slidev", slug: "2026/missing" }], createDeps({ warn }));
      expect(warn).toHaveBeenCalledWith('slidev slug 未検出 "2026/missing"');
    });
  });

  describe("speakerdeck", () => {
    it("oEmbed の title を使うこと", async () => {
      expect((await resolveOne(SPEAKERDECK_ENTRY))?.title).toBe(EMBED.title);
    });

    it("config の title を oEmbed より優先すること", async () => {
      expect((await resolveOne({ ...SPEAKERDECK_ENTRY, title: "手書きタイトル" }))?.title).toBe("手書きタイトル");
    });

    it("プレイヤーの URL を埋め込み先にすること", async () => {
      expect((await resolveOne(SPEAKERDECK_ENTRY))?.embedUrl).toBe(EMBED.playerUrl);
    });

    it("SpeakerDeck の URL を sourceUrl にすること", async () => {
      expect((await resolveOne(SPEAKERDECK_ENTRY))?.sourceUrl).toBe(SPEAKERDECK_ENTRY.url);
    });

    it("SpeakerDeck の縮小画像を thumbnail にすること", async () => {
      expect((await resolveOne(SPEAKERDECK_ENTRY))?.thumbnail).toBe(EMBED.thumbnail);
    });

    it("config の image を thumbnail にも使うこと", async () => {
      const image = "https://example.com/cover.png";
      expect((await resolveOne({ ...SPEAKERDECK_ENTRY, image }))?.thumbnail).toBe(image);
    });

    it("eventUrl が無ければ空文字にすること", async () => {
      expect((await resolveOne(SPEAKERDECK_ENTRY))?.eventUrl).toBe("");
    });

    it("取得に失敗したら URL を title にすること", async () => {
      const deps = createDeps({ fetchSpeakerdeckEmbed: vi.fn().mockResolvedValue(null) });
      expect((await resolveOne(SPEAKERDECK_ENTRY, deps))?.title).toBe(SPEAKERDECK_ENTRY.url);
    });

    it("取得に失敗したら埋め込みなしにすること", async () => {
      const deps = createDeps({ fetchSpeakerdeckEmbed: vi.fn().mockResolvedValue(null) });
      expect((await resolveOne(SPEAKERDECK_ENTRY, deps))?.embedUrl).toBe("");
    });

    it("取得に失敗したら警告すること", async () => {
      const warn = vi.fn();
      await resolveOne(SPEAKERDECK_ENTRY, createDeps({ fetchSpeakerdeckEmbed: vi.fn().mockResolvedValue(null), warn }));
      expect(warn).toHaveBeenCalledWith(`SpeakerDeck の埋め込み取得に失敗 ${SPEAKERDECK_ENTRY.url}`);
    });
  });
});
