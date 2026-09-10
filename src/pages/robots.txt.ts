import type { APIRoute } from 'astro';
import { absoluteUrl } from '../data/site';

/**
 * Allow everything. There is nothing on this site we would rather a crawler — or
 * an answer engine — did not read.
 */
export const GET: APIRoute = () =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
