import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const payload = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(payload));
  return Buffer.concat([len, payload, crc]);
}

function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[(width * 4 + 1) * y] = 0;
    for (let x = 0; x < width; x += 1) {
      const s = (y * width + x) * 4;
      const d = (width * 4 + 1) * y + 1 + x * 4;
      raw[d] = rgba[s];
      raw[d + 1] = rgba[s + 1];
      raw[d + 2] = rgba[s + 2];
      raw[d + 3] = rgba[s + 3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

class Pix {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.data = new Uint8Array(w * h * 4);
  }
  hex(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  p(x, y, hex, a = 255) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h || !hex) return;
    const [r, g, b] = this.hex(hex);
    const i = (y * this.w + x) * 4;
    this.data[i] = r;
    this.data[i + 1] = g;
    this.data[i + 2] = b;
    this.data[i + 3] = a;
  }
  fill(x, y, w, h, hex, a = 255) {
    for (let yy = y; yy < y + h; yy += 1) {
      for (let xx = x; xx < x + w; xx += 1) this.p(xx, yy, hex, a);
    }
  }
  rect(x, y, w, h, hex) {
    for (let xx = x; xx < x + w; xx += 1) {
      this.p(xx, y, hex);
      this.p(xx, y + h - 1, hex);
    }
    for (let yy = y; yy < y + h; yy += 1) {
      this.p(x, yy, hex);
      this.p(x + w - 1, yy, hex);
    }
  }
  stamp(sx, sy, map, colors) {
    map.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch !== "." && colors[ch]) this.p(sx + x, sy + y, colors[ch]);
      });
    });
  }
}

const C = {
  leather: "#5c3a24",
  leatherD: "#3a2416",
  bronze: "#c4a36a",
  copper: "#8a5a2b",
  charcoal: "#2b2622",
  stone: "#7a7264",
  stoneL: "#b4aa96",
  beige: "#cbb89a",
  gas: "#e6c36a",
  black: "#14110e",
  coat: "#4a2f1c",
  steel: "#6a6258",
  brick: "#a05a42",
  brickD: "#6b3a2a",
  roof: "#3a2a20",
  fog: "#8a93a0",
  green: "#35503a",
};

function save(rel, pix) {
  const path = join(root, "public", rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, encodePNG(pix.w, pix.h, pix.data));
}

function block(pix, x, y, base, light, dark, accent) {
  pix.fill(x, y, 18, 18, base);
  pix.rect(x, y, 18, 18, dark);
  pix.fill(x + 1, y + 1, 16, 3, light);
  if (accent) pix.fill(x + 1, y + 1, 16, 1, accent);
  pix.p(x + 4, y + 7, dark);
  pix.p(x + 13, y + 7, dark);
  pix.p(x + 4, y + 13, dark);
  pix.p(x + 13, y + 13, dark);
}

