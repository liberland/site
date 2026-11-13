/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  LIBERLAND GRAND CHRISTMAS GALA 2026 — EVENT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  This is the ONLY file organisers need to edit to change what the page says.
 *  Every date, time, name, status, photograph, link and paragraph comes from here.
 *
 *  How to edit (no programming knowledge needed):
 *    • Change text between the quotes '…'. Keep the quotes and the comma.
 *    • Statuses are fixed words — use one of the options listed next to them.
 *    • `null` means "not known yet". The page then shows a designed
 *      "to be announced" state instead of inventing a value.
 *    • After editing, run `npm run build` (or merge to master: the deploy
 *      workflow builds the page). The build stops with a clear message if
 *      something is mistyped.
 *
 *  Integrity rules built into the page (do not work around them):
 *    • While `date.status` is 'tentative', the date is shown as proposed and no
 *      Event structured data is published.
 *    • A person's portrait in "Faces of the Evening" does NOT state that they
 *      attend. Only `attendance: 'confirmed'` says so, and only after written
 *      confirmation.
 *    • Hotel photographs are shown only when `cleared: true` (written permission
 *      from Le Palais). Until then the page shows a designed placeholder.
 *    • No form collects personal data. Registration opens only when
 *      `registration.url` points to an authorised registration system.
 *
 *  See README.md for step-by-step instructions.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { LANG } from '../i18n/lang';
import { zh } from './event.zh';

/* ---------- types (describe the allowed values; no need to edit) ---------- */

export type DateStatus = 'tentative' | 'confirmed';

/**
 * 'featured'    = shown as a Liberland personality; says nothing about attendance.
 * 'programme'   = named in the planned programme (still subject to confirmation).
 * 'anticipated' = invited / expected; participation to be confirmed.
 * 'confirmed'   = written confirmation received.
 */
export type Attendance = 'featured' | 'programme' | 'anticipated' | 'confirmed';

export type RegistrationStatus = 'coming-soon' | 'open' | 'closed';

export interface Person {
  name: string;
  /** Short title under the name. */
  role: string;
  attendance: Attendance;
  /** Optional line under the role, e.g. which programme item. */
  note: string | null;
  /** Portrait in /public/images/faces/<slug>.webp (square, ≥ 560 px), or null for a monogram. */
  portrait: string | null;
  initials: string;
  /** Required with a portrait: author / source / licence, shown in the page credits. */
  credit: string | null;
  /** Speakers only: the talk. `keynote: true` marks a keynote. */
  talk?: { title: string; keynote?: boolean; text: string };
}

export interface Photo {
  /** File name without extension, in public/images/venue/ (cleared) — see ASSETS.md. */
  id: string;
  title: string;
  caption: string;
  alt: string;
  /** true only after written permission from the copyright holder. */
  cleared: boolean;
  credit: string;
  /** Where the photograph comes from (for the asset manifest). */
  source: string;
  /** CSS object-position for cropping, e.g. '50% 40%'. */
  focus?: string;
}

export interface ProgrammeItem {
  /** '15:00', or a word such as 'Evening'. */
  time: string;
  title: string;
  text: string;
}

export interface Theme {
  numeral: string;
  title: string;
  text: string;
  note: string;
}

/* ------------------------------- the event ------------------------------- */

const HOTEL = '© Le Palais Art Hotel Prague';

