import { event } from '../data/event';
import { externalLinkProps } from '../lib/event-helpers';
import { NewTab } from './Arrow';

export function Footer() {
  const org = event.site.organiser;
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>
          {org.name} ·{' '}
          <a href={org.url} className="link-u" {...externalLinkProps}>
            {org.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            <NewTab />
          </a>
          <br />
          {event.editorial.footer}
        </p>
        <nav aria-label="Footer">
          <a href="#programme">Programme</a>
          <a href="#venue">Venue</a>
          <a href="#information">Information</a>
          <a href="#register">Registration</a>
        </nav>
      </div>
    </footer>
  );
}