function makeTileset() {
  const pix = new Pix(16 * 18, 4 * 18);
  const put = (index, draw) => draw((index % 16) * 18, Math.floor(index / 16) * 18);
  put(1, (x, y) => block(pix, x, y, C.brick, "#8a5340", C.brickD, C.copper));
  put(2, (x, y) => block(pix, x, y, C.brick, C.beige, C.brickD, C.gas));
  put(3, (x, y) => block(pix, x, y, C.stone, C.stoneL, C.charcoal, C.bronze));
  put(4, (x, y) => block(pix, x, y, C.stone, C.bronze, C.charcoal, C.gas));
  put(5, (x, y) => block(pix, x, y, "#5a5348", "#8d8476", "#2c2822", C.bronze));
  put(6, (x, y) => {
    pix.fill(x, y + 4, 18, 14, C.roof);
    pix.fill(x, y + 2, 18, 3, C.copper);
    pix.rect(x, y + 4, 18, 14, C.black);
  });
  put(7, (x, y) => pix.fill(x, y + 6, 18, 6, C.steel) || pix.rect(x, y + 6, 18, 6, C.charcoal));
  put(8, (x, y) => pix.fill(x + 6, y, 6, 18, C.steel) || pix.rect(x + 6, y, 6, 18, C.charcoal));
  put(9, (x, y) => {
    pix.fill(x + 2, y + 3, 14, 13, C.leather);
    pix.rect(x + 2, y + 3, 14, 13, C.leatherD);
    pix.fill(x + 3, y + 8, 12, 1, C.leatherD);
  });
  put(10, (x, y) => {
    pix.fill(x + 5, y + 4, 8, 12, C.copper);
    pix.rect(x + 5, y + 4, 8, 12, C.leatherD);
    pix.fill(x + 6, y + 6, 6, 2, C.bronze);
  });
  put(11, (x, y) => {
    pix.fill(x + 8, y + 2, 2, 10, C.steel);
    pix.fill(x + 6, y + 1, 6, 5, C.gas);
    pix.p(x + 8, y + 2, C.copper);
  });
  put(12, (x, y) => {
    pix.fill(x + 3, y + 2, 12, 14, C.beige);
    pix.rect(x + 3, y + 2, 12, 14, C.copper);
    pix.fill(x + 5, y + 4, 8, 2, C.brick);
    pix.fill(x + 5, y + 8, 8, 1, C.charcoal);
  });
  put(13, (x, y) => {
    pix.fill(x + 4, y + 1, 10, 16, C.leatherD);
    pix.rect(x + 4, y + 1, 10, 16, C.bronze);
    pix.fill(x + 11, y + 9, 2, 2, C.gas);
  });
  put(14, (x, y) => {
    pix.fill(x + 3, y + 3, 12, 12, C.charcoal);
    pix.rect(x + 3, y + 3, 12, 12, C.bronze);
    pix.fill(x + 5, y + 5, 8, 8, C.gas, 90);
  });
  put(15, (x, y) => {
    pix.fill(x + 1, y + 8, 16, 8, C.leather);
    pix.fill(x + 2, y + 4, 14, 5, C.beige);
    pix.rect(x + 1, y + 4, 16, 12, C.leatherD);
  });
  put(16, (x, y) => block(pix, x, y, "#4a5a48", "#7a8a70", "#243028", C.green));
  put(17, (x, y) => {
    pix.fill(x + 8, y + 8, 2, 10, C.leatherD);
    pix.fill(x + 4, y + 2, 10, 9, C.green);
  });
  put(18, (x, y) => {
    pix.fill(x, y + 10, 18, 2, C.steel);
    pix.fill(x + 2, y + 6, 2, 6, C.steel);
    pix.fill(x + 8, y + 6, 2, 6, C.steel);
    pix.fill(x + 14, y + 6, 2, 6, C.steel);
  });
  put(19, (x, y) => {
    pix.fill(x + 6, y + 8, 6, 8, C.steel);
    pix.fill(x + 7, y + 2, 4, 8, C.beige, 140);
  });
  put(20, (x, y) => {
    pix.fill(x + 5, y + 4, 8, 6, C.black);
    pix.p(x + 12, y + 6, C.bronze);
    pix.fill(x + 4, y + 10, 10, 2, C.black);
  });
  put(21, (x, y) => {
    pix.fill(x + 2, y + 10, 14, 3, C.leather);
    pix.fill(x + 3, y + 8, 12, 2, C.leatherD);
  });
  put(22, (x, y) => {
    pix.fill(x + 8, y + 2, 2, 14, C.steel);
    pix.fill(x + 4, y + 3, 8, 6, "#6b1f1f");
  });
  put(23, (x, y) => {
    pix.fill(x + 4, y + 8, 10, 8, C.stone);
    pix.fill(x + 7, y + 2, 4, 8, C.bronze);
  });
  put(24, (x, y) => {
    pix.fill(x + 3, y + 5, 12, 11, C.steel);
    pix.rect(x + 3, y + 5, 12, 11, C.charcoal);
    pix.fill(x + 5, y + 7, 3, 3, C.gas);
    pix.fill(x + 10, y + 7, 3, 3, C.copper);
  });
  put(25, (x, y) => {
    pix.fill(x, y + 11, 18, 5, C.leather);
    pix.fill(x, y + 11, 18, 1, C.bronze);
  });
  put(26, (x, y) => {
    pix.fill(x, y, 18, 18, "#2a221c");
    pix.rect(x, y, 18, 18, "#1a1410");
    pix.fill(x + 2, y + 2, 14, 1, "#3d3228");
  });
  put(27, (x, y) => {
    pix.fill(x + 6, y + 2, 6, 14, C.brickD);
    pix.fill(x + 5, y, 8, 4, C.stone);
    pix.fill(x + 7, y + 1, 2, 2, C.fog, 120);
  });
  return pix;
}

function makePlayer() {
  const frames = 12;
  const pix = new Pix(32 * frames, 40);
  const colors = {
    o: "#1a1410",
    c: "#8a5a2b",
    d: "#5c3a24",
    m: "#2b2118",
    e: C.bronze,
    a: "#d4c4a0",
    p: "#e6d2b0",
    g: C.gas,
    r: "#5a1a1a",
  };
  const body = [
    "..........oooo..........",
    ".........ommmmo.........",
    "........omgeeemo........",
    "........omgeeemo........",
    ".........ommmmo.........",
    "........occcccco........",
    ".......occcccccco.......",
    "......occccaacccco......",
    "......occccaacccco......",
    ".......occccccco........",
    ".......odcc..ccdo.......",
    ".......odcc..ccdo.......",
    ".......oddd..dddo.......",
  ];
  const draw = (ox, bob, arm, hurt, shoot) => {
    pix.stamp(ox + 4, 10 + bob, body, colors);
    if (arm) pix.fill(ox + 22, 20, 6, 3, C.steel);
    if (shoot) pix.fill(ox + 24, 18, 5, 2, C.bronze);
    if (hurt) pix.fill(ox + 12, 14, 8, 4, "#7a1f1f", 150);
    pix.p(ox + 20, 16, C.gas);
  };
  draw(0, 0, false, false, false);
  draw(32, 1, false, false, false);
  draw(64, 0, false, false, false);
  draw(96, 1, true, false, false);
  draw(128, 0, false, false, false);
  draw(160, 1, true, false, false);
  draw(192, -1, false, false, false);
  draw(224, 1, false, false, false);
  draw(256, 0, false, false, false);
  draw(288, 0, true, false, false);
  draw(320, 0, false, false, true);
  draw(352, 0, false, true, false);
  return pix;
}

