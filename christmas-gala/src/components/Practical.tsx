import type { ReactNode } from 'react';
import { event } from '../data/event';
import { t } from '../i18n/ui';
import { Title } from './Title';
import { dateConfirmed, dateLong, externalLinkProps, formatPrice, rsvpMailto } from '../lib/event-helpers';
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
  const mailto = rsvpMailto();
  const regOpen = reg.status === 'open' && (!!mailto || !!reg.url);

  return (
    <section className="practical" id="information" aria-labelledby="info-title">
      <CornerSpray side="left" className="practical-spray" />
      <div className="wrap">
        <header className="sec-head sec-head--center reveal">
          <p className="eyebrow eyebrow--ink">{t.practical.eyebrow}</p>
          <h2 id="info-title" className="display">
            <Title parts={t.practical.title} />
          </h2>
          <Flourish className="flourish--ink" />
        </header>
        <div className="prac-grid">
          <dl className="record reveal">
            <div>
              <dt>{t.practical.date}</dt>
              <dd>
                {dateLong()}
                {!dateConfirmed && <Pending>{t.practical.proposed}</Pending>}
              </dd>
            </div>
            <div>
              <dt>{t.practical.programme}</dt>
              <dd>
                <ul className="record-list">
                  {event.programme.schedule.map((s) => (
                    <li key={s.time}>
                      <b>{s.time}</b> {s.title}
                    </li>
                  ))}
                </ul>
                <Pending>{t.practical.planned}</Pending>
              </dd>
            </div>
            <div>
              <dt>{t.practical.venue}</dt>
              <dd>
                {v.name}
                <br />
                {v.street}, {v.postcode} {v.district}, {v.country}
              </dd>
            </div>
            <div>
              <dt>{t.practical.tickets}</dt>
              <dd>
                {regOpen ? (
                  <>
                    <ul className="record-list">
                      {reg.tickets.map((tk) => (
                        <li key={tk.group}>
                          <b>{formatPrice(tk.price)}</b> {tk.group}
                        </li>
                      ))}
                    </ul>
                    {mailto ? (
                      <>
                        {t.practical.byEmail[0]}
                        <a href={mailto}>{reg.email}</a>
                        {t.practical.byEmail[1]}
                      </>
                    ) : (
                      <a href={reg.url!} {...externalLinkProps}>
                        {t.practical.officialPage}
                        <NewTab />
                      </a>
                    )}
                  </>
                ) : reg.status === 'closed' ? (
                  t.practical.closed
                ) : (
                  <>
                    {t.practical.notOpen}
                    <Pending>{t.practical.admissionPending}</Pending>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>{t.practical.gettingThere}</dt>
              <dd>
                {pr.travel} {t.practical.directions[0]}
                <a href={v.url} {...externalLinkProps}>
                  {t.practical.directions[1]}
                  <NewTab />
                </a>
                {t.practical.directions[2]}
              </dd>
            </div>
            <div>
              <dt>{t.practical.staying}</dt>
              <dd>
                {pr.accommodation}
                {pr.accommodationPending && <Pending>{pr.accommodationPending}</Pending>}
              </dd>
            </div>
            <div>
              <dt>{t.practical.dressCode}</dt>
              <dd>{pr.dressCode ?? <Pending>{t.practical.tba}</Pending>}</dd>
            </div>
            <div>
              <dt>{t.practical.contact}</dt>
              <dd>{pr.contact ? <a href={pr.contact.href}>{pr.contact.label}</a> : <Pending>{t.practical.contactPending}</Pending>}</dd>
            </div>
          </dl>
          <Registration />
        </div>
      </div>
    </section>
  );
}
