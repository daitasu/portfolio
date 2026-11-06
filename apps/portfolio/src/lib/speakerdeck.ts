export type SpeakerdeckEmbed = {
  title: string;
  playerUrl: string;
  image: string;
  /** 一覧カード用の縮小版（640x360）。 */
  thumbnail: string;
};

const OEMBED_ENDPOINT = "https://speakerdeck.com/oembed.json";
const PRESENTATION_FILES_BASE_URL = "https://files.speakerdeck.com/presentations";
const PLAYER_SRC_PATTERN = /src="(https:\/\/speakerdeck\.com\/player\/([0-9a-f]+))"/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * oEmbed の html に含まれるプレイヤー iframe から埋め込み URL を取り出す。形式が想定外なら null。
 * 表紙画像は oEmbed に無いので、プレイヤー URL の ID から files.speakerdeck.com の URL を組み立てる。
 * slide_0.jpg（1440x810）は OGP 用、preview_slide_0.jpg（640x360）は一覧カード用。
 */
export const parseOembed = (json: unknown): SpeakerdeckEmbed | null => {
  if (!isRecord(json) || typeof json.html !== "string") return null;
  const match = json.html.match(PLAYER_SRC_PATTERN);
  const playerUrl = match?.[1];
  const presentationId = match?.[2];
  if (playerUrl === undefined || presentationId === undefined) return null;
  return {
    title: typeof json.title === "string" ? json.title : "",
    playerUrl,
    image: `${PRESENTATION_FILES_BASE_URL}/${presentationId}/slide_0.jpg`,
    thumbnail: `${PRESENTATION_FILES_BASE_URL}/${presentationId}/preview_slide_0.jpg`,
  };
};

/** 取得に失敗したら null（詳細ページは SpeakerDeck へのリンクだけを出す）。 */
export const fetchSpeakerdeckEmbed = async (talkUrl: string): Promise<SpeakerdeckEmbed | null> => {
  try {
    const response = await fetch(`${OEMBED_ENDPOINT}?url=${encodeURIComponent(talkUrl)}`);
    if (!response.ok) return null;
    return parseOembed(await response.json());
  } catch {
    return null;
  }
};
