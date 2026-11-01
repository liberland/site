import { useState } from 'react';
import { event, people, type ParticipationStatus } from '../data/anniversary';
import { Photo } from './Photo';

const STATUS: Record<ParticipationStatus, { label: string; cls: string }> = {
  speaker: { label: 'Confirmed speaker', cls: 'st st-speaker' },
  guest: { label: 'Confirmed guest', cls: 'st st-guest' },
  featured: { label: 'Featured community figure', cls: 'st st-featured' },
  pending: { label: 'Participation pending', cls: 'st st-pending' },
};
const KEYS = ['all', 'speaker', 'guest', 'featured', 'pending'] as const;
type Key = (typeof KEYS)[number];

const EMPTY: Record<Exclude<Key, 'all'>, string> = {
  speaker: `No speakers are confirmed for ${event.year} yet. Confirmed speakers will appear here.`,
  guest: `No guests are confirmed for ${event.year} yet. Confirmed guests will appear here.`,
  featured: 'No featured figures in this view.',
  pending: 'No invitations are currently marked as pending.',
};

const sorted = [...people].sort((a, b) => a.order - b.order);

/** E · Featured faces — filter chips by participation status. */
export function Faces() {
  const [filter, setFilter] = useState<Key>('all');
  const shown = sorted.filter((p) => filter === 'all' || p.status === filter);
  const nextId = `P-${String(people.length + 1).padStart(2, '0')}`;

  return (
    <section id="faces" className="sec s-faces" aria-labelledby="faces-title">
      <div className="wrap">
        <div className="faces-head rv">
          <div>
            <p className="kick lbl">Featured faces</p>
            <h2 id="faces-title" className="d2">The people of the occasion</h2>
          </div>
          <p className="lead">
            Liberland figures and community representatives. Speakers and guests for {event.year} will be added as their
            participation is confirmed.
          </p>
        </div>
        <div className="chips" role="group" aria-label="Filter by participation status">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className={filter === k ? 'chip on' : 'chip'}
              aria-pressed={filter === k}
              aria-controls="faces-list"
              onClick={() => setFilter(k)}
            >
              {k === 'all' ? 'All' : STATUS[k].label}{' '}
              <span className="ct">
                {k === 'all' ? people.length : people.filter((p) => p.status === k).length}
              </span>
            </button>
          ))}
        </div>
        <div id="faces-list" className="faces" aria-live="polite">
          {shown.map((p) => (
            <article className="face rv" key={p.id}>
              <Photo photo={p.portrait} className="warm" kind="Portrait" sizes="(max-width: 1100px) 50vw, 300px" />
              <span className={STATUS[p.status].cls}>{STATUS[p.status].label}</span>
              <h3>{p.name}</h3>
              <p>{p.role}</p>
              {p.bio && <p className="bio">{p.bio}</p>}
            </article>
          ))}
          {shown.length === 0 && filter !== 'all' && (
            <div className="empty">
              <p className="d3">None yet.</p>
              <p style={{ marginTop: 8 }}>{EMPTY[filter]}</p>
            </div>
          )}
          {filter === 'all' && (
            <div className="face face-tba rv">
              <div className="slot">
                <span className="rec">{nextId} → P-nn</span>
                <span className="d3">To be announced</span>
                <span>Speakers and guests are added on confirmation.</span>
              </div>
            </div>
          )}
        </div>
        <p className="disclaim">
          A listing on this page does not indicate confirmed participation in {event.year} unless it is marked Confirmed
          speaker or Confirmed guest.
        </p>
      </div>
    </section>
  );
}
