import { event } from '../data/event';
import { externalLinkProps } from '../lib/event-helpers';
import { NewTab } from './Arrow';

export function Footer() {
  const org = event.site.organiser;
  const v = event.venue;
  const credits = [
    ...event.faces.people.filter((p) => p.portrait && p.credit).map((p) => p.credit!),
    ...[v.heroPhoto, v.portalPhoto, v.christmasPhoto, ...v.gallery].some((p) => p.cleared) ? [`Venue photography © ${v.name}, used with permission`] : [],
    'Christmas ornamentation: original artwork drawn for this page',
  ];
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div>
          <p className="footer-org">
            {org.name} ·{' '}
            <a href={org.url} className="link-u" {...externalLinkProps}>
              {org.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              <NewTab />
            </a>
          </p>
          <p>{event.editorial.footer}</p>
          <p className="footer-credits">
            <b>Image credits.</b> {credits.join('. ')}.
          </p>
        </div>
        <nav aria-label="Footer">
          <a href="#programme">Programme</a>
          <a href="#venue">Le Palais</a>
          <a href="#information">Information</a>
          <a href="#register">Registration</a>
        </nav>
      </div>
    </footer>
  );
}
