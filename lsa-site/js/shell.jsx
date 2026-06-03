/* ============================================================
   shell.jsx — LOS shared: data, Crest, Header, Footer, helpers
   ============================================================ */

const ROUTES = [
  { path: "/", label: "Home", nav: false },
  { path: "/about", label: "About & Governance", nav: true, short: "About" },
  { path: "/sports", label: "Sports & Federations", nav: true, short: "Sports" },
  { path: "/clean-sport", label: "Clean Sport & Integrity", nav: true, short: "Clean Sport" },
  { path: "/support", label: "Support & Patrons", nav: true, short: "Support" },
];

const FEDS = [
  { ab: "LFF", nm: "Football", c: "var(--green)", body: "FIFA", olympic: true, status: "full",
    tagline: "The national game — clubs, leagues and a route to the international stage.",
    extra: "League and competition structure; option to partner with neighbouring leagues (the Liechtenstein lesson); referee and club licensing.",
    clubs: 9, members: 420, champ: "Liberland Football Championship" },
  { ab: "LAF", nm: "Athletics", c: "var(--red)", body: "World Athletics", olympic: true, status: "full",
    tagline: "Track & field — the heart of the small-states programme and a near-term podium bet.",
    extra: "Event listings across track & field, national records, and a focused medal-target discipline at small-states level.",
    clubs: 6, members: 280, champ: "Liberland Athletics Championships" },
  { ab: "LCF", nm: "Cycling", c: "var(--blue)", body: "UCI", olympic: true, status: "full",
    tagline: "Road, mountain and track racing across Liberland and the Danube region.",
    extra: "Road / MTB / track disciplines; route & event safety; licence registration.",
    clubs: 5, members: 190, champ: "Tour of Liberland" },
  { ab: "LMMAF", nm: "Mixed Martial Arts", c: "var(--ink)", body: "IMMAF", olympic: false, status: "full",
    tagline: "Consent-based combat sport, governed strictly within the Non-Aggression Principle.",
    extra: "Combat is NAP-compatible because each contestant freely and informedly consents within published, revocable rules — never authorising harm beyond consent. Published medical & safety standards.",
    clubs: 4, members: 150, champ: "Liberland MMA Open" },
  { ab: "LChF", nm: "Chess", c: "var(--gold-deep)", body: "FIDE", olympic: false, status: "full",
    tagline: "A low-cost, high-visibility route to the international stage for a young nation.",
    extra: "Rating & tournament system; online play; broad accessibility — chess is an IOC-recognised IF, though not on the Olympic programme.",
    clubs: 7, members: 510, champ: "Liberland Chess Championship" },
  { ab: "LArF", nm: "Archery", c: "var(--violet)", body: "World Archery", olympic: true, status: "provisional",
    tagline: "A precision sport where a tiny nation can realistically reach a podium.",
    extra: "Range & safety rules; the San Marino lesson — concentrate resources on a precision discipline with genuine podium potential.",
    clubs: 3, members: 95, champ: "Liberland Archery Grand Prix" },
];

const NEWS = [
  { tag: "Announcement", fed: "LOS", date: "28 May 2026", title: "LOS publishes its founding Bylaws and first transparency dossier", excerpt: "The full statutes, org chart and funding statement are now public — the cornerstone of our recognition file.", img: "var(--green)" },
  { tag: "Athletics", fed: "LAF", date: "21 May 2026", title: "National athletics records ratified ahead of the GSSE cycle", excerpt: "Six events get their first official Liberland marks.", img: "var(--red)" },
  { tag: "Governance", fed: "LOS", date: "14 May 2026", title: "General Assembly elects first Executive Board", excerpt: "Results published in full under meritocratic voting.", img: "var(--blue)" },
];

const EVENTS = [
  { d: "12", m: "Jul", ev: "Liberland Athletics Championships", loc: "Central Range, Liberland", tier: "National" },
  { d: "03", m: "Sep", ev: "Tour of Liberland — Road Race", loc: "Danube Circuit", tier: "National" },
  { d: "18", m: "Oct", ev: "Liberland Chess Championship", loc: "Online + Liberty Hall", tier: "National" },
  { d: "—", m: "2027", ev: "Games of the Small States of Europe", loc: "Target participation cycle", tier: "Continental" },
];

function fedColor(f){ return f.c; }

/* ---------- Crest ---------- */
function Crest({ size = 56 }) {
  const id = "c" + size;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-label="LOS crest" style={{ display: "block" }}>
      <defs>
        <path id={id + "t"} d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
        <path id={id + "b"} d="M 36 100 A 64 64 0 0 0 164 100" fill="none" />
      </defs>
      <circle cx="100" cy="100" r="98" fill="#15130E" />
      <circle cx="100" cy="100" r="92" fill="#F2C200" />
      <circle cx="100" cy="100" r="68" fill="#F7F3E8" stroke="#15130E" strokeWidth="2.5" />
      <text fontFamily="Archivo" fontSize="11" fontWeight="700" letterSpacing="2.1" fill="#15130E">
        <textPath href={"#" + id + "t"} startOffset="50%" textAnchor="middle">LIBERLAND SPORTS · OLYMPIC CTTE</textPath>
      </text>
      <text fontFamily="Archivo" fontSize="10" fontWeight="700" letterSpacing="3" fill="#15130E">
        <textPath href={"#" + id + "b"} startOffset="50%" textAnchor="middle">EST · MMXXVI</textPath>
      </text>
      <text x="100" y="103" fontFamily="Fraunces" fontSize="62" fontWeight="900" fill="#15130E" textAnchor="middle" dominantBaseline="middle">L</text>
      <g>
        <circle cx="72" cy="132" r="6" fill="#0F76C2" />
        <circle cx="86" cy="132" r="6" fill="#F2C200" stroke="#15130E" strokeWidth="1" />
        <circle cx="100" cy="132" r="6" fill="#15130E" />
        <circle cx="114" cy="132" r="6" fill="#1A8F6B" />
        <circle cx="128" cy="132" r="6" fill="#C8432F" />
      </g>
    </svg>
  );
}

