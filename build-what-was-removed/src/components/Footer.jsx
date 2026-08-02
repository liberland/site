function SiteFooter() {
  const go = window.BWWR_goTo;
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <div className="row gap-12" style={{ marginBottom: 20 }}>
            <svg width="20" height="20" viewBox="0 0 100 100" fill="none" stroke="#CBA96E" strokeWidth="3.4" aria-hidden="true">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="34" />
              <path d="M50 5v90M5 50h90" />
            </svg>
            <span style={{ fontFamily: "var(--serif)", fontSize: 19, letterSpacing: ".02em", color: "var(--paper)" }}>
              Build What Was Removed
            </span>
          </div>
          <p className="small" style={{ color: "var(--muted-dark)", maxWidth: "52ch", marginBottom: 20 }}>
            The Gornja Siga Settlement Recovery Campaign. An evidence-based effort to document disputed property
            removals, pursue lawful recovery and build a peaceful, environmentally responsible settlement.
          </p>
          <div className="label-mono" style={{ lineHeight: 1.8 }}>
            NO ADJUDICATED SOVEREIGNTY IS ASSERTED. NO FINAL CRIMINAL FINDING IS ASSERTED.
            <br />
            TODO — RECIPIENT LEGAL ENTITY AND CROATIAN-COUNSEL SIGN-OFF PENDING.
          </div>
        </div>
        <div>
          <h4>Evidence</h4>
          <div className="site-footer__links">
            <a href={window.Router.pathFor("ledger")} onClick={go("ledger")}>Ledger</a>
            <a href={window.Router.pathFor("evidence")} onClick={go("evidence")}>Methodology</a>
            <a href={window.Router.pathFor("incident", { incidentId: "GS-2023-09-21" })} onClick={go("incident", { incidentId: "GS-2023-09-21" })}>Incidents</a>
          </div>
        </div>
        <div>
          <h4>Participate</h4>
          <div className="site-footer__links">
            <a href={window.Router.pathFor("reply")} onClick={go("reply")}>Request a correction</a>
            <a href={window.Router.pathFor("reply")} onClick={go("reply")}>Submit a right of reply</a>
            <a href={window.Router.pathFor("reply")} onClick={go("reply")}>Report a privacy or safety concern</a>
          </div>
        </div>
        <div>
          <h4>Legal</h4>
          <div className="site-footer__links">
            <a href={window.Router.pathFor("legal", { section: "terms" })} onClick={go("legal", { section: "terms" })}>Terms</a>
            <a href={window.Router.pathFor("legal", { section: "privacy" })} onClick={go("legal", { section: "privacy" })}>Privacy notice</a>
            <a href={window.Router.pathFor("legal", { section: "donation-terms" })} onClick={go("legal", { section: "donation-terms" })}>Donation terms</a>
            <a href={window.Router.pathFor("legal", { section: "evidence-disclaimer" })} onClick={go("legal", { section: "evidence-disclaimer" })}>Evidence disclaimer</a>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">© 2026 — CAMPAIGN RECORD. NO THIRD-PARTY ANALYTICS. WCAG 2.2 AA TARGET.</div>
    </footer>
  );
}

window.BWWR_SiteFooter = SiteFooter;
