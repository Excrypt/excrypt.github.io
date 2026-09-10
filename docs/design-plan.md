# BriteUX — design system

The system is modelled closely on **browserbase.com**. Values below were read off the
live site with `getComputedStyle`, then fitted to our content.

## What was taken from the reference, and what was not

**Taken — the visual system:**

- Full-bleed dithered pixel hero on a pale periwinkle ground, with a pointer-driven
  interaction over it.
- Headline set in a hot accent highlight block, one box per line
  (`box-decoration-break: clone`), centred lock-up, tight leading.
- Fully-rounded pills — black primary with a drawn chevron, light grey secondary.
- Hairline cell grids: `grey-200` rules on `grey-50`/white fills, cells sharing rules.
- Small letterspaced uppercase mono labels above every section heading.
- Faint 64px square grid behind the quieter sections, and two vertical rules running
  the height of the page at the content edges.
- Their grey ramp, used unchanged.
- The split tracking: **negative on headlines (−0.022em), positive on body and small
  text (+0.01 to +0.09em)**, with tight line-heights throughout. This is most of what
  makes the reference sound like itself, and it is the easiest thing to miss.

**Not taken — their logo and wordmark.** Everything else, including the palette, is
theirs verbatim.

## Colour — their set, verbatim

| Token | Value | Their name |
|---|---|---|
| `--accent` / `--c-orange` | `#ff5e19` | orange |
| `--c-red` | `#ff4500` | primary-browserbase-red |
| `--c-blue` | `#5956ff` | blue |
| `--c-sky` | `#00b0ff` | primary-director-blue |
| `--c-green` | `#00c851` | primary-stagehand-green |
| `--c-lime` | `#c4d600` | primary-lime |
| `--c-yellow` | `#fffacd` | primary-yellow |
| `--c-gold` | `#cb9915` | primary-gold |
| `--c-navy` | `#0000cd` | primary-navy |
| `--c-magenta` | `#ff00ff` | primary-magenta |
| `--c-pink` | `#ffc0cb` | primary-pink |
| `--c-periwinkle` | `#c5d3e8` | primary-gray — the hero sky |
| `--blue-50 … --blue-900` | full ramp | blue-50…900 |
| `--grey-25 … --grey-950` | full ramp | grey-25…950 |

### Which accent goes where, and why

Each accent's contrast decides what it is allowed to do. Measured against white and
black:

```
carries white text at any size   blue 5.00   navy 11.16   blue-600 7.77
carries white text when large    orange 3.06  red 3.44     magenta 3.14
carries black text only          sky 8.65  green 9.38  lime 12.97
                                 yellow 19.81  gold 8.11  pink 13.65
                                 periwinkle 13.86
```

So:

- **Orange `#ff5e19`** floods the headline highlight blocks. Headline type is large, and
  large text needs 3:1 — orange clears it at 3.06. This is exactly the reference's hero.
- **Blue `#5956ff`** floods the "Now" panel in the comparison, because that panel carries
  running white body copy and blue is the one accent in the set that can hold it.
- **Sky, green, lime, periwinkle** appear as halftone ink and as chips under black text.
- **Pills stay black** and **mono labels stay grey** — which is what the reference does,
  and it is why using their orange exactly costs nothing. An orange pill would put 14px
  white text on a 3.06:1 ground; an orange label would put 13px orange on white.

Audited across the home page and both answer pages: **the only element below AA is the
white "B" in the wordmark square** (3.06:1), which is a logotype and explicitly exempt
under WCAG 1.4.3. The reference's mark is the same construction.

## Type scale — measured off their site

Read with `getComputedStyle` at 1440 and at 390, then matched:

```
role                theirs @1440   ours @1440    theirs @390   ours @390
h1                  45 / 500       45            21 / 500      22
h2                  36 / 500       36            21 / 500      21
card title          24 / 500       24            16 / 500      18
card body           16 / 400       16            16 / 400      16
lead                20 / 500       20            20 / 500      18
pill / nav          16 / 500       16            16 / 500      16
mono label          14 / +0.06em   14            14            14
```

Two of ours were the source of the mismatch: **card and row copy was set at 14px**
where theirs is 16, and **pills were 14px** where theirs are 16. Everything at 14px is
now reserved for genuine captions — bylines, notes, the founder bios' secondary line.

## The wordmark

A pixel `B` on a 5x7 grid, drawn as SVG rects rather than set in a typeface: it costs
nothing, stays crisp at any size, and is the same pixel language as the hero dither. The
tile is 34px with **square corners** — no radius is a large part of why the reference's
mark reads as a stamp rather than an app icon. On the orange footer the tile inverts to
black so the mark keeps its figure/ground.

The glyph is the canonical 5x7 bitmap `B` (column bytes `0x7F 0x49 0x49 0x49 0x36`). The
step at each bowl corner is intrinsic to the letter at that resolution, not a defect.
`shape-rendering: crispEdges` keeps it from anti-aliasing at fractional sizes.

Because the mark is now SVG rather than a text glyph, the logotype no longer appears in
the contrast audit at all.

## Hero line breaks

`text-wrap: balance` was not honoured on iOS Safari for this construct, so at wider phone
widths the first line still broke as "…where to / get" and left an orphan. The break is
now an explicit `<br>` that is `display: none` above 48rem — deterministic at every
width, one line on desktop, two balanced lines on mobile. The space before the `<br>`
matters: without it the desktop line renders as "askingAI".

## Mobile scale — measured off their site at 390px

Their mobile headline is **21px**, which is far smaller than a typical hero and is most
of why the highlight block hugs the words instead of filling the column. Matched:

