# Archived hero — dithered landscape, no laptop

The hero as it stood before the pixel laptop was added: the dithered ridge landscape as
a full-bleed backdrop, the rotating headline over it, and nothing else in the frame.

## To restore

```bash
cp docs/archive/hero-landscape/Hero.astro src/components/sections/Hero.astro
```

`DitherCanvas.astro` is kept here too, but the live one is a superset — it only gained an
extra lime stop in the ink ramp. Copy it back only if you want the older, less green
mountain:

```bash
cp docs/archive/hero-landscape/DitherCanvas.astro src/components/DitherCanvas.astro
```

The laptop lives in `src/components/PixelLaptop.astro` and is imported by the current
hero. Restoring the file above leaves it orphaned, which is harmless.
