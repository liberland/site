import type { ReactNode } from 'react';

/** Small rounded status pill. "prov" marks something provisional. */
export function Pill({ children, prov, ok }: { children: ReactNode; prov?: boolean; ok?: boolean }) {
  return <span className={`pill${prov ? ' pill-prov' : ''}${ok ? ' pill-ok' : ''}`}>{children}</span>;
}

export const Arrow = ({ c = '→' }: { c?: string }) => <span className="arrow" aria-hidden="true">{c}</span>;
export const NewTab = () => <span className="vh"> (opens in a new tab)</span>;

/** Renders text with any e-mail address turned into a mailto link. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(/([^\s@]+@[^\s@]+\.[a-z]{2,})/i);
  return <>{parts.map((p, i) => (i % 2 ? <a key={i} href={`mailto:${p}`}>{p}</a> : p))}</>;
}
