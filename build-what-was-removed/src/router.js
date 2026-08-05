// Minimal hash-based client router — no framework dependency, matches this
// repo's convention of plain global scripts loaded without a bundler.
// Hash routing (not history.pushState with real paths) so the site works
// unmodified from any static host and any mount point — a Netlify site at
// its own domain root, or a GitHub Pages preview at a subpath like
// /site/build-what-was-removed/ — without needing server-side rewrites for
// deep links such as #/incidents/GS-2023-09-21.
(function (root) {
  function parseHash(hash) {
    const raw = (hash || "").replace(/^#\/?/, "");
    const [pathPart, searchPart] = raw.split("?");
    const params = new URLSearchParams(searchPart || "");
    const segs = pathPart.split("/").filter(Boolean);

    if (segs.length === 0) return { view: "home", params };
    if (segs[0] === "ledger") return { view: "ledger", params };
    if (segs[0] === "incidents" && segs[1]) return { view: "incident", incidentId: decodeURIComponent(segs[1]), params };
    if (segs[0] === "case") return { view: "case", params };
    if (segs[0] === "evidence") return { view: "evidence", params };
    if (segs[0] === "fund") return { view: "fund", params };
    if (segs[0] === "updates") return { view: "updates", params };
    if (segs[0] === "right-of-reply") return { view: "reply", params };
    if (segs[0] === "legal") return { view: "legal", section: segs[1] || null, params };
    return { view: "home", params };
  }

  function pathFor(view, opts) {
    opts = opts || {};
    switch (view) {
      case "home":
        return "#/";
      case "ledger":
        return "#/ledger" + (opts.search ? "?" + opts.search : "");
      case "incident":
        return "#/incidents/" + encodeURIComponent(opts.incidentId);
      case "case":
        return "#/case";
      case "evidence":
        return "#/evidence";
      case "fund":
        return "#/fund";
      case "updates":
        return "#/updates";
      case "reply":
        return "#/right-of-reply";
      case "legal":
        return "#/legal" + (opts.section ? "/" + opts.section : "");
      default:
        return "#/";
    }
  }

  function navigate(view, opts) {
    const path = pathFor(view, opts);
    if (path !== root.location.hash) {
      root.location.hash = path;
    } else {
      root.dispatchEvent(new Event("bwwr:navigate"));
    }
    if (!(opts && opts.preserveScroll)) root.scrollTo(0, 0);
  }

  root.Router = { parseHash, pathFor, navigate };
})(typeof window !== "undefined" ? window : this);
