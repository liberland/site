import { event } from '../data/event';
import { t } from '../i18n/ui';
import { externalLinkProps } from '../lib/event-helpers';
import { NewTab } from './Arrow';

export function Footer() {
  const org = event.site.organiser;
  const v = event.venue;
  const credits = [
    ...[...event.faces.speakers, ...event.faces.people].filter((p) => p.portrait && p.credit).map((p) => p.credit!),
    ...[v.heroPhoto, v.portalPhoto, v.christmasPhoto, ...v.gallery].some((p) => p.cleared) ? [t.footer.venueCredit(v.name)] : [],
    t.footer.ornaments,
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
            <b>{t.footer.imageCredits}</b> {credits.join(t.footer.join)}
            {t.footer.end}
          </p>
        </div>
        <nav aria-label={t.footer.label}>
          <a href="#programme">{t.footer.links.programme}</a>
          <a href="#venue">{t.footer.links.venue}</a>
          <a href="#information">{t.footer.links.information}</a>
          <a href="#register">{t.footer.links.register}</a>
        </nav>
      </div>
    </footer>
  );
}
