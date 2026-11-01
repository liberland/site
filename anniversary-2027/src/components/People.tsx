import { useState } from 'react';
import { event, people, photos, type ParticipationStatus } from '../data/anniversary';
import { resolve } from '../lib/photo';
import { Figure, Img } from './Photo';
import { Pill } from './Tag';

const STATUS: Record<ParticipationStatus, { label: string; ok?: boolean; prov?: boolean }> = {
  speaker: { label: 'Confirmed speaker', ok: true },
  guest: { label: 'Confirmed guest', ok: true },
  featured: { label: 'Featured community figure' },
  pending: { label: 'Participation pending', prov: true },
};
type Key = 'all' | ParticipationStatus;
const EMPTY: Record<ParticipationStatus, string> = {
  speaker: `No speakers are confirmed for ${event.year} yet.`,
  guest: `No guests are confirmed for ${event.year} yet.`,
  featured: 'No featured figures in this view.',
  pending: 'No invitations are currently marked as pending.',
};
const sorted = [...people].sort((a, b) => a.order - b.order);
const used = [...new Set(people.map((p) => p.status))];

/** E · The people — real portraits; a person without a cleared portrait is shown as a typographic profile. */
export function People() {
  const [filter, setFilter] = useState<Key>('all');
  const shown = sorted.filter((p) => filter === 'all' || p.status === filter);
  // Filter chips only earn their place once more than one participation status is in use.
  const chips: Key[] = used.length > 1 ? ['all', ...(['speaker', 'guest', 'featured', 'pending'] as const).filter((k) => used.includes(k))] : [];

  return (
    <section id="faces" className="sec" aria-labelledby="faces-title">
      <div className="wrap">
        <div className="sec-head rv">
          <h2 id="faces-title" className="h2">The people</h2>
          <p className="lead">
            Liberland figures and community representatives. Speakers and guests for {event.year} will be added here as their
            participation is confirmed.
          </p>
        </div>
        {chips.length > 0 && (
          <div className="chips" role="group" aria-label="Filter by participation status">
            {chips.map((k) => (
              <button key={k} type="button" className={filter === k ? 'chip on' : 'chip'} aria-pressed={filter === k} aria-controls="people-list" onClick={() => setFilter(k)}>
                {k === 'all' ? 'All' : STATUS[k].label}
              </button>
            ))}
          </div>
        )}
        <div id="people-list" className="people" aria-live="polite">
          {shown.map((p) => {
            const has = !!resolve(p.portrait);
            return (
              <article className={has ? 'person rv' : 'person no-ph rv'} key={p.id}>
                {has && p.portrait && <div className="person-ph"><Img photo={p.portrait} sizes="176px" /></div>}
                <h3>{p.name}</h3>
                <p>{p.role}</p>
                {p.bio && <p className="bio">{p.bio}</p>}
                <Pill ok={STATUS[p.status].ok} prov={STATUS[p.status].prov}>{STATUS[p.status].label}</Pill>
              </article>
            );
          })}
          {shown.length === 0 && filter !== 'all' && <p className="empty">{EMPTY[filter]}</p>}
        </div>
        <p className="people-note">
          A listing here does not indicate confirmed participation in {event.year} unless it is marked Confirmed speaker or
          Confirmed guest.
        </p>

        <div className="past">
          <div className="past-txt rv">
            <h3 className="h3">Last year’s anniversary</h3>
            <p className="body">
              Panels, the Order of Merit and many friends from abroad: faces from the 11th anniversary celebration in April 2026.
            </p>
          </div>
          <Figure photo={photos.speaker} className="rv" sizes="(max-width: 640px) 50vw, 400px" />
          <Figure photo={photos.recipient} className="rv" sizes="(max-width: 640px) 50vw, 400px" />
        </div>
      </div>
    </section>
  );
}
