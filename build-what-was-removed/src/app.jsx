function useRoute() {
  const [route, setRoute] = React.useState(() => window.Router.parseHash(window.location.hash));

  React.useEffect(() => {
    const onChange = () => setRoute(window.Router.parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    window.addEventListener("bwwr:navigate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("bwwr:navigate", onChange);
    };
  }, []);

  return route;
}

function App() {
  const route = useRoute();
  const mainRef = React.useRef(null);

  let page;
  switch (route.view) {
    case "ledger":
      page = <window.BWWR_Ledger initialParams={route.params} />;
      break;
    case "incident":
      page = <window.BWWR_IncidentDetail incidentId={route.incidentId} />;
      break;
    case "case":
      page = <window.BWWR_CasePage />;
      break;
    case "evidence":
      page = <window.BWWR_EvidencePage />;
      break;
    case "fund":
      page = <window.BWWR_FundPage />;
      break;
    case "updates":
      page = <window.BWWR_UpdatesPage />;
      break;
    case "reply":
      page = <window.BWWR_ReplyPage />;
      break;
    case "legal":
      page = <window.BWWR_LegalPage section={route.section} />;
      break;
    default:
      page = <window.BWWR_Home />;
  }

  // A real "#main" fragment would be swallowed by the hash router (it isn't
  // a recognised route segment, so it would fall through to the home view).
  // Focus the landmark directly instead of relying on native fragment nav.
  function skipToMain(e) {
    e.preventDefault();
    if (mainRef.current) mainRef.current.focus();
  }

  return (
    <>
      <a href="#/" onClick={skipToMain} className="skip-link">Skip to main content</a>
      <window.BWWR_UtilityBar />
      <window.BWWR_SiteNav view={route.view} />
      <main id="main" ref={mainRef} tabIndex="-1">{page}</main>
      <window.BWWR_SiteFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
