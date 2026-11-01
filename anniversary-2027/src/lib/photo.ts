import type { Photo } from '../data/anniversary';

/** "1" in a local review build: photos with cleared:false are shown from public/_reference/ with a visible tag. */
export const REFERENCE = import.meta.env.VITE_REFERENCE_IMAGES === '1';

export type Resolved = { src: string; srcSet: string; reference: boolean } | null;

/** The published file for a photo, or null when it must not be shown (the layout then omits it — never a placeholder). */
export function resolve(p: Photo | null | undefined): Resolved {
  if (!p) return null;
  const dir = p.cleared ? 'images' : REFERENCE ? '_reference' : null;
  if (!dir) return null;
  const base = `${import.meta.env.BASE_URL}${dir}/${p.file}`;
  return {
    src: `${base}-${p.widths[p.widths.length - 1]}.webp`,
    srcSet: p.widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    reference: !p.cleared,
  };
}
