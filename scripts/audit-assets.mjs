import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';

const characters = {
  'nero-sheet': { frame: [120, 192], status: 'REVIEW', scale: 0.5, feetBoundary: 192, source: 'art/source/nero-sheet.jpg', note: '11 poses; vários frames tocam limites laterais. Assimetria e ciclos exigem revisão.' },
  winsth: { frame: [148, 236], status: 'BLOCKOUT', scale: 0.5, feetBoundary: 235, source: 'scripts/make-gameplay-art.py', note: 'Stand-in procedimental; marreta cortada nos limites; não é animação final.' },
  'npc-ilda': { frame: [52, 88], status: 'REVIEW', scale: 0.8, feetBoundary: 88, source: 'art/source/npc-ilda.jpg', note: 'Frame 1 é só translação vertical, removido do playback.' },
  'npc-worker': { frame: [52, 88], status: 'REVIEW', scale: 0.8, feetBoundary: 88, source: 'art/source/npc-worker.jpg', note: 'Frame 1 é só translação vertical, removido do playback.' },
  'npc-mechanic': { frame: [52, 88], status: 'REVIEW', scale: 0.8, feetBoundary: 88, source: 'art/source/npc-mechanic.jpg', note: 'Frame 1 é só translação vertical, removido do playback.' },
  'npc-child': { frame: [40, 64], status: 'REVIEW', scale: 0.75, feetBoundary: 64, source: 'art/source/npc-child.jpg', note: 'Pose de referência; falta caminhada articulada.' },
  lina: { frame: [20, 28], status: 'BLOCKOUT', source: 'scripts/generate-assets.mjs', note: 'Alias legado; nome, idade e design final pendentes.' },
  'cobble-review-v2': { status: 'REVIEW', source: 'art/source/cobble-review-v2-source.png + scripts/prepare-ground.mjs', note: 'Gerado com imagegen; prompt preservado. 768×42 com emenda espelhada, sem aprovação artística humana.' },
};
async function list(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...await list(p)); else if (p.endsWith('.png')) out.push(p);
  }
  return out.sort();
}
const assets = [];
for (const file of await list('public/assets')) {
  const bytes = await fs.readFile(file);
  const png = PNG.sync.read(bytes);
  const name = file.split('/').pop().replace('.png', '');
  const definition = characters[name];
  const [w, h] = definition?.frame || [png.width, png.height];
  if (png.width % w || png.height % h) throw new Error(`Dimensões inválidas: ${file}`);
  const frames = [];
  for (let fy = 0; fy < png.height; fy += h) for (let fx = 0; fx < png.width; fx += w) {
    let minX = w, minY = h, maxX = -1, maxY = -1, translucent = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const a = png.data[((fy + y) * png.width + fx + x) * 4 + 3];
      if (a > 0 && a < 255) translucent++;
      if (a > (definition ? 128 : 0)) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
    }
    if (maxX < 0) throw new Error(`Frame vazio: ${file} ${fx},${fy}`);
    frames.push({ x: fx, y: fy, opaqueBounds: [minX, minY, maxX + 1, maxY + 1], translucentPixels: translucent, touchesSide: minX === 0 || maxX === w - 1 });
  }
  assets.push({
    id: file.replace('public/assets/', '').replace('.png', ''), path: file.replace('public/', ''),
    width: png.width, height: png.height, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'),
    status: definition?.status || (name === 'cobble-review-v2' ? 'REVIEW' : 'REVIEW'),
    source: definition?.source || 'Origem declarada em docs/ASSET_LICENSES.md; auditar por item antes de RELEASE_READY.',
    license: 'Conforme LICENSE e docs/ASSET_LICENSES.md; aprovação/proveniência externa não presumidas.',
    ...(definition || {}), frames,
  });
}
const manifest = { schemaVersion: 1, note: 'Inspeção técnica automatizada; não concede aprovação artística. Bounds opacos não medem altura anatômica.', assets };
await fs.writeFile('art/asset-audit.json', `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${assets.length} PNGs auditados; manifest em art/asset-audit.json. Arte permanece em revisão/blockout.`);
