# Archived: "Audit, build, then every month"

Shelved 2026-09-11. The three-step process section — a sticky intro beside a
column of tinted step cards that slide in as they enter — came off the home page
to make room for the research section (`src/components/sections/Research.astro`).

Kept here because it works and the copy is settled; it may come back once the
page has room for both.

## What it was

`HowItWorks.astro`, exactly as it last shipped. A sticky left column holding the
heading, a one-line lead and a "Talk to us" pill; on the right an ordered list of
three cards (Audit, Build, Monthly), each with its number on a pixel badge drawn
from a ramp around the card's tint (`blush`, `lavender`, `ice`). Cards entered
from the right, staggered by scroll position, and re-armed when they left below
the viewport so scrolling back down replayed the entrance. Below 768px the cards
stuck under the header and stacked.

## Restoring it

1. `git mv docs/archive/how-it-works/HowItWorks.astro src/components/sections/`
2. The file's one import is `../DitherCanvas.astro`, which resolves again once it
   is back in `sections/`.
3. In `src/pages/index.astro`, import it and put `<HowItWorks />` back where
   `<Research />` now sits (between the grid bands after `<WhatWeDo />`), or
   beside it.
4. Restore the `/#how-it-works` link in `Header.astro` (both the bar and the
   menu list) and in `Footer.astro`. They were pointed at `/#research`.

`docs/before-launch.md` still mentions the intake call living in *How it works*;
that note is only true again once the section is back.
