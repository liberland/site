import type { CSSProperties } from 'react';
import type { Photo as PhotoT } from '../data/anniversary';
import { resolve } from '../lib/photo';

type Props = {
  photo: PhotoT;
  /** Extra classes on the .ph slot: warm | river | dark | big | small … (design fallback variants). */
  className?: string;
  /** Responsive sizes hint for srcset. */
  sizes: string;
  /** Second word of the slot label: "Required", "Archive", "Portrait". */
  kind?: string;
  /** Hero only. */
  eager?: boolean;
  style?: CSSProperties;
};

/**
 * One photograph slot from the design. Shows the cleared photograph when there is one; otherwise the
 * art-directed fallback panel with its production label (IMG-xx · Required · brief), exactly as designed.
 */
export function Photo({ photo, className = '', sizes, kind = 'Required', eager, style }: Props) {
  const r = resolve(photo);
  return (
    <div className={`ph ${className}`.trim()} style={style}>
      {r ? (
        <>
          <img
            src={r.src}
            srcSet={r.srcSet}
            sizes={sizes}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            style={photo.focus ? { objectPosition: photo.focus } : undefined}
          />
          {r.reference && <span className="ref-tag">Reference image · not cleared for publication</span>}
        </>
      ) : (
        <div className="ph-in">
          <span className="rec">{photo.id} · {kind}</span>
          <span className="ph-t">{photo.brief}</span>
          {photo.note && <span className="rec">{photo.note}</span>}
        </div>
      )}
    </div>
  );
}
