/** title の末尾・og:site_name・ヘッダーに出すサイト名。 */
export const SITE_NAME = "daitasu.work";

/**
 * GitHub のアイコン。github.com/<user>.png はリダイレクトを挟み原寸（460px）を返すので、
 * 画像ホストを直接指してトップの表示サイズ（96px）の 2 倍に絞る。ヘッダーも同じ URL にしてキャッシュを共有する。
 */
export const AVATAR_URL = "https://avatars.githubusercontent.com/u/28728602?s=192";
