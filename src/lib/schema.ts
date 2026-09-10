/**
 * Typed JSON-LD builders.
 *
 * Everything here reads from src/data/*, so structured data cannot describe
 * something the page does not say. Add a builder rather than hand-writing a
 * <script type="application/ld+json"> in a page.
 */
import { site, absoluteUrl } from '../data/site';
import type { FaqEntry } from '../data/faq';

/** Loose but useful: every builder returns a node with an @type. */
export type SchemaNode = Record<string, unknown> & { '@type': string };

/** Stable @ids so nodes can reference each other instead of repeating themselves. */
export const ids = {
  organization: absoluteUrl('/#organization'),
  website: absoluteUrl('/#website'),
  localBusiness: absoluteUrl('/#localbusiness'),
  service: absoluteUrl('/#service'),
  founder: (name: string) =>
    absoluteUrl(`/#person-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`),
} as const;

export function personSchema(founder: (typeof site.founders)[number]): SchemaNode {
  return {
    '@type': 'Person',
    '@id': ids.founder(founder.name),
    name: founder.name,
    jobTitle: founder.role,
    description: founder.bio,
    worksFor: { '@id': ids.organization },
    ...(founder.sameAs.length ? { sameAs: [...founder.sameAs] } : {}),
  };
}

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
} as const;

export function organizationSchema(): SchemaNode {
  return {
    '@type': 'Organization',
    '@id': ids.organization,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.svg'),
    },
    telephone: site.phone.e164,
    email: site.email,
    address: postalAddress,
    founder: site.founders.map((f) => ({ '@id': ids.founder(f.name) })),
    sameAs: [...site.sameAs],
  };
}

export function webSiteSchema(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { '@id': ids.organization },
    inLanguage: 'en-US',
  };
}

export function localBusinessSchema(): SchemaNode {
  return {
    '@type': 'ProfessionalService',
    '@id': ids.localBusiness,
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.phone.e164,
    email: site.email,
    address: postalAddress,
    areaServed: { '@type': 'Country', name: site.areaServed },
    parentOrganization: { '@id': ids.organization },
    priceRange: `${site.offer.priceDisplay}/${site.offer.billingPeriod}`,
  };
}

export function serviceSchema(): SchemaNode {
  return {
    '@type': 'Service',
    '@id': ids.service,
    name: 'AI and search visibility for decorators and distributors',
    serviceType: 'Search and AI visibility management',
    description:
      `A monthly retainer that gets promotional products distributors and apparel ` +
      `decorators found in Google and in AI assistants when a buyer is sourcing a ` +
      `supplier. ${site.offer.terms} ${site.offer.ownership}`,
    provider: { '@id': ids.organization },
    areaServed: { '@type': 'Country', name: site.areaServed },
    audience: {
      '@type': 'BusinessAudience',
      name: 'Promotional products distributors and apparel decorators',
    },
    offers: {
      '@type': 'Offer',
      price: String(site.offer.price),
      priceCurrency: site.offer.currency,
      url: absoluteUrl('/#offer'),
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(site.offer.price),
        priceCurrency: site.offer.currency,
        unitCode: 'MON',
        billingIncrement: 1,
      },
    },
  };
}

/**
 * Build FAQPage from the same array the page renders. Never call this with
 * questions that are not visible on the page.
 */
export function faqSchema(entries: FaqEntry[], pageUrl: string): SchemaNode {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

export interface ArticleInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}

export function articleSchema(input: ArticleInput): SchemaNode {
  const author =
    site.founders.find((f) => f.name === input.authorName) ?? site.founders[0];
  return {
    '@type': 'Article',
    '@id': `${input.url}#article`,
    headline: input.headline,
    description: input.description,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { '@id': ids.founder(author.name) },
    publisher: { '@id': ids.organization },
    isPartOf: { '@id': ids.website },
    inLanguage: 'en-US',
  };
}

export function breadcrumbSchema(
  trail: { name: string; url: string }[]
): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/** Wrap a set of nodes into one @graph document. One script tag per page. */
export function graph(nodes: SchemaNode[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes });
}
