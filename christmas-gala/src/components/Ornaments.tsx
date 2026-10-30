/* Christmas ornamentation: procedurally drawn fir garlands, wreath and baubles
   (scripts/ornaments/), plus vector filigree. All decorative — aria-hidden. */
import type { CSSProperties } from 'react';
import meta from '../assets/ornaments/ornaments.json';
import swag from '../assets/ornaments/garland-swag.webp';
import swagHalf from '../assets/ornaments/garland-swag-half.webp';
import rope from '../assets/ornaments/garland-rope.webp';
import ropeHalf from '../assets/ornaments/garland-rope-half.webp';
import wreath from '../assets/ornaments/wreath.webp';
import wreathHalf from '../assets/ornaments/wreath-half.webp';
import corner from '../assets/ornaments/corner-spray.webp';
import cornerHalf from '../assets/ornaments/corner-spray-half.webp';
import bBurgundy from '../assets/ornaments/bauble-burgundy.webp';
import bGold from '../assets/ornaments/bauble-gold.webp';
import bRed from '../assets/ornaments/bauble-red.webp';
import bIvory from '../assets/ornaments/bauble-ivory.webp';

type Meta = Record<string, { w: number; h: number; lights: [number, number, number][] }>;
const M = meta as unknown as Meta;

/** Gentle twinkle over the drawn fairy lights (same positions as in the artwork). */
function Twinkles({ name, every = 4 }: { name: string; every?: number }) {
  return (
    <span className="twinkles">
      {M[name].lights
        .filter((_, i) => i % every === 0)
        .map(([x, y, s], i) => (
          <i
            key={i}
            style={{ left: `${x * 100}%`, top: `${y * 100}%`, '--d': `${(i * 0.73) % 4.2}s`, '--s': s } as CSSProperties}
          />
        ))}
    </span>
  );
}

export function Garland({ kind, className = '', eager = false, twinkle = true }: { kind: 'swag' | 'rope'; className?: string; eager?: boolean; twinkle?: boolean }) {
  const name = kind === 'swag' ? 'garland-swag' : 'garland-rope';
  const [full, half] = kind === 'swag' ? [swag, swagHalf] : [rope, ropeHalf];
  const { w, h } = M[name];
  return (
    <div className={`garland garland--${kind} ${className}`} aria-hidden="true">
      <img
        src={full}
        srcSet={`${half} ${w / 2}w, ${full} ${w}w`}
        sizes="100vw"
        width={w}
        height={h}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchpriority: 'high' } : {})}
      />
      {twinkle && <Twinkles name={name} />}
    </div>
  );
}

export function Wreath({ className = '' }: { className?: string }) {
  const { w, h } = M.wreath;
  return (
    <div className={`wreath ${className}`} aria-hidden="true">
      <img src={wreath} srcSet={`${wreathHalf} ${w / 2}w, ${wreath} ${w}w`} sizes="(max-width: 760px) 90vw, 760px" width={w} height={h} alt="" loading="lazy" decoding="async" />
      <Twinkles name="wreath" every={3} />
    </div>
  );
}

export function CornerSpray({ side, className = '' }: { side: 'left' | 'right'; className?: string }) {
  const { w, h } = M['corner-spray'];
  return (
    <div className={`corner corner--${side} ${className}`} aria-hidden="true">
      <img src={corner} srcSet={`${cornerHalf} ${w / 2}w, ${corner} ${w}w`} sizes="(max-width: 760px) 60vw, 520px" width={w} height={h} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

const BAUBLES = { burgundy: bBurgundy, gold: bGold, red: bRed, ivory: bIvory };

/** Baubles hanging on gold threads from the top edge of a section, swaying gently. */
export function HangingBaubles({ items }: { items: { x: string; len: number; size: number; kind: keyof typeof BAUBLES }[] }) {
  return (
    <div className="hanging" aria-hidden="true">
      {items.map((b, i) => (
        <span key={i} className="hang" style={{ left: b.x, '--len': `${b.len}px`, '--size': `${b.size}px`, '--d': `${i * -1.3}s` } as CSSProperties}>
          <img src={BAUBLES[b.kind]} alt="" width={b.size} height={Math.round(b.size * 1.12)} loading="lazy" decoding="async" />
        </span>
      ))}
    </div>
  );
}

/** Gold filigree divider: scrolls, a star at the centre. */
export function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg className={`flourish ${className}`} viewBox="0 0 320 28" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M8 14H118" strokeWidth=".8" opacity=".6" />
      <path d="M202 14H312" strokeWidth=".8" opacity=".6" />
      <path d="M118 14c8-9 18-9 22-3s-4 11-9 7 1-9 6-6" strokeWidth="1" />
      <path d="M202 14c-8-9-18-9-22-3s4 11 9 7-1-9-6-6" strokeWidth="1" />
      <path d="M118 14c8 9 18 9 22 3" strokeWidth=".8" opacity=".7" />
      <path d="M202 14c-8 9-18 9-22 3" strokeWidth=".8" opacity=".7" />
      <path d="M160 3l2.6 8.4L171 14l-8.4 2.6L160 25l-2.6-8.4L149 14l8.4-2.6z" fill="currentColor" stroke="none" />
      <circle cx="4" cy="14" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="316" cy="14" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Small eight-point star, used as a bullet and timeline node. */
export function Star({ className = '' }: { className?: string }) {
  return (
    <svg className={`star ${className}`} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 1l2.2 6.8L21 10l-6.8 2.2L12 19l-2.2-6.8L3 10l6.8-2.2z" />
      <path d="M12 6.5l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="var(--star-core, #fff6dc)" opacity=".7" />
    </svg>
  );
}
