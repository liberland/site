import type { Photo } from '../data/anniversary';

/** "1" in the local design-review build: uncleared photographs are shown from public/_reference/ with a visible tag. */
export const REFERENCE = import.meta.env.VITE_REFERENCE_IMAGES === '1';

export type Resolved = { src: string; srcSet: string; reference: boolean } | null;

/**
 * Decides what a photo slot shows.
 *  - cleared photo           → published file from public/images/
 *  - uncleared, reference    → public/_reference/ (never in the production build)
 *  - otherwise               → null: the designed fallback panel
 */
export function resolve(p: Photo): Resolved {
  if (!p.file) return null;
  const dir = p.cleared ? 'images' : REFERENCE ? '_reference' : null;
  if (!dir) return null;
  const base = `${import.meta.env.BASE_URL}${dir}/${p.file}`;
  const widths = p.widths ?? [p.width ?? 1600];
  return {
    src: `${base}-${widths[widths.length - 1]}.webp`,
    srcSet: widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    reference: !p.cleared,
  };
}
