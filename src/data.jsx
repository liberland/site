// Shared content + constants

const COMPANY = {
  name: "Liberland Limited",
  tagline: "Members. Gatherings. A place on the Danube.",
  blurb:
    "Liberland Limited is a Hong Kong company providing membership services, hosting community gatherings, and brokering residences for the Liberland community at Ark Village in Apatin, Serbia.",
  registered: "Hong Kong",
  address: "Room 1601, 16th Floor, Wing On Centre, 111 Connaught Road Central, Hong Kong",
  email: "limited@liberland.org",
  director: "Vít Jedlička, Director",
};

const NAV_LINKS = [
  { id: "membership", label: "Membership" },
  { id: "events", label: "Gatherings" },
  { id: "residences", label: "Residences" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// Members' tiers — placeholders chosen to read like a private club
const TIERS = [
  {
    id: "silver",
    name: "Silver",
    annual: 150,
    monthly: 15,
    summary: "An open door to the community.",
    description:
      "For supporters who want to stay close to the work and visit on occasion.",
    seats: "Open intake",
    perks: [
      "Members' newsletter, four times a year",
      "Standard tickets to community gatherings at member rate",
      "Listing in the members' directory",
      "Priority on the cottage waitlist at Ark Village",
    ],
    notIncluded: ["Private events", "Members' concierge", "Founder's salon"],
  },
  {
    id: "gold",
    name: "Gold",
    annual: 1000,
    monthly: 95,
    summary: "Closer involvement, a seat at the table.",
    description:
      "For members who want regular access to the community and its events.",
    seats: "240 places",
    perks: [
      "Everything in Silver",
      "Two complimentary General-Admission tickets per gathering",
      "Members' lounge access at Ark Village",
      "Quarterly briefings with the Director",
      "Members' concierge for travel & stays",
    ],
    notIncluded: ["Private dinners with founder's salon"],
  },
  {
    id: "platinum",
    name: "Platinum",
    annual: 10000,
    monthly: 900,
    summary: "Hosted attendance and reserved hospitality.",
    description:
      "For members who attend most gatherings and want the logistics handled.",
    seats: "80 places",
    featured: true,
    perks: [
      "Everything in Gold",
      "Two VIP passes per major gathering, all year",
      "Reserved cottage for Anniversary & Floating Man weeks",
      "Private dinners and the founder's salon",
      "Personal guest list for two named companions",
    ],
    notIncluded: [],
  },
  {
    id: "founder",
    name: "Founder",
    annual: 20000,
    monthly: 1800,
    summary: "A standing seat in the room.",
    description:
      "A numbered, named circle. By application and introduction.",
    seats: "12 seats / year",
    perks: [
      "Everything in Platinum",
      "A numbered, lifetime membership recorded in the founders' register",
      "A reserved table at every gathering, for as long as you hold it",
      "Annual private retreat — small group, off the calendar",
      "Direct line to the Director's office",
    ],
    notIncluded: [],
  },
];

// Events — current as of May 2026.
const EVENTS = [
  {
    id: "floatingman-2026",
    title: "Floating Man Festival",
    edition: "2026 Edition",
    dates: "17 — 23 August 2026",
    when: "August 2026",
    where: "Ark Village, Apatin, Serbia",
    blurb:
      "A week of art, music, and conversation on the Danube. Workshops by day; performances and salons by night.",
    image: "https://anniversary.ll.land/wp-content/uploads/2025/03/Vit-Jedlicka.jpg", // unused — use bg below
    cover: "https://ark.ll.land/wp-content/uploads/2023/07/20210813_123554-1-scaled-1-e1689673660879-1024x632.jpg",
    featured: true,
    capacity: "400 places",
    tickets: [
      { name: "Virtual", price: 24, summary: "Conference broadcast & networking room" },
      { name: "Regular", price: 119, was: 49, summary: "Full festival entry, conference, networking" },
      { name: "Gold", price: 1159, was: 599, summary: "All-inclusive, speedboat, members' dinner" },
    ],
    programme: [
      { day: "Mon 17 Aug", note: "Arrival, the first stroke, welcome set" },
      { day: "Tue 18 Aug", note: "Plein-air painting, sound design talk, acoustic sunset" },
      { day: "Wed 19 Aug", note: "Generative art, the floating gallery, river rhythm night" },
      { day: "Thu 20 Aug", note: "Found-object sculpture, modular synth, experimental stage" },
      { day: "Fri 21 Aug", note: "Stencil techniques, mural finale, headliner set" },
      { day: "Sat 22 Aug", note: "Members' auction, the great jam, gala dinner" },
      { day: "Sun 23 Aug", note: "Reflection, gallery walk, departures" },
    ],
  },
  {
    id: "members-salon-hk-2026",
    title: "Members' Salon — Hong Kong",
    edition: "Autumn dinner",
    dates: "24 October 2026",
    when: "October 2026",
    where: "Wing On Centre, Hong Kong",
    blurb:
      "An evening dinner for members travelling through Asia. Forty seats, conversation by candlelight.",
    cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&auto=format&fit=crop",
    capacity: "40 seats",
    tickets: [
      { name: "Members", price: 220, summary: "Open to Gold tier and above" },
      { name: "Members + 1", price: 380, summary: "Bring one named companion" },
    ],
  },
  {
    id: "winter-retreat-2026",
    title: "Winter Retreat at Ark",
    edition: "Members only",
    dates: "27 — 30 December 2026",
    when: "December 2026",
    where: "Ark Village, Apatin, Serbia",
    blurb:
      "A quiet four days between the years. Long walks, long table, fires by the river.",
    cover: "https://ark.ll.land/wp-content/uploads/2023/07/Cabin4-1024x768.jpg",
    capacity: "60 places",
    tickets: [
      { name: "Members", price: 480, summary: "Cottage stay, all meals included" },
      { name: "Members + family", price: 880, summary: "Two adults, up to two children" },
    ],
  },
  {
    id: "anniversary-2027",
    title: "Liberland 12th Anniversary",
    edition: "April 2027",
    dates: "9 — 12 April 2027",
    when: "April 2027",
    where: "Ark Village, Apatin, Serbia",
    blurb:
      "Four days of programme, conversation, and celebration to mark the twelfth year. Tickets open in autumn.",
    cover: "https://anniversary.ll.land/wp-content/uploads/2026/02/Featured-Image-1.webp",
    capacity: "Tickets open Sep 2026",
    tickets: [
      { name: "Register interest", price: 0, summary: "Be first to hear when tickets open" },
    ],
  },
];

const RESIDENCES = [
  {
    label: "The Studio",
    size: "50 m²",
    blurb: "A compact one-room cottage with a yard and a view of the orchard. Suitable for one or two.",
    image: "https://ark.ll.land/wp-content/uploads/2023/07/351147079_1186107902074878_7268019130542026426_n-1024x768.jpg",
  },
  {
    label: "The Two-Bedroom",
    size: "120 m²",
    blurb: "Two bedrooms, a study, and a fenced garden. The most-requested layout in the village.",
    image: "https://ark.ll.land/wp-content/uploads/2023/07/Cabin4-1024x768.jpg",
  },
  {
    label: "The House on the Lake",
    size: "210 m²",
    blurb: "Three bedrooms with a deck onto the natural pool. A handful built each year.",
    image: "https://ark.ll.land/wp-content/uploads/2023/07/IMG-7017bc3158030d27051815f2ee432339-V-1-1024x768.jpg",
  },
];

window.LL_DATA = { COMPANY, NAV_LINKS, TIERS, EVENTS, RESIDENCES };
