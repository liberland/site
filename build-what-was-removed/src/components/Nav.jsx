const BWWR_NAV_ITEMS = [
  { view: "home", label: "Home" },
  { view: "ledger", label: "Ledger" },
  { view: "case", label: "The Case" },
  { view: "evidence", label: "Evidence" },
  { view: "updates", label: "Updates" },
  { view: "reply", label: "Right of Reply" },
];

function goTo(view, opts) {
  return (e) => {
    if (e) e.preventDefault();
    window.Router.navigate(view, opts);
  };
}

function UtilityBar() {
  return (
    <div className="utility-bar">
      <div className="utility-bar__brand">
        <svg width="18" height="18" viewBox="0 0 100 100" fill="none" stroke="#CBA96E" strokeWidth="3.4" aria-hidden="true">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="34" />
          <path d="M50 5v90M5 50h90" />
        </svg>
        <span>Liberland</span>
        <span style={{ width: 1, height: 14, background: "rgba(203,169,110,.35)" }} />
        <span className="label-mono" style={{ color: "var(--muted-dark)" }}>
          RECOVERY&nbsp;CAMPAIGN
        </span>
      </div>
      <div className="utility-bar__meta">
        <span>EVIDENCE&nbsp;BUILD&nbsp;v1.0</span>
        <span style={{ color: "#5F5849" }}>·</span>
        <span>NO&nbsp;FINAL&nbsp;CRIMINAL&nbsp;FINDING&nbsp;ASSERTED</span>
      </div>
    </div>
  );
}

function SiteNav({ view }) {
  return (
    <div className="site-nav">
      <div className="site-nav__inner">
        <button className="site-nav__brand" onClick={goTo("home")}>
          Build What Was Removed
        </button>
        <nav aria-label="Primary" className="site-nav__links">
          {BWWR_NAV_ITEMS.map((n) => (
            <button
              key={n.view}
              className="site-nav__link"
              aria-current={view === n.view ? "page" : undefined}
              onClick={goTo(n.view)}
            >
              {n.label}
            </button>
          ))}
          <button className="site-nav__cta" onClick={goTo("fund")}>
            Fund the Recovery
          </button>
        </nav>
      </div>
    </div>
  );
}

window.BWWR_UtilityBar = UtilityBar;
window.BWWR_SiteNav = SiteNav;
window.BWWR_goTo = goTo;
window.BWWR_NAV_ITEMS = BWWR_NAV_ITEMS;