```
                theirs @390        ours @390
h1              21px 500 -0.42px   22px 500 -0.44px
h2              21px 500 -0.21px   21px 500 -0.29px
h3              16px 500 +0.24px   16px 500 +0.24px
hero subhead    16px 500 +0.32px   16px 500 +0.32px
body            16px 400 +0.16px   16px 400 +0.16px
hero media box  x24 w342           x24 w342
content line    40px               40px
```

The hero media block escapes the 40px gutter by −16px so it sits 24px off the viewport
edge while the text inside returns to the 40px line — their exact offset. Section heads
are flush left on mobile and centred from 48rem up, as theirs are.

### The highlight block has to be an inline box

`box-decoration-break: clone` only paints per-line boxes when the element is an **inline**
box that can fragment across lines. Two things broke that here, both silently:

- The lock-up was a flex column, which **blockifies its children** — the spans became
  block boxes.
- The spans also carried `display: inline-block`, which cannot fragment at all.

Either one makes the highlight paint as a single full-width rectangle with the text
floating inside it, which is exactly what it looked like. The fix is a plain block
container, a block-level wrapper per line so `text-wrap: balance` has something to
balance, and the mark left as a bare inline. The rotator is the one exception — it stays
`inline-block` because it needs a box whose width can be animated.

### One consequence worth knowing

At 21–22px and weight 500, the orange headline text and the white-on-orange blocks are
**normal-size text**
under WCAG, not large text — large starts at 24px. So they need 4.5:1 and `#ff5e19`
gives 3.06:1. Above 48rem the same blocks are 40–45px, count as large, and pass at the
3:1 threshold; **desktop is clean apart from the logotype.**

This is inherited from the reference — their own 21px hero mark is 3.44:1 and fails the
same check. It is legible in practice; it is the formal ratio that is short. Two one-line
fixes if you want it to pass on mobile too, both in `global.css`:

- `--accent: #c7390a` — keeps the hue, clears 4.5:1 everywhere, no other change; or
- give `.hero__title .mark` / `h2 .mark` `font-weight: 700` below 48rem, which makes them
  large-scale text at 3:1 and keeps the colour exactly.

## The mobile menu

Below 62.5em the header's CTA pill is replaced by a hamburger that folds into an X, over
a full-screen white panel: large nav links on hairline rules, and two pills pinned to the
foot — the phone number and *Talk to us*. That is where the phone number lives on mobile
now, which matters for this audience.

It is a **`<details>`**, so it opens and closes with no JavaScript at all. The script adds
only what `<details>` does not: Escape to close, locking the page behind the panel, and
closing on link click — including same-page anchors, where no navigation happens to close
it for us. It also force-closes past the breakpoint, since a resize hides the button and
would otherwise leave scrolling locked with nothing on screen to unlock it.

One trap worth recording: the panel is **absolutely positioned against the header, not
fixed to the viewport**. The header carries a `backdrop-filter`, and any filter on an
ancestor makes it the containing block for fixed descendants — so `position: fixed` was
being scoped to the header's own box and clipped to a 72px strip. The header is
full-width and stuck to the top, so absolute against it lands in exactly the same place.

## Calls to action

Every CTA on the site points at `/contact/`, which carries the phone number, the email
address and the message form. The home page no longer has an inline contact section —
two copies of the same form meant the primary button led somewhere the reader already
was.

Note this reverses the original brief, which wanted the primary CTA to be a phone call
rather than a form fill. The phone number is still one tap away in the header on desktop,
in the footer, and at the top of the contact page above the form.

## Two kinds of emphasis

- **`.mark`** — the filled block, white on orange. Now reserved for the **hero lock-up**
  and for inline chips in body copy (the lime "real decoration"), where it reads as a
  highlighter.
- **`.hi`** — coloured text, no ground. Every **section heading** uses this. A painted
  slab behind every section title was reading as furniture rather than emphasis.

Section headings no longer carry a mono eyebrow above them. The remaining `.label` uses
are all doing real labelling work beside or below content, not announcing a heading:
column heads in the comparison and the footer, `Call` / `Email` on the contact page, the
founder roles, `Your part` in the steps, and `The exhibit` in the hero caption row.

Step numbers moved into their own grid column on mobile, so the sequence survives without
putting text above a heading.

## Pastel tints — the "Don't use the web. Scale it." set

Harvested off their page: `#ffc0cb` pink, `#e2e9f3` periwinkle, `#c4edff` pale blue,
`#fffde6` cream, `#fffacd` lemon, `#a4f9c6` mint, `#ffbaff` pale magenta, `#e1eb80` pale
lime. Every one carries **black** text (13:1 or better) and none carries white.

Used on the capability strip — which is our analogue of their pastel stat stack — and on
the periwinkle highlight behind the hero subhead and the "Before" panel head.

## Footer

Measured: their footer is `#ff4500` with **black** text, not white. Black on that ground
is 6.10:1, so the whole panel clears AA, which white would not. Mono uppercase column
heads, links at 19–22px weight 500, columns for Site / Contact / Answers, and the
wordmark square inverts to black-on-orange so the logo keeps its figure/ground.

## Type

**Geist** and **Geist Mono** (Vercel, OFL), self-hosted, two variable files, 52 KB total,
both preloaded.

The reference uses GT Planar, Plain and GT Standard Mono — all licensed, none
redistributable. Geist is the closest open equivalent: the same flat-sided grotesk
construction, single-storey `g`, tight fit.

