/**
 * Matches founder portraits to each other.
 *
 * The source headshots are cut out against transparency but framed differently
 * — one is a tight head-and-shoulders crop, the other a three-quarter shot —
 * so dropping them side by side puts one head half again the size of the other
 * and at a different height. This finds the head in each and rewrites both onto
 * a common square frame with the head at the same size and the same position.
 *
 * The head is found from the alpha mask alone, not from the pixels: walking
 * down from the crown, the mask widens through the skull, narrows at the neck,
 * then jumps at the shoulders. The head is the first peak. That is why the
 * search stops once the mask has fallen well below the running maximum — a wide
 * pair of shoulders is wider than any head, and without the stop it wins.
 *
 * THE FRAME HEIGHT IS CAPPED BY THE TIGHTEST SOURCE. Every headshot has a
 * different amount of image below the chin, and once scaled to a common head
 * size, whichever has the least decides how tall the frame can be: any taller
 * and that subject's shoulders end mid-frame, leaving a hard horizontal cut
 * floating above the floor. The ceiling is
 *
 *   HEADROOM + min over sources of (srcHeight - headTop) * scale
 *
 * FRAME_H is set rather than derived, because the ceiling moves whenever a
 * source is replaced and the page's proportions should not move with it. The
 * script checks the chosen height against the ceiling and refuses to write if
 * it does not fit, naming the source that is too tightly cropped.
 *
 * `Portrait.astro` has to carry the same ratio in its `aspect-ratio`, or the
 * frame will letterbox the result.
 *
 * Run with `node scripts/normalize-portraits.mjs`. Sources are read from
 * `src/assets/portraits-source/` and the results overwrite the two portraits
 * in `src/assets/`.
 *
 * NOTE: `astro dev` caches optimised images per source path in memory. If you
 * re-run this against a running dev server, the portraits will keep serving the
 * old bytes until the server is restarted.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SRC = `${ROOT}src/assets/portraits-source/`;
const OUT = `${ROOT}src/assets/`;

const FRAME_W = 800; // output width, in pixels
const FRAME_H = 690; // output height — must match Portrait.astro's aspect-ratio
const HEAD_W = 300; // target head width, in output pixels
const HEADROOM = 78; // field above the top of the head, in output pixels
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

const PAIRS = [
  ['bryce.png', 'portrait-bryce.png'],
  ['blaid.png', 'portrait-blaid.png'],
];

/** Alpha-mask geometry: where the head is, how wide, and where its centre is. */
async function measure(file) {
  const { data, info } = await sharp(SRC + file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  const span = (y) => {
    let lo = -1;
    let hi = -1;
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > 32) {
        if (lo < 0) lo = x;
        hi = x;
      }
    }
    return lo < 0 ? null : { lo, hi, w: hi - lo + 1 };
  };

  let top = 0;
  while (top < H && !span(top)) top++;

  const rows = [];
  for (let y = top; y < H; y++) rows.push(span(y));

  let peakI = 0;
  for (let i = 0; i < rows.length; i++) {
    const w = rows[i] ? rows[i].w : 0;
    if (w >= rows[peakI].w) peakI = i;
    else if (w < rows[peakI].w * 0.72) break; // past the head
  }

  const peak = rows[peakI];
  return { W, H, headTop: top, headW: peak.w, headCx: (peak.lo + peak.hi) / 2 };
}

// Measure everything first: the frame height depends on all of the sources, not
// just the one being written.
const measured = [];
for (const [file, out] of PAIRS) {
  const m = await measure(file);
  m.scale = HEAD_W / m.headW;
  // How much image this source has below the top of the head, once scaled.
  m.below = (m.H - m.headTop) * m.scale;
  measured.push({ file, out, m });
}

const ceiling = Math.round(
  HEADROOM + Math.min(...measured.map(({ m }) => m.below))
);
if (FRAME_H > ceiling) {
  const tightest = measured.reduce((a, b) => (a.m.below < b.m.below ? a : b));
  throw new Error(
    `FRAME_H is ${FRAME_H} but ${tightest.file} only reaches ${ceiling}. ` +
      `Its shoulders would end mid-frame. Lower FRAME_H to ${ceiling} (and ` +
      `Portrait.astro's aspect-ratio with it), raise HEAD_W, or use a less ` +
      `tightly cropped source.`
  );
}
console.log(
  `frame ${FRAME_W} x ${FRAME_H}  (aspect-ratio: ${FRAME_W} / ${FRAME_H})` +
    `  — ceiling ${ceiling}, ${ceiling - FRAME_H}px of slack`
);

for (const { file, out, m } of measured) {
  const s = m.scale;
  const sw = Math.round(m.W * s);
  const sh = Math.round(m.H * s);

  // The output frame, expressed in the scaled image's own coordinates.
  const left = Math.round(m.headCx * s - FRAME_W / 2);
  const top = Math.round(m.headTop * s - HEADROOM);

  // extract() cannot read outside the image, so pad whichever sides fall short.
  const pad = {
    left: Math.max(0, -left),
    top: Math.max(0, -top),
    right: Math.max(0, left + FRAME_W - sw),
    bottom: Math.max(0, top + FRAME_H - sh),
  };

  // Three passes, with buffers between them: sharp fixes the order of resize,
  // extend and extract inside a single pipeline, so chaining all three does not
  // mean what it reads like.
  const scaled = await sharp(SRC + file)
    .resize(sw, sh, { kernel: 'lanczos3' })
    .png()
    .toBuffer();

  const padded = await sharp(scaled)
    .extend({ ...pad, background: CLEAR })
    .png()
    .toBuffer();

  await sharp(padded)
    .extract({
      left: left + pad.left,
      top: top + pad.top,
      width: FRAME_W,
      height: FRAME_H,
    })
    .png({ compressionLevel: 9 })
    .toFile(OUT + out);

  console.log(
    `${file} -> ${out}  head ${m.headW}px @ y${m.headTop}  scale ${s.toFixed(3)}`
  );
}
