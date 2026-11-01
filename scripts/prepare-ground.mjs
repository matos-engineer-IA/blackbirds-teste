import fs from 'node:fs';
import { PNG } from 'pngjs';

// Packaging a generated source, not inventing animation or approving artwork.
// Nearest-neighbor crop in source pixels; mirror makes exact repeat boundaries.
const input = PNG.sync.read(fs.readFileSync('art/source/cobble-review-v2-source.png'));
const strip = new PNG({ width: 768, height: 42 });
if (input.width !== 1536 || input.height !== 1024) throw new Error('Dimensões inesperadas da fonte do piso.');
for (let y = 0; y < 42; y++) for (let x = 0; x < 768; x++) {
  const sourceX = (x < 384 ? x : 767 - x) * 4;
  const sourceY = 116 + y * 4;
  const src = (sourceY * input.width + sourceX) * 4;
  const dest = (y * strip.width + x) * 4;
  strip.data.set(input.data.subarray(src, src + 4), dest);
}
fs.writeFileSync('public/assets/tilesets/cobble-review-v2.png', PNG.sync.write(strip));
console.log('Piso REVIEW: 768×42, fonte preservada, emenda horizontal espelhada.');
