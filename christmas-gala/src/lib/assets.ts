/** Resolves a path inside /public against the deployment base (e.g. /christmas/). */
export function withBase(path: string) {
  if (/^(https?:)?\/\//.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
