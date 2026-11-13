import { LANG, LANG_STORAGE_KEY, LANG_TAG, type Lang } from '../i18n/lang';
import { t } from '../i18n/ui';
import { withBase } from '../lib/assets';

const LABEL: Record<Lang, string> = { en: 'EN', zh: '中文' };

/** The page in each language: English at the site root, Chinese in /zh/. */
export function langHref(lang: Lang) {
  return withBase(lang === 'zh' ? 'zh/' : '');
}

/** EN · 中文. Remembers the choice, so automatic language detection never overrides it. */
export function LangSwitch({ className = '' }: { className?: string }) {
  const choose = (lang: Lang) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      /* private mode: the choice simply is not remembered */
    }
    if (lang === LANG) return e.preventDefault();
    e.currentTarget.href = langHref(lang) + window.location.hash; // stay on the same section
  };
  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t.nav.language}>
      {(['en', 'zh'] as Lang[]).map((lang, i) => (
        <span key={lang}>
          {i > 0 && <i aria-hidden="true">·</i>}
          <a
            href={langHref(lang)}
            hrefLang={LANG_TAG[lang]}
            lang={LANG_TAG[lang]}
            aria-current={lang === LANG ? 'true' : undefined}
            onClick={choose(lang)}
          >
            {LABEL[lang]}
          </a>
        </span>
      ))}
    </div>
  );
}
