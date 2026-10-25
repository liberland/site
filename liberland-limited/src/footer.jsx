// Footer — identification, navigation and independent resources
function Footer() {
  const t = window.LL_T.footer;
  const { Link } = window.LL_UI;

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <img src={`${window.LL_ROOT}assets/liberland-limited-logo.png`} alt="" style={{ width: 44, height: 44, objectFit: "contain", background: "#f3eee5", borderRadius: "50%", padding: 3 }} />
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400 }}>Liberland Limited</div>
            </div>
            <p className="muted" style={{ maxWidth: 420, fontSize: 14, lineHeight: 1.55, margin: "0 0 20px" }}>{t.blurb}</p>
            <p style={{ fontSize: 14, margin: "0 0 6px" }}>{t.idLine}</p>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, margin: 0 }}>
              <span className="sr-only">{t.officeLabel}: </span>{t.office}
            </p>
          </div>

          <nav aria-label={t.navLabel}>
            <div className="label">{t.navLabel}</div>
            <ul className="footer-list">
              {t.nav.map(l => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
            </ul>
          </nav>

          <div>
            <div className="label">{t.resourcesLabel}</div>
            <ul className="footer-list">
              {t.resources.map(l => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            </ul>
          </div>
        </div>

        <div style={{ paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, fontSize: 12.5, lineHeight: 1.6 }}>
          <p className="muted" style={{ margin: 0, maxWidth: 760 }}>{t.legal}</p>
          <p className="muted" style={{ margin: 0 }}>{t.copyright(new Date().getFullYear())}</p>
        </div>
      </div>
    </footer>
  );
}

window.LL_Footer = Footer;
