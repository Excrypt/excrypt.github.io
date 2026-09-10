/**
 * Single source of truth for every site-wide fact.
 *
 * Visible copy, JSON-LD structured data and /llms.txt all read from this file, so the
 * three cannot drift apart. Change a value here and it changes everywhere.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDERS — every value marked `@placeholder` is invented and must be
 * replaced before launch. They are all real-shaped (555 numbers are reserved for
 * fiction, the domain is a guess) so nothing breaks, but none of them are true.
 * See docs/before-launch.md for the full checklist.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Founder {
  name: string;
  role: string;
  /** One line, first person, used in the Who we are section and Person schema. */
  bio: string;
  /** Describes exactly what photograph belongs in this slot. */
  photoAlt: string;
  sameAs: string[];
}

export const site = {
  name: 'BriteUX',
  /** @placeholder legal entity name */
  legalName: 'BriteUX LLC',

  /**
   * @placeholder confirm the production domain before deploying
   *
   * `SITE_URL` overrides this at build time so a preview deploy (GitHub Pages)
   * gets correct canonicals, Open Graph URLs and a correct sitemap without the
   * production domain being edited here. Unset, the production domain is used.
   */
  url: process.env.SITE_URL ?? 'https://briteux.com',

  /** Used as the <title> suffix and in WebSite schema. */
  tagline: 'Get your shop found by buyers using AI',

  /**
   * One sentence. Used as the default meta description, the Organization
   * description, and the opening line of /llms.txt.
   */
  description:
    'BriteUX gets promotional products distributors and apparel decorators found in ' +
    'Google and in AI assistants like ChatGPT, Perplexity and Google AI Overviews ' +
    'when a buyer is sourcing a supplier.',

  /** @placeholder */
  phone: {
    display: '(555) 555-0134',
    /** E.164, for tel: links and schema. */
    e164: '+15555550134',
  },

  /** @placeholder */
  email: 'hello@briteux.com',

  /** @placeholder — a real postal address is required for LocalBusiness schema */
  address: {
    street: '1400 Press Street',
    locality: 'Greensboro',
    region: 'NC',
    postalCode: '27401',
    country: 'US',
  },

  /** Where the service is offered. Used for Service.areaServed. */
  areaServed: 'United States',

  /** @placeholder social profiles — used for Organization.sameAs */
  sameAs: [
    'https://www.linkedin.com/company/briteux',
    'https://www.facebook.com/briteux',
  ],

  /**
   * The year Hightech Grafix was founded, per its own LinkedIn and PRINTING
   * United's member spotlight. Not a placeholder any more — it is a checkable
   * claim about a real company, and it also seeds the hero's dither field, so
   * changing it repaints the hero.
   */
  familyShopSince: 2008,

  /**
   * Real people, real profiles. The bios are written from what those profiles
   * state and nothing else — Bryce's engineering title, Blaid's line of work —
   * because these sit beside real names, real faces and links to the real
   * accounts, and anything invented here is a claim about a person rather than
   * placeholder copy.
   *
   * `sameAs` is what ties the Person schema to those profiles, so an assistant
   * reading the page can confirm the two are the same person. Keep them exact.
   */
  founders: [
    {
      name: 'Bryce Nichols',
      role: 'Co-founder',
      bio:
        'I build software for a living — senior UX engineer by day. I run the ' +
        'audits and build what comes out of them.',
      photoAlt:
        'Bryce Nichols, co-founder of BriteUX — black and white portrait, arms ' +
        'folded, in a dark polo',
      sameAs: ['https://www.linkedin.com/in/bryce-nichols-25615610b/'],
    },
    {
      name: 'Blaid Nichols',
      role: 'Co-founder',
      bio:
        'I sell contract decoration for a living — screen print, embroidery and ' +
        'DTF. I know the questions buyers ask, and I am who you talk to.',
      photoAlt:
        'Blaid Nichols, co-founder of BriteUX — black and white portrait, arms ' +
        'folded, in glasses and a work polo',
      sameAs: ['https://www.linkedin.com/in/blaid-nichols-9056ba176/'],
    },
  ] satisfies Founder[],

  offer: {
    price: 1500,
    currency: 'USD',
    /** Human-readable, used in visible copy. */
    priceDisplay: '$1,500',
    billingPeriod: 'month',
    terms: 'Month to month, no contract.',
    includes: [
      'A full audit of how you show up in Google and in AI assistants today',
      'A website, if you need one — built and maintained, not rented',
      'Your Google Business Profile claimed, corrected and kept current',
      'Answer pages written for the questions your buyers actually ask',
      'A monthly call and a plain report of what moved',
    ],
    /** Stated on the page and in the FAQ. Not a footnote. */
    excluded: 'Hosting and domain registration are billed to you directly, at cost.',
    ownership:
      'You own the domain, the Google Business Profile and every account. We are ' +
      'an admin you can remove.',
  },
} as const;

export type Site = typeof site;

/** Absolute URL for a site-relative path. Used for canonicals, OG and sitemaps. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).href;
}

/**
 * Where the contact form posts.
 *
 * @placeholder — the site is static output, so this needs a real endpoint before
 * launch: a Cloudflare Pages Function at functions/api/contact.ts, or a hosted
 * form endpoint. Until then the form will 404 on submit, which is why the phone
 * number and email address sit above it rather than below it.
 */
export const formEndpoint = '/api/contact';
