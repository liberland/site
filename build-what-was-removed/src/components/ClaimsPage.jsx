function claimStatus(inc) {
  if (inc.status === "temporary_administrative_seizure") return { cls: "badge badge--warn", text: "TEMPORARY SEIZURE" };
  if (inc.status === "claimed_unreturned_or_destroyed") return { cls: "badge badge--bad", text: "CLAIMED UNRETURNED / DESTROYED" };
  return { cls: "badge badge--neutral", text: inc.statusLabel };
}

// What a claim's value line may say. The distinction matters: "covered by
// the incident total" is not the same as "not valued", and neither is zero.
function claimValue(claim, inc) {
  const eur = window.Metrics.formatEUR;
  if (claim.cents != null) return { text: eur(claim.cents), tone: "value" };
  if (claim.informational && inc.claimedCents != null)
    return { text: "Inside the incident total", tone: "muted" };
  return { text: "Not valued", tone: "muted" };
}

function ClaimCard({ claim, inc }) {
  const go = window.BWWR_goTo;
  const Photo = window.BWWR_Photo;
  const status = claimStatus(inc);
  const value = claimValue(claim, inc);

  return (
    <article className="claim">
      <div className="claim__figure">
        {claim.imageId ? (
          <Photo id={claim.imageId} aspect="4/3" radius="record" />
        ) : (
          <div style={{ aspectRatio: "4/3" }}>
            <div className="image-slot image-slot--withheld" style={{ width: "100%", height: "100%" }}>
              NO PHOTOGRAPH ON RECORD
              <br />
              ADD ONE TO {claim.id}
            </div>
          </div>
        )}
      </div>

      <div className="claim__body">
        <div className="label-mono claim__ref">{claim.id}</div>
        <h3 className="claim__name">{claim.name}</h3>
        <p className="claim__desc">{claim.description}</p>

        <dl className="claim__facts">
          <div>
            <dt>Category</dt>
            <dd>{claim.category}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>{claim.owner}</dd>
          </div>
          <div>
            <dt>Value</dt>
            <dd className={value.tone === "muted" ? "claim__value--muted" : "claim__value"}>{value.text}</dd>
          </div>
        </dl>

        <div className="row-wrap gap-8 claim__tags">
          <span className={status.cls}>{status.text}</span>
          {claim.itemisationPending && <span className="badge badge--warn">NOT YET ITEMISED</span>}
        </div>

        <button className="claim__link mono" onClick={go("incident", { incidentId: inc.id })}>
          {inc.id} · {inc.title} →
        </button>
      </div>
    </article>
  );
}

function ClaimsPage() {
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const items = window.Data.items;
  const incidents = window.Data.incidents;
  const s = window.Metrics.claimsSummary(items);

  const categories = ["all"].concat(
    items
      .map((i) => i.category)
      .filter((c, idx, arr) => arr.indexOf(c) === idx)
      .sort()
  );

  const needle = q.trim().toLowerCase();
  const match = (c) =>
    (category === "all" || c.category === category) &&
    (!needle || (c.name + " " + c.description + " " + c.category + " " + c.owner + " " + c.id).toLowerCase().includes(needle));

  const groups = window.Metrics.claimsByIncident(incidents, items)
    .map((g) => ({ ...g, claims: g.claims.filter(match) }))
    .filter((g) => g.claims.length > 0);

  const shown = groups.reduce((n, g) => n + g.claims.length, 0);

  return (
    <div>
      <section style={{ background: "var(--void)", color: "var(--chalk)" }}>
        <div className="container" style={{ paddingTop: 72, paddingBottom: 64 }}>
          <div className="row gap-14" style={{ marginBottom: 32 }}>
            <span style={{ width: 40, height: 2, background: "var(--yellow)" }} />
            <span className="eyebrow eyebrow--accent">The claims register</span>
          </div>
          <h1 className="h2" style={{ maxWidth: "20ch", marginBottom: 26 }}>
            Everything that was taken
          </h1>
          <p className="lede" style={{ marginBottom: 32 }}>
            Every piece of property on record, one entry at a time: what it was, who owned it, what happened to it,
            and what it was worth. Where a photograph exists it is shown. Where one does not, the entry says so.
          </p>

          <div className="claims-summary">
            <div>
              <div className="claims-summary__n">{s.total}</div>
              <div className="label-mono">ENTRIES ON RECORD</div>
            </div>
            <div>
              <div className="claims-summary__n">{s.valued}</div>
              <div className="label-mono">CARRY A VALUE</div>
            </div>
            <div>
              <div className="claims-summary__n">{s.photographed}</div>
              <div className="label-mono">HAVE A PHOTOGRAPH</div>
            </div>
            <div>
              <div className="claims-summary__n claims-summary__n--warn">{s.itemisationPending}</div>
              <div className="label-mono">NOT YET ITEMISED</div>
            </div>
          </div>

          <div
            className="evidence-notice evidence-notice--compact"
            style={{ marginTop: 24, background: "none", border: "1px solid var(--rule-on-dark)" }}
          >
            <span className="label-mono" style={{ color: "var(--yellow)" }}>
              ON THIS LIST
            </span>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--muted-3)", maxWidth: "110ch" }}>
              An entry marked <strong>not yet itemised</strong> is a category, not a thing — "hand and power tools"
              rather than each tool. Those lines stand as they were recorded at the time and are being broken down
              into individual items. An entry reading <strong>inside the incident total</strong> is already counted
              in that incident's figure and is never added again here.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="claims-filter">
          <label className="field" style={{ flex: "1 1 260px" }}>
            <span className="field-label">Search the register</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Item, owner, reference…" />
          </label>
          <label className="field" style={{ flex: "0 1 230px" }}>
            <span className="field-label">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
          </label>
          <div className="label-mono" style={{ paddingBottom: 12 }}>
            SHOWING {shown} OF {s.total}
          </div>
        </div>

        {groups.length === 0 && (
          <p className="body-text" style={{ marginTop: 32 }}>
            No entry matches that search.
          </p>
        )}

        {groups.map((g) => (
          <section key={g.incident.id} className="claims-group">
            <div className="claims-group__head">
              <div>
                <div className="label-mono" style={{ color: "var(--amber)", marginBottom: 10 }}>
                  {g.incident.id} ·{" "}
                  {new Date(g.incident.date + "T00:00:00").toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <h2 className="h3">{g.incident.title}</h2>
              </div>
              <div className="label-mono">
                {g.claims.length} {g.claims.length === 1 ? "ENTRY" : "ENTRIES"}
              </div>
            </div>
            <div className="claims-grid">
              {g.claims.map((c) => (
                <ClaimCard key={c.id} claim={c} inc={g.incident} />
              ))}
            </div>
          </section>
        ))}
      </section>

      <section style={{ background: "var(--concrete)" }}>
        <div className="container" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <h2 className="h3" style={{ marginBottom: 18, maxWidth: "34ch" }}>
            Something missing, or wrong?
          </h2>
          <p className="body-text" style={{ marginBottom: 28 }}>
            This register is incomplete by admission, not by omission. If you owned something that is not listed, or
            an entry here misdescribes what was yours, the correction route is open and every decision on a request
            is published alongside the record it concerns.
          </p>
          <button className="btn" onClick={window.BWWR_goTo("reply")}>
            Submit a correction
          </button>
        </div>
      </section>
    </div>
  );
}

window.BWWR_ClaimsPage = ClaimsPage;
window.BWWR_ClaimCard = ClaimCard;
