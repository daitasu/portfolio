export const SITE_URL = "https://daitasu.work";

/**
 * talks.config.ts に並べる登壇 1 件。
 * slug は "<year>/<dir>"（例: "2026/0708_nihonbashijs"）で、詳細ページ・スライド本体の URL に使う。
 */
export type TalkEntry =
  | {
      kind: "slidev";
      /** apps/talks/<slug>/slides.md の <slug>。title / date / event はデッキの frontmatter から解決する。 */
      slug: string;
      /** "draft" は一覧に出さない（詳細ページとデッキはビルドされ URL 直開きは可能）。未指定は "shipped"。 */
      status?: "draft" | "shipped";
    }
  | {
      kind: "speakerdeck";
      slug: string;
      url: string;
      /** 登壇日（SpeakerDeck からは取れないので手動）。"YYYY-MM-DD"。 */
      date: string;
      event?: string;
      eventUrl?: string;
      /** 取得した oEmbed の title より優先する。取得に失敗したときの代わりにもなる。 */
      title?: string;
      /** SpeakerDeck の表紙画像より優先する。取得に失敗したときの代わりにもなる。 */
      image?: string;
    };

export const toTalkPath = (slug: string): string => `/talks/${slug}/`;

export const toSlidesPath = (slug: string): string => `/slides/${slug}/`;
