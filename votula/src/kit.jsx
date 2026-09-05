// Votula brand kit — the marks and motifs from brand.html as reusable pieces.
// Everything here is geometry only; colour comes from the tone prop or CSS vars.

const { useId, useState, useEffect, useRef } = React;

/* ── Mark A · Sunset V ───────────────────────────────────────
   A setting sun cut by the horizon. The V is the first letter of
   the name and an arrow down into the water.
   Tones:  brand      yellow sun, salt V, lagoon horizon (on black)
           solid      one flat colour (on yellow, or single-colour print)
           light      all salt
------------------------------------------------------------- */
function Mark({ size = 40, tone = "brand", color, title }) {
  const clip = useId().replace(/:/g, "");
  const sun = tone === "brand" ? "#FFD200" : color || (tone === "light" ? "#FBF7EC" : "#06090E");
  const vee = tone === "brand" ? "#FBF7EC" : sun;
  const bar = tone === "brand" ? "#12D8B0" : sun;
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role={title ? "img" : "presentation"}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : "true"}
      style={{ flex: "none" }}
    >
      <defs>
        <clipPath id={clip}><rect x="0" y="0" width="120" height="66" /></clipPath>
      </defs>
      <circle cx="60" cy="66" r="34" fill={sun} clipPath={`url(#${clip})`} />
      <path d="M26 66 L60 108 L94 66" fill="none" stroke={vee} strokeWidth="9" strokeLinejoin="miter" />
      <rect x="10" y="62" width="100" height="7" fill={bar} />
    </svg>
  );
}

/* Horizontal lockup. Clear space equals the height of the sun disc. */
function Lockup({ markSize = 34, type = 24, tone = "brand", sub, href = "index.html", stacked = false }) {
  const ink = tone === "brand" || tone === "light" ? "var(--salt)" : "var(--black)";
  const Tag = href ? "a" : "div";
  return (
    <Tag
      href={href || undefined}
      style={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: stacked ? "flex-start" : "center",
        gap: stacked ? 12 : 12,
        color: ink,
      }}
      aria-label="Votula — home"
    >
      <Mark size={markSize} tone={tone} title={href ? "Votula" : ""} />
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: type, letterSpacing: "-0.03em", color: ink }}>
          VOTULA
        </div>
        {sub && (
          <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: 6, color: tone === "solid" ? "rgba(6,9,14,.6)" : "var(--text-4)" }}>
            {sub}
          </div>
        )}
      </div>
    </Tag>
  );
}

/* ── Double wave rule ────────────────────────────────────────
   Replaces the horizontal divider. Lagoon over Danube blue.
------------------------------------------------------------- */
function wavePath(y, width = 1200, seg = 30) {
  let d = `M0 ${y} q${seg / 2} -${Math.round(seg * 0.55)} ${seg} 0`;
  for (let x = seg; x < width; x += seg) d += ` t${seg} 0`;
  return d;
}