```
h1     clamp(34px, 3.4vw, 62px)   500   -0.025em   1.04
h2     clamp(28px, 2vw, 45px)     500   -0.022em   1.06
h3     20px                       500   -0.008em   1.20
lead   17 → 20px                  500   +0.015em   1.35
body   16px                       400   +0.010em   1.45
label  13px mono                  500   +0.090em   uppercase
```

Body line-height is 1.45 rather than the reference's 1.2. Their copy is six-word feature
blurbs; ours runs to real paragraphs, and 1.2 is unreadable at that length.

## The hero

### Composition

Not full-bleed. The picture is a **contained block inside the content column**, with the
page's vertical rails running down its edges and the faint square grid visible around it
— the reference's composition. Container is 1280px; the frame is `min(78vh, 700px)` with
the text lock-up anchored to the top so it always sits on open sky.

### The sky

The background is a drifting pixel cloudscape — the mountain ridge is gone. Two layers on
one ramp: a heavy bank low in the frame where the ridge used to sit, and thin wisps above
it, so the clouds behind the device read much stronger than the ones behind the headline.

**The ramp is sampled, not guessed.** Decoding a screenshot of their hero and counting
colours across the sky returns `#c5d3e8` (their primary-gray) with its dither neighbours,
their `#e1e9f2`, and pure `#ffffff` for the brightest cloud. There is no cream anywhere in
their sky — the pale yellow in that image is snow on the ridge, not cloud, which is the
thing that would have been copied wrong by eye.

### Drifting clouds

The sky carries a fourth, brightest stop used only by cloud. A low-frequency noise field
sampled with a time-advancing x offset gives wide, flat shapes rather than speckle, and
the dither turns them into hard pixel edges.

One loop drives both moving things — the cloud phase and the decay of the pointer trail —
throttled to about 16fps. At a five-pixel grid the picture is chunky by construction, so
a higher rate buys nothing and costs battery. It parks itself when the hero scrolls out
of view or the tab is hidden, and under `prefers-reduced-motion` the phase never advances,
which leaves the clouds as a still layer rather than removing them.

### The device

Real device mockups from the client: an iPhone on mobile, a MacBook from 768px
up. Both files ship with the screen area cut out to full transparency, which is
what makes the whole thing simple — **the chat renders behind the frame and the
PNG masks it.** The dynamic island and the MacBook notch occlude the chat for
free, with nothing to keep in sync with the artwork.

**The corners are the exception, and they were a real bug.** The chat box is
deliberately a hair larger than the hole so no bright hairline of sky shows at
the seam. That works everywhere the frame is thick enough to cover the overhang
— but the iPhone bezel is only ~17px while the screen's corner radius is ~44px,
so square corners punched straight through the artwork and four dark tabs sat
outside the phone. `--scr-r` rounds them, in `cqw` (1% of the device's own
width, via `container-type: inline-size` on `.device`) so the radius tracks the
frame at every size instead of being a fixed pixel guess that drifts.

The screen holes were measured off the files (flood-fill inwards from the border,
then bbox the enclosed transparent region), not eyeballed:

| file | size | hole | as % of frame |
|---|---|---|---|
| `hero-iphone.png` | 410x852 | 377x818 at (17,17), r≈44px | 4.146 / 1.995 / 91.951 / 96.009, r 10.7cqw |
| `hero-macbook.png` | 488x283 | 404x237 at (42,6), r≈3px | 8.607 / 2.120 / 82.787 / 83.746, r 0.7cqw |

Those four numbers per device are the `--scr-*` custom properties. Replacing an
artwork file means re-measuring them; nothing else about the chat depends on the
frame.

**One copy of the chat.** The hero script drives `[data-lt-ask]` and
`[data-lt-row]`, so a second copy for a second breakpoint would silently hand it
six rows to type into. Both chromes — the iOS header and the web sidebar — are in
the markup and swapped by media query; the thread between them is shared.
Verified: one `[data-lt-ask]` and three `[data-lt-row]` at every width.

Art direction is a real `<picture>` with `<source media>` over `getImage()` URLs,
so only the matching file is fetched — not two files with one hidden. Optimized
output is 19kB (iPhone) and 5kB (MacBook).

**The dark UI colours are sampled, not guessed.** Taken off ChatGPT's own dark web
UI by decoding the reference screenshot: canvas `#212121`, sidebar `#181818`,
raised surfaces — user bubble and composer — `#303030`, sidebar hover `#242424`.
The phone uses the same set rather than iOS's near-black, by request.

Two deliberate departures. The result numbers are the site accent, because that is
the whole point of the visual — a shop named in the answer. And no assistant
wordmark or logo appears anywhere in it; the model switcher carries a neutral
word instead.

**The gap above the device is the margin below the lock-up and nothing else.** The
frame used to carry `min-height: min(84vh, 780px)` from 768px up, and the stage's
`margin-top: auto` handed every pixel of leftover height to that gap — an empty
band that grew with the viewport. From 768px the frame is content-sized
(`min-height: 0`) and the stage's top margin is pinned to `0`, so the gap is a
flat 26px at every width above the breakpoint. Mobile keeps its `min-height` and
its auto margin, where the copy wraps enough that the frame is content-sized in
practice anyway.

**The crop is cut to the composer, not to the artwork.** Showing the whole MacBook
screen made the hero 842px tall on desktop, which read as too much page spent
before the argument starts. The crop now lands just under the composer — the one
element that has to be visible for the screen to read as a live chat — and takes
the disclaimer line and the keyboard base with it: -82px at tablet, -106px on
desktop, leaving the composer 7-8px clear of the section edge at both. Hero frame
is 624px at tablet and 781px on desktop, down from 842px.

