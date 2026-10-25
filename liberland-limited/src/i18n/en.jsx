// English copy. Rich text is an array of strings and { href, text } links.
const { COMPANY: C_EN, MAIL: M_EN, LINKS: L_EN } = window.LL_DATA;

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

window.LL_I18N = window.LL_I18N || {};
window.LL_I18N.en = {
  lang: "en",
  registry: L_EN.registryInfo,

  // "21–22 November 2026"; spans across months or years are spelled out in full.
  formatRange(start, end) {
    const [y1, m1, d1] = start.split("-").map(Number);
    const [y2, m2, d2] = end.split("-").map(Number);
    if (y1 === y2 && m1 === m2) return `${d1}–${d2} ${MONTHS_EN[m1 - 1]} ${y1}`;
    if (y1 === y2) return `${d1} ${MONTHS_EN[m1 - 1]} – ${d2} ${MONTHS_EN[m2 - 1]} ${y1}`;
    return `${d1} ${MONTHS_EN[m1 - 1]} ${y1} – ${d2} ${MONTHS_EN[m2 - 1]} ${y2}`;
  },

  nav: {
    links: [
      { href: "#about", label: "About" },
      { href: "#membership", label: "Membership" },
      { href: "#events", label: "Visit & Events" },
      { href: "#company", label: "Company & Contact" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: "Explore Membership",
    sub: `Hong Kong · BRN ${C_EN.brn}`,
    menu: "Menu",
    theme: "Switch between light and dark mode",
    skip: "Skip to content",
  },

  hero: {
    eyebrow: "The real-world Liberland community",
    eyebrowRight: "Liberland Limited · Hong Kong",
    title: [
      { text: "Meet the people." },
      { text: "Visit the Danube." },
      { text: "Explore membership.", em: true },
    ],
    lede: "Liberland is an idea brought to life by people, projects and gatherings. Explore practical ways to connect with the community, discover places to visit, and learn about membership through Liberland Limited.",
    primary: "Explore Membership",
    secondary: "Visit the Danube",
    meta: [
      { label: "Operated by", value: "Liberland Limited, Hong Kong" },
      { label: "Business Registration No.", value: C_EN.brn },
      { label: "Visitor base", value: "Ark Village, Apatin, Serbia" },
    ],
    figure: {
      alt: "Aerial view of the Danube winding between wooded islands and sandbanks",
      place: "The Danube",
    },
  },

  marquee: ["Membership enquiries", "Community events on the Danube", "Visitor information for Apatin, Serbia", "Registered in Hong Kong", `BRN ${C_EN.brn}`],

  about: {
    label: "01 — What we do",
    title: ["Real-world connections ", { em: "to Liberland." }],
    intro: "Whether you are discovering Liberland for the first time or have followed the community for years, there are practical ways to get involved. Start with a conversation, explore events in the region, or plan a visit.",
    cards: [
      {
        label: "01 · Membership",
        title: "Explore Membership",
        text: "Find out how private membership connected with the Liberland community works. Ask about current arrangements, participation and applicable terms before making a decision.",
        button: "Membership Information",
        href: "#membership",
        provider: "Through Liberland Limited",
      },
      {
        label: "02 · Community events",
        title: "Meet in Person",
        text: "Discover publicly announced gatherings, retreats and community experiences in the Danube region. Event details and bookings are provided by the respective organisers.",
        button: "Explore Events",
        href: "#events",
        provider: "Organised and booked by each event's organiser",
      },
      {
        label: "03 · Visit the region",
        title: "Discover Ark Village",
        text: "Ark Village in Apatin, Serbia, offers a practical base for exploring the Danube region and meeting people associated with Liberland. Accommodation and experiences are arranged through Ark Village directly.",
        button: "Explore Ark Village",
        href: L_EN.arkExperience,
        provider: "Operated by Ark Village",
      },
      {
        label: "04 · Official Liberland status",
        title: "E-Residency & Citizenship",
        text: "Looking for Liberland E-Residency or citizenship rather than private community membership? Applications and official status information are handled through Liberland's own website.",
        button: "Official Application",
        href: L_EN.application,
        provider: "Handled by liberland.org — not a Liberland Limited service",
        external: true,
      },
    ],
  },

  membership: {
    label: "02 — Membership",
    title: ["Membership begins with ", { em: "a clear conversation." }],
    intro: [
      "Liberland Limited provides a point of contact for people interested in private membership connected with the Liberland community.",
      "Membership arrangements may involve different forms of participation. Before accepting any paid membership, you should receive a written description of the services offered, the relevant fees, the duration of membership and the applicable contractual terms.",
    ],
    stepsLabel: "How membership enquiries work",
    steps: [
      { n: "01", title: "Get in touch", text: "Tell us a little about yourself, your interests and how you would like to participate in the community." },
      { n: "02", title: "Review the arrangements", text: "We will explain the membership options currently available and provide the relevant terms before you make a commitment." },
      { n: "03", title: "Make an informed decision", text: "An enquiry does not create membership or a payment obligation. Membership begins only when the applicable agreement has been accepted." },
    ],
    cta: "Ask About Membership",
    ctaHint: ["Opens your email app, addressed to ", { href: M_EN.membership, text: C_EN.email }, "."],
    clarification: [
      "Private membership arranged through Liberland Limited is separate from ",
      { href: L_EN.liberlandFaq, text: "Liberland E-Residency and citizenship", external: true },
      ". It does not, by itself, provide a passport, immigration status, political rights, property ownership or a right to enter any territory.",
    ],
  },

  events: {
    label: "03 — Events",
    title: ["Meet around ", { em: "the Danube." }],
    intro: "Events and gatherings are a practical way to connect with people interested in Liberland. Below are publicly announced events in the region. Always confirm dates, availability and booking conditions with the event organiser.",
    organiser: "Organised by Ark Village",
    artCredit: "Artwork: Ark Village",
    details: "Event Details",
    whenLabel: "Dates",
    whereLabel: "Location",
    items: {
      longevity: {
        title: "Longevity Ark Retreat",
        alt: "Ark Village's poster for the Longevity Ark Retreat, 21–22 November",
        where: "Ark Village, Apatin, Serbia",
        text: "A weekend exploring health, longevity, movement, recovery and nature, bringing together visitors interested in learning and shared experiences.",
      },
      winterAlchemy: {
        title: "Winter Alchemy Retreat",
        alt: "Ark Village's poster for the Winter Alchemy Retreat, showing the village under snow",
        where: "Ark Village, Apatin, Serbia",
        text: "A winter gathering focused on regional food traditions, outdoor cooking, nature and shared activities near the Danube.",
      },
    },
    none: "No upcoming events are listed here at the moment. The organiser's calendar always shows the current programme.",
    calendarText: "Looking for more activities? Browse the organiser's current calendar. Event schedules, prices and availability may change.",
    calendarButton: "Full Ark Village Calendar",
  },

  visit: {
    label: "04 — Visit",
    title: ["Visit the ", { em: "Danube region." }],
    intro: "Ark Village is located in Apatin, Serbia, near the Danube. It offers accommodation, activities and experiences for people interested in visiting the region associated with Liberland.",
    locationLabel: "Location",
    locationAlt: "Aerial view of Ark Village among the trees beside a Danube backwater in Apatin, Serbia",
    location: ["Ark Village", "Mirni Dunav 3", "Apatin, Serbia"],
    map: "View on OpenStreetMap",
    cards: [
      {
        title: "Plan an Experience",
        text: "Explore options for a visit, local activities and accommodation through Ark Village's dedicated experience page.",
        button: "Explore Experiences",
        href: L_EN.arkExperience,
        alt: "Visitors with the Liberland flag on a sandy Danube beach",
      },
      {
        title: "Contact Ark Village",
        alt: "A visitor on a paddleboard on the calm water at Ark Village",
        text: "Ask the local operator directly about accommodation, availability, group bookings and visitor arrangements.",
        button: "Contact Ark Village",
        href: L_EN.arkContact,
      },
    ],
    operator: "Operated by Ark Village",
    credit: "Photo: Ark Village",
    noteLabel: "Where Ark Village is",
    note: "Ark Village is in Serbia. It is distinct from the territory claimed by Liberland. Booking accommodation or purchasing membership does not provide any special right to cross borders or enter that territory. Visitors remain responsible for applicable travel and entry requirements.",
  },

  company: {
    label: "05 — Company",
    title: ["A registered company. ", { em: "A real-world community." }],
    text: [
      "Liberland Limited is a company registered in Hong Kong. This website provides information about private community membership and practical ways to connect with the Liberland project in the real world.",
      "Our legal identity is publicly verifiable through the Hong Kong Companies Registry. We distinguish the company's services from Liberland's civic institutions and from services provided by independent event and accommodation operators.",
    ],
    panelLabel: "Company details",
    rows: [
      ["Registered name", C_EN.name],
      ["Jurisdiction", "Hong Kong"],
      ["Business Registration Number", C_EN.brn],
      ["Business Registration Certificate", C_EN.brc],
      ["Registered office", C_EN.office.join(", ")],
      ["Contact", { href: `mailto:${C_EN.email}`, text: C_EN.email }],
      ["Registry", { href: L_EN.registryInfo, text: "Verify through the Hong Kong Companies Registry", external: true }],
    ],
    verify: "Verify our company registration",
    verifyHint: [
      "Use the Registry's ",
      { href: L_EN.registrySearch, text: "electronic search service", external: true },
      " and search for “Liberland Limited” or BRN “64816138”.",
    ],
    disambiguation: "A separately registered company in the United Kingdom, LIBERLAND LIMITED (company number 15671292), is a different legal entity. Its number does not identify this Hong Kong company.",
  },

  contact: {
    label: "06 — Contact",
    title: ["Contact ", { em: "Liberland Limited" }],
    intro: "Questions about private membership, community connections or this website? Send us an email. For Ark Village accommodation and events, please contact the organiser directly.",
    rows: [
      ["Membership and website enquiries", { href: `mailto:${C_EN.email}`, text: C_EN.email }],
      ["Company", C_EN.name],
      ["Registration", `Hong Kong — BRN ${C_EN.brn}`],
      ["Registered office", C_EN.office],
    ],
    footnote: "The address above is the company's registered office. It should not be understood as a public visitor centre or event venue.",
    button: "Email Us",
    arkLabel: "Visiting Ark Village?",
    arkText: "Accommodation, availability and event bookings are handled by Ark Village.",
    arkLink: "Ark Village Visitor Enquiries",
  },

  faq: {
    label: "07 — FAQ",
    title: ["Frequently asked ", { em: "questions." }],
    items: [
      {
        q: "What is Liberland Limited?",
        a: "Liberland Limited is a Hong Kong-registered company associated with the Liberland community. This website provides information about private membership enquiries and practical ways to connect with activities and places in the region.",
      },
      {
        q: "Is membership in Liberland Limited the same as Liberland citizenship?",
        a: "No. Private membership through a company is distinct from Liberland E-Residency and citizenship. For official applications, visit liberland.org.",
        link: { href: L_EN.application, text: "liberland.org/application", external: true },
      },
      {
        q: "Can I visit the Liberland region?",
        a: "Yes, visitors can explore locations in the Danube region, including Ark Village in Apatin, Serbia. Travel to particular locations remains subject to applicable laws, border procedures and local conditions.",
        link: { href: L_EN.arkExperience, text: "Experience Liberland at Ark Village", external: true },
      },
      {
        q: "Does membership guarantee access to events or accommodation?",
        a: "No. Access to specific events and accommodation depends on the relevant organiser's availability and terms. Any privileges included in a particular membership arrangement must be expressly described in that arrangement.",
      },
      {
        q: "How do I find out about membership?",
        a: "Contact us with a membership enquiry. We can provide information about arrangements currently offered and the terms applicable to them. Enquiring does not create a payment obligation.",
        link: { href: M_EN.membership, text: "Send a membership enquiry" },
      },
      {
        q: "Can I verify the company?",
        a: "Yes. Liberland Limited is registered in Hong Kong under Business Registration Number 64816138. You can search the company's details through the Hong Kong Companies Registry.",
        link: { href: L_EN.registryInfo, text: "Hong Kong Companies Registry", external: true },
      },
      {
        q: "Are the events on this website operated by Liberland Limited?",
        a: "Not necessarily. Where an event is organised by another provider, we identify that provider and link to its original event information. Bookings and participation conditions are governed by the organiser's own terms.",
      },
      {
        q: "Can I buy real estate or an investment through this website?",
        a: "This website does not presently offer the purchase of real estate, securities or investment interests. Information about visits and accommodation is provided for convenience and does not constitute a property sale or investment offer.",
      },
      {
        q: "Does membership give me a visa or right of entry?",
        a: "No. Membership does not confer a visa, residence permit, citizenship of a recognised state, or special immigration or border-crossing rights.",
      },
    ],
  },

  footer: {
    blurb: "Real-world community connections, membership enquiries and information about the Liberland project.",
    idLine: `Liberland Limited · Hong Kong · BRN ${C_EN.brn}`,
    officeLabel: "Registered office",
    office: C_EN.office.join(", "),
    navLabel: "Navigation",
    nav: [
      { href: "#membership", label: "Membership" },
      { href: "#events", label: "Events" },
      { href: "#visit", label: "Visit" },
      { href: "#contact", label: "Contact" },
      { href: "privacy/", label: "Privacy" },
      { href: "terms/", label: "Terms" },
    ],
    resourcesLabel: "Independent resources",
    resources: [
      { href: L_EN.liberland, label: "Official Liberland website" },
      { href: L_EN.application, label: "Liberland E-Residency and citizenship" },
      { href: L_EN.docs, label: "Liberland documentation" },
      { href: L_EN.ark, label: "Ark Village" },
      { href: L_EN.registryInfo, label: "Hong Kong Companies Registry" },
    ],
    legal: "Liberland Limited is a Hong Kong-registered company. Company-administered private membership must not be confused with governmental status, citizenship or immigration rights.",
    copyright: year => `© ${year} Liberland Limited.`,
  },

  newTab: "(opens in a new tab)",
};