/* ---------- reveal-on-scroll ---------- */
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  });
}

/* ---------- small UI ---------- */
const Eyebrow = ({ children, className = "" }) => (
  <span className={"eyebrow " + className}>{children}</span>
);

const PH = ({ label = "Photo", className = "", style, dark }) => (
  <div className={"ph " + (dark ? "dark " : "") + className} data-label={label} style={style}>
    <div className="cam"></div>
  </div>
);

function go(path){ window.location.hash = "#" + path; }

/* ---------- Header ---------- */
function Header({ route }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { setOpen(false); }, [route]);
  return (
    <header className={"header" + (open ? " open" : "")}>
      <div className="bar">
        <div className="brand" onClick={() => go("/")}>
          <Crest size={42} />
          <div>
            <div className="wm-a">LOS</div>
            <div className="wm-b">Liberland · Olympic Committee</div>
          </div>
        </div>
        <nav className="nav-links">
          {ROUTES.filter(r => r.nav).map(r => (
            <a key={r.path} href={"#" + r.path} className={route === r.path ? "active" : ""}>{r.short}</a>
          ))}
        </nav>
        <div className="right">
          <div className="lang"><b>EN</b> · LB</div>
          <a href="#/support" className="btn btn-gold btn-sm">Support the movement</a>
          <button className="burger" aria-label="Menu" onClick={() => setOpen(o => !o)}>
            <i></i><i></i><i></i>
          </button>
        </div>
      </div>
      <div className="mobile-menu">
        {ROUTES.filter(r => r.nav).map(r => (
          <a key={r.path} href={"#" + r.path}>{r.label}</a>
        ))}
        <a href="#/support">Donate · Become a Patron</a>
      </div>
    </header>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const [email, setEmail] = React.useState("");
  const [msg, setMsg] = React.useState(null);
  const submit = (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setMsg({ ok: false, t: "Enter a valid email." }); return; }
    setMsg({ ok: true, t: "Subscribed — welcome to the movement." }); setEmail("");
  };
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="cols">
          <div>
            <div className="brand" style={{ marginBottom: 4 }} onClick={() => go("/")}>
              <Crest size={52} />
              <div>
                <div className="wm-a" style={{ fontSize: 22 }}>LOS</div>
                <div className="wm-b">Liberland Sports & Olympic Committee</div>
              </div>
            </div>
            <p className="motto">"Live Free, Respect Others"</p>
            <p className="sig">The voluntary National Olympic Committee and sports confederation of the Free Republic of Liberland.</p>
            <form className="signup" onSubmit={submit}>
              <input type="email" placeholder="Email for the newsroom" value={email} onChange={e => { setEmail(e.target.value); setMsg(null); }} />
              <button type="submit">Join</button>
            </form>
            {msg && <p className="msg" style={{ color: msg.ok ? "var(--gold)" : "#E98", marginTop: 8 }}>{msg.t}</p>}
          </div>
          <div>
            <h5>Movement</h5>
            <ul>
              <li><a href="#/about">About & Governance</a></li>
              <li><a href="#/sports">Sports & Federations</a></li>
              <li><a href="#/clean-sport">Clean Sport & Integrity</a></li>
              <li><a href="#/support">Support & Patrons</a></li>
            </ul>
          </div>
          <div>
            <h5>Federations</h5>
            <ul>
              {FEDS.map(f => <li key={f.ab}><a href="#/sports">{f.ab} · {f.nm}</a></li>)}
            </ul>
          </div>
          <div>
            <h5>Transparency</h5>
            <ul>
              <li><a href="#/about">Bylaws & statutes</a></li>
              <li><a href="#/about">Officers & elections</a></li>
              <li><a href="#/support">Audited accounts</a></li>
              <li><a href="#/clean-sport">Court of Sport Arbitration</a></li>
              <li><a href="#/about">Contact & registered seat</a></li>
            </ul>
          </div>
        </div>
        <p className="disclaimer">
          The LOS is a private, voluntary, member-based association financed exclusively by voluntary means. It is not a tax-funded state organ and makes no claim on the public treasury. The LOS is not yet recognised by the International Olympic Committee; no Olympic recognition is implied. Olympic-related marks are used only as permitted. This site is a design prototype.
        </p>
        <div className="bottom">
          <span>© MMXXVI Liberland Sports & Olympic Committee</span>
          <a href="#/about">Privacy</a>
          <a href="#/about">Cookies</a>
          <a href="#/about">Terms</a>
          <span className="sp">Registered seat · Territory of Liberland</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { ROUTES, FEDS, NEWS, EVENTS, Crest, useReveal, Eyebrow, PH, Header, Footer, go, fedColor });
