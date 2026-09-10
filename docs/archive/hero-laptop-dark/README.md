# Archived hero — pixel laptop, dark chat screen

The hero with a pixel laptop rising out of the bottom edge of the section, showing a
dark-mode chat assistant answering the query in the headline. Green dithered mountains
behind it.

Notable bits, in case they are wanted again:

- The laptop is **in flow with a negative bottom margin**, and the frame is a flex column
  so slack from `min-height` goes to the laptop's auto top margin. That is what keeps the
  screen flush to the bottom edge at every width while never letting the gap above it
  collapse — an absolutely positioned version gave 6px of clearance at 320px.
- The screen types in monospace with `steps()` set from script to each line's exact
  character count.
- No assistant's name, wordmark or logo appears anywhere in it.

## To restore

```bash
cp docs/archive/hero-laptop-dark/Hero.astro       src/components/sections/Hero.astro
cp docs/archive/hero-laptop-dark/PixelLaptop.astro src/components/PixelLaptop.astro
```

`DitherCanvas.astro` is kept here at the state it had then — green ramp, no clouds. The
live one has since gained drifting pixel clouds; copy this one back only if you want the
still sky.

## Also here

- `DitherCanvas-mountains-clouds.astro` — the green mountain ridge *with* drifting
  clouds, i.e. the last version before the background became pure cloudscape.
- `PixelPhone.astro` — the phone-only device, before it became a
  breakpoint-driven phone / tablet / laptop shell.
