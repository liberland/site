import { useRef, useState, type KeyboardEvent } from 'react';
import { event, people, programme, type Session } from '../data/anniversary';
import { parts, short } from '../lib/dates';
import { anniversaryDay, anniversaryDayLong, dateRange, datesConfirmed, foundingLong } from '../lib/event';
import { visibleDays } from '../lib/event';
import { Pill } from './Tag';

function time(s: Session) {
  if (!s.start) return 'Time TBC';
  return s.end ? `${s.start}–${s.end}` : s.start;
}

function meta(s: Session) {
  const names = s.speakerIds
    .map((id) => people.find((p) => p.id === id))
    .filter((p) => p && p.status === 'speaker')
    .map((p) => p!.name);
  return [s.location, names.join(', ')].filter(Boolean).join(' · ');
}

/** D · The programme — accessible tabs (roving tabindex; arrows, Home, End). */
export function Programme() {
  const [cur, setCur] = useState(programme.initialDay);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const day = visibleDays[cur];
  const n = visibleDays.length;

  const go = (i: number) => {
    const next = (i + n) % n;
    setCur(next);
    tabs.current[next]?.focus();
  };
  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown') go(cur + 1);
    else if (k === 'ArrowLeft' || k === 'ArrowUp') go(cur - 1);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(n - 1);
    else return;
    e.preventDefault();
  };

  const end = event.dates.end;
  const relation = anniversaryDay > end ? 'in the days before it' : anniversaryDay < event.dates.start ? 'in the days after it' : 'around it';

  return (
    <section id="programme" className="sec" aria-labelledby="prog-title">
      <div className="wrap">
        <div className="sec-head rv">
          <div>
            <p className="eyebrow">{dateRange}</p>
            <h2 id="prog-title" className="h2" style={{ marginTop: 10 }}>The programme</h2>
          </div>
          <div className="prog-meta">
            {programme.status === 'provisional' && <Pill prov>Provisional programme</Pill>}
            <p className="body">{programme.note}</p>
          </div>
        </div>
        <div className="days" role="tablist" aria-label="Programme days" onKeyDown={onKey}>
          {visibleDays.map((d, i) => {
            const p = parts(d.date);
            return (
              <button
                key={d.date}
                ref={(el) => { tabs.current[i] = el; }}
                type="button"
                role="tab"
                id={`day-tab-${i}`}
                aria-controls="day-panel"
                aria-selected={i === cur}
                tabIndex={i === cur ? 0 : -1}
                className={i === cur ? 'day on' : 'day'}
                onClick={() => setCur(i)}
              >
                <span className="day-d">{p.weekday.slice(0, 3)} {p.d} {p.month.slice(0, 3)}</span>
                <span className="day-t">{d.title}</span>
              </button>
            );
          })}
        </div>
        <div key={cur} id="day-panel" className="day-panel fade-in" role="tabpanel" aria-labelledby={`day-tab-${cur}`} tabIndex={0}>
          <div className="panel-head">
            <h3 className="h3">{day.title}</h3>
            <span className="eyebrow">{short(day.date)}{datesConfirmed ? '' : ' · Provisional'}</span>
          </div>
          <p className="body">{day.lead}</p>
          <ul className="sessions">
            {day.sessions.map((s) => {
              const m = meta(s);
              return (
                <li key={s.title}>
                  <span className="s-time">{time(s)}</span>
                  <span className="s-title">
                    {s.title}
                    {s.description && <span className="s-desc">{s.description}</span>}
                    {m && <span className="s-meta">{m}</span>}
                  </span>
                  {s.status === 'confirmed' ? <Pill ok>Confirmed</Pill> : <Pill prov>Provisional</Pill>}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="prog-foot rv">
          <strong>{short(anniversaryDay)}</strong>
          <span>
            The founding anniversary itself falls on {anniversaryDayLong}, twelve years after the proclamation of {foundingLong}.
            The anniversary gathering takes place {relation}.
          </span>
        </p>
      </div>
    </section>
  );
}
