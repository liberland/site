// Events — featured spotlight + grid + ticket flow modal
const { useState: useStateEv, useEffect: useEffectEv } = React;

function TicketModal({ event, onClose }) {
  const [step, setStep] = useStateEv(1);
  const [chosen, setChosen] = useStateEv(event.tickets[0]);
  const [qty, setQty] = useStateEv(1);
  const [form, setForm] = useStateEv({ name: "", email: "", member: "" });

  useEffectEv(() => {
    document.body.classList.add("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, []);

  const total = chosen.price * qty;

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target.className === "modal-backdrop") onClose(); }}>
      <aside className="modal" role="dialog" aria-label="Tickets">
        <header style={{ padding: "28px 32px", borderBottom: "1px solid var(--rule)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div className="label">Tickets · Step {step} of 3</div>
            <h3 className="h3" style={{ margin: "8px 0 0" }}>{event.title}</h3>
            <div className="small" style={{ marginTop: 4 }}>{event.dates} · {event.where}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 36, height: 36, border: "1px solid var(--rule-strong)", borderRadius: 999 }}>×</button>
        </header>

        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
          {step === 1 && (
            <>
              <span className="label">Choose your ticket</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {event.tickets.map(t => (
                  <button key={t.name} onClick={() => setChosen(t)}
                    style={{
                      textAlign: "left", padding: 18, border: "1px solid", borderRadius: 6,
                      borderColor: chosen.name === t.name ? "var(--ink)" : "var(--rule)",
                      background: chosen.name === t.name ? "var(--paper-card)" : "transparent",
                      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                    }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 15 }}>{t.name}</div>
                      <div className="small" style={{ marginTop: 4 }}>{t.summary}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {t.was && <div className="small" style={{ textDecoration: "line-through" }}>€{t.was}</div>}
                      <div className="num" style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 400 }}>
                        {t.price === 0 ? "Free" : `€${t.price}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
                <div className="row" style={{ gap: 0 }}>
                  <span className="label" style={{ marginRight: 16 }}>Quantity</span>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 32, height: 32, border: "1px solid var(--rule-strong)", borderRadius: 4 }}>−</button>
                  <span style={{ width: 40, textAlign: "center", fontFamily: "var(--mono)" }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: 32, height: 32, border: "1px solid var(--rule-strong)", borderRadius: 4 }}>+</button>
                </div>
                <button className="btn btn--solid" onClick={() => setStep(2)}>Continue <span className="arrow">→</span></button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <span className="label">Your details</span>
              <div className="field">
                <label className="small">Full name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="As it should appear on the guest list" />
              </div>
              <div className="field">
                <label className="small">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label className="small">Member number (optional)</label>
                <input value={form.member} onChange={e => setForm({...form, member: e.target.value})} placeholder="LL-····" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
                <button className="btn btn--ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn--solid" onClick={() => setStep(3)} disabled={!form.name || !form.email}
                        style={{ opacity: (!form.name || !form.email) ? 0.4 : 1 }}>
                  Review <span className="arrow">→</span>
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <span className="label">Review & confirm</span>
              <div style={{ border: "1px solid var(--rule)", borderRadius: 6, padding: 20, background: "var(--paper-card)", display: "flex", flexDirection: "column", gap: 12 }}>
                <Row k="Event"     v={event.title} />
                <Row k="Dates"     v={event.dates} />
                <Row k="Ticket"    v={`${chosen.name} × ${qty}`} />
                <Row k="Name"      v={form.name} />
                <Row k="Email"     v={form.email} />
                {form.member && <Row k="Member" v={form.member} />}
                <div style={{ height: 1, background: "var(--rule)", margin: "4px 0" }} />
                <Row k="Total" v={chosen.price === 0 ? "Free — registration only" : `€${total.toLocaleString()}`} big />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
                <button className="btn btn--ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn--solid" onClick={() => setStep(4)}>
                  {chosen.price === 0 ? "Register" : "Confirm & pay"} <span className="arrow">→</span>
                </button>
              </div>
              <p className="small" style={{ margin: 0 }}>
                A demonstration flow. No payment is taken in this preview.
              </p>
            </>
          )}

          {step === 4 && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ width: 64, height: 64, margin: "0 auto 24px", border: "1px solid var(--teal)", borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", fontSize: 28 }}>✓</div>
              <h3 className="h3" style={{ margin: "0 0 12px" }}>You're on the list.</h3>
              <p className="body" style={{ maxWidth: 360, margin: "0 auto" }}>
                A confirmation has gone to <strong>{form.email}</strong>. We'll send the
                full programme three weeks before the gathering.
              </p>
              <button className="btn" style={{ marginTop: 24 }} onClick={onClose}>Close</button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v, big }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
      <span className="label">{k}</span>
      <span style={{ fontFamily: "var(--serif)", fontSize: big ? 22 : 15, fontWeight: 400 }}>{v}</span>
    </div>
  );
}

function FeaturedEvent({ event, onTickets }) {
  return (
    <article className="card" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", overflow: "hidden", padding: 0 }}
             data-featured>
      <div style={{ position: "relative", minHeight: 480 }}>
        <img src={event.cover} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.92) contrast(1.02)" }} />
        <div style={{ position: "absolute", left: 24, top: 24, display: "flex", gap: 8 }}>
          <span style={{ background: "var(--paper)", color: "var(--ink)", padding: "6px 12px", borderRadius: 999, fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>
            Featured · {event.when}
          </span>
        </div>
      </div>
      <div style={{ padding: "40px 40px 36px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="label label--teal">{event.edition}</div>
        <h3 className="display h2" style={{ fontSize: "clamp(28px, 3.6vw, 48px)", margin: 0 }}>{event.title}</h3>
        <div className="row" style={{ flexWrap: "wrap", gap: 24 }}>
          <Meta label="When" v={event.dates} />
          <Meta label="Where" v={event.where} />
          <Meta label="Capacity" v={event.capacity} />
        </div>
        <p className="body" style={{ margin: 0 }}>{event.blurb}</p>

        <details style={{ borderTop: "1px solid var(--rule)", paddingTop: 18 }}>
          <summary className="label" style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Programme — seven days</span>
            <span aria-hidden>+</span>
          </summary>
          <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "flex", flexDirection: "column", gap: 10 }}>
            {event.programme.map((p, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 16, paddingBottom: 10, borderBottom: "1px solid var(--rule)" }}>
                <span className="label">{p.day}</span>
                <span className="body" style={{ fontSize: 14 }}>{p.note}</span>
              </li>
            ))}
          </ul>
        </details>

        <div className="row" style={{ marginTop: "auto", paddingTop: 16 }}>
          <button className="btn btn--solid" onClick={() => onTickets(event)}>Tickets <span className="arrow">→</span></button>
          <span className="small">From <span className="num">€{event.tickets[0].price}</span></span>
        </div>
      </div>

      <style>{`
        [data-featured] { grid-template-columns: 1.1fr 1fr; }
        @media (max-width: 920px) { [data-featured] { grid-template-columns: 1fr !important; } }
      `}</style>
    </article>
  );
}

function Meta({ label, v }) {
  return (
    <div>
      <div className="label" style={{ fontSize: 10 }}>{label}</div>
      <div className="body" style={{ fontSize: 14, color: "var(--ink)", marginTop: 4 }}>{v}</div>
    </div>
  );
}

function EventCard({ event, onTickets }) {
  return (
    <article className="card" style={{ display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
      <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
        <img src={event.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.92)", transition: "transform 600ms ease" }}
             onMouseEnter={e => e.target.style.transform = "scale(1.04)"} onMouseLeave={e => e.target.style.transform = "scale(1)"} />
      </div>
      <div style={{ padding: "24px 24px 24px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div className="label label--teal">{event.edition}</div>
        <h3 className="h3" style={{ margin: 0, fontSize: 22 }}>{event.title}</h3>
        <div className="small">{event.dates} · {event.where}</div>
        <p className="body" style={{ margin: 0, fontSize: 14 }}>{event.blurb}</p>
        <div className="row" style={{ marginTop: "auto", paddingTop: 16, justifyContent: "space-between", borderTop: "1px solid var(--rule)" }}>
          <span className="small">From <span className="num">€{event.tickets[0].price}</span></span>
          <button className="label label--ink" style={{ cursor: "pointer" }} onClick={() => onTickets(event)}>
            Tickets →
          </button>
        </div>
      </div>
    </article>
  );
}

function Events() {
  const events = window.LL_DATA.EVENTS;
  const featured = events.find(e => e.featured);
  const others = events.filter(e => !e.featured);
  const [open, setOpen] = useStateEv(null);

  return (
    <section id="events" className="section" data-screen-label="Events">
      <div className="container">
        <div className="section-head">
          <span className="label">03 — Gatherings</span>
          <div>
            <h2 className="display h2" style={{ marginBottom: 18 }}>
              The calendar. <em>Six dates this year.</em>
            </h2>
            <p className="lede" style={{ maxWidth: 640, margin: 0 }}>
              We host on the Danube and travel for one Salon a year. Tickets at member
              rate; a small allocation is held back for guests by invitation.
            </p>
          </div>
        </div>

        <FeaturedEvent event={featured} onTickets={setOpen} />

        <div className="grid-3" style={{ marginTop: 40 }}>
          {others.map(e => (
            <EventCard key={e.id} event={e} onTickets={setOpen} />
          ))}
        </div>

        {open && <TicketModal event={open} onClose={() => setOpen(null)} />}
      </div>
    </section>
  );
}

window.LL_Events = Events;
