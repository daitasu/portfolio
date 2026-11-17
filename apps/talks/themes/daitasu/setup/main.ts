import configs from "#slidev/configs";
import { defineAppSetup } from "@slidev/types";

export default defineAppSetup(({ app, router }) => {
  // headmatter の themeConfig を <html> のクラスにして、layouts.css で見た目を切り替える。
  // palette: navy → dt-navy（ポートフォリオと同じネイビーのダーク）、motif: wind → dt-motif-wind（未指定は波）
  const { palette, motif } = configs.themeConfig ?? {};
  if (palette === "navy") document.documentElement.classList.add("dt-navy");
  if (motif) document.documentElement.classList.add(`dt-motif-${motif}`);

  // Prefix a public-asset path with the deploy base so it resolves under a
  // sub-route (e.g. /talks/2026/slug/). Use in slides: :src="$public('/foo.png')"
  app.config.globalProperties.$public = (p: string) =>
    import.meta.env.BASE_URL + String(p).replace(/^\//, "");

  // Workaround for Slidev 52.16.0: getSlidePath() returns a BASE_URL-prefixed
  // path and router.push() prepends the history base again, so under --base
  // navigation lands on /base/base/<n> and 404s. Strip the extra base here.
  const base = import.meta.env.BASE_URL;
  if (base !== "/") {
    router.beforeEach((to) => {
      if (to.path.startsWith(base)) {
        const fixed = "/" + to.path.slice(base.length);
        if (fixed !== to.path) return fixed;
      }
    });
  }
});
