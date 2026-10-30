import type { ReactNode } from 'react';
import { event } from '../data/event';
import { dateConfirmed, dateLong, dateMono, externalLinkProps } from '../lib/event-helpers';
import { Registration } from './Registration';
import { NewTab } from './Arrow';

function Pending({ children, flush }: { children: ReactNode; flush?: boolean }) {
  return (
    <span className="pending" style={flush ? { marginTop: 0 } : undefined}>
      {children}
    </span>
  );
}

export function Practical() {
  const v = event.venue;
  const pr = event.practical;
  const reg = event.registration;
  const regOpen = reg.status === 'open' && !!reg.url;

  return (
    <section className="practical" id="information" aria-labelledby="info-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="label">Practical information</span>
            <h2 className="h2" id="info-title">
              Before you <em>travel</em>
            </h2>
          </div>
          <p className="body">
            What is known, and what is still to come. Pending items are marked and will be updated as they are
            confirmed.
          </p>
        </div>
        <div className="prac-grid">
          <dl className="record reveal">
            <div>
              <dt>Event</dt>
              <dd>{event.name}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>
                {dateLong()} <span className="mono">· {dateMono()}</span>
                {event.date.startTime && (
                  <>
                    <br />
                    <span className="mono">
                      {event.date.startTime}
                      {event.date.endTime ? `–${event.date.endTime}` : ''} CET
                    </span>
                  </>
                )}
                {!dateConfirmed && (
                  <>
                    <br />
                    <Pending>Proposed — not yet confirmed</Pending>
                  </>
                )}
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
              <dt>Programme</dt>
              <dd>
                {[...event.programme.pillars.map((p) => p.title), 'Christmas gala'].join(' · ')}
                <br />
                <Pending>Detailed schedule to be announced</Pending>
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
                    <br />
                    <Pending>Admission and ticketing details pending</Pending>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>Getting there</dt>
              <dd>
                {pr.travel} For local directions, see the{' '}
                <a href={v.url} {...externalLinkProps}>
                  hotel website
                  <NewTab />
                </a>
                .
                {pr.travelPending && (
                  <>
                    <br />
                    <Pending>{pr.travelPending}</Pending>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>Accommodation</dt>
              <dd>
                {pr.accommodation}
                {pr.accommodationPending && (
                  <>
                    <br />
                    <Pending>{pr.accommodationPending}</Pending>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>Dress code</dt>
              <dd>{pr.dressCode ?? <Pending flush>To be announced</Pending>}</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                {pr.contact ? (
                  <a href={pr.contact.href}>{pr.contact.label}</a>
                ) : (
                  <Pending flush>Event contact to be published</Pending>
                )}
              </dd>
            </div>
          </dl>
          <Registration />
        </div>
      </div>
    </section>
  );
}
