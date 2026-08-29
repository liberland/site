// Shared site data. One file to edit when the facts change.

/* ============================================================
   ⚠ PLACEHOLDER FIGURES
   Every number in this block is illustrative and must be replaced
   with audited, real values before this site goes live. Nothing
   here has been verified. The brand voice rule is "never a claim
   without a figure behind it" — which cuts both ways.
   ============================================================ */
const PLACEHOLDER = {
  treasuryLLM:      "4,201,908",
  treasuryChange:   "30d +18.4%",
  reserveRatio:     "1.02",
  latestBlock:      "18,442,907",
  llmPrice:         "4.2019",
  parcelsTokenised: "112",
  arkPhaseUnits:    "48",
  arkPhaseSold:     "31",
  buildersShipping: "24",
  grantPool:        "250,000",
  audits:           "2",
};

const COMPANY = {
  name:     "Votula, Ltd.",
  city:     "Victoria, Seychelles",
  parent:   "Liberland",
  parentUrl:"https://liberland.org",
  arkUrl:   "https://ark.ll.land",
  email:    "hello@votula.com",
  domain:   "votula.com",
};

const NAV_LINKS = [
  { href: "property.html", label: "Property",  id: "property" },
  { href: "llm.html",      label: "LLM",       id: "llm" },
  { href: "builders.html", label: "Builders",  id: "builders" },
  { href: "company.html",  label: "Company",   id: "company" },
  { href: "docs.html",     label: "Docs",      id: "docs" },
];

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "property.html", label: "Tokenised property" },
      { href: "property.html#offerings", label: "Current offerings" },
      { href: "llm.html", label: "LLM & treasury" },
      { href: "builders.html", label: "Build on Liberland" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "company.html", label: "About Votula" },
      { href: "company.html#structure", label: "How we are structured" },
      { href: "company.html#compliance", label: "Compliance" },
      { href: "company.html#contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "docs.html", label: "Documentation" },
      { href: "brand.html", label: "Brand language" },
      { href: "https://liberland.org", label: "Liberland ↗", external: true },
      { href: "https://ark.ll.land", label: "Ark Village ↗", external: true },
    ],
  },
];

/* The one joke per page lives here so nobody writes two. */
const MARQUEE = [
  "SUN", "·", "WAVE", "·", "BLOCK", "·",
  "LAND", "·", "LEDGER", "·", "LIBERTY", "·",
];

const DISCLAIMER =
  "Votula, Ltd. is a company registered in Victoria, Seychelles. Nothing on this site is an offer to sell " +
  "or a solicitation to buy any security, token, or interest in property, and nothing here is investment, " +
  "legal, or tax advice. Tokenised property carries risk, including total loss of capital and the risk that " +
  "an interest cannot be sold when you want to sell it. Offerings are made only to eligible participants " +
  "under the terms of the relevant offering documents, and availability depends on your jurisdiction.";

window.VT_DATA = { PLACEHOLDER, COMPANY, NAV_LINKS, FOOTER_COLUMNS, MARQUEE, DISCLAIMER };
