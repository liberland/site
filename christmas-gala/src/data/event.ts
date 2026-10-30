/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIBERLAND GRAND CHRISTMAS GALA 2026 — EVENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  This is the ONLY file organisers need to edit to change what the page says.
 *  Every date, name, status, link and paragraph on the page comes from here.
 *
 *  How to edit (no programming knowledge needed):
 *    • Change text between the quotes '…'. Keep the quotes and the comma.
 *    • Statuses are fixed words — use one of the options listed next to them.
 *    • `null` means "not known yet". The page then shows a designed
 *      "to be announced" / "pending" state instead of inventing a value.
 *    • After editing, run `npm run build` (or let the deploy workflow do it).
 *      The build fails with a clear message if something is mistyped.
 *
 *  Integrity rules built into the page (do not work around them):
 *    • The date is shown as "Proposed · not yet confirmed" until
 *      `date.status` is 'confirmed'. Event structured data for search engines
 *      is only published once the date is confirmed.
 *    • A guest is shown as confirmed only when their `status` is 'confirmed'.
 *    • No registration form collects personal data. Registration becomes
 *      active only when `registration.url` points to an authorised system.
 *
 *  See README.md for step-by-step instructions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ---------- types (describe the allowed values; no need to edit) ---------- */

/** 'tentative' = proposed, not confirmed. 'confirmed' = organisers have signed off. */
export type DateStatus = 'tentative' | 'confirmed';

/** 'anticipated' = invited / expected, NOT confirmed. Only use 'confirmed' after written confirmation. */
export type GuestStatus = 'anticipated' | 'confirmed';

/** 'coming-soon' = no registration yet. 'open' = `url` is live and authorised. 'closed' = registration has ended. */
export type RegistrationStatus = 'coming-soon' | 'open' | 'closed';

export interface Guest {
  /** Full name as it should be printed. */
  name: string;
  /** Monogram shown when there is no cleared portrait, e.g. 'RV'. */
  initials: string;
  /** Short designation under the name. */
  role: string;
  /** One or two sentences. Must be approved by the guest before publication. */
  bio: string;
  status: GuestStatus;
  /**
   * Rights-cleared portrait in /public/images (e.g. 'images/guest-roger-ver.webp'),
   * 4:5 crop, at least 800 × 1000 px. null = monogram placeholder.
   */
  portrait: string | null;
  /** Source and licence of the portrait (shown nowhere, kept for the asset manifest). */
  portraitCredit: string | null;
}

export interface Pillar {
  numeral: string;
  /** Small caps tag top-right of the card. */
  tag: string;
  title: string;
  description: string;
  /** Mono status line in the card footer. */
  status: string;
  /** Visual treatment: matches the approved design. */
  tone: 'burg' | 'ever' | 'navy';
  art: 'colonnade' | 'merit' | 'chain';
}

export interface VenuePhoto {
  /** Short caption heading, e.g. 'Exterior'. */
  title: string;
  /** Caption text / description of the intended photograph. */
  caption: string;
  /**
   * Licensed photograph in /public/images, e.g. 'images/venue-exterior.webp'.
   * null = designed "Photograph pending" placeholder.
   * Do NOT add hotel photography without the hotel's written permission.
   */
  src: string | null;
  /** Alternative text describing the photograph (required when src is set). */
  alt: string;
  /** Credit line shown when a photograph is used, e.g. '© Le Palais Art Hotel Prague'. */
  credit: string | null;
  art: 'facade' | 'ceiling' | 'skyline';
}

/* ------------------------------- the event ------------------------------- */

