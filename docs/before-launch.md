# Before launch

Everything on this list is invented, guessed, or unfinished. The site builds and works
with all of it in place, but none of it should go live unchanged.

## 1. Replace the placeholders in `src/data/site.ts`

Every one is marked `@placeholder` in that file. It is the only file that needs editing —
the visible copy, the JSON-LD, `/llms.txt` and the sitemap all read from it.

| Field | Currently | Needs |
|---|---|---|
| `url` | `https://briteux.com` | The real production domain. Canonicals, Open Graph, JSON-LD `@id`s and the sitemap all break if this is wrong. |
| `legalName` | `BriteUX LLC` | The registered entity. |
| `phone.display` / `phone.e164` | `(555) 555-0134` | The real number. 555-01xx is reserved for fiction, so this cannot be dialled. |
| `email` | `hello@briteux.com` | The real inbox. |
| `address` | A Greensboro, NC street address | A real postal address. `LocalBusiness` schema is not valid without one, and Google Business Profile has to match it exactly. |
| `sameAs` | Guessed LinkedIn and Facebook URLs | Real profile URLs, or delete the entries. A `sameAs` pointing at a 404 is worse than none. |
| `familyShopSince` | `1987` | The year the family shop actually opened. This number appears in the hero, in *Who we are* and in `/llms.txt`. |
| `founders` | `Ryan Deshler` and `Mark Deshler` | Real names, roles, one-line bios in first person, and real LinkedIn URLs. |

The founder names are also the allowed values for the `author` field on answer pages —
`src/content.config.ts` derives that enum from `site.founders`, so changing a name will
fail the build until the front matter of both answer pages is updated to match. That is
deliberate.

## 2. Wire up the contact form

`formEndpoint` in `src/data/site.ts` is `/api/contact`, which does not exist. The site is
static output, so it needs one of:

- a Cloudflare Pages Function at `functions/api/contact.ts`, or
- a hosted form endpoint (the URL goes in `formEndpoint`).

Until then the form 404s on submit. This is why the phone number and email sit above the
form rather than below it — the working path to reach you is never blocked on this.

## 3. The two audiences

The copy now distinguishes them, and it should stay that way: **decorators run the
equipment; distributors contract the decorating out.** Anywhere the site asks what a
reader "runs" it offers both branches — the intake call in *How it works*, the "What do
you need from me?" answer, and the second *What we do* card. If you add copy, keep that
split.

## 4. Verify every number and every source

Two figures and four citations appear in the answer pages. All of them were written from
general knowledge and **none has been checked against the source**:

- `src/content/answers/how-buyers-find-decorators.md` — the claim that AI Overviews
  reached all US users in May 2024, and the characterisation of the GEO paper's findings
  (that quotations and statistics produced the largest measured gains). Read the paper
  and confirm the wording before publishing.
- `src/content/answers/what-an-ai-visibility-audit-checks.md` — the description of
  Google's structured data documentation, and the named directories (SAGE, ASI).

Every source is in the `sources:` front matter block and rendered visibly at the foot of
the page, so this is a finite list. A wrong statistic on a page whose whole argument is
"be accurate and cite things" costs more than the statistic is worth.

Also confirm the two answer pages describe the audit you actually run. They currently
describe ten to fifteen questions across four assistants, a week's turnaround, and a
half-hour walkthrough call.

## 5. The hero device mockups — incoming from Illustrator

The hero currently uses the two supplied mockups, with the assistant UI drawn in
CSS behind a transparent screen cut-out:

- `src/assets/hero-iphone.png` — 410x852, hole 377x818 at (17,17), corner r ~44px
- `src/assets/hero-macbook.png` — 488x283, hole 404x237 at (42,6), corner r ~3px

Those four numbers per device are the `--scr-*` custom properties in
`HeroDevice.astro`. **Replace a file and they must be re-measured.**

**Planned change: the devices are being rebuilt in Illustrator with the ChatGPT
UI baked into the artwork**, leaving only the conversation to overlay. When those
land, three things are needed alongside the files:

1. The **screen rectangle** — or just keep the screen transparent as now and it
   can be measured the same way.
2. The **rectangles the live text occupies**: the question bubble, and the three
   result rows. Those are the only parts that animate, so everything else can be
   flat in the artwork.
3. Whether the bubble should **grow with the question**. It does now; if the
   artwork draws a fixed bubble, the questions need to be a fixed width.

The chat markup collapses to those few elements at that point, and the sidebar,
composer, icons and disclaimer all come out of the CSS.

