/**
 * Sizes the dithered press drawing, and encodes it as a palette PNG.
 *
 * WHY THIS IS NOT JUST AN `<Image />`. The drawing arrived already dithered,
 * but it is a photograph with a dither applied rather than a genuinely
 * quantised one — 603,616 distinct colours in the source. That combination is
 * the worst case for a lossy codec: the dither is high-frequency noise, so
 * there is nothing for WebP to throw away cheaply, and it spends its bit budget
 * reproducing speckle. Measured on this file:
 *
 *            WebP q88     palette PNG     ratio
 *    680px      76 KB          28 KB      2.7x
 *    960px     124 KB          48 KB      2.6x
 *   1360px     196 KB          84 KB      2.3x
 *
 * Quantising to a real palette is both smaller and truer to the intent: the
 * flats come out flat, the way the reference's own object drawings are, instead
 * of carrying the photograph's leftover gradients under the dither.
 *
 * Astro's image service has no palette knob, so the variants are built here and
 * dropped in `public/`, where they are served untouched.
 *
 * Run with `node scripts/build-press-image.mjs` after replacing the source.
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SRC = `${ROOT}src/assets/sp_machine.png`;
const OUT = `${ROOT}public/press/`;

/**
 * The drawing is widest as a single full-width column just under the two-column
 * breakpoint — about 920 CSS px — so the top variant covers that at 2x.
 */
const WIDTHS = [480, 720, 960, 1440, 1920];

/**
 * The hover layer. Deliberately tiny: it is stretched back up to the press's
 * full size with `image-rendering: pixelated`, so the blocks come out roughly
 * eight times the size of the ones in the sharp image. Sizing it by hand rather
 * than reusing the smallest variant, because 480 is close enough to the
 * displayed width that the difference reads as a slight softening rather than
 * as a deliberate step down.
 */
const CHUNK = 200;

/** Few enough that the flats are flat; enough that the ink ramp survives. */
const COLOURS = 48;

await mkdir(OUT, { recursive: true });

const meta = await sharp(SRC).metadata();
console.log(`source ${meta.width} x ${meta.height}`);

for (const w of WIDTHS) {
  const out = `${OUT}press-${w}.png`;
  const info = await sharp(SRC)
    .resize(w, null, { kernel: 'lanczos3' })
    .png({ palette: true, colours: COLOURS, dither: 0.6, compressionLevel: 9, effort: 10 })
    .toFile(out);
  console.log(`press-${w}.png  ${info.width} x ${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

{
  const info = await sharp(SRC)
    .resize(CHUNK, null, { kernel: 'lanczos3' })
    .png({ palette: true, colours: 24, dither: 0, compressionLevel: 9, effort: 10 })
    .toFile(`${OUT}press-chunk.png`);
  console.log(`press-chunk.png  ${info.width} x ${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}

console.log(`\nintrinsic ratio ${meta.width} / ${meta.height}`);
