const BWWR_NAV_ITEMS = [
  { view: "home", label: "Home" },
  { view: "ledger", label: "Ledger" },
  { view: "costs", label: "Croatia's Costs" },
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
      {/* No mark. The state owns three pieces of artwork — flag, escutcheon,
          achievement — and a vector redraw of the arms is still open. V1's
          invented seal was the wrong trade; where no real mark applies, the
          design language says use none. The 2px yellow rule below this bar
          carries the flag instead. */}
      <div className="utility-bar__brand">
        <span>Liberland</span>
        <span style={{ width: 1, height: 12, background: "var(--rule-on-dark)" }} />
        <span className="label-mono" style={{ color: "var(--muted-dark)" }}>
          SETTLEMENT&nbsp;CAMPAIGN
        </span>
      </div>
      <div className="utility-bar__meta">
        <span>45°46′N&nbsp;18°53′E</span>
        <span style={{ color: "#6b6962" }}>·</span>
        <span>EVIDENCE&nbsp;BUILD&nbsp;v2.0</span>
        <span style={{ color: "#6b6962" }}>·</span>
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
          Foster What We Built
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
            Fund the Settlement
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
