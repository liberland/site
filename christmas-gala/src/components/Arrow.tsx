import { t } from '../i18n/ui';

/** Visually hidden note for links that open in a new tab. */
export function NewTab() {
  return <span className="sr-only">{t.newTab}</span>;
}