const base = {
  name: 'Liberland Grand Christmas Gala 2026',
  shortName: 'Grand Christmas Gala',
  tagline: 'A Night for Freedom. A New Chapter for Liberland.',
  guidingLine: 'Christmas at Le Palais — an extraordinary evening with the Liberland community.',

  /* ---- date ---- */
  date: {
    /** ISO date, YYYY-MM-DD. The weekday is worked out automatically. */
    iso: '2026-12-18',
    status: 'confirmed' as DateStatus,
    /** First programme item (24 h, Prague time), or null. */
    startTime: '15:00' as string | null,
    endTime: null as string | null,
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
    galleryUrl: 'https://www.lepalaishotel.eu/gallery/',
    artUrl: 'https://www.lepalaishotel.eu/art/',
    /** Rooms named in the "Step inside" invitation (shown while the gallery photos are not cleared). */
    rooms: [
      'The golden lobby, under crystal chandeliers',
      'The Marold salon and its original painted ceilings',
      'The library lounge, all leather and lamplight',
      'Artista, the fine-dining restaurant with its view of Prague',
      'The Belle Époque corridor of stucco and mosaic',
    ],
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Le+Palais+Art+Hotel+Prague',
    telephone: '+420 234 634 111',
    /** Checked against lepalaishotel.eu on 30 Oct 2026. */
    intro:
      'A five-star Belle Époque hotel in a carefully restored nineteenth-century building, where the painter Luděk Marold once lived and worked. His original painted ceilings remain, among interiors hung with works by Czech and international artists.',
    facts: [
      { label: 'The house', value: 'Five-star hotel · restored 19th-century building · 72 rooms and suites' },
      { label: 'Art', value: 'Original ceilings by Luděk Marold · works by Czech and international artists' },
      { label: 'Dining', value: 'Artista restaurant, with its view of Prague · Lobby Bar' },
    ],
    /** Large photograph behind the opening screen. */
    heroPhoto: {
      id: 'corridor-hero',
      title: 'The gallery corridor',
      caption: 'Painted vaults, Venetian chandeliers and mosaic floors inside Le Palais.',
      alt: 'The Belle Époque gallery corridor of Le Palais Art Hotel Prague, with painted vaulted ceilings, crystal chandeliers and a mosaic floor',
      /** Supplied by the organisers for the opening screen (30 Oct 2026). */
      cleared: true,
      credit: HOTEL,
      source: 'Supplied by the organisers; same view as lepalaishotel.eu le_palais_slide_06.jpg',
      focus: '50% 42%',
    } as Photo,
    /** Arched photograph beside the introduction. */
    portalPhoto: {
      id: 'facade-dusk',
      title: 'Le Palais at dusk',
      caption: 'The hotel’s illuminated Belle Époque façade on U Zvonařky.',
      alt: 'The illuminated Belle Époque façade of Le Palais Art Hotel Prague at dusk, with its arched entrance',
      /** Supplied by the organisers (30 Oct 2026). */
      cleared: true,
      credit: HOTEL,
      source: 'Supplied by the organisers; lepalaishotel.eu/gallery — le_palais_art_gallery_hotel_03.jpg',
      focus: '38% 50%',
    } as Photo,
    /** The photographic gallery, in display order (the first is shown largest). */
    gallery: [
      {
        id: 'golden-lobby',
        title: 'The lobby',
        caption: 'Crystal chandeliers and gilded light in the hotel’s lobby.',
        alt: 'Golden lobby of Le Palais with crystal chandeliers and patterned columns',
        cleared: false,
        credit: HOTEL,
        source: 'lepalaishotel.eu — le_palais_slide_01.jpg',
        focus: '50% 50%',
      },
      {
        id: 'marold-salon',
        title: 'The Marold salon',
        caption: 'Original painted and coffered ceilings, preserved from the house’s past.',
        alt: 'Salon with an ornate painted coffered ceiling, chandelier and tall windows',
        cleared: false,
        credit: HOTEL,
        source: 'lepalaishotel.eu/art — le_palais_art_gallery_01.jpg',
        focus: '50% 30%',
      },
      {
        id: 'corridor',
        title: 'The gallery corridor',
        caption: 'Stucco, mosaic floors and lantern light.',
        alt: 'Belle Époque corridor with stucco ceiling, chandelier and mosaic floor',
        cleared: false,
        credit: HOTEL,
        source: 'lepalaishotel.eu — le_palais_slide_06.jpg',
        focus: '50% 50%',
      },
      {
        id: 'entrance',
        title: 'Hotel Le Palais',
        caption: 'Through the doors: chandeliers lead the way in.',
        alt: 'Entrance of Hotel Le Palais with its name above glass doors and chandeliers beyond',
        cleared: false,
        credit: HOTEL,
        source: 'lepalaishotel.eu/gallery — le_palais_art_gallery_hotel_04.jpg',
        focus: '50% 40%',
      },
      {
        id: 'library',
        title: 'The library lounge',
        caption: 'Leather, books and lamplight — a room for long conversations.',
        alt: 'Library lounge with bookshelves, red armchairs and warm lamps',
        cleared: false,
        credit: HOTEL,
        source: 'lepalaishotel.eu — le_palais_slide_03.jpg',
        focus: '50% 50%',
      },
      {
        id: 'artista',
        title: 'Artista',
        caption: 'The hotel’s fine-dining restaurant.',
        alt: 'Artista restaurant with laid tables, white tablecloths and chandeliers',
        cleared: false,
        credit: HOTEL,
        source: 'lepalaishotel.eu/gallery — le_palais_art_gallery_restaurant_artista_01.jpg',
        focus: '50% 50%',
      },
      {
        id: 'staircase',
        title: 'The staircase',
        caption: 'The historic staircase, lit like a stage.',
        alt: 'Historic staircase with a carved banister and warm wall lamps',
        cleared: false,
        credit: HOTEL,
        source: 'lepalaishotel.eu/gallery — le_palais_art_gallery_hotel_02.jpg',
        focus: '50% 50%',
      },
    ] as Photo[],
    /** The hotel's own Christmas photograph, behind "The Christmas Evening". */
    christmasPhoto: {
      id: 'christmas-lobby',
      title: 'Christmas at Le Palais',
      caption: 'The hotel’s lobby dressed for Christmas — from the hotel’s own seasonal photography.',
      alt: 'The lobby of Le Palais with a tall decorated Christmas tree, chandeliers and armchairs',
      cleared: false,
      credit: HOTEL,
      source: 'lepalaishotel.eu (homepage, 2026) — LePalais-Vanocni-foceni-11.jpg',
      focus: '68% 50%',
    } as Photo,
  },

  /* ---- programme ---- */
  programme: {
    note: 'A planned schedule, subject to final programme confirmation.',
    /** One line for the invitation card under the introduction. */
    summary: 'From 15:00 · convention, talks on AI, announcements & Christmas gala',
    schedule: [
      {
        time: '15:00',
        title: 'Constitutional Convention',
        text: 'Discussions on constitutional development, liberty and governance.',
      },
      {
        time: '17:00',
        title: 'Press Conference & Major Announcements',
        text: 'President Vít Jedlička and invited guests present developments relating to Liberland Merit (LLM) and Liberland Blockchain V2.',
      },
      {
        time: 'Evening',
        title: 'Grand Christmas Gala',
        text: 'Ceremonial presentations, Liberland honours and awards, Christmas festivities and international networking.',
      },
    ] as ProgrammeItem[],
    themes: [
      {
        numeral: 'I',
        title: 'Constitutional Convention',
        text: 'A gathering on the constitutional development of Liberland — liberty, consent and the shape of good government.',
        note: 'Format and speakers in the final programme',
      },
      {
        numeral: 'II',
        title: 'Liberland Merit (LLM)',
        text: 'Developments in Liberland Merit, the Republic’s instrument of blockchain-based participation in its governance.',
        note: 'LLM is distinct from the Liberland Dollar (LLD)',
      },
      {
        numeral: 'III',
        title: 'Liberland Blockchain V2',
        text: 'Liberland’s existing blockchain is already EVM-compatible. V2 is its planned next generation, based on Ethereum technology; developments are expected to be presented at 17:00.',
        note: 'Planned · no release date announced',
      },
      {
        numeral: 'IV',
        title: 'AI and the state',
        text: 'Talks by Daniel Vávra, Vojtěch Roček, Martin Groch and Jan Schlüter on what artificial intelligence changes in public services, investment, energy and government.',
        note: 'Speakers confirmed · times in the final programme',
      },
    ] as Theme[],
  },

  /* ---- faces ---- */
  faces: {
    intro:
      'The President of Liberland and members of its Congress are joined by people who are putting artificial intelligence to work on real institutions: public services, investment, energy and government itself.',
    /** Confirmed speakers (attendance 'confirmed'), shown first as large cards with their talk. */
    speakers: [
      {
        name: 'Vít Jedlička',
        role: 'President of Liberland',
        attendance: 'confirmed',
        note: null,
        portrait: 'images/faces/vit-jedlicka.webp',
        initials: 'VJ',
        credit: 'Vít Jedlička — photo by Gage Skidmore, CC BY-SA 3.0, via Wikimedia Commons (cropped, colour-graded)',
        talk: {
          title: 'Major announcements',
          text: 'At the 17:00 press conference: developments relating to Liberland Merit (LLM) and Liberland Blockchain V2.',
        },
      },
      {
        name: 'Daniel Vávra',
        role: 'Liberland citizen · tech entrepreneur',
        attendance: 'confirmed',
        note: null,
        portrait: 'images/faces/daniel-vavra.webp',
        initials: 'DV',
        credit: 'Daniel Vávra — Show Jana Krause, FTV Prima, CC BY-SA 3.0, via Wikimedia Commons (cropped, colour-graded)',
        talk: {
          title: 'An AI-powered civic portal',
          text: 'Presents his new initiative: a civic portal that uses AI to make public services and information easier to reach for Czech citizens.',
        },
      },
      {
        name: 'Vojtěch Roček',
        role: 'Czech venture capitalist',
        attendance: 'confirmed',
        note: null,
        portrait: null,
        initials: 'VR',
        credit: null,
        talk: {
          title: 'Old Structures Rewritten by AI',
          keynote: true,
          text: 'How artificial intelligence is taking apart, and rebuilding, the way organisations and economies are run.',
        },
      },
      {
        name: 'Martin Groch',
        role: 'Deep-tech and energy innovator',
        attendance: 'confirmed',
        note: null,
        portrait: null,
        initials: 'MG',
        credit: null,
        talk: {
          title: 'AI and the David nuclear reactor',
          text: 'How AI is used in designing David, a nuclear reactor, and what that means for advanced hardware and clean energy.',
        },
      },
      {
        name: 'Jan Schlüter',
        role: 'Member of the Liberland Congress',
        attendance: 'confirmed',
        note: null,
        portrait: 'images/faces/jan-schluter.webp',
        initials: 'JS',
        credit: 'Jan Schlüter — official Liberland media, liberland.org (27 Sept 2026)',
        talk: {
          title: 'The Gornja Siga digital archive',
          text: 'An AI-assisted archive of Gornja Siga that informs the work of the Liberland government. Its approach has since inspired an urban-planning system for municipalities.',
        },
      },
      {
        name: 'Balázs Magyar',
        role: 'Member of the Liberland Congress',
        attendance: 'confirmed',
        note: null,
        portrait: 'images/faces/balazs-magyar.webp',
        initials: 'BM',
        credit: 'Balázs Magyar — official Liberland media, liberland.org (27 Sept 2026)',
      },
    ] as Person[],
    /** Further Liberland personalities (not speaking). A portrait here says nothing about attendance unless `attendance` does. */
    note: 'Personalities shown here are not necessarily attending or speaking. The final programme will confirm who takes part.',
    people: [
    ] as Person[],
  },

  /* ---- last year: Christmas 2025 at Le Palais (facts from the film's own subtitles) ---- */
  lastYear: {
    eyebrow: 'Christmas 2025 · Le Palais',
    lead: 'On Friday, 19 December 2025, the Liberland community filled Le Palais for the Liberland Christmas Party and Constitutional Reading, marking the tenth anniversary of Liberland. This is how it felt.',
    film: {
      src: 'media/gala-2025/film.mp4',
      poster: 'media/gala-2025/poster.webp',
      title: 'Christmas 2025 at Le Palais',
      duration: '1:48',
      note: 'With sound and English subtitles',
    },
    stills: [
      { src: 'media/gala-2025/chandelier.webp', alt: 'A gilded chandelier hung with Christmas baubles at Le Palais' },
      { src: 'media/gala-2025/conference.webp', alt: 'President Vít Jedlička speaking at the conference, a slide reading “Evolving democracy to meritocracy” behind him' },
      { src: 'media/gala-2025/audience.webp', alt: 'A full room of guests in red armchairs applauding' },
      { src: 'media/gala-2025/conversation.webp', alt: 'President Vít Jedlička, in black tie, in conversation with a guest' },
      { src: 'media/gala-2025/toast.webp', alt: 'Guests raising a toast in the hotel library' },
      { src: 'media/gala-2025/band.webp', alt: 'A drummer playing live music in the library' },
    ],
    highlights: [
      { title: 'The Constitution, read aloud', text: 'A conference led by President Vít Jedlička, at which the Constitution was read, discussed and signed.' },
      { title: 'Guests from many countries', text: 'Legal scholars, ministers and international guests joined the Liberland community for the evening.' },
      { title: 'Honours & passports', text: 'Distinguished guests received the Star of Merit, and Liberland passports were presented.' },
      { title: 'And then, the party', text: 'Photographs, dinner, live music in the library and a toast to a better future.' },
    ],
    credit: 'Film and stills: Free Republic of Liberland, Christmas 2025 at Le Palais.',
  },

  /* ---- the Christmas evening ---- */
  evening: {
    lead: 'When the sessions close, Le Palais turns to Christmas. Old friends and new arrive in evening dress, the house glows with warm light, and the Liberland community gathers to celebrate the year together.',
    moments: [
      { title: 'Ceremonial presentations', text: 'A formal moment to mark the year — and the new chapter ahead.' },
      { title: 'Liberland honours & awards', text: 'Recognition for those who have given their time and talent to the Republic.' },
      { title: 'Christmas festivities', text: 'Candlelight, a Christmas toast and the warmth of a European winter evening.' },
      { title: 'International networking', text: 'Friends from many countries, unhurried conversation, and introductions worth making.' },
    ],
    note: 'Evening format, dress code and hospitality details will be published with the final programme.',
  },

  /* ---- practical information (null = shown as "to be announced") ---- */
  practical: {
    dressCode: null as string | null,
    contact: null as { label: string; href: string } | null,
    /** A link to the hotel website for directions is added automatically. */
    travel: 'Václav Havel Airport Prague (PRG) is the nearest international airport.',
    accommodation: 'Rooms at Le Palais can be booked directly with the hotel.',
    accommodationPending: 'Any gala room arrangement to be confirmed' as string | null,
  },

  /* ---- registration ---- */
  registration: {
    /**
     * 'coming-soon' | 'open' | 'closed'.
     * Registration opens when status is 'open' AND either `email` (RSVP by e-mail)
     * or `url` (an authorised online registration page) is set.
     */
    status: 'open' as RegistrationStatus,
    /** RSVP address: the page offers a pre-filled e-mail to it. */
    email: 'rsvp@liberland.org' as string | null,
    /** Online registration page (https), if one is used instead of e-mail. */
    url: null as string | null,
    openLabel: 'RSVP by email',
    /** Admission prices. `price` 0 = free. Shown on the ticket card and in the information table. */
    tickets: [
      { group: 'Citizens of Liberland', price: 0 },
      { group: 'E-residents', price: 50 },
      { group: 'General public', price: 100 },
    ] as { group: string; price: number }[],
    currency: 'USD',
    /** What people must say in their RSVP. */
    instructions: 'Registration is required. Write to us and tell us whether you are a citizen of Liberland, an e‑resident or a member of the public.',
    updatesUrl: 'https://liberland.org/' as string | null,
    updatesLabel: 'News on liberland.org',
  },

  /* ---- editorial text ---- */
  editorial: {
    celebration: [
      'On Friday, 18 December 2026, the Liberland community gathers at Le Palais Art Hotel in Prague for its Grand Christmas Gala — a day of serious conversation followed by a night of celebration.',
      'The afternoon belongs to ideas: a Constitutional Convention, talks on how artificial intelligence is changing public services, investment, energy and government, and a press conference with major announcements on Liberland Merit and Liberland Blockchain V2.',
      'And when the sessions close, the house turns to Christmas: ceremonial presentations, Liberland honours and awards, and an evening among friends from many countries, under chandeliers and painted ceilings in the heart of Prague.',
    ],
    finale: {
      title: 'You are warmly invited',
      lead: 'Join the Liberland community for a Christmas evening to remember — at Le Palais, in the heart of Prague.',
      motto: 'To live and let live.',
    },
    footer:
      'Programme and guests are subject to confirmation. Nothing on this page is an offer of tokens, securities or investment. Liberland Merit (LLM) and the Liberland Dollar (LLD) are distinct instruments.',
  },

  /* ---- site & social metadata ---- */
  site: {
    url: 'https://liberlandlimited.com/christmas/',
    /** false = ask search engines not to index (test preview). Set true at launch. */
    indexable: false,
    description:
      'Christmas at Le Palais: the Liberland Grand Christmas Gala on Friday, 18 December 2026 at Le Palais Art Hotel Prague — a Constitutional Convention, talks on AI and the state with Daniel Vávra, Vojtěch Roček, Martin Groch and Jan Schlüter, announcements on Liberland Merit (LLM) and Liberland Blockchain V2, and a Christmas gala evening.',
    socialImage: 'og-image.jpg',
    socialImageAlt: 'Liberland Grand Christmas Gala — Prague, 18 December 2026',
    locale: 'en_GB',
    organiser: { name: 'Free Republic of Liberland', url: 'https://liberland.org/' },
  },

  /** Gentle snowfall over the whole page. Off automatically for reduced-motion users. */
  atmosphere: { snow: true },
};

/** Lays the Chinese text (event.zh.ts) over the English base; lists are matched by position. */
function overlay<T>(a: T, b: unknown): T {
  if (b === undefined) return a;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((x, i) => overlay(x, b[i])) as T;
  if (a && typeof a === 'object' && b && typeof b === 'object') {
    const out = { ...(a as Record<string, unknown>) };
    for (const [k, v] of Object.entries(b)) out[k] = overlay(out[k], v);
    return out as T;
  }
  return b as T;
}

/** The event, in the language this page is built for. */
export const event: typeof base = LANG === 'zh' ? overlay(base, zh) : base;

export type EventConfig = typeof event;
