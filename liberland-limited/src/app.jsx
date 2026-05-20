// App composition + reveal-on-scroll observer
const { useEffect: useEffectApp } = React;

function Marquee() {
  const items = [
    "Membership", "★", "Gatherings on the Danube", "★", "A Hong Kong office",
    "★", "Residences at Ark Village", "★", "Members since 2024", "★",
    "Six dates a year", "★",
  ];
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
    const els = document.querySelectorAll(".section, .hero-figure, .card");
    els.forEach(e => e.classList.add("reveal"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <window.LL_Nav />
      <main>
        <window.LL_Hero />
        <Marquee />
        <window.LL_About />
        <window.LL_Membership />
        <window.LL_Events />
        <window.LL_Residences />
        <window.LL_Contact />
      </main>
      <window.LL_Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
