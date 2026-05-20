// Membership — tier selector with a comparator (4 tiers).
const { useState: useStateMem } = React;

function Tick({ on = true }) {
  return (
    <span aria-hidden="true" style={{
      display: "inline-flex", width: 18, height: 18, alignItems: "center", justifyContent: "center",
      color: on ? "var(--teal)" : "var(--ink-mute)",
      opacity: on ? 1 : 0.5,
    }}>
      {on ? "✓" : "—"}
    </span>
  );
}

function TierCard({ tier, active, onClick, billing }) {
  const price = billing === "annual"
    ? `$${tier.annual.toLocaleString()}`
    : `$${tier.monthly.toLocaleString()}`;
  const unit = billing === "annual" ? "USD / year" : "USD / month";

  return (
    <button
      onClick={onClick}
      className="card tier"
      style={{
        textAlign: "left",
        padding: "32px 28px 28px",
        display: "flex", flexDirection: "column", gap: 18,
        borderColor: active ? "var(--ink)" : "var(--rule)",
        background: active ? "var(--paper-card)" : "transparent",
        boxShadow: active ? "var(--shadow)" : "none",
        position: "relative",
        cursor: "pointer",
        outline: tier.featured && !active ? "1px solid var(--teal)" : "none",
        outlineOffset: -1,
      }}
    >
      {tier.featured && (
        <div style={{
          position: "absolute", top: -10, right: 24,
          background: "var(--teal)", color: "#fff",
          padding: "4px 10px", borderRadius: 999,
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase"
        }}>
          Most chosen
        </div>
      )}
      <div className="label label--ink" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{tier.name}</span>
        <span style={{ color: "var(--ink-mute)" }}>{tier.seats}</span>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="num" style={{
          fontFamily: "var(--serif)",
          fontSize: "clamp(32px, 3.2vw, 42px)",
          fontWeight: 300, lineHeight: 1.05, letterSpacing: "-0.02em",
          wordBreak: "break-word", overflowWrap: "anywhere",
        }}>
          {price}
        </div>
        <div className="small" style={{ marginTop: 6 }}>{unit}</div>
      </div>
      <p className="body" style={{ margin: 0, color: "var(--ink-soft)" }}>{tier.summary}</p>
      <div style={{ height: 1, background: "var(--rule)", margin: "4px 0" }} />
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {tier.perks.slice(0, 4).map((p, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Tick />
            <span className="body" style={{ fontSize: 14, color: "var(--ink-soft)" }}>{p}</span>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "auto", paddingTop: 12 }}>
        <span className={"btn " + (tier.featured ? "btn--solid" : "")} style={{ width: "100%", justifyContent: "center" }}>
          Apply for {tier.name}
        </span>
      </div>
    </button>
  );
}

function Comparator({ tiers, active }) {
  const allPerks = [
    "Members' newsletter, four times a year",
    "Member rate on gathering tickets",
    "Listing in the members' directory",
    "Cottage waitlist priority",
    "Two complimentary GA tickets per gathering",
    "Members' lounge at Ark Village",
    "Quarterly briefings with the Director",
    "Members' concierge",
    "Two VIP passes per major gathering",
    "Reserved cottage during major gatherings",
    "Founder's salon and private dinners",
    "Numbered, lifetime registration",
    "Reserved table at every gathering",
    "Annual private retreat (off calendar)",
    "Direct line to the Director's office",
  ];

  // synthesize per-tier inclusion based on order
  const inclusion = {
    silver:   [1,1,1,1, 0,0,0,0, 0,0,0, 0,0,0,0],
    gold:     [1,1,1,1, 1,1,1,1, 0,0,0, 0,0,0,0],
    platinum: [1,1,1,1, 1,1,1,1, 1,1,1, 0,0,0,0],
    founder:  [1,1,1,1, 1,1,1,1, 1,1,1, 1,1,1,1],
  };

  return (
    <div className="card" style={{ marginTop: 56, padding: 0, overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "20px 24px", borderBottom: "1px solid var(--rule)", width: "40%" }}>
              <span className="label">What's included</span>
            </th>
            {tiers.map(t => (
              <th key={t.id} style={{
                padding: "20px 16px",
                borderBottom: "1px solid var(--rule)",
                borderLeft: "1px solid var(--rule)",
                background: active === t.id ? "var(--paper-card)" : "transparent",
              }}>
                <div className="label label--ink" style={{ marginBottom: 4 }}>{t.name}</div>
                <div className="small" style={{ textTransform: "none", letterSpacing: 0 }}>{t.seats}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allPerks.map((perk, i) => (
            <tr key={i}>
              <td style={{ padding: "14px 24px", borderBottom: "1px solid var(--rule)" }}>
                <span className="body" style={{ fontSize: 14 }}>{perk}</span>
              </td>
              {tiers.map(t => (
                <td key={t.id} style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--rule)",
                  borderLeft: "1px solid var(--rule)",
                  textAlign: "center",
                  background: active === t.id ? "var(--paper-card)" : "transparent",
                }}>
                  <Tick on={!!inclusion[t.id][i]} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Membership() {
  const tiers = window.LL_DATA.TIERS;
  const [active, setActive] = useStateMem("platinum");
  const [billing, setBilling] = useStateMem("annual");

  return (
    <section id="membership" className="section section--warm" data-screen-label="Membership">
      <div className="container">
        <div className="section-head">
          <span className="label">02 — Membership</span>
          <div>
            <h2 className="display h2" style={{ marginBottom: 18 }}>
              Four tiers. <em>One register, kept by hand.</em>
            </h2>
            <p className="lede" style={{ maxWidth: 640, margin: 0 }}>
              Pay annually or monthly. Apply online; we reply within a working week.
              Founder seats are by introduction only.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24, gap: 4, alignItems: "center" }}>
          <span className="label" style={{ marginRight: 12 }}>Billing</span>
          <div style={{ border: "1px solid var(--rule-strong)", borderRadius: 999, padding: 3, display: "flex" }}>
            {[["annual","Annual"],["monthly","Monthly"]].map(([v, l]) => (
              <button key={v}
                onClick={() => setBilling(v)}
                className="label"
                style={{
                  padding: "8px 16px", borderRadius: 999,
                  background: billing === v ? "var(--ink)" : "transparent",
                  color: billing === v ? "var(--paper)" : "var(--ink-mute)",
                  transition: "background 200ms ease",
                  cursor: "pointer",
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid-4 tier-grid" style={{ gap: 20, paddingTop: 16 }}>
          {tiers.map(t => (
            <TierCard key={t.id} tier={t} billing={billing} active={active === t.id} onClick={() => setActive(t.id)} />
          ))}
        </div>

        <Comparator tiers={tiers} active={active} />

        <p className="small" style={{ marginTop: 24, textAlign: "center" }}>
          Membership is a personal contract. It does not constitute a securities subscription
          or an interest in any investment vehicle. Reviewed annually.
        </p>
      </div>
    </section>
  );
}

window.LL_Membership = Membership;
