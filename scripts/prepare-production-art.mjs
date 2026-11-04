// Deterministic packaging only. Sources and prompts remain in art/source/production-v2.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';
const source = 'art/source/production-v2', output = 'public/assets';
const manifest = { status: 'REVIEW', tool: 'imagegen sources; deterministic nearest-neighbour packaging', assets: [] };
const read = name => PNG.sync.read(fs.readFileSync(`${source}/${name}.png`));
function write(file, png, meta = {}) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, PNG.sync.write(png, { filterType: 4 })); manifest.assets.push({ file, width: png.width, height: png.height, ...meta }); }
function components(png, min = 900) {
    const seen = new Uint8Array(png.width * png.height), out = [];
    for (let n = 0; n < seen.length; n++) {
        if (seen[n] || png.data[n * 4 + 3] < 160)
            continue;
        const queue = [n];
        seen[n] = 1;
        let x0 = png.width, y0 = png.height, x1 = 0, y1 = 0;
        for (let i = 0; i < queue.length; i++) {
            const v = queue[i], x = v % png.width, y = Math.floor(v / png.width);
            x0 = Math.min(x0, x);
            x1 = Math.max(x1, x);
            y0 = Math.min(y0, y);
            y1 = Math.max(y1, y);
            for (const k of [x > 0 ? v - 1 : -1, x < png.width - 1 ? v + 1 : -1, y > 0 ? v - png.width : -1, y < png.height - 1 ? v + png.width : -1])
                if (k >= 0 && !seen[k] && png.data[k * 4 + 3] >= 160) {
                    seen[k] = 1;
                    queue.push(k);
                }
        }
        if (queue.length >= min)
            out.push({ x0, y0, x1, y1, count: queue.length, mask: new Set(queue) });
    }
    return out;
}
function ordered(png, rows) { const parts = components(png); return parts.sort((a, b) => Math.floor((a.y0 + a.y1) / 2 / (png.height / rows)) - Math.floor((b.y0 + b.y1) / 2 / (png.height / rows)) || a.x0 - b.x0); }
function rect(x0, y0, x1, y1, hip, foot, scale) { return { x0, y0, x1, y1, hip, foot, scale }; }
function pack(file, frames, w, h, foot) {
    const dest = new PNG({ width: w * frames.length, height: h });
    frames.forEach((f, index) => {
        const { png, part } = f, scale = part.scale, hip = part.hip ?? (part.x0 + part.x1) / 2, feet = part.foot ?? part.y1;
        for (let dy = 0; dy < h; dy++)
            for (let dx = 0; dx < w; dx++) {
                const sx = Math.round((dx - w / 2) / scale + hip), sy = Math.round((dy - foot + 1) / scale + feet);
                if (sx < part.x0 || sx > part.x1 || sy < part.y0 || sy > part.y1)
                    continue;
                const si = (sy * png.width + sx) * 4, di = (dy * dest.width + index * w + dx) * 4;
                if (part.mask && !part.mask.has(sy * png.width + sx))
                    continue;
                if (png.data[si + 3] < 160)
                    continue;
                if (part.blackKey && Math.max(...png.data.subarray(si, si + 3)) < 19)
                    continue;
                // Quantisation is applied to derived pixels, never to original artwork.
                for (let c = 0; c < 3; c++)
                    dest.data[di + c] = Math.min(255, Math.round(png.data[si + c] / 8) * 8);
                dest.data[di + 3] = 255;
            }
    });
    write(`${output}/characters/${file}.png`, dest, { frame: { w, h, footY: foot }, frames: frames.map(f => ({ source: f.source, bounds: [f.part.x0, f.part.y0, f.part.x1, f.part.y1], scale: f.part.scale, foot: f.part.foot ?? f.part.y1, hip: f.part.hip ?? (f.part.x0 + f.part.x1) / 2 })) });
}
const old = jpeg.decode(fs.readFileSync('art/source/nero-sheet.jpg'), { useTArray: true });
const legacy = [rect(34, 48, 151, 260, 98, 254, .85), rect(171, 48, 287, 260, 230, 254, .85), rect(278, 284, 465, 490, 384, 490, .85), rect(510, 323, 696, 515, 612, 510, .85), rect(13, 526, 254, 737, 133, 728, .85), rect(265, 526, 515, 737, 390, 728, .85), rect(516, 526, 761, 737, 587, 728, .85), rect(764, 526, 1014, 737, 835, 728, .85)].map(part => ({ png: old, part: { ...part, blackKey: true }, source: 'art/source/nero-sheet.jpg' }));
// Measured opaque boot boundary after removal of the JPEG's dark matte.
legacy.forEach((frame, i) => frame.part.foot = [254, 254, 483, 506, 723, 721, 726, 724][i]);
const walk = read('nero-walk'), hips = [282, 778, 1292, 284, 786, 1302];
const walkFrames = ordered(walk, 2).map((part, i) => ({ png: walk, part: { ...part, hip: hips[i], scale: .365 }, source: `${source}/nero-walk.png` }));
if (walkFrames.length !== 6)
    throw Error(`Nero walk: expected six components, got ${walkFrames.length}`);
