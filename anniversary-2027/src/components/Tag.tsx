import type { ReactNode } from 'react';

/** Square status tag — a record. "prov" adds the amber provisional dot. */
export function Tag({ children, prov }: { children: ReactNode; prov?: boolean }) {
  return <span className={prov ? 'tag tag-prov' : 'tag'}>{children}</span>;
}

export const Arrow = ({ c = '→' }: { c?: string }) => <span className="arrow" aria-hidden="true">{c}</span>;

/** Renders text with any e-mail address turned into a mailto link. */
export function Linkify({ text }: { text: string }) {
  const parts = text.split(/([^\s@]+@[^\s@]+\.[a-z]{2,})/i);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <a key={i} href={`mailto:${p}`}>{p}</a> : p))}
    </>
  );
}
