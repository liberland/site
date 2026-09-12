// Nav + footer. Shared by every page; the active link comes from
// document.body.dataset.page.

const { useState: useStateC, useEffect: useEffectC } = React;

function Nav() {
  const { NAV_LINKS } = window.VT_DATA;
  const { Lockup } = window.VT;
  const [scrolled, setScrolled] = useStateC(false);
  const [open, setOpen] = useStateC(false);
  const current = document.body.dataset.page;

  useEffectC(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffectC(() => {
    document.body.classList.toggle("no-scroll", open);
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <nav className={`nav${scrolled || open ? " nav--scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <Lockup markSize={32} type={21} sub="Liberland · Blockchain" />

        <div className="nav-links">
          {NAV_LINKS.map(l => (
            <a
              key={l.id}
              href={l.href}
              className="nav-link"
              aria-current={current === l.id ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex" style={{ gap: 12 }}>
          <a href="property.html#offerings" className="btn btn--primary btn--sm nav-cta">
            View offerings
          </a>
          <button
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span
              style={{
                display: "block",
                width: 16,
                height: 1.5,
                background: "var(--salt)",
                boxShadow: open ? "none" : "0 5px 0 var(--salt), 0 -5px 0 var(--salt)",
                transform: open ? "rotate(45deg)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="nav-mobile">
          <div className="wrap">
            {NAV_LINKS.map(l => (
              <a key={l.id} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <a href="property.html#offerings" className="btn btn--primary" style={{ marginTop: 18, display: "inline-flex" }}>
              View offerings
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  const { COMPANY, FOOTER_COLUMNS, DISCLAIMER } = window.VT_DATA;
  const { Lockup, WaveRule } = window.VT;

  return (
    <footer className="footer">
      <div className="wrap">
        <WaveRule height={18} opacity={0.55} />
        <div className="footer-grid">
          <div className="stack">
            <Lockup markSize={40} type={26} sub={`${COMPANY.city}`} />
            <p className="small" style={{ maxWidth: "32ch", marginTop: 6 }}>
              Liberland's blockchain and crypto branch. Land, ledger, and the rails between them.
            </p>
            {/* Guardrail: the Liberland endorsement appears in every footer. */}
            <div className="flex" style={{ gap: 8, marginTop: 6 }}>
              <span className="pill pill--yellow">A Liberland company</span>
            </div>
          </div>

          {FOOTER_COLUMNS.map(col => (
            <div key={col.title}>
              <div className="eyebrow eyebrow--mute" style={{ marginBottom: 12 }}>{col.title}</div>
              {col.links.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <p className="small" style={{ maxWidth: "92ch", paddingBottom: 24, color: "var(--text-4)", fontSize: 12.5 }}>
          {DISCLAIMER}
        </p>

        <div className="footer-base">
          <div>{COMPANY.name} · a Liberland company</div>
          <div className="flex" style={{ gap: 20 }}>
            <a href={COMPANY.parentUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>liberland.org</a>
            <a href="brand.html" style={{ color: "inherit" }}>Brand v1.0</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Mounts the page component named by window.VT_PAGE between the
   shared nav and footer. Every page ends by calling this. */
function mountPage() {
  function Shell() {
    window.VT.useReveal();
    // The browser resolves location.hash before React has rendered anything,
    // so an inbound link like property.html#offerings would land at the top
    // of the page. Re-run the jump once the target actually exists.
    useEffectC(() => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }, []);
    return (
      <React.Fragment>
        <Nav />
        <main id="main">{React.createElement(window.VT_PAGE)}</main>
        <Footer />
      </React.Fragment>
    );
  }
  ReactDOM.createRoot(document.getElementById("root")).render(<Shell />);
}

window.VT_Nav = Nav;
window.VT_Footer = Footer;
window.VT_mount = mountPage;
