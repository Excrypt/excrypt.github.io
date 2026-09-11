import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, absoluteUrl } from '../data/site';
import { homeFaq } from '../data/faq';

/**
 * /llms.txt — a plain-text summary of the business for language models.
 *
 * Generated from the same source data as the JSON-LD and the visible copy
 * (src/data/site.ts and src/data/faq.ts), so the three cannot disagree. Adding an
 * answer page adds it here automatically.
 */
export const GET: APIRoute = async () => {
  const answers = (await getCollection('answers', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## What this is',
    '',
    `${site.name} is a monthly retainer service for promotional products distributors ` +
      'and apparel decorators — screen printers, embroiderers and DTF shops. The work ' +
      'is getting a shop found when a buyer sources a supplier, whether that buyer is ' +
      'using Google or asking an AI assistant.',
    '',
    `Run by ${site.founders.map((f) => f.name).join(' and ')}, brothers whose family ` +
      `has run a contract-only apparel decorator — screen print, embroidery and DTF — ` +
      `since ${site.familyShopSince}.`,
    '',
    '## The offer',
    '',
    `- Price: ${site.offer.priceDisplay} per ${site.offer.billingPeriod}`,
    `- Terms: ${site.offer.terms}`,
    `- Ownership: ${site.offer.ownership}`,
    `- Billed separately: ${site.offer.excluded}`,
    '',
    'Included:',
    ...site.offer.includes.map((line) => `- ${line}`),
    '',
    '## Contact',
    '',
    `- Email: ${site.email}`,
    `- Meetings: book at ${absoluteUrl('/contact/')}`,
    `- Location: ${site.address.locality}, ${site.address.region}, ${site.address.country}`,
    `- Area served: ${site.areaServed}`,
    '',
    '## Pages',
    '',
    `- [Home](${absoluteUrl('/')}): what the service is, the research behind it, and the price.`,
    `- [Half of business buyers now ask AI before they search](${absoluteUrl('/research/answer-economy/')}): a summary of G2's 2026 Answer Economy survey of 1,076 B2B buyers, with sources.`,
    `- [The shift](${absoluteUrl('/the-shift/')}): how a buyer finds a shop now, and the figures behind it.`,
    `- [What we do](${absoluteUrl('/what-we-do/')}): the three jobs done every month, and what each produces.`,
    `- [Research](${absoluteUrl('/research/')}): the studies this is built on, with sources.`,
    `- [Who we are](${absoluteUrl('/who-we-are/')}): the founders and the family shop behind them.`,
    `- [Pricing](${absoluteUrl('/pricing/')}): the one plan, what it includes, and what you keep.`,
    `- [Questions](${absoluteUrl('/questions/')}): the questions a skeptical owner asks.`,
    `- [Answers](${absoluteUrl('/answers/')}): the answer library index.`,
    `- [Contact](${absoluteUrl('/contact/')}): book a thirty-minute meeting, or email.`,
    ...answers.map(
      (entry) =>
        `- [${entry.data.title}](${absoluteUrl(`/answers/${entry.id}/`)}): ${
          entry.data.description
        }`
    ),
    '',
    '## Common questions',
    '',
    ...homeFaq.flatMap((entry) => [`### ${entry.question}`, '', entry.answer, '']),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
