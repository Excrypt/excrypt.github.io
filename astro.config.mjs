// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site';

export default defineConfig({
  // `site` drives canonicals, Open Graph, JSON-LD @ids and the sitemap. It comes
  // from src/data/site.ts so there is exactly one place the domain is written.
  site: site.url,

  // Zero JavaScript ships by default. Nothing on this site needs hydration; if a
  // component ever does, give that one component a client: directive rather than
  // changing this.
  output: 'static',

  // Cloudflare Pages serves /answers/foo/index.html for /answers/foo/, and this
  // keeps the trailing slash on canonicals and internal links consistent.
  trailingSlash: 'always',

  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],

  prefetch: false,
});