function makeNpc() {
  const pix = new Pix(24 * 8, 32);
  const palettes = [
    { body: "#4a453c", head: "#cbb89a", accent: "#8a5a2b" },
    { body: "#6b3a2a", head: "#cbb89a", accent: "#c4a36a" },
    { body: "#2b2622", head: "#cbb89a", accent: "#6b1f1f" },
    { body: "#35503a", head: "#e6d2b0", accent: "#c4a36a" },
    { body: "#3a2416", head: "#cbb89a", accent: "#5c3a24" },
    { body: "#cbb89a", head: "#e6d2b0", accent: "#c4a36a" },
    { body: "#4a453c", head: "#cbb89a", accent: "#6a6258" },
    { body: "#2b2118", head: "#cbb89a", accent: "#14110e" },
  ];
  palettes.forEach((pal, i) => {
    const x = i * 24;
    pix.fill(x + 8, 4, 8, 7, pal.head);
    pix.fill(x + 6, 11, 12, 12, pal.body);
    pix.fill(x + 7, 23, 4, 7, pal.accent);
    pix.fill(x + 13, 23, 4, 7, pal.accent);
    if (i === 2) pix.fill(x + 8, 6, 8, 2, "#6b1f1f");
    if (i === 5) pix.fill(x + 5, 12, 14, 4, pal.accent);
  });
  return pix;
}

function makeLina() {
  const pix = new Pix(40, 28);
  for (let f = 0; f < 2; f += 1) {
    const x = f * 20;
    pix.fill(x + 7, 4 + f, 6, 6, "#e6d2b0");
    pix.fill(x + 6, 10 + f, 8, 8, "#6b3a2a");
    pix.fill(x + 6, 18 + f, 3, 6, "#3a2416");
    pix.fill(x + 11, 18 + (1 - f), 3, 6, "#3a2416");
  }
  return pix;
}

function makeCarriage() {
  const pix = new Pix(48, 28);
  pix.fill(6, 8, 36, 12, "#3a2416");
  pix.rect(6, 8, 36, 12, "#1a1410");
  pix.fill(28, 4, 12, 8, "#5c3a24");
  pix.fill(2, 12, 8, 6, "#6a6258");
  pix.fill(10, 20, 6, 6, "#2b2622");
  pix.fill(30, 20, 6, 6, "#2b2622");
  pix.fill(16, 10, 6, 4, "#e6c36a", 160);
  return pix;
}

function makeBg(kind) {
  const pix = new Pix(320, 180);
  pix.fill(0, 0, 320, 180, kind === "far" ? "#4a3a2c" : kind === "mid" ? "#3d2f24" : "#32261c");
  if (kind === "far") {
    pix.fill(0, 0, 320, 70, "#6a5340");
    for (let i = 0; i < 14; i += 1) {
      const x = i * 24;
      const h = 30 + (i % 5) * 12;
      pix.fill(x + 4, 90 - h, 18, h, "#1a1410");
      pix.fill(x + 8, 90 - h - 16, 6, 16, "#2b2118");
      if (i % 2 === 0) pix.fill(x + 9, 90 - h + 8, 3, 3, C.gas, 160);
    }
    pix.fill(0, 90, 320, 90, "#2b241c");
  }
  if (kind === "mid") {
    for (let i = 0; i < 8; i += 1) {
      pix.fill(i * 42 + 6, 40, 28, 140, "#3a2a20");
      pix.rect(i * 42 + 6, 40, 28, 140, "#1a1410");
      pix.fill(i * 42 + 10, 50, 6, 7, C.gas, 120);
      pix.fill(i * 42 + 20, 68, 6, 7, C.gas, 80);
    }
  }
  if (kind === "near") {
    pix.fill(0, 140, 320, 40, "#2b2118");
    for (let i = 0; i < 16; i += 1) pix.fill(i * 20, 128, 8, 16, "#3a2a20");
    pix.fill(0, 168, 320, 2, C.bronze, 100);
  }
  return pix;
}

function makeSteam() {
  const pix = new Pix(8, 8);
  pix.fill(2, 2, 4, 4, C.beige, 140);
  pix.p(3, 1, C.beige, 80);
  pix.p(4, 6, C.beige, 80);
  return pix;
}

function makeCrow() {
  const pix = new Pix(16, 16);
  pix.fill(3, 7, 10, 5, C.black);
  pix.fill(8, 4, 5, 5, C.black);
  pix.fill(12, 6, 3, 2, C.copper);
  pix.p(10, 6, C.bronze);
  return pix;
}

save("assets/tilesets/tileset.png", makeTileset());
save("assets/characters/lina.png", makeLina());
save("assets/characters/carriage.png", makeCarriage());
save("assets/ui/crow.png", makeCrow());
console.log("tileset e props auxiliares gerados — personagens e rua pintada vêm de scripts/process-painted-art.py");