pack('nero-production-v2', [...legacy.slice(0, 2), ...walkFrames, ...legacy.slice(2)], 320, 224, 208);
const boss = read('winsth-poses-fixed'), bh = [210, 650, 1098, 1536, 215, 598, 1097, 1505], bf = [425, 425, 425, 423, 857, 857, 857, 858];
const bossFrames = ordered(boss, 2).map((part, i) => ({ png: boss, part: { ...part, hip: bh[i], foot: bf[i], scale: .5 }, source: `${source}/winsth-poses-fixed.png` }));
if (bossFrames.length !== 8)
    throw Error(`Winsth: expected eight components, got ${bossFrames.length}`);
const bw = read('winsth-walk'), bwParts = ordered(bw, 1);
if (bwParts.length !== 2)
    throw Error('Winsth walk components');
// Both poses have the same native body height, mapped to the 184 px body reference.
bwParts.forEach((part, i) => bossFrames[2 + i] = { png: bw, part: { ...part, hip: [398, 1044][i], scale: .30 }, source: `${source}/winsth-walk.png` });
pack('winsth-production-v2', bossFrames, 384, 288, 264);
const npc = read('npc-cycles'), parts = ordered(npc, 4);
if (parts.length !== 16)
    throw Error(`NPC expected16, got${parts.length}`);
['ilda', 'worker', 'mechanic', 'guard'].forEach((name, row) => pack(`npc-${name}-v2`, parts.slice(row * 4, row * 4 + 4).map((part, col) => ({ png: npc, part: { ...part, hip: col * 384 + 192, scale: .36 }, source: `${source}/npc-cycles.png` })), 96, 128, 112));
const daughter = read('daughter'), dp = ordered(daughter, 2);
if (dp.length !== 6)
    throw Error('Daughter components');
pack('daughter-v2', dp.map((part, i) => ({ png: daughter, part: { ...part, hip: [243, 757, 1247, 262, 772, 1270][i], scale: .18 }, source: `${source}/daughter.png` })), 96, 112, 104);
const vehicle = read('carriage'), vp = ordered(vehicle, 1)[0];
pack('carriage-v2', [{ png: vehicle, part: { ...vp, scale: .30 }, source: `${source}/carriage.png` }], 416, 256, 248);
// Panels retain native horizontal proportions. Each unique panel is placed once.
const panelBands = {
    'worker-street': [[0, 343], [350, 673], [680, 994]],
    'market-a': [[0, 358], [362, 665], [680, 983]],
    'market-b': [[0, 324], [340, 651], [670, 1008]],
    'avenue-a': [[0, 333], [344, 659], [674, 996]],
    'avenue-b': [[0, 339], [359, 663], [680, 1001]],
    'school-a': [[0, 334], [348, 665], [678, 1011]],
    'school-b': [[0, 330], [344, 662], [680, 995]],
};
for (const name of Object.keys(panelBands)) {
    const png = read(name);
    const bands = panelBands[name];
    for (let i = 0; i < 3; i++) {
        const [y0, y1] = bands[i], dest = new PNG({ width: png.width, height: y1 - y0 });
        for (let y = 0; y < dest.height; y++)
            for (let x = 0; x < dest.width; x++) {
                const si = ((y + y0) * png.width + x) * 4, di = (y * dest.width + x) * 4;
                if (png.data[si + 3] < 160)
                    continue;
                if (name === 'avenue-b' && Math.min(...png.data.subarray(si, si + 3)) > 230)
                    continue;
                for (let c = 0; c < 3; c++)
                    dest.data[di + c] = Math.min(255, Math.round(png.data[si + c] / 8) * 8);
                dest.data[di + 3] = 255;
            }
        write(`${output}/painted/${name}-${i}.png`, dest, { source: `${source}/${name}.png`, crop: [0, y0, png.width, y1] });
    }
}
// Working hinged door and pressure wheel are cut from the same street source.
for (const [name, bounds] of [['door-leaf', [109, 252, 169, 342]], ['pressure-wheel', [372, 581, 396, 605]]]) {
    const png = read('worker-street'), [x0, y0, x1, y1] = bounds, dest = new PNG({ width: x1 - x0, height: y1 - y0 });
    for (let y = 0; y < dest.height; y++)
        for (let x = 0; x < dest.width; x++) {
            const si = ((y + y0) * png.width + x + x0) * 4, di = (y * dest.width + x) * 4;
            png.data.copy(dest.data, di, si, si + 4);
        }
    write(`${output}/painted/${name}-v2.png`, dest, { source: `${source}/worker-street.png`, crop: bounds });
}
fs.writeFileSync('art/production-v2-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest.assets.map(a => `${a.file} ${a.width}x${a.height}`).join('\n'));
