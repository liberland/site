// Sticky nav with theme toggle
const { useState, useEffect } = React;

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    let t = null;
    try { t = localStorage.getItem("ll-theme"); } catch (e) {}
    if (t === "dark") { document.documentElement.dataset.theme = "dark"; setDark(true); }
  }, []);
  function flip() {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("ll-theme", next ? "dark" : "light"); } catch (e) {}
  }
  const label = window.LL_T.nav.theme;
  return (
    <button className="toggle" aria-label={label} aria-pressed={dark} onClick={flip} title={label} />
  );
}

// English lives at the site root, Simplified Chinese under zh/. An explicit choice is
// remembered, and the root page only auto-redirects visitors who have not chosen yet.
const LANGS = [
  { code: "en", hreflang: "en", label: "EN", name: "English", flag: "gb.svg", path: "" },
  { code: "zh", hreflang: "zh-Hans", label: "中文", name: "简体中文", flag: "cn.svg", path: "zh/" },
];

function LangSwitch() {
  function choose(e, code, href) {
    try { localStorage.setItem("ll-lang", code); } catch (err) {}
    e.currentTarget.href = href + location.hash; // stay on the same section
  }
  return (
    <div className="lang-switch" role="group" aria-label="Language · 语言">
      {LANGS.map(l => {
        const href = window.LL_ROOT + l.path || "./";
        return (
          <a key={l.code} href={href} hrefLang={l.hreflang} lang={l.hreflang} title={l.name}
             aria-current={l.code === window.LL_LANG ? "true" : undefined}
             onClick={e => choose(e, l.code, href)}>
            <img src={`${window.LL_ROOT}assets/flags/${l.flag}`} alt="" width="18" height="12" />
            <span className="lang-label">{l.label}</span>
          </a>
        );
      })}
    </div>
  );
}

function Nav() {
  const t = window.LL_T.nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
    transition: "background 220ms ease, border-color 220ms ease, padding 220ms ease",
    background: scrolled || open ? "color-mix(in oklab, var(--paper) 92%, transparent)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: `1px solid ${scrolled ? "var(--rule)" : "transparent"}`,
    padding: scrolled ? "12px 0" : "20px 0",
  };

  return (
    <nav style={navStyle} aria-label="Main">
      <a className="skip-link" href="#main">{t.skip}</a>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <a href="#hero" className="brand">
          <img src={`${window.LL_ROOT}assets/liberland-limited-logo.png`} alt="" />
          <div style={{ lineHeight: 1 }}>
            <div className="name">Liberland Limited</div>
            <div className="label">{t.sub}</div>
          </div>
        </a>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {t.links.map(l => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LangSwitch />
          <span className="nav-theme"><ThemeToggle /></span>
          <a href="#membership" className="btn btn--solid btn--sm nav-cta">{t.cta}</a>
          <button className="mob-toggle" aria-label={t.menu} aria-expanded={open} aria-controls="mobile-menu"
                  onClick={() => setOpen(!open)}>
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="mob-menu">
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {t.links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <div className="mob-theme">
              <span className="small">{t.theme}</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .nav-link { font-size: 14px; color: var(--ink-soft); transition: color 160ms; white-space: nowrap; }
        .nav-link:hover { color: var(--ink); }
        .mob-toggle { display: none; width: 36px; height: 36px; border-radius: 4px; border: 1px solid var(--rule-strong); flex: none; }
        .mob-toggle span { display: block; width: 16px; height: 1px; background: var(--ink); margin: auto; box-shadow: 0 5px 0 var(--ink), 0 -5px 0 var(--ink); }
        .mob-menu { border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 12px 0; background: var(--paper); margin-top: 12px; }
        .mob-menu a { padding: 12px 0; border-bottom: 1px solid var(--rule); }
        .nav-theme { display: inline-flex; }
        .mob-theme { display: none; justify-content: space-between; align-items: center; gap: 16px; padding: 12px 0 4px; }
        @media (max-width: 1080px) {
          .nav-links { display: none !important; }
          .mob-toggle { display: inline-flex; align-items: center; justify-content: center; }
        }
        @media (max-width: 640px) {
          .nav-cta, .nav-theme { display: none !important; }
          .mob-theme { display: flex; }
          nav .brand .label { letter-spacing: 0.08em; }
        }
      `}</style>
    </nav>
  );
}

window.LL_Nav = Nav;