function WaveRule({ height = 22, opacity = 0.9 }) {
  return (
    <svg className="wave-rule" viewBox="0 0 1200 24" height={height} preserveAspectRatio="none" aria-hidden="true" style={{ opacity }}>
      <path d={wavePath(9)} fill="none" stroke="var(--lagoon)" strokeWidth="3" strokeLinecap="round" />
      <path d={wavePath(18)} fill="none" stroke="rgba(10,107,214,.8)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ── Chain strip ─────────────────────────────────────────────
   Progress, timelines, steps. The last block stays dashed until
   it is confirmed.
------------------------------------------------------------- */
function ChainStrip({ steps, confirmed = steps.length - 1 }) {
  return (
    <ol
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(190px, 1fr))`,
        gap: 0,
      }}
    >
      {steps.map((s, i) => {
        const isPending = i > confirmed;
        return (
          <li key={s.title} style={{ position: "relative", paddingRight: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span
                style={{
                  width: 34,
                  height: 26,
                  borderRadius: 4,
                  border: `2px solid ${isPending ? "var(--text-4)" : "var(--yellow)"}`,
                  borderStyle: isPending ? "dashed" : "solid",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: isPending ? "var(--text-4)" : "var(--yellow)",
                  flex: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {i < steps.length - 1 && <span style={{ flex: 1, height: 2, background: "var(--lagoon)", opacity: isPending ? 0.25 : 1 }} />}
            </div>
            <h3 className="h4" style={{ marginBottom: 6, color: isPending ? "var(--text-3)" : "var(--text)" }}>{s.title}</h3>
            <p className="small" style={{ paddingRight: 12 }}>{s.body}</p>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Sunset hero background ──────────────────────────────────
   Heat at the top, ledger at the bottom. Exactly one sun.
   `full` = the landing hero ramp; otherwise a shorter interior band.
------------------------------------------------------------- */
function SunsetBackdrop({ full = false, sunTop = "34%", sunLeft = "50%", sunWidth = "min(560px, 70vw)", sunOpacity = 1 }) {
  return (
    <div className="page-hero-bg" aria-hidden="true">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: full
            ? "var(--ramp-sunset)"
            : "linear-gradient(180deg, #06090E 0%, #0B1A2A 62%, #3A1B3C 88%, #8E2A31 100%)",
        }}
      />
      <div className="sun" style={{ left: sunLeft, top: sunTop, transform: "translate(-50%,-50%)", width: sunWidth, aspectRatio: 1, opacity: sunOpacity }} />
      <div className="grid-horizon" />
      {full && (
        <div
          style={{
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            height: "34%",
            background: "linear-gradient(180deg, rgba(255,210,0,0) 0%, rgba(255,138,43,.25) 100%)",
          }}
        />
      )}
    </div>
  );
}

/* ── Interior page hero ──────────────────────────────────────
   A shorter sunset band. Still exactly one sun, still ledger at
   the bottom — but the heat stops short of yellow so the page
   below it can carry the accent.
------------------------------------------------------------- */
function PageHero({ eyebrow, title, lede, actions, aside }) {
  return (
    <section className="page-hero">
      {/* Sun pushed right and dimmed: the headline and buttons live on the
          left, and nothing should have to read over the disc. */}
      <SunsetBackdrop sunTop="92%" sunLeft="72%" sunWidth="min(620px, 78vw)" sunOpacity={0.72} />
      <div className="wrap" style={{ position: "relative" }}>
        {/* Wide column on the left: the headline needs the room more than the
            aside card does. */}
        <div className="grid grid--wide" style={{ alignItems: "end", gap: 48 }}>
          <div className="stack stack--lg">
            <div className="eyebrow eyebrow--yellow">{eyebrow}</div>
            <h1 className="h1" style={{ fontSize: "clamp(40px, 5.6vw, 76px)" }}>{title}</h1>
            {lede && <p className="lede" style={{ maxWidth: "30ch", color: "var(--text-2)" }}>{lede}</p>}
            {actions && <div className="flex" style={{ gap: 12, marginTop: 4 }}>{actions}</div>}
          </div>
          {aside && <div className="stack">{aside}</div>}
        </div>
      </div>
    </section>
  );
}

/* ── Section header ──────────────────────────────────────── */
function SectionHead({ index, title, note, tone = "lagoon" }) {
  const cls = tone === "yellow" ? "eyebrow eyebrow--yellow" : tone === "sunset" ? "eyebrow eyebrow--sunset" : "eyebrow";
  return (
    <div className="sec-head">
      <div>
        <div className={cls}>{index} — {title.eyebrow}</div>
        <h2 className="h2">{title.head}</h2>
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}

/* ── Parameter table ─────────────────────────────────────────
   Protocol values are data, so they are set in the mono face and
   right-aligned in every column but the first. Wide tables scroll
   inside their own box rather than pushing the page sideways.
------------------------------------------------------------- */
function ParamTable({ title, cols, rows, note }) {
  return (
    <div className="card card--clip stack" style={{ gap: 0, alignContent: "start" }}>
      <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
        <h3 className="h4">{title}</h3>
      </div>
      <div className="table-wrap">
        <table className="ptable">
          <thead>
            <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[0]}>
                {r.map((cell, i) => (
                  <td key={i} className={i === 0 ? "ptable-key" : undefined}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <p className="small" style={{ padding: "14px 22px 18px", borderTop: "1px solid var(--line-soft)" }}>{note}</p>
      )}
    </div>
  );
}

/* ── Module chips ────────────────────────────────────────────
   One kernel layer: its name, what it is for, and the contracts
   that live in it. Contract names are data, so: mono.
------------------------------------------------------------- */
function LayerCard({ name, note, modules, colour, badge }) {
  return (
    <div className="card card--pad stack stack--lg" style={{ position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: colour, opacity: 0.85 }} />
      <div className="flex" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="stack stack--sm">
          <div className="eyebrow" style={{ color: colour }}>{name}</div>
          <p className="small" style={{ color: "var(--text-2)" }}>{note}</p>
        </div>
        {badge && <span className="data" style={{ color: "var(--text-4)", whiteSpace: "nowrap" }}>{badge}</span>}
      </div>
      <div className="flex" style={{ gap: 8 }}>
        {modules.map(m => <span key={m} className="chip">{m}</span>)}
      </div>
    </div>
  );
}

/* ── Stat ────────────────────────────────────────────────── */
function Stat({ label, value, unit, note }) {
  return (
    <div className="stack stack--sm">
      <div className="eyebrow eyebrow--mute">{label}</div>
      <div className="figure">
        {value}
        {unit && <span style={{ fontSize: "0.45em", color: "var(--yellow)", marginLeft: 8, letterSpacing: 0 }}>{unit}</span>}
      </div>
      {note && <div className="data">{note}</div>}
    </div>
  );
}

/* ── Reveal-on-scroll ────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;
    els.forEach(e => e.classList.add("reveal"));
    const io = new IntersectionObserver(
      entries => entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.06, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
}

window.VT = {
  Mark, Lockup, WaveRule, ChainStrip, SunsetBackdrop, PageHero, SectionHead, Stat,
  ParamTable, LayerCard, useReveal, wavePath,
};
