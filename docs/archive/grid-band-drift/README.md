# Archived: grid band accent-strip drift

Shelved 2026-09-09. The strips in `GridBand.astro` slid a little as their band
crossed the viewport. It worked; it was pulled because the page already carries a
lot of motion — a drifting hero, two drifting panels, fifteen drifting strips, a
stepping carousel and two rotating words — and this was the easiest of those to
give up.

Kept here because nothing about it was wrong, and it may be worth restoring if
some of the other motion comes out.

## What it did

Each block slid `--drift` either side of its cell across the whole time its band
was on screen. The two blocks in a band ran opposite directions so they passed
each other rather than sliding together.

`--drift` was 7px on mobile, 10px at tablet, 14px on desktop, set alongside
`--cols` and `--blk-h` in the same three rules.

It was a scroll-driven animation, not a scroll listener: `animation-timeline:
view()` runs on the compositor and costs nothing per frame, where updating
fifteen blocks from a `scroll` handler would be main-thread work on every scroll
event — and this page already has eighteen canvases competing for that thread.

## Restoring it

1. Put this back in `GridBand.astro`'s `<style>`, above
   `.band__block[data-edge='top']`:

```css
  /**
   * The strips slide a little as the band crosses the viewport, alternating
   * direction so a band's two blocks pass each other rather than sliding
   * together.
   *
   * A scroll-driven animation rather than a scroll listener: it runs on the
   * compositor and costs nothing per frame, where updating fifteen blocks from
   * a `scroll` handler would be main-thread work on every scroll event.
   *
   * `@supports` guarded, because where the timeline is unsupported the fallback
   * is simply that the strips do not move — which is the current design, not a
   * broken one. Nothing else depends on it.
   */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .band__block {
        animation-name: bandDriftA;
        animation-duration: auto;
        animation-timing-function: linear;
        animation-fill-mode: both;
        animation-timeline: view();
        /* The whole time the band is on screen, entering to leaving. */
        animation-range: entry 0% exit 100%;
      }

      .band__block[data-drift='b'] {
        animation-name: bandDriftB;
      }
    }
  }

  @keyframes bandDriftA {
    from {
      transform: translateX(calc(var(--drift) * -1));
    }
    to {
      transform: translateX(var(--drift));
    }
  }

  @keyframes bandDriftB {
    from {
      transform: translateX(var(--drift));
    }
    to {
      transform: translateX(calc(var(--drift) * -1));
    }
  }
```

2. Add `--drift` to the three `.band` rules: `7px` in the base rule, `10px` in
   the `48rem` block, `14px` in the `62.5em` block.

3. Add the direction attribute to the block markup, which needs the map index:

```astro
blocks.map((b, i) => {
  ...
  <span
    class="band__block"
    data-tone={b.tone}
    data-edge={b.edge || 'top'}
    data-drift={i % 2 ? 'b' : 'a'}
  >
```

## The one thing to fix if it comes back

A drifting strip can never paint outside the rails — the band is exactly
rail-to-rail and clips with `overflow: hidden`. But a strip in the **first or last
column** drifting toward that edge is clipped rather than moved, so it appears to
lose width instead of sliding.

Two blocks start at column 1: the band above `Offer`, and the last band. If this
is restored, either keep column 1 and the last column free of blocks, or force
edge blocks to drift inward — give a first-column block `data-drift="b"` so it
starts at `+drift` and travels in, rather than starting clipped.

## Verification at the time

Chrome: a real `ViewTimeline` attached to each block, `playState` running, range
computing to `entry / exit`, keyframes resolving to -7/+7, -10/+10 and -14/+14 at
the three breakpoints, every band's pair opposed.

The movement itself was never observed. `timeline.currentTime` reads `null` in
both automation browsers, because view timelines advance during the rendering
steps and a hidden document suspends those — the same blind spot that hides
requestAnimationFrame and IntersectionObserver there.
