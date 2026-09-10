import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/site';

/**
 * Allow everything. There is nothing on this site we would rather a crawler — or
 * an answer engine — did not read.
 *
 * The exception is a preview deploy, which serves the same pages under a
 * different host while the content is still placeholder. `NOINDEX=1` at build
 * time turns the file into a blanket disallow so a preview never competes with
 * the real domain in an index.
 */
const noindex = process.env.NOINDEX === '1';

export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      noindex ? 'Disallow: /' : 'Allow: /',
      '',
      `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