The phone's screen is 96% of its frame, so it cannot be cropped without cutting
the chat; it keeps the -190px cut through the middle of the screen, and the
composer is below the fold there.

### The three-job cards stack on mobile

Below 768px the three cards in `WhatWeDo` stack: each sticks below the header and
the next scrolls up over it, leaving a 14px sliver of the one beneath. Above
768px they are the three-column grid they always were — `position: static`,
verified at 834 and 1440.

**It is `position: sticky`, not an animation.** No script, no scroll listener,
nothing per frame. Three things it depends on, all worth knowing before anything
near it changes:

- **The cards are opaque.** They already carry `background: var(--white)` and a
  border, so a card genuinely covers the one under it.
- **Nothing in the ancestor chain scrolls.** `html` uses `overflow-x: clip` rather
  than `hidden` — `clip` does not create a scroll container, so sticky still
  resolves against the viewport. If that ever becomes `hidden` this silently
  stops working, and the comment already on that rule explains why it is `clip`.
- **Later cards paint over earlier ones.** All three are positioned and carry no
  `z-index`, so DOM order settles it. The header's `z-index: 30` keeps the whole
  stack passing underneath it.

`top` is `calc(84px + var(--i) * 14px)` — 84 clears the 72px sticky header, then
one step per card so the stack reads as a deck rather than as one card replacing
another. Measured through a scroll: card one pins at 84 and stays there, card two
at 98, card three at 112.

### The steps are tinted blocks

The three steps carry `--t-pink`, `--t-periwinkle` and `--t-blue`, and each
number sits on a pixel badge drawn from a ramp hovering around that same tint —
so the badge reads as a deeper patch of the block it sits on rather than as a
separate object. Three ramps were added for this: `blush`, `lavender`, `ice`.

**The number sits outside its block**, in a gutter to the left, so the block's
copy starts at its own left edge rather than being indented around it. At 320 the
container already eats 80px, so the gutter drops from 46px to 36px and the badge
from 34px to 28px below 22.5rem — otherwise the block was 194px wide, about eleven
characters a line.

**These pastels carry near-black text, not white.** Measured on the live blocks:
titles 12.46 / 15.68 / 15.43, body copy 9.08 / 11.43 / 11.24, and the numerals
against the darkest pixel each badge's dither can actually produce — 9.20 / 12.34
/ 12.08. White would fail on all three.

**Mobile stacks them** at the same `top` rather than stepping down like the cards
in `WhatWeDo`. With solid colour blocks a sliver of the one underneath reads as a
stripe of the wrong colour, not as a stack, so each block replaces the last
outright.

There was a pixel rail down a left gutter connecting the badges, revealed on
scroll with a clip. Removed at the client's request — the tints carry the sequence
now. Worth keeping from that pass: the reveal had to be a `clip-path`, not a
`scaleY`, because scaling stretched the dither inside the rail into vertical
streaks. The pixels stopped being square, which is the one thing this visual
language depends on. Anything that reveals a dithered shape should clip it, never
scale it.

"Your part" came out of all three steps, which also dropped the third column from
the desktop layout.

### The founder cards stack on mobile

Same construction as the three-job cards: sticky below the header, stepping 14px
so each leaves a sliver. From 30rem the pair sits side by side, where sticky has
nothing to do — the two cards share a grid row, so neither can travel over the
other. It is left on rather than switched off because it costs nothing and the
single-column layout below 30rem is the case that matters.

### The grid bands

The ruled band the reference runs above and below its feature sections: a row of
square cells with a few filled in flat colour. `GridBand.astro`, used three times
— sandwiching the three-step section and setting up the close.

**Square, and exactly rail to rail, by construction.** The band is inset by the
same expression `.rails` uses for its vertical lines, so its edges land *on* them
rather than running past into the gutter. Inside is a plain
`repeat(var(--cols), 1fr)` grid whose cells carry `aspect-ratio: 1` — so the cells
are square, they divide the rail-to-rail width evenly, and the band's height is
whatever one cell comes to. Nothing is measured and nothing needs re-tuning when
the container changes.

Measured at every breakpoint: track count equals `--cols`, every cell square to
within 0.6px, all cells one width, band edges on the rails, no overflow.

| width | cols | cell | band |
|---|---|---|---|
| 320 | 6 | 45px | 47px |
| 390 | 6 | 56.67px | 58.67px |
| 834 | 10 | 79.3px | 81.3px |
| 1440 | 14 | 95.29px | 97.29px |

**Two overlaid grids, not one.** With cells and blocks as items of the same grid,
the explicitly-placed blocks reserved their slots and the auto-placed cells were
pushed *past* them into implicit columns — six cells and two blocks produced a
nine-track template with three tracks 0.67px wide, and the blocks rendered as
hairlines. `.band__grid` and `.band__blocks` overlay each other sharing `--cols`,
so a block sits on top of a cell instead of displacing it.

**`nth-child`, not `nth-of-type`.** The blocks are spans too, so `of-type` counts
them in the same sequence and `:last-of-type` matched a block rather than the last
cell.

**Column counts change per breakpoint** so cells stay a sensible size rather than
28px slivers on a phone or 160px slabs on a desktop. That means a block's column
index means something different at each width, so each block carries one per
breakpoint. Seven blocks on the page — explicit is cheaper here than clever, and
the start/span are clamped to the grid so a hand-written column can never fall off
its own row.

An earlier pass positioned everything with `calc(50% + n * cell)` off a fixed cell
size. That could satisfy neither half of the requirement: the cells were not
square, and the pattern ran the full viewport with no relationship to the rails.

