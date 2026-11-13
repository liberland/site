/**
 * The language a build is for: 'en' (default) or 'zh' (Simplified Chinese, served at /zh/).
 * Set with VITE_LANG=zh at build time. Vite replaces import.meta.env in the page and
 * SSR bundles; the Vite config itself runs in Node, where process.env is read instead.
 */
export type Lang = 'en' | 'zh';

function read() {
  const fromVite = import.meta.env?.VITE_LANG as string | undefined;
  const fromNode = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITE_LANG;
  return fromVite ?? fromNode;
}

export const LANG: Lang = read() === 'zh' ? 'zh' : 'en';

/** The other language, for the language selector. */
export const OTHER: Lang = LANG === 'zh' ? 'en' : 'zh';

/** BCP 47 tags for <html lang>, hreflang and Intl. */
export const LANG_TAG: Record<Lang, string> = { en: 'en', zh: 'zh-CN' };

/** Remembered choice from the language selector (localStorage key). */
export const LANG_STORAGE_KEY = 'gala-lang';
