// App composition, reveal-on-scroll observer and deep links
const { useEffect: useEffectApp } = React;

// Anchors from earlier versions of the page that should still land somewhere sensible.
const ANCHOR_ALIASES = { residences: "visit", gatherings: "events", correspondence: "contact" };

function scrollToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const el = document.getElementById(ANCHOR_ALIASES[id] || id);
  if (el) el.scrollIntoView();
}

function Marquee() {
  const items = window.LL_T.marquee.flatMap(it => [it, "★"]);
  // duplicate for seamless loop
  const all = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {all.map((it, i) => (
          <span key={i} className={it === "★" ? "star" : ""}>{it}</span>
        ))}
      </div>
    </div>
  );
}

function App() {
  useEffectApp(() => {
    // The page is rendered by script, so the browser cannot jump to /#contact on its own.
    scrollToHash();
    const onHash = () => {
      const id = location.hash.slice(1);
      if (ANCHOR_ALIASES[id]) scrollToHash();
    };
    window.addEventListener("hashchange", onHash);

    const els = document.querySelectorAll(".section, .card");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach(e => {
      // Only animate what is still below the fold, so deep links never land on invisible content.
      if (e.getBoundingClientRect().top > window.innerHeight) {
        e.classList.add("reveal");
        io.observe(e);
      }
    });
    return () => { io.disconnect(); window.removeEventListener("hashchange", onHash); };
  }, []);

  return (
    <>
      <window.LL_Nav />
      <main id="main" tabIndex={-1}>
        <window.LL_Hero />
        <Marquee />
        <window.LL_About />
        <window.LL_Membership />
        <window.LL_Events />
        <window.LL_Visit />
        <window.LL_Company />
        <window.LL_Contact />
        <window.LL_Faq />
      </main>
      <window.LL_Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