**Seven bands: one above every section from the third down** — Shift, WhatWeDo,
HowItWorks, WhoWeAre, Offer, Faq, and one setting up the close. Each carries a
different arrangement so the rhythm reads as deliberate rather than as one
ornament repeated seven times.

That is a deliberate reversal of the earlier note here, which said to use these
sparingly after grid motifs behind several sections at once made the page read as
busy. The difference is that these are thin separators between sections rather
than fields behind content, and the client asked for the rhythm explicitly.

**On cost.** Seven bands is fifteen filled blocks, so eighteen canvases on the
page counting the hero and the two panels. They are not all painting: every field
canvas parks itself on an IntersectionObserver, so only the two or three bands
actually on screen are running, and each block is tiny — 36x6 cells at mobile,
127x8 at desktop. Without that parking this would not be a reasonable thing to
ship.

**The filled blocks run the same drifting dither as the before/now panels.**
Each block holds a `DitherCanvas` in its `field` variant on a ramp built around
its own colour — the base value in the middle with two steps down and two up, all
on one hue. That is what lets the pixels move without the block changing colour.
The flat colour stays underneath as the ground, so a block is still the solid
block it was if the script never runs.

Cell size is 3px rather than the panels' 5, because these strips are only 16-24px
tall; at 5 a block had three rows of dither and read as banding rather than as
pixels.

