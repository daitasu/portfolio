// ポートフォリオの /talks 一覧と /talks/<slug>/ 詳細ページに並べる登壇の master リスト。
// 一覧は日付降順で表示される。型は packages/shared/src/talks.ts を参照。
import type { TalkEntry } from "@daitasu/shared/talks";

export const talks: TalkEntry[] = [
  { kind: "slidev", slug: "2026/261019_ginzajs" },
  { kind: "slidev", slug: "2026/261016_tamadev" },
  { kind: "slidev", slug: "2026/261012_frontendconf_kansai" },
  { kind: "slidev", slug: "2026/0907_gotandats" },
  { kind: "slidev", slug: "2026/0710_tamagawadev" },
  { kind: "slidev", slug: "2026/0708_nihonbashijs" },
  { kind: "slidev", slug: "2026/0612_tamadev" },

  // 過去の SpeakerDeck 登壇。title / 画像 / 埋め込みは build 時に URL から取得する。
  // 2026/0612 は slidev 版があるので、SpeakerDeck 版は載せない。
  { kind: "speakerdeck", slug: "2026/0512_tachikawaany-opening", url: "https://speakerdeck.com/daitasu/tachikawa-dot-any-yun-ying-ai-zan", date: "2026-05-12", event: "Tachikawa.any" },
  { kind: "speakerdeck", slug: "2026/0410_why-local-community", url: "https://speakerdeck.com/daitasu/tachikawa-dot-any-shi-memasita-di-yu-komiyuniteiwonazeli-tishang-gerunoka-chu-metenoli-tishang-genobi", date: "2026-04-10" },
  { kind: "speakerdeck", slug: "2026/0304_delegation", url: "https://speakerdeck.com/daitasu/kai-fa-zu-zhi-noke-ti-jie-jue-wojia-su-surutamenoquan-xian-yi-rang-suruce-sareruce-tositenoxiang-kihe-ifang", date: "2026-03-04", event: "Engineering Management Conference Japan 2026" },
  { kind: "speakerdeck", slug: "2026/0219_driven-development", url: "https://speakerdeck.com/daitasu/koji-xian-nixue-he-qin-hokeyan-noqin-tatihezeng-ru-you-nolun-qu-dong-kai-fa", date: "2026-02-19" },
  { kind: "speakerdeck", slug: "2026/0109_tanstack-ai", url: "https://speakerdeck.com/daitasu/xing-an-quan-defei-yi-cun-naqing-liang-aiezientohuremuwaku-tankstack-ai", date: "2026-01-09" },
  { kind: "speakerdeck", slug: "2025/1112_mcp-ui", url: "https://speakerdeck.com/daitasu/aiezientogadui-hua-de-nauiwofan-su-mcp-uidebian-waruyuzati-yan", date: "2025-11-12" },
  { kind: "speakerdeck", slug: "2025/0911_dplus-tokyo", url: "https://speakerdeck.com/daitasu/zhi-zhong-nobi-worong-kasitekai-fa-saikuruwogao-su-nihui-su-qing-bao-tou-ming-xing-tozhi-zhong-yue-jing-karakao-eruaihurendorinazhi-zhong-jian-lian-xi", date: "2025-09-11", event: "D-Plus Tokyo #18" },
  { kind: "speakerdeck", slug: "2025/0822_evaluation", url: "https://speakerdeck.com/daitasu/minna-xiao-yan-ninaare-woshi-xian-suru-zhi-zhong-hun-he-kai-fa-zu-zhi-nomu-biao-she-ding-ping-jia-nogai-shan-shi-li", date: "2025-08-22", event: "教えて！おたくの評価制度" },
  { kind: "speakerdeck", slug: "2025/0319_railway-oriented-programming", url: "https://speakerdeck.com/daitasu/typescript-de-railway-oriented-programming-xing-an-quan-naerahandoringuwozuo-ru", date: "2025-03-19", event: "コネヒトさんとのクローズドイベント" },
  { kind: "speakerdeck", slug: "2024/0723_where-we-are", url: "https://speakerdeck.com/daitasu/establishing-a-system-for-continuous-inquiry-about-where-we-are", date: "2024-07-23", event: "SEN Developer Meetsup" },
  { kind: "speakerdeck", slug: "2022/0310_stores-designsystem", url: "https://speakerdeck.com/daitasu/designsystem-history-stores-20220310", date: "2022-03-10", event: "Frontend Talk 〜デザインシステム構築のリアルな裏側〜【hey｜note｜ANDPAD】" },
  { kind: "speakerdeck", slug: "2020/1212_cross-functional-scrum", url: "https://speakerdeck.com/daitasu/zhi-neng-heng-duan-xing-sukuramuti-zhi-ninatutekarafalsetimugai-shan-huo-dong-improvement-activity-for-multi-functional-team", date: "2020-12-12", event: "Developer Boost 2020" },
  { kind: "speakerdeck", slug: "2019/1024_stores-components-design", url: "https://speakerdeck.com/daitasu/components-design-of-frontend-in-stores-dot-jp", date: "2019-10-24", event: "STORES.jp Meetup for Front-end Engineers #1" },
  { kind: "speakerdeck", slug: "2019/0322_vue-animation", url: "https://speakerdeck.com/daitasu/vuedefalseanimesiyonfalsehua", date: "2019-03-22" },
  { kind: "speakerdeck", slug: "2018/1212_liff-sentry", url: "https://speakerdeck.com/daitasu/lifffalseogong-nisentryhaikaga", date: "2018-12-12" },
];
