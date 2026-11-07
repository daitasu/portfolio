import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchSpeakerdeckEmbed, parseOembed } from "./speakerdeck.ts";

const OEMBED_RESPONSE = {
  type: "rich",
  title: "Vueでのアニメーションの話",
  html: '<iframe id="talk_frame_507793" class="speakerdeck-iframe" src="https://speakerdeck.com/player/ac9ab729957b4e6fb37f2589937845b5" width="710" height="399"></iframe>\n',
};

describe("parseOembed", () => {
  describe("正常系", () => {
    it("プレイヤーの URL を取り出すこと", () => {
      expect(parseOembed(OEMBED_RESPONSE)?.playerUrl).toBe(
        "https://speakerdeck.com/player/ac9ab729957b4e6fb37f2589937845b5",
      );
    });

    it("プレゼンテーション ID から表紙画像の URL を組み立てること", () => {
      expect(parseOembed(OEMBED_RESPONSE)?.image).toBe(
        "https://files.speakerdeck.com/presentations/ac9ab729957b4e6fb37f2589937845b5/slide_0.jpg",
      );
    });

    it("プレゼンテーション ID から一覧用の縮小画像の URL を組み立てること", () => {
      expect(parseOembed(OEMBED_RESPONSE)?.thumbnail).toBe(
        "https://files.speakerdeck.com/presentations/ac9ab729957b4e6fb37f2589937845b5/preview_slide_0.jpg",
      );
    });

    it("title を取り出すこと", () => {
      expect(parseOembed(OEMBED_RESPONSE)?.title).toBe("Vueでのアニメーションの話");
    });

    it("title が無ければ空文字にすること", () => {
      expect(parseOembed({ html: OEMBED_RESPONSE.html })?.title).toBe("");
    });
  });

  describe("異常系", () => {
    it("オブジェクトでなければ null を返すこと", () => {
      expect(parseOembed("not json")).toBeNull();
    });

    it("html が無ければ null を返すこと", () => {
      expect(parseOembed({ title: "x" })).toBeNull();
    });

    it("html にプレイヤーの iframe が無ければ null を返すこと", () => {
      expect(parseOembed({ html: '<iframe src="https://example.com/embed"></iframe>' })).toBeNull();
    });
  });
});

describe("fetchSpeakerdeckEmbed", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("oEmbed エンドポイントに talk の URL をエンコードして渡すこと", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(OEMBED_RESPONSE)));
    vi.stubGlobal("fetch", fetchMock);
    await fetchSpeakerdeckEmbed("https://speakerdeck.com/daitasu/vue");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://speakerdeck.com/oembed.json?url=https%3A%2F%2Fspeakerdeck.com%2Fdaitasu%2Fvue",
    );
  });

  it("成功時に埋め込み情報を返すこと", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(OEMBED_RESPONSE))));
    expect((await fetchSpeakerdeckEmbed("https://speakerdeck.com/daitasu/vue"))?.title).toBe(
      "Vueでのアニメーションの話",
    );
  });

  it("HTTP エラーなら null を返すこと", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 404 })));
    expect(await fetchSpeakerdeckEmbed("https://speakerdeck.com/daitasu/missing")).toBeNull();
  });

  it("通信エラーでも例外を投げず null を返すこと", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    expect(await fetchSpeakerdeckEmbed("https://speakerdeck.com/daitasu/vue")).toBeNull();
  });
});
