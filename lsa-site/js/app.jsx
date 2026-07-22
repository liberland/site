/* ============================================================
   app.jsx — hash router + mount + Tweaks
   ============================================================ */
const { Header, Footer, Home, About, Sports, CleanSport, Support } = window;
const { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio } = window;

const PAGES = {
  "/": Home,
  "/about": About,
  "/sports": Sports,
  "/clean-sport": CleanSport,
  "/support": Support,
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "display": "Archivo",
  "bodyType": "Serif",
  "accent": "#F2C200"
}/*EDITMODE-END*/;

const DISPLAY_STACK = {
  Archivo: '"Archivo", system-ui, sans-serif',
  Fraunces: '"Fraunces", Georgia, serif',
};
const BODY_STACK = {
  Serif: '"Spectral", Georgia, serif',
  Sans: '"Archivo", system-ui, sans-serif',
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--display", DISPLAY_STACK[t.display] || DISPLAY_STACK.Archivo);
    r.setProperty("--body", BODY_STACK[t.bodyType] || BODY_STACK.Serif);
    r.setProperty("--accent", t.accent);
  }, [t.display, t.bodyType, t.accent]);

  const [route, setRoute] = React.useState(() => {
    const h = window.location.hash.replace(/^#/, "");
    return h.startsWith("/") ? (PAGES[h] ? h : "/") : "/";
  });
  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#/, "");
      if (h.startsWith("/")) {
        const r = PAGES[h] ? h : "/";
        setRoute(r);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    };
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const Page = PAGES[route] || Home;
  return (
    <React.Fragment>
      <Header route={route} />
      <main key={route}><Page /></main>
      <Footer />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Typography" />
        <TweakRadio label="Headlines" value={t.display} options={["Archivo", "Fraunces"]}
          onChange={(v) => setTweak("display", v)} />
        <TweakRadio label="Body text" value={t.bodyType} options={["Serif", "Sans"]}
          onChange={(v) => setTweak("bodyType", v)} />
        <TweakSection label="Colour" />
        <TweakColor label="Section accent" value={t.accent}
          options={["#F2C200", "#1A8F6B", "#0F76C2", "#C8432F"]}
          onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