**The MacBook file is still too small.** 488px wide rendering at 920 CSS px is a
1.9x upscale before the display's own pixel ratio. If the Illustrator rebuild is
happening anyway, export it at **1840px wide or larger**. The iPhone is fine —
410px native against a 232px render is close enough to 2x.

## 6. Photographs

There are three image slots. Each renders a description of exactly the photograph that
belongs in it, taken from `photoAlt` in `site.ts` or from the `alt` prop:

1. **Hero** — a screenshot of an AI assistant answering a real buyer sourcing question,
   with shops named. This is the most important image on the site. Use a real screenshot
   of a real answer, not a mock-up, and check nothing in it is defamatory about a named
   competitor.
2. **Ryan** — in a shop, beside a manual press, waist up, natural light.
3. **Mark** — in a shop, beside a multi-head embroidery machine, waist up, natural light.

Replace `<ImageSlot />` with Astro's `<Image />` and explicit `width` and `height`. The
slot reserves the same box via `aspect-ratio`, so swapping them will not shift layout.

Do not substitute stock photography. A stock photo of a press is worse than an empty box
to a reader who has stood in front of one.

## 7. The palette is Browserbase's, verbatim

`src/styles/global.css` carries their exact accent set and both their ramps, including
`--accent: #ff5e19`. `docs/design-plan.md` records which accent is allowed to carry which
text and why — that mapping is what keeps the site at AA while using their colours
unchanged, so read it before moving a colour to a new job.

Two things to know:

- The hero's ink ramp repeats those colours as literal RGB triples in
  `src/components/DitherCanvas.astro` (`LAND`), so a palette change has to happen there
  too.
- The white "B" in the wordmark square is 3.06:1. That is a logotype and exempt under
  WCAG 1.4.3, but if the mark ever becomes plain text rather than a logo, it needs a
  darker ground.

One legal note worth a five-minute conversation with whoever advises you: the visual
system here is deliberately very close to browserbase.com, and the palette is now
identical. Different industry, different name, different logo, so this is ordinary
design influence rather than a problem — but you should make that call knowingly rather
than discover it later.

## 8. Deploy

Cloudflare Pages:

- Build command `npm run build`
- Output directory `dist`
- Node 20 or later

Set the custom domain, then confirm `/robots.txt`, `/llms.txt` and `/sitemap-index.xml`
all resolve and all contain the production domain rather than `briteux.com`.

## 9. Check before you announce it

- Rich Results Test on `/` — expect Organization, WebSite, ProfessionalService, Service,
  two Person nodes and FAQPage.
- Rich Results Test on both answer pages — expect Article on one, FAQPage on the other.
- Lighthouse on mobile, throttled. The build ships one 1.6 KB inlined script, two fonts
  totalling 52 KB and one inlined stylesheet, so anything short of a green Core Web
  Vitals result means something was added that should not have been.
- Move the pointer across the hero and confirm the etch trail floods and decays. Then
  turn on Reduce Motion and confirm the field still draws and the trail does not run.
- Submit the sitemap in Google Search Console.

## The assistant carousel and WCAG 2.2.2

The strip of assistants steps automatically every 2.4s. 2.2.2 requires a way to
pause, stop or hide moving content that runs longer than five seconds. The page
offers pause on hover, pause on keyboard focus, and no motion at all under
`prefers-reduced-motion`, where the stack becomes a plain scrollable column.

A touch user with motion enabled has no way to stop it. The reference this was
built from carries prev/next arrows and a progress indicator; adding those would
close the gap and give the section manual control at the same time. Roughly
twenty lines on top of what is there.

Also worth a decision before launch: the list is ChatGPT, Google Gemini,
Perplexity, Microsoft Copilot, Claude, Grok, Meta AI, DeepSeek. **Google AI
Overviews is deliberately not in it** — it is where a very large share of these
searches actually land, but it is a search feature rather than a chatbot, and the
ask was for chatbots. Adding it is one line.

## Assistant logos

The marquee shows each assistant's mark beside its name. These are third-party
trademarks, shown to say where the work happens. The client authorised their use
explicitly.

Two rules kept in the code, worth keeping if the section is edited:

- The marks are drawn in `currentColor` at the label grey. **Do not recolour them
  into the site accent** — a third-party mark in our orange reads as co-branding.
- Do not place them beside language that implies a partnership, certification or
  endorsement. "Where buyers ask" is fine; "our partners" is not.

Icon source is `@lobehub/icons`, inlined into `src/data/assistants.ts` at build
time. Nothing is fetched at runtime. If a brand refreshes its mark, replace the
path in that file.
