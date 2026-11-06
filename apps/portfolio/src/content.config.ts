import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { findDecks } from "@daitasu/shared/decks";
import { talks as talkEntries } from "talks/config";
import { fetchProfileMarkdown, PROFILE_DOCUMENTS, rewriteProfileLinks } from "./lib/profile.ts";
import { fetchSpeakerdeckEmbed } from "./lib/speakerdeck.ts";
import { resolveTalks, talkItemSchema } from "./lib/talks.ts";

const profile = defineCollection({
  loader: {
    name: "profile-loader",
    load: async ({ store, renderMarkdown }) => {
      store.clear();
      await Promise.all(
        PROFILE_DOCUMENTS.map(async ({ id, fileName }) => {
          const body = rewriteProfileLinks(await fetchProfileMarkdown(fileName));
          store.set({ id, data: {}, body, rendered: await renderMarkdown(body) });
        }),
      );
    },
  },
  schema: z.object({}),
});

const talks = defineCollection({
  loader: {
    name: "talks-loader",
    load: async ({ store, logger, parseData, config }) => {
      store.clear();
      const publicDir = fileURLToPath(config.publicDir);
      const items = await resolveTalks(talkEntries, {
        decks: findDecks(fileURLToPath(new URL("../talks/", config.root))),
        hasSlideFile: (slug, fileName) => existsSync(join(publicDir, "slides", slug, fileName)),
        fetchSpeakerdeckEmbed,
        warn: (message) => logger.warn(message),
      });
      await Promise.all(
        items.map(async (item) => store.set({ id: item.slug, data: await parseData({ id: item.slug, data: item }) })),
      );
    },
  },
  schema: talkItemSchema,
});

export const collections = { profile, talks };
