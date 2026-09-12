# Deployment

## Intended production deployment: Netlify (own site)

Matching `liberland-limited/` and `new-site/`, this folder is meant to be
configured as its own Netlify site:

1. Create a new Netlify site pointed at this repository.
2. Set **Base directory** to `build-what-was-removed`.
3. Build command: none (`netlify.toml` already sets `command = ""`,
   `publish = "."`).
4. Point a real domain at it once one is chosen. The canonical/OG tags
   currently point at `https://liberlandlimited.com/fund/`, which is where
   the GitHub Pages build below actually serves it — update them if a
   dedicated domain is adopted later.

No `_redirects` file is needed: routing is hash-based
(`#/incidents/...`), so every route resolves against the single
`index.html` regardless of host — see `ARCHITECTURE.md`.

## Current home: GitHub Pages at /fund

`.github/workflows/deploy-pages.yml` assembles all three sites and this
folder is mounted at:

```
https://liberlandlimited.com/fund/
```

The domain comes from `liberland-limited/CNAME`, which is copied to the
build root; `liberland-limited/` serves `/`, `new-site/` serves
`/candidate/`, and this folder serves `/fund/`.

**Deploys only from `master`.** The `github-pages` environment restricts
which branches may deploy, so a push to a feature branch runs the workflow
and fails at the deploy step in about a second. That is a repository
setting, not a fault in the build — either merge to `master`, or add the
branch under Settings → Environments → `github-pages` → Deployment
branches.

**The page is `noindex, nofollow`** while the legal checklist is open (see
`index.html`; the TODO there says how to flip it). Note that
`/fund/robots.txt` is never read by crawlers — only the file at the domain
root is — so the meta tag is what actually governs indexing here.

This preview exists purely so the site can be reviewed with a real URL
before a Netlify site is created for it. It is not the intended long-term
home — `liberland-limited/`'s own `CNAME` file shows the pattern this repo
follows (a real Netlify-hosted domain, with GitHub Pages as a secondary
mirror/candidate-preview surface), and this site should follow the same
pattern once its recipient entity and domain are decided
(`LEGAL-REVIEW-CHECKLIST.md`).

## Local development

```
npx serve . -l 3738 -s
```

No build step, no environment variables required for local dev.
