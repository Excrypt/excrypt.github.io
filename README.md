# BriteUX

Marketing site for BriteUX. Astro, static output, zero client-side JavaScript, deployed to
Cloudflare Pages.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run check    # astro check
```

**Before this goes live, work through [docs/before-launch.md](docs/before-launch.md).**
Every name, number, phone and address in the site is a placeholder.

The design system and the reasoning behind it are in
[docs/design-plan.md](docs/design-plan.md).

## How it fits together

```
src/
  data/site.ts          every site-wide fact — the single source of truth
  data/faq.ts           the home page FAQ
  lib/schema.ts         typed JSON-LD builders
  content.config.ts     the answers collection schema
  content/answers/      answer pages, one markdown file each
  components/
    BaseHead.astro      title, description, canonical, OG, Twitter, JSON-LD
    sections/           one component per home page section
  pages/
    index.astro         home
    answers/            index + [...slug]
    llms.txt.ts         generated from site.ts, faq.ts and the collection
    robots.txt.ts       generated from site.ts
  styles/global.css     the whole design system, one file
```

### The rule that matters

**Site-wide facts live in `src/data/site.ts` and nowhere else.** The visible copy, the
structured data, `/llms.txt` and the sitemap all read from it. If you find yourself typing
the phone number, the price or a founder's name into a component, stop — put it in
`site.ts` and read it from there. The whole point of the structured data is that it agrees
with the page, and it can only agree if there is one copy of the fact.

The same rule applies to the FAQ. `src/data/faq.ts` feeds both the visible
`<details>` list and the `FAQPage` JSON-LD. Marking up a question that is not on the page
is a Google policy violation, and this arrangement makes it impossible.

## Adding an answer page

Drop a markdown file in `src/content/answers/`. The filename becomes the slug. The front
matter is typed in `src/content.config.ts` and the build fails if it is wrong:

```yaml
---
title: A question, written the way a buyer would ask it
description: One sentence, 50–175 characters, has to stand on its own.
answer: >-
  The direct answer in one or two sentences. Rendered immediately under the h1 and
  reused in structured data. This is the sentence an assistant is most likely to lift,
  so it has to be true without the rest of the page around it.
author: Ryan Deshler        # must match a name in site.founders
publishDate: 2026-03-01
schemaType: Article         # or FAQPage, which then requires faq entries
faq: []
sources:
  - label: Who said it
    url: https://example.com/where
    note: What it says.
related:
  - another-answer-slug     # validated against the collection
---
```

No route to add, no meta to write, no schema to wire, no sitemap to update, no `llms.txt`
entry to remember — all of it is derived.

### How to write one

- Question-shaped `h2`s, with the direct answer in the first sentence underneath, before
  any elaboration.
- Short, self-contained paragraphs. Assume each one will be read on its own, extracted
  from the page.
- Concrete numbers and named sources wherever a claim is made, and put the source in the
  `sources` block so it renders and can be checked.
- Real attribution. `author` is a person, never "the team".

## Constraints this site holds

These are deliberate. Breaking one should be a decision, not an accident.

- **One script, and it is the hero.** `DitherCanvas` is 3.1 KB raw / 1.6 KB gzipped,
  inlined into the page. Nothing else ships JavaScript — the FAQ uses native `<details>`,
  the accordion animation is CSS. If a component ever needs hydration, give that
  component a `client:` directive rather than changing the global config, and check the
  budget first.
- **No third-party anything.** No analytics, no tag manager, no cookie banner, no
  embedded fonts from a CDN. Every one is a Core Web Vitals cost and a trust cost, and a
  cookie banner in particular is the first thing that makes a small shop owner suspicious.
- **One stylesheet.** `src/styles/global.css` holds the system; components use Astro
  scoped styles for their own layout. Section rhythm is defined once, on `.section`, so
  padding rules cannot cancel each other out.
- **Two font files.** Geist and Geist Mono, latin subsets, 52 KB total, self-hosted and
  preloaded.
- **One accent token.** `--accent` at the top of `global.css`. It was chosen to clear AA
  in both directions so no second "accent for text" variant is needed; if you change it,
  re-check that. Everything else is the grey ramp.
- **No stock imagery.** Image slots name the photograph that belongs in them.

## Accessibility floor

Working skip link, visible focus on everything focusable, labelled form fields (not
placeholder-only), `prefers-reduced-motion` respected (including the hero canvas), one
`h1` per page with no heading level skipped, no horizontal scroll at 320px, every tap
target at least 24px, and AA contrast throughout.

Contrast is measured, not assumed: the audit composites every ancestor background —
including `color-mix()` and alpha layers — before computing the ratio. Last run: 0
failures on the home page and both answer pages.
