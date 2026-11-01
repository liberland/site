import type { Photo as PhotoT } from '../data/anniversary';
import { resolve } from '../lib/photo';

type ImgProps = { photo: PhotoT; sizes: string; eager?: boolean; className?: string };

/** A bare <img> for a photo (or nothing at all if it is not cleared). */
export function Img({ photo, sizes, eager, className }: ImgProps) {
  const r = resolve(photo);
  if (!r) return null;
  return (
    <img
      className={className}
      src={r.src}
      srcSet={r.srcSet}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      {...(eager ? { fetchpriority: 'high' } : {})}
      style={photo.focus ? { objectPosition: photo.focus } : undefined}
    />
  );
}

type FigProps = ImgProps & { caption?: boolean; children?: React.ReactNode };

/**
 * A captioned photograph. Returns null when the photo is not cleared, so a section simply recomposes
 * around the photographs it has — there is no placeholder state.
 */
export function Figure({ photo, sizes, eager, className = '', caption = true, children }: FigProps) {
  const r = resolve(photo);
  if (!r) return null;
  return (
    <figure className={`ph ${className}`.trim()}>
      <div className="ph-frame">
        <Img photo={photo} sizes={sizes} eager={eager} />
        {r.reference && <span className="ref-tag">Reference · not cleared</span>}
      </div>
      {children}
      {caption && photo.caption && <figcaption>{photo.caption}</figcaption>}
    </figure>
  );
}
