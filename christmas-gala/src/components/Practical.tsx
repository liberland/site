import type { ReactNode } from 'react';
import { event } from '../data/event';
import { dateConfirmed, dateLong, externalLinkProps } from '../lib/event-helpers';
import { Registration } from './Registration';
import { NewTab } from './Arrow';
import { CornerSpray, Flourish } from './Ornaments';

function Pending({ children }: { children: ReactNode }) {
  return <span className="pending">{children}</span>;
}

export function Practical() {
  const v = event.venue;
  const pr = event.practical;
  const reg = event.registration;
  const regOpen = reg.status === 'open' && !!reg.url;

  return (
    <section className="practical" id="information" aria-labelledby="info-title">
      <CornerSpray side="left" className="practical-spray" />
      <div className="wrap">
        <header className="sec-head sec-head--center reveal">
          <p className="eyebrow eyebrow--ink">Practical Information</p>
          <h2 id="info-title" className="display">
            Before you <em>travel</em>
          </h2>
          <Flourish className="flourish--ink" />
        </header>
        <div className="prac-grid">
          <dl className="record reveal">
            <div>
              <dt>Date</dt>
              <dd>
                {dateLong()}
                {!dateConfirmed && <Pending>Proposed — not yet confirmed</Pending>}
              </dd>
            </div>
            <div>
              <dt>Programme</dt>
              <dd>
                <ul className="record-list">
                  {event.programme.schedule.map((s) => (
                    <li key={s.time}>
                      <b>{s.time}</b> {s.title}
                    </li>
                  ))}
                </ul>
                <Pending>Planned — subject to final programme confirmation</Pending>
              </dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>
                {v.name}
                <br />
                {v.street}, {v.postcode} {v.district}, {v.country}
              </dd>
            </div>
            <div>
              <dt>Registration</dt>
              <dd>
                {regOpen ? (
                  <>
                    Registration is open.{' '}
                    <a href={reg.url!} {...externalLinkProps}>
                      Register on the official registration page
                      <NewTab />
                    </a>
                    .
                  </>
                ) : reg.status === 'closed' ? (
                  'Registration has closed.'
                ) : (
                  <>
                    Registration has not opened yet. Details will be published on this page.
                    <Pending>Admission and ticketing details to follow</Pending>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>Getting there</dt>
              <dd>
                {pr.travel} For local directions, see the{' '}
                <a href={v.url} {...externalLinkProps}>
                  hotel’s website
                  <NewTab />
                </a>
                .
              </dd>
            </div>
            <div>
              <dt>Staying</dt>
              <dd>
                {pr.accommodation}
                {pr.accommodationPending && <Pending>{pr.accommodationPending}</Pending>}
              </dd>
            </div>
            <div>
              <dt>Dress code</dt>
              <dd>{pr.dressCode ?? <Pending>To be announced</Pending>}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>{pr.contact ? <a href={pr.contact.href}>{pr.contact.label}</a> : <Pending>Event contact to be published</Pending>}</dd>
            </div>
          </dl>
          <Registration />
        </div>
      </div>
    </section>
  );
}