export const event = {
  name: 'Liberland Grand Christmas Gala 2026',
  shortName: 'Grand Christmas Gala',
  tagline: 'A Night for Freedom. A New Chapter for Liberland.',

  /* ---- date ---- */
  date: {
    /** ISO date, YYYY-MM-DD. */
    iso: '2026-12-19',
    status: 'tentative' as DateStatus,
    /** Start / end time (24 h, Prague time), or null while unknown. */
    startTime: null as string | null,
    endTime: null as string | null,
    /** Shown in kickers when the exact day should not be emphasised. */
    monthLabel: 'December 2026',
  },

  /* ---- place ---- */
  city: 'Prague',
  countryCode: 'CZ',
  venue: {
    name: 'Le Palais Art Hotel Prague',
    shortName: 'Le Palais Art Hotel',
    street: 'U Zvonařky 1',
    postcode: '120 00',
    district: 'Prague 2',
    country: 'Czech Republic',
    url: 'https://www.lepalaishotel.eu/',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Le+Palais+Art+Hotel+Prague',
    telephone: '+420 234 634 111',
    /** Facts checked against lepalaishotel.eu on 30 Oct 2026. */
    facts: [
      { label: 'Hotel', value: 'Five-star · 72 rooms and suites' },
      { label: 'Dining', value: 'Artista restaurant · Lobby Bar' },
      { label: 'Wellness', value: 'Spa, sauna and fitness room' },
    ],
    intro:
      'A five-star hotel in a restored nineteenth-century building, where the painter Luděk Marold once lived and worked. His original ceilings remain.',
    lead:
      'Belle Époque character, works by Czech and international artists, and a view across Prague from its restaurant — a fitting house for a winter evening of ideas.',
    photos: [
      {
        title: 'Exterior',
        caption:
          'Le Palais Art Hotel Prague, from the hotel’s official imagery. Publication requires the hotel’s written permission.',
        src: null,
        alt: 'Exterior of Le Palais Art Hotel Prague',
        credit: null,
        art: 'facade',
      },
      {
        title: 'Interior',
        caption: 'Marold ceilings and historic interiors. Hotel permission required.',
        src: null,
        alt: 'Painted ceilings by Luděk Marold inside Le Palais Art Hotel Prague',
        credit: null,
        art: 'ceiling',
      },
      {
        title: 'Artista',
        caption: 'The hotel restaurant, with its view of Prague. Hotel permission required.',
        src: null,
        alt: 'Artista restaurant at Le Palais Art Hotel Prague with a view over the city',
        credit: null,
        art: 'skyline',
      },
    ] as VenuePhoto[],
  },

  /* ---- programme ---- */
  programme: {
    heading: { line1: 'Three conversations.', line2: 'One evening.' },
    intro:
      'From the principles of a free society to the technology that may carry them forward. Formats, speakers and running order will be announced with the confirmed programme.',
    pillars: [
      {
        numeral: 'I',
        tag: 'Convention',
        title: 'The Constitutional Convention',
        description:
          'A conversation about liberty, principles, and the future of governance — what a constitution of consent asks of those who join it, and what it protects in return.',
        status: 'Format & speakers · to be announced',
        tone: 'burg',
        art: 'colonnade',
      },
      {
        numeral: 'II',
        tag: 'Merit',
        title: 'The Next Chapter of LLM',
        description:
          'Developments in blockchain-based participation and Liberland Merit: how merit is earned, held and used in the Republic’s governance, and what is planned next.',
        status: 'LLM = Liberland Merit · distinct from LLD, the Liberland Dollar',
        tone: 'ever',
        art: 'merit',
      },
      {
        numeral: 'III',
        tag: 'Technology',
        title: 'Liberland Blockchain V2',
        description:
          'The planned next generation of Ethereum-based blockchain technology. Liberland’s current chain already offers EVM compatibility; V2 is the next step, and its design is expected to be presented by the team.',
        status: 'Status · anticipated presentation · release timing not announced',
        tone: 'navy',
        art: 'chain',
      },
    ] as Pillar[],
    /** Shown as the last line of the "By day" list. */
    scheduleNote: 'Running order and times to be announced',
  },

  /* ---- guests ---- */
  guests: {
    intro: 'Guests are announced as they confirm. No name appears here as confirmed until it is.',
    featured: [
      {
        name: 'Roger Ver',
        initials: 'RV',
        role: 'Early Bitcoin investor · Cryptocurrency advocate',
        bio: 'One of the earliest investors in Bitcoin and a long-standing advocate of cryptocurrency as a tool of individual freedom.',
        status: 'anticipated',
        portrait: null,
        portraitCredit: null,
      },
    ] as Guest[],
    /** Dashed "to be announced" slots beside the featured guest. */
    slots: [
      { title: 'Further guests', note: 'To be announced' },
      { title: 'Convention speakers', note: 'Programme in preparation' },
    ],
    note: 'Speakers, hosts and panellists will be published here once confirmed. Follow the registration updates to be told when the line-up is announced.',
  },

  /* ---- the evening ---- */
  evening: {
    lead: 'When the sessions close, the light softens. Founders and citizens, builders and old friends — people who have argued about freedom all year — raise a glass to the year behind them and the work ahead.',
    moments: [
      { title: 'Arrive', text: 'Winter coats, warm light, and a first glass in a house built for gatherings.' },
      { title: 'Converse', text: 'Unhurried conversation between people building the same future from different corners of the world.' },
      { title: 'Celebrate', text: 'A Christmas toast to liberty, and to the simplest rule: to live and let live.' },
    ],
    note: 'Evening format, dress code and hospitality details are pending and will be published with the confirmed programme.',
  },

  /* ---- practical information (null = shown as "pending") ---- */
  practical: {
    dressCode: null as string | null,
    contact: null as { label: string; href: string } | null,
    /** A link to the hotel website for local directions is added automatically. */
    travel: 'Václav Havel Airport Prague (PRG) is the nearest international airport.',
    accommodation: 'Rooms at Le Palais can be booked directly with the hotel.',
    /** Pending notes under travel / accommodation. Set to null once resolved. */
    accommodationPending: 'Any gala room arrangement to be confirmed' as string | null,
    travelPending: 'Event travel guidance to be published' as string | null,
  },

  /* ---- registration ---- */
  registration: {
    /**
     * 'coming-soon' until an authorised registration system exists.
     * To open registration: set `url` to the official registration page
     * AND set `status` to 'open'. Both are required.
     */
    status: 'coming-soon' as RegistrationStatus,
    url: null as string | null,
    /** Button text when registration is open. */
    openLabel: 'Register now',
    /** Optional: where people can follow announcements while registration is not open. */
    updatesUrl: 'https://liberland.org/' as string | null,
    updatesLabel: 'News on liberland.org',
  },

  /* ---- editorial text ---- */
  editorial: {
    introStatement:
      'In December 2025 the Constitution of Liberland was read in Prague. One year on, the community gathers again — to celebrate what has been built, and to set out',
    introStatementEmphasis: 'what comes next.',
    introParagraphs: [
      'The Liberland Grand Christmas Gala brings founders, thinkers, technologists and entrepreneurs from many countries to Le Palais Art Hotel Prague for an evening that joins two traditions: the serious work of building a free society, and the warmth of a European Christmas.',
      'The programme opens with a Constitutional Convention — a conversation about constitutional principles, individual liberty and the future of governance in a society founded on consent.',
      'It continues with the next chapter of Liberland Merit (LLM), the Republic’s instrument of blockchain-based participation, and the anticipated presentation of Liberland Blockchain V2, the planned next generation of Liberland’s Ethereum-based blockchain technology.',
      'Then the evening turns to celebration: conversation and a Christmas toast among friends old and new, in a restored nineteenth-century building in the heart of Prague.',
    ],
    /** Fact list beside the introduction. */
    milestones: [
      { label: 'Republic founded', value: '13 APR 2015' },
      { label: 'Constitution read', value: 'DEC 2025 · PRAGUE' },
    ],
    finale: {
      line1: 'The future is',
      line2: 'built together.',
      lead: 'An evening for those who believe freedom is something you build — with others, in good faith, one decision at a time.',
      cta: 'Be Part of the Evening',
      motto: 'To Live and Let Live.',
    },
    footer:
      'Proposed date, programme and guests are subject to confirmation. Nothing on this page is an offer of tokens, securities or investment. Liberland Merit (LLM) and the Liberland Dollar (LLD) are distinct instruments.',
    heroArtCredit: 'Artwork: illustrative composition of a Belle Époque façade. Not a photograph of the venue.',
  },

  /* ---- site & social metadata ---- */
  site: {
    /** Public address of the page (used for canonical and social links). */
    url: 'https://liberlandlimited.com/christmas/',
    /** false = ask search engines not to index (test preview). Set true at launch. */
    indexable: false,
    description:
      'The Liberland Grand Christmas Gala 2026 at Le Palais Art Hotel Prague: a Constitutional Convention, the next chapter of Liberland Merit (LLM), Liberland Blockchain V2 and a Christmas gala evening. Proposed date 19 December 2026.',
    /** 1200 × 630 social image in /public. */
    socialImage: 'og-image.jpg',
    socialImageAlt: 'Liberland Grand Christmas Gala 2026 — Prague, Le Palais Art Hotel',
    locale: 'en_GB',
    organiser: { name: 'Free Republic of Liberland', url: 'https://liberland.org/' },
  },

  /** Gentle CSS snowfall in the hero. Switched off automatically for reduced-motion users. */
  atmosphere: { snow: true },
};

export type EventConfig = typeof event;
