import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { toTalkPath } from "@daitasu/shared/talks";
import { SITE_NAME } from "../../lib/site.ts";

export const GET: APIRoute = async ({ site }) => {
  const talks = (await getCollection("talks"))
    .map((entry) => entry.data)
    .filter((talk) => talk.listed)
    .toSorted((a, b) => b.date.localeCompare(a.date));

  return rss({
    title: `Talks | ${SITE_NAME}`,
    description: "daitasu の登壇スライドまとめ",
    site: site ?? "",
    items: talks.map((talk) => ({
      title: talk.title,
      link: toTalkPath(talk.slug),
      pubDate: new Date(talk.date),
      description: talk.description,
    })),
  });
};
