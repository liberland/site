// Facts shared by every language version. Wording lives in src/i18n/<lang>.jsx.
//
// The company particulars below were supplied by the owner. 64816138 is the Hong Kong
// Business Registration Number; it is not a Companies Registry incorporation number, and
// it must not be confused with UK company 15671292 (a separate LIBERLAND LIMITED).
//
// The earlier membership tiers, prices and invented event programme were removed from the
// public site on 25 October 2026. They remain in git history (commit 394b88c) for
// reconciliation; do not republish them without signed terms and real fulfilment.

const COMPANY = {
  name: "Liberland Limited",
  brn: "64816138",
  brc: "64816138-000",
  office: ["Room 1601, 16th Floor", "Wing On Centre", "111 Connaught Road Central", "Hong Kong"],
  email: "info@liberland.org",
};

const MAIL = {
  membership: "mailto:info@liberland.org?subject=Liberland%20Limited%20membership%20enquiry",
  general: "mailto:info@liberland.org?subject=Liberland%20Limited%20enquiry",
};

const LINKS = {
  registryInfo: "https://www.cr.gov.hk/en/electronic/e-servicesportal/e-search.htm",
  registrySearch: "https://www.e-services.cr.gov.hk/",
  liberland: "https://liberland.org/",
  application: "https://liberland.org/application",
  liberlandFaq: "https://liberland.org/faq",
  docs: "https://docs.liberland.org/",
  ark: "https://ark.ll.land/",
  arkExperience: "https://ark.ll.land/experiences/experience-liberland",
  arkContact: "https://ark.ll.land/contact",
  arkEvents: "https://ark.ll.land/events",
  arkMap: "https://www.openstreetmap.org/search?query=Mirni%20Dunav%203%2C%20Apatin%2C%20Serbia",
};

// Events published by Ark Village, checked against ark.ll.land/events on 25 October 2026.
// Ark Village organises and sells these; Liberland Limited does not. Each one disappears
// from the page the day after it ends; when none are left, only the calendar link remains.
const EVENTS = [
  { id: "longevity", start: "2026-11-21", end: "2026-11-22", url: "https://ark.ll.land/events/longevity-retreat" },
  { id: "winterAlchemy", start: "2026-12-12", end: "2026-12-13", url: "https://ark.ll.land/events/winter-alchemy-retreat" },
];

function todayISO(now = new Date()) {
  const p = n => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

function upcomingEvents(now) {
  const today = todayISO(now);
  return EVENTS.filter(e => e.end >= today);
}

window.LL_DATA = { COMPANY, MAIL, LINKS, EVENTS, upcomingEvents };
