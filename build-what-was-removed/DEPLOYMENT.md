# Deployment

## Intended production deployment: Netlify (own site)

Matching `liberland-limited/` and `new-site/`, this folder is meant to be
configured as its own Netlify site:

1. Create a new Netlify site pointed at this repository.
2. Set **Base directory** to `build-what-was-removed`.
3. Build command: none (`netlify.toml` already sets `command = ""`,
   `publish = "."`).
4. Point a real domain at it once one is chosen (the placeholder domain
   `buildwhatwasremoved.org` in `index.html`'s canonical/OG tags is a
   TODO, not a live domain).

No `_redirects` file is needed: routing is hash-based
(`#/incidents/...`), so every route resolves against the single
`index.html` regardless of host — see `ARCHITECTURE.md`.

## Temporary preview: GitHub Pages

Until a dedicated Netlify site exists, this folder is also published
read-only by `.github/workflows/deploy-pages.yml` alongside the other two
sites, at:

```
https://<pages-domain-for-this-repo>/build-what-was-removed/
```

(The exact `<pages-domain-for-this-repo>` depends on how GitHub Pages is
configured for this repository — check the repo's Pages settings, or the
`page_url` output of the "Deploy to GitHub Pages" workflow run.)

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
