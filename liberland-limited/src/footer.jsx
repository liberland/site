// Newsletter + Footer + contact
const { useState: useStateFt } = React;

function Contact() {
  const [email, setEmail] = useStateFt("");
  const [sent, setSent] = useStateFt(false);

  function submit(e) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
  }

  const c = window.LL_DATA.COMPANY;

  return (
    <section id="contact" className="section" data-screen-label="Contact" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="section-head">
          <span className="label">05 — Correspondence</span>
          <h2 className="display h2">
            Write to us. <em>We answer.</em>
          </h2>
        </div>

        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="stack-4">
            <div>
              <div className="label" style={{ marginBottom: 8 }}>The Office</div>
              <div className="body" style={{ color: "var(--ink)" }}>{c.address}</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>By email</div>
              <a href={`mailto:${c.email}`} className="body" style={{ color: "var(--teal)", textDecoration: "underline", textUnderlineOffset: 4 }}>{c.email}</a>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Director</div>
              <div className="body" style={{ color: "var(--ink)" }}>{c.director}</div>
            </div>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Hours</div>
              <div className="body" style={{ color: "var(--ink)" }}>Tuesday — Friday · 10:00 — 17:00 HKT</div>
            </div>
          </div>

          <form onSubmit={submit} style={{ background: "var(--paper-card)", border: "1px solid var(--rule)", padding: 36, display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="label label--teal">Members' letter</div>
            <h3 className="h3" style={{ margin: 0 }}>The quarterly letter, posted four times a year.</h3>
            <p className="body" style={{ margin: 0, fontSize: 14 }}>
              Programme dates, members' news, and a short note from the Director.
              No marketing, no third parties.
            </p>
            {sent ? (
              <div className="body" style={{ color: "var(--teal)", padding: "14px 0", borderTop: "1px solid var(--rule)" }}>
                ✓ Thank you. Your address is recorded.
              </div>
            ) : (
              <>
                <div className="field">
                  <input type="email" required placeholder="your.name@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button className="btn btn--solid" type="submit" style={{ alignSelf: "flex-start" }}>
                  Subscribe <span className="arrow">→</span>
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const c = window.LL_DATA.COMPANY;
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 64, borderBottom: "1px solid rgba(243,238,229,0.18)" }}
             className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <img src="assets/liberland-limited-logo.png" alt="" style={{ width: 44, height: 44, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
              <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400 }}>Liberland Limited</div>
            </div>
            <p style={{ maxWidth: 380, fontSize: 14, lineHeight: 1.55, color: "rgba(243,238,229,0.7)" }}>
              A Hong Kong company offering membership services, hosting community
              gatherings, and brokering residences at Ark Village in Apatin, Serbia.
            </p>
          </div>

          <div>
            <div className="label">Visit</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <li><a href="#membership">Membership</a></li>
              <li><a href="#events">Gatherings</a></li>
              <li><a href="#residences">Residences</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <div className="label">Sister sites</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
              <li><a href="https://ark.ll.land" target="_blank" rel="noreferrer">ark.ll.land ↗</a></li>
              <li><a href="https://anniversary.ll.land" target="_blank" rel="noreferrer">anniversary.ll.land ↗</a></li>
              <li><a href="https://floatingman.ll.land" target="_blank" rel="noreferrer">floatingman.ll.land ↗</a></li>
              <li><a href="https://liberland.org" target="_blank" rel="noreferrer">liberland.org ↗</a></li>
            </ul>
          </div>

          <div>
            <div className="label">The Office</div>
            <div style={{ marginTop: 16, fontSize: 14, lineHeight: 1.55, color: "rgba(243,238,229,0.7)" }}>
              {c.address}
            </div>
            <a href={`mailto:${c.email}`} style={{ display: "inline-block", marginTop: 16, fontSize: 14 }}>{c.email}</a>
          </div>
        </div>

        <div style={{ paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontSize: 12, color: "rgba(243,238,229,0.55)" }}>
          <div>© {year} Liberland Limited · {c.director}</div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <span>Hong Kong company</span>
            <span>Hospitality & brokerage services</span>
            <span>Not a fund</span>
            <a href="assets/liberland-limited-company-introduction.pdf" target="_blank" rel="noreferrer" style={{ color: "rgba(243,238,229,0.7)", textDecoration: "underline", textUnderlineOffset: 3 }}>Company introduction (PDF)</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) { .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; } }
        @media (max-width: 540px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}

window.LL_Contact = Contact;
window.LL_Footer = Footer;
