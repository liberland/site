/**
 * Resolves a path inside /public against the site root (e.g. /christmas/).
 * The Chinese page lives in /zh/ but shares the root's public files (photos, film),
 * so they are not copied twice: VITE_PUBLIC_BASE is set by vite.config.ts.
 */
export function withBase(path: string) {
  if (/^(https?:)?\/\//.test(path)) return path;
  const root = (import.meta.env.VITE_PUBLIC_BASE as string | undefined) ?? import.meta.env.BASE_URL;
  return `${root}${path.replace(/^\//, '')}`;
}
