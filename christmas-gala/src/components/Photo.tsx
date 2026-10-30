import type { ReactNode } from 'react';
import type { Photo as PhotoData } from '../data/event';
import { resolvePhoto } from '../lib/event-helpers';

/**
 * A venue photograph. Renders the cleared image, or — in a local reference
 * build — the uncleared image with a visible "not cleared" tag. When neither is
 * available it renders `fallback` (each section supplies its own designed state).
 */
export function Photo({
  photo,
  sizes,
  className = '',
  eager = false,
  fallback = null,
  showTag = true,
}: {
  photo: PhotoData;
  sizes: string;
  className?: string;
  eager?: boolean;
  fallback?: ReactNode;
  showTag?: boolean;
}) {
  const r = resolvePhoto(photo);
  if (!r) return <>{fallback}</>;
  return (
    <>
      <img
        className={className}
        src={r.src}
        srcSet={r.srcSet}
        sizes={sizes}
        alt={photo.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={photo.focus ? { objectPosition: photo.focus } : undefined}
        {...(eager ? { fetchpriority: 'high' } : {})}
      />
      {showTag && r.reference && <RefTag />}
    </>
  );
}

export function RefTag() {
  return (
    <span className="ref-tag" title="Design reference only. Publication requires written permission from Le Palais Art Hotel Prague.">
      Reference image · not cleared for publication · © Le Palais
    </span>
  );
}