**Tone names had to be disambiguated first.** `sky` meant the hero's periwinkle in
the panels and would have meant `--c-sky` (#00b0ff) in the bands. Two different
blues under one name is how you end up fixing the wrong component, so the hero's
own ramp is `press` now, the periwinkle one is `periwinkle`, and `sky` is the
cyan. `astro check` and the prop union caught every call site.

Ten canvases on the page now — one static hero, two panels, seven blocks. The
blocks are tiny (36x6 cells at mobile), so the added per-frame cost is on the
order of a thousand cells against the panels' fifteen thousand, and each one
parks itself off screen exactly as the panels do.

**Only one rule per boundary.** `.strip` used to draw its own full-width
`border-bottom`, and the first band draws a rail-to-rail `border-top` directly
underneath it with no gap. Stacked, that was 2px of line between the rails and
1px outside them — a single rule that visibly changed weight across its own
length. The strip's is gone; the band's is the one to keep, because it stops at
the rails where the strip's ran the full width and crossed outside them.

Sections need no rules of their own any more either: `.section + .section` only
matches adjacent sections, and with a band between every pair from the third down
none are adjacent. Verified across all seven bands that nothing above or below
draws a competing rule at the same y.

**The strips used to drift sideways on scroll.** That is archived rather than
deleted — `docs/archive/grid-band-drift/` has the exact CSS, the markup change and
the one edge-column problem to fix before it goes back. It was pulled because the
page already carries a drifting hero, two drifting panels, fifteen drifting
strips, a stepping carousel and two rotating words, and this was the easiest of
those to give up. Nothing was wrong with it.

**The strips stay inside the rails.** They are grid items in a band that is itself
exactly rail-to-rail, so containment is structural rather than something to keep
checking — verified across all seven bands at 320, 390, 834 and 1440 that no block
reaches its band's edge and every band's edges sit on the rails.

The band is `aria-hidden` and carries no text.

### The assistant strip

The strip that sits where the reference puts its customer logo wall used to name
decoration methods, which proved we knew the vocabulary. It now names the
assistants a buyer actually asks, which is the thing the heading beside it
promises. The cells carry a name and the brand's mark. Logos were the client's
call, made explicitly; the constraint that remains is in `src/data/assistants.ts`
— the marks are drawn in `currentColor` so they take the label grey, they are
never recoloured into the site accent, and they must not sit beside language
implying a partnership. Recolouring a third-party mark into our orange is what
reads as co-branding, not showing it.

The marks are the single-path monochrome 24x24 icons from `@lobehub/icons`,
inlined at build time rather than fetched. The site loads no third-party assets at
runtime, and a logo that 404s mid-carousel would leave a hole in the stack.

#### The carousel

A centre-stage coverflow on the reference's construction: one card held at full
size and full contrast, its neighbours tucked *behind* it, smaller and faded,
stepping one place every 2.4s.

**It changes axis at the breakpoint.** Vertical under the copy on a phone;
horizontal from 768px up, centred and running the full container width beneath
the title and standfirst. Same markup, same script — only the `data-off`
transforms are rewritten in the media query.

It was briefly a two-column row with the deck beside the standfirst. Full width
below both is better: the deck had only 338px at tablet there, which clipped both
neighbours instead of showing the tuck.

**The step has to be shorter than the card's long side.** At 70px against a 60px
card the vertical neighbours sat in gaps above and below rather than behind the
card on stage, and the deck read as a list. 42-46px vertically; 140px at tablet
and 162px on desktop against 216px and 248px cards.

Positions come from a single `data-off` — the signed distance from the active
card, **wrapped to the shorter way round the loop**, clamped to `far` past the
second neighbour. Without the wrap, the card two places before the active one
reads as n-2 and flies the length of the stack to get where -2 already is. The
script writes that attribute and advances an index; every position, scale and
opacity is CSS, which keeps the tuning in one readable place instead of spread
through transform maths. About 230 bytes gzipped.

Pause lives in CSS: `:hover` and `:focus-within` set `--cover-paused`, and the
script reads it. One mechanism, one place.

Without JavaScript the first card renders active with the next two tucked below —
a still frame of the same picture, not an empty box. Under `prefers-reduced-motion`
the stack unfolds into a plain scrollable column and nothing advances.

#### The title, and why it has its own row

The title is one line from 768px up. Sharing a row with the carousel, it could not
be: squeezed into the left column it had to drop to 15.9px at 768 to fit, which is
too quiet for a section title.

It takes the full container width on its own row now, with the standfirst beneath
it and the carousel beneath that. That buys back the type size and hands the
carousel the width it needed to go horizontal — the same change solves both.

The standfirst's measure went from 52ch to **72ch**, which takes it from three
lines to one at 834px and above, two at 768. 72ch is as far as it should go: the
brief sets a 75-character line-length ceiling, and the full sentence is ~90
characters, so fitting it on one line at every width would mean a measure that is
genuinely harder to read however few lines it makes.

`min(var(--fs-card), 3.5cqw)` against `.strip__inner` keeps it honest; in this
layout the `--fs-card` cap is what binds at every width the site supports and the
`cqw` term is a backstop. Measured with the **longer** of the two word pairings,
which is the case that has to fit:

| viewport | font | needs | has |
|---|---|---|---|
| 768 | 20.9px | 555px | 673px |
| 1440 | 24px | 638px | 1280px |

Note that `scrollWidth` is useless for this check — the title is a block element,
so it reports the box width whether the text overflows or not. A `Range` over the
paragraph's contents gives the real number.

Cards are 216px at tablet and 248px on desktop, which is what the longest name —
Microsoft Copilot — needs once the logo, the gap and the card padding are counted.

#### The rotating words

The two highlighted words cycle: decorators/distributors, then
manufacturers/suppliers. (Both spellings were corrected from the brief.)

**Both slots run off one clock**, so the line never catches a half-swapped pairing
like "manufacturers and distributors". Each slot's width is measured and set
before its word changes, so the highlight grows or shrinks into the new word
rather than snapping and shoving the rest of the line sideways — the same move
the hero headline makes, and the reason the measurement is redone on
`fonts.ready`: measuring against the fallback face gives a width the real face
then overflows.

**The line breaks are forced below 768px.** The two words differ enough in length
that swapping them moved the wrap point — a word jumped between lines and the
page under it shifted. Two lockups, because one does not hold across the range;
the container is only 240px wide at 320px, where "Helping manufacturers and"
needs 244 and wraps anyway, which put the shift straight back:

| width | lockup |
|---|---|
| < 360px | `Helping <word>` / `and <word>` / `get seen by AI` |
| 360-767px | `Helping <word> and` / `<word> get seen by AI` |
| >= 768px | one line, nowrap |

Verified identical line positions and title height in both word states at 320,
360, 390 and 430. A forced break that still wraps fixes nothing, so each of those
six lines was measured against its width in both states rather than assumed.

`white-space: nowrap` does **not** suppress an explicit `<br>`, so the breaks are
`display: none` from 768px rather than left to the nowrap.

**The slot needs a 0.18em nudge down to sit on the line.** `vertical-align:
bottom` puts the slot's *padding* box bottom on the line box bottom, so `.mark`'s
0.18em bottom padding lifted the rotating word that much above the plain text
beside it — measured at 4.31px against a 24px font, which is 0.18em to three
decimals. `position: relative; top: 0.18em` lands the two baselines together;
verified at 0.00px offset at 390, 768, 834 and 1440.

That value is tied to `.mark`'s `padding-bottom` in global.css. If that changes,
this changes with it.

#### Accessibility

WCAG 2.2.2 wants a mechanism to stop moving content. Available without adding
controls: pause on hover, pause on keyboard focus, and no motion at all under
`prefers-reduced-motion`. A touch user with motion enabled still has no way to
stop it — listed in before-launch.

### The before/now panels

A label over each column, then a filled panel of chips — crosses on the left,
ticks on the right. No eyebrow dot and no claim heading: both were tried and
removed.

The reference fills its panels with a vertical scan-line gradient. Ours run the
hero's own dither canvas in a new `field` variant — a drifting pixel field, grey
on the left and sky on the right — instead of the static halftone dots that were
here first. Panels are square-cornered like the assistant strip's cells and unlike
the site's cards; that is the reference's construction, and it is what makes them
read as printed panels rather than as more cards.

The reference runs a 2x2. We have five rows, and the fifth spans the pair rather
than being dropped to make the shape tidy.

#### The hero

The hero is the same field as the before/now panels — `variant="field"` on the
periwinkle ramp — rather than the ridge landscape it carried before.

**It costs more than the ridge did.** The ridge painted once and then only while
a pointer trail decayed; this drifts continuously while in view. Measured: 28,544
cells at `cell: 6` on a 1440x767 hero, and the loop's arithmetic for one frame
benchmarks at **8.7ms against the 80ms interval** — about 11% of the budget on a
desktop machine, and roughly a quarter of that work on a phone, where the canvas
is a quarter the size. `cell` is the lever if that ever needs to come down: 8
would cut it roughly in half.

**The pointer trail has its own ramp.** Blue, through sky, to white — a second
palette rather than more heat on the base one, because pushing periwinkle further
up its own ramp only ever gets a paler periwinkle, which reads as nothing. The
*choice* of ramp is dithered against the same Bayer threshold as everything else
(`h * 2.6 > bay`), so the trail has no hard outline: at the edge only some cells
flip and the two palettes interleave in the same pixel grid.

The gain was 1.15 at first and the trail topped out at sky, reading as one flat
colour. At 1.95 the centre reaches white and the tail falls back through sky to
blue — measured across a six-step drag: 323 white, 259 sky, 22 blue.

Only the hero sets `hot`. The panels and the grid blocks keep the plain heat
behaviour, which just brightens them within their own ramp.

#### The `field` variant

`DitherCanvas` now takes `variant` and `tone`. `ridge` is the hero: a skyline with
an ink mass below it, still until the pointer touches it. `field` is a flat dither
field that drifts on its own, for panels far down the page that nothing will ever
hover.

**It is driven by `setTimeout`, not `requestAnimationFrame`.** The loop wants about
12fps; asking rAF for sixty frames a second to use twelve of them wakes the
compositor forty-eight times for nothing. Parking is unchanged in effect — an
IntersectionObserver sets `inView`, and the loop checks `inView`,
`document.hidden` and `prefers-reduced-motion` before scheduling the next frame.
Under reduced motion nothing starts and each panel is its painted ground colour.

**The sky ramp is wider than the hero's.** The hero's spans only 197..215 because
type sits directly on it. Reusing that here measured 0.14% change frame to frame —
it was moving and you could not tell. Opened to 152..248, against the grey panel's
6.7%.

#### Contrast

The field moves, so the chips cannot be a light wash over it or the text's
contrast breathes with the picture. Each chip carries a scrim opaque enough that
the worst frame the ramp can produce still clears AA. Measured against the ramp
endpoints, not against one lucky frame:

| | worst case | |
|---|---|---|
| chip text, dark panel | 15.71:1 | white on rgb(35,35,35) |
| chip text, sky panel | 16.85:1 | near-black on rgb(236,241,247) |
| crosses | 6.69:1 | |
| ticks | 5.09:1 | after darkening |

The ticks were plain `--accent` and measured **3.03:1** against the darkest frame —
clearing 1.4.11 by 0.03, which would not survive a nudge to the ramp. They are the
accent walked 26% toward black now, the same move `.label--accent` already makes.

#### A note on verifying this

Neither automation surface could show the drift running: both report
`document.hidden`, and a hidden document has its rendering steps suspended, so
rAF **and** IntersectionObserver callbacks are both suspended with it. Confirmed by
temporarily lifting the hidden guard and calling `run()` directly — phase advanced
at the expected rate and both canvases changed. The scaffolding was removed
afterwards; if this component is touched again, expect the same blind spot.

### The landscape

The hero sky now sits over a pixel landscape: a wavering horizon at 60% of the
canvas (68% on a phone, where the frame beside the device is a sliver), a distant
conifer treeline, field bands, grass texture and flower speckle, and two trees
standing on the left.

**The greens are theirs at the top of the ramp and derived below it.** #c4d600
(their lime) and #e1eb80 carry the sunlit distance; the five stops beneath walk
one hue down in value for the folds, the treeline and the trees. Their hero has
no dark green to copy — its ridge is black — so inventing those was unavoidable,
and keeping them on a single hue is what stops the field reading as a rainbow.
Their #00c851 was in the ramp and had to come out: it is far bluer than its
neighbours, so the dither read as a hue break rather than a step, and the field
came out banded in stripes. Flowers pick up their #a4f9c6 mint alongside white
and pale lime.

Three things had to be right for it to read as fields rather than static:

- **Flatten toward whole stops.** Every pixel was landing on a fractional ramp
  position, so the Bayer pattern fired everywhere. Pulling the fractional part in
  to 42% leaves most of a band solid and keeps the dither on the boundary between
  two greens, which is where it belongs.
- **Warp the depth, not the colour.** Field boundaries roll across the frame
  because `depth` is displaced by low-frequency noise before it picks a stop. The
  first attempt ran that noise slower than the canvas is wide, which tilted the
  whole field light-left to dark-right instead of undulating.
- **Match the noise frequencies in x and y.** The mottling pass originally ran y
  six times faster than x and the field came out as horizontal stripes.

**Trees and the treeline stand above the horizon line**, so `y < hz[x]` is not a
safe test for "this is sky" — using it drew the canopies and then painted cloud
straight over them. A `solid` mask records where the land wrote something, and
paint branches on that instead.

Cloud still reads *over* the land: a haze band along the horizon, drifting with
the clouds and weighted to the left and right edges, because the middle is behind
the device. On a phone it is halved — at ~55 cells wide almost every column counts
as "edge" and the mist swallowed the field.

**Cost.** The land needs five noise lookups per pixel where the sky needs two, and
none of it moves, so it is painted once per resize into a buffer and copied each
frame. Only the clouds and the haze are live. The script is 2.8kB gzipped and the
per-frame loop costs what it did before the landscape existed.

### What makes the screen read as the real thing

Placeholder squares for icons were the tell. Every icon is now a real inline SVG
on `currentColor` — compose, overflow dots, magnifier, library grid, copy, both
thumbs, read-aloud, regenerate, plus, mic — sized in `em` so they scale with
`--ai-font` rather than needing a value per breakpoint.

The answer also had to be long enough to fill the column. A lede, three results
with a muted spec line each (`Screen print · 3-5 day turn · 24 pc min`), and a
closing follow-up question is roughly the shape of a real reply, and it fills the
laptop screen where a bare three-item list left a void above the composer. All of
it is per-query data in `Hero.astro`, so the embroidery answer talks about stitch
counts and the DTF answer talks about gang sheets.

Only the question and the shop names are typed. The lede, the spec lines and the
closing question fade in on the same clock, staggered top to bottom, so the answer
assembles the way a generated one does instead of snapping into place.

### The phone

### The laptop (archived)

*Superseded by the phone; kept for reference.* A pixel laptop sat on the ridge showing an assistant answering the query in the
headline. Square corners, chunky black rules, mono type, no shadows — the same idiom as
the ridge behind it, and modelled on no real assistant's interface.

One list in `Hero.astro` drives both halves: `tail` completes the headline, `ask` and
`results` are what the screen shows. They always agree because they are the same object.

The screen types in monospace with `steps()` set from script to each line's exact
character count. That is what gives it the old-terminal cadence — a fade or a generic
`steps(20)` does not read the same way, and it only lands cleanly because the type is
monospaced.

The markup renders the **first** query fully resolved, so with JavaScript off or under
`prefers-reduced-motion` the reader sees a complete, correct screen. The whole laptop
carries one `role="img"` and a label rather than exposing duplicated text to assistive
tech.

### The dither

`src/components/DitherCanvas.astro` — the only JavaScript on the site, **3.1 KB raw /
1.6 KB gzipped**, inlined into the page so it costs no extra request.

The reference stacks two looping videos and a canvas (`heroEtchTrail__baseVideo`,
`__sourceVideo`, `__canvas`) and etches between them along the pointer trail. We have no
footage and did not want a video in the critical path, so the equivalent here is
generated:

1. A ridged fBm noise field builds a skyline, kept low in the frame so the text lock-up
   always sits on open sky.
2. Two octaves of surface texture at different scales are added, at deliberately high
   amplitude — that is what keeps every stop of the ink ramp mixing all the way down
   instead of banding into a flat black slab.
3. The field is quantised through an ordered 8×8 Bayer dither into a five-stop ramp
   (black → hot → warm → pale) and drawn at one-fifth resolution, scaled up with
   `image-rendering: pixelated`.
4. Pointer movement floods heat into the field, pushing those cells up the ramp — ink
   spreading through a screen. The heat decays and the loop stops.

The ramp is their own mountain's inks: grey-950, browserbase-red, orange, lime, pale
yellow, on the periwinkle sky. Lime is doubled in the ramp, which widens the green band
without adding a colour. Black is doubled in the ramp so the mass stays weighted
dark, and the texture amplitude is high so every stop keeps mixing down through it
rather than banding into a flat slab.

A halftone dither is also the literal mechanism by which a photograph gets printed on a
garment, which is why this particular borrowed idea earns its place here rather than
just looking current.

**Failure and cost behaviour:**

- Renders once on load; repaints only while the trail is decaying, so an untouched page
  costs nothing after first paint.
- Nothing depends on it. The canvas sits behind the text over a painted `--sky` ground,
  so if the script never runs the hero is a solid colour with legible type on it.
- Under `prefers-reduced-motion` the field draws once and the trail never runs.
- No trail on touch devices (`hover: hover` gate).
- A resize cancels the in-flight loop before rebuilding the buffers it reads from.

## The rotating headline

Line one is fixed — *"Buyers are asking AI where to get"* — and the second line cycles
through real sourcing searches. Every phrase is kept under about 21 characters so it
holds **one line at 320px**; `white-space: nowrap` then guarantees it rather than hoping.
Widest phrase measures 215px against 240px available at 320.

The word rolls up and out, the next rolls in from below, and the orange block is
**width-animated to a measured value** so the bar physically resizes with the phrase
instead of snapping. 0.8 KB gzipped.

Three things this has to get right, all of which bit during the build:

- **The first phrase is in the HTML.** The `<h1>` reads as a complete sentence for
  crawlers and for anyone whose JavaScript never runs.
- **Width is measured after the webfont loads.** The first measurement happens against
  the fallback face; Geist swaps in later and every glyph changes width. And the block
  is `border-box` with padding, so the measured text width has the padding added back —
  without that, the last glyph is clipped by exactly the padding.
- **The state machine runs on timers, not `requestAnimationFrame`.** rAF is throttled in
  a background or unfocused tab while `setTimeout` is not, so a rAF-gated step can
  silently never arrive and park the word off-screen. The transition is committed with a
  forced reflow instead.

Accessibility: disabled entirely under `prefers-reduced-motion`; pauses on hover, on
keyboard focus inside the hero, and while the tab is hidden; `aria-live="off"` so the
heading is read once as rendered. Below 48rem the phrase wraps and the width animation
is off.

## Imagery

We have no product UI and no photographs, and the brief forbids stock. Two substitutes,
both in the same pixel language as the hero:

- **`.halftone`** — a CSS dot field with a density gradient, used for the card media
  areas where the reference puts product screenshots. Zero cost, no assets.
- **`ImageSlot`** — a halftone panel with the required photograph *described on it*. The
  `alt` string is the brief for the photographer and becomes the real alt attribute when
  the image lands. Swapping in Astro's `<Image />` reserves the same box, so nothing
  shifts.

The capability strip copies their logo cloud's construction exactly — uniform `#f8f7f4`
cells (measured off their page; a warm off-white, not from the grey ramp), square
corners, 4px gutters. It was briefly a pastel rainbow, which turned a quiet
credential row into the loudest block on the page. The pastels now live only where they
belong: the tinted marks.

**The cells list decoration methods only.** A distributor does not run any of them — they
contract the decorating out — so listing "Distributors" beside "DTF" was a category
error. The heading names both audiences; the cells name only the processes.

The customer-logo wall has no honest equivalent — we have no customers to name and no
permission to imply endorsement — so that slot carries the industry vocabulary strip
instead: the thing a shop owner actually scans for in the first four seconds.

## Layout

Container 1120px, gutters 20/32px, section padding 72/112px. Section heads are centred
(as the reference's are); card and row content is left-aligned. Two vertical hairlines
run the height of the page at the content edges via `.rails`, so the page reads as one
continuous sheet rather than a stack of bands.
