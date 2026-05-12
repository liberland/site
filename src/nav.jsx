// Sticky nav with theme toggle
const { useState, useEffect } = React;

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const t = localStorage.getItem("ll-theme");
    if (t === "dark") { document.documentElement.dataset.theme = "dark"; setDark(true); }
  }, []);
  function flip() {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    localStorage.setItem("ll-theme", next ? "dark" : "light");
  }
  return (
    <button className="toggle" aria-label="Toggle theme" onClick={flip} title={dark ? "Light mode" : "Dark mode"} />
  );
}

function Nav() {
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
    background: scrolled ? "color-mix(in oklab, var(--paper) 88%, transparent)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
    borderBottom: `1px solid ${scrolled ? "var(--rule)" : "transparent"}`,
    padding: scrolled ? "12px 0" : "20px 0",
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <a href="#hero" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="assets/liberland-limited-logo.png" alt="Liberland Limited" style={{ width: 36, height: 36, objectFit: "contain" }} />
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18, fontWeight: 400, letterSpacing: "0.01em", color: "var(--ink)" }}>
              Liberland Limited
            </div>
            <div className="label" style={{ fontSize: 9.5, marginTop: 4 }}>HONG KONG · EST. 2024</div>
          </div>
        </a>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {window.LL_DATA.NAV_LINKS.map(l => (
            <a key={l.id} href={`#${l.id}`} className="nav-link"
               style={{ fontSize: 14, color: "var(--ink-soft)", transition: "color 160ms" }}
               onMouseEnter={e => e.target.style.color = "var(--ink)"}
               onMouseLeave={e => e.target.style.color = "var(--ink-soft)"}>
              {l.label}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <ThemeToggle />
          <a href="#membership" className="btn btn--solid btn--sm">Become a member</a>
          <button className="mob-toggle" aria-label="Menu"
                  onClick={() => setOpen(!open)}
                  style={{ display: "none", width: 36, height: 36, borderRadius: 4, border: "1px solid var(--rule-strong)" }}>
            <span style={{ display: "block", width: 16, height: 1, background: "var(--ink)", margin: "auto", boxShadow: "0 5px 0 var(--ink), 0 -5px 0 var(--ink)" }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mob-menu" style={{ borderTop: "1px solid var(--rule)", padding: "16px 0", background: "var(--paper)" }}>
          <div className="container" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {window.LL_DATA.NAV_LINKS.map(l => (
              <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} style={{ padding: "8px 0", borderBottom: "1px solid var(--rule)" }}>{l.label}</a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 920px) {
          .nav-links { display: none !important; }
          .mob-toggle { display: inline-flex !important; align-items: center; justify-content: center; }
          nav .btn--solid { display: none; }
        }
      `}</style>
    </nav>
  );
}

window.LL_Nav = Nav;
