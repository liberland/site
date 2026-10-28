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
      {/* The escutcheon, full colour, once per surface — the mark of office in
          the letterhead position the design language describes: arms and office
          lockup top-left over a 2px yellow rule, on void (the preferred
          ground). It appears exactly here and nowhere else on the page.
          Sized by width because the minimum is 22px wide and full colour needs
          24px+; below that the rowan berries and water lines turn to mud and
          the silhouette is used instead — which is what the favicon is. */}
      <div className="utility-bar__brand">
        <img
          className="arms"
          src="assets/liberland-arms.png"
          width="28"
          height="39"
          alt="Coat of arms of Liberland: a rowan tree on the chief, a dove and the sun on argent, the Danube in base."
        />
        <span>Liberland</span>
        <span className="utility-bar__tick" />
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
