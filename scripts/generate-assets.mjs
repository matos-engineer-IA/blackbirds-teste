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
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
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

  rect(x, y, w, h, hex, a = 255) {
    for (let xx = x; xx < x + w; xx += 1) {
      this.p(xx, y, hex, a);
      this.p(xx, y + h - 1, hex, a);
    }
    for (let yy = y; yy < y + h; yy += 1) {
      this.p(x, yy, hex, a);
      this.p(x + w - 1, yy, hex, a);
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
  void: "#000000",
  bg: "#070b14",
  shadow: "#1a0a24",
  cyan: "#2de2e6",
  cyanD: "#178a8e",
  mag: "#ff2d95",
  red: "#ff3355",
  lamp: "#ffb020",
  steel: "#5b7190",
  steelL: "#9bb3cc",
  steelD: "#243044",
  rust: "#8a4a32",
  rustL: "#c4724a",
  rustD: "#4a2418",
  nexus: "#3a2158",
  nexusL: "#6b3d91",
  skin: "#c9b6a0",
  suit: "#121826",
  visor: "#2de2e6",
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
  pix.fill(x + 1, y + 1, 16, 1, accent || light);
  pix.p(x + 3, y + 6, dark);
  pix.p(x + 14, y + 6, dark);
  pix.p(x + 3, y + 13, dark);
  pix.p(x + 14, y + 13, dark);
  pix.fill(x + 1, y + 16, 16, 1, dark);
}

function makeTileset() {
  const pix = new Pix(16 * 18, 4 * 18);
  const put = (index, draw) => {
    const x = (index % 16) * 18;
    const y = Math.floor(index / 16) * 18;
    draw(x, y);
  };

  put(1, (x, y) => block(pix, x, y, C.steel, C.steelL, C.steelD, C.cyanD));
  put(2, (x, y) => block(pix, x, y, C.steel, C.cyan, C.steelD, C.cyan));
  put(3, (x, y) => {
    block(pix, x, y, C.steelD, C.steel, C.bg, C.cyanD);
    pix.fill(x + 6, y + 4, 6, 10, C.steel);
  });
  put(4, (x, y) => block(pix, x, y, C.rust, C.rustL, C.rustD, C.lamp));
  put(5, (x, y) => block(pix, x, y, C.rustD, C.rust, C.bg, C.lamp));
  put(6, (x, y) => block(pix, x, y, C.nexus, C.nexusL, C.shadow, C.mag));
  put(7, (x, y) => block(pix, x, y, C.shadow, C.nexusL, C.bg, C.cyan));
  put(8, (x, y) => {
    pix.fill(x + 2, y + 3, 14, 13, C.rust);
    pix.rect(x + 2, y + 3, 14, 13, C.rustD);
    pix.fill(x + 3, y + 8, 12, 1, C.rustD);
    pix.fill(x + 8, y + 4, 1, 11, C.rustD);
    pix.rect(x + 4, y + 5, 3, 2, C.steelD);
  });
  put(9, (x, y) => {
    pix.fill(x + 5, y + 4, 8, 12, C.rustL);
    pix.rect(x + 5, y + 4, 8, 12, C.rustD);
    pix.fill(x + 6, y + 6, 6, 2, C.steelD);
    pix.fill(x + 6, y + 12, 6, 2, C.steelD);
  });
  put(10, (x, y) => {
    for (let i = 0; i < 3; i += 1) {
      const sx = x + 2 + i * 5;
      pix.fill(sx + 1, y + 8, 2, 8, C.steel);
      pix.p(sx + 1, y + 7, C.red);
      pix.p(sx + 2, y + 6, C.red);
    }
  });
  put(11, (x, y) => {
    pix.fill(x + 6, y, 6, 18, C.cyan, 90);
    pix.fill(x + 8, y, 2, 18, C.cyan, 180);
    for (let i = 0; i < 5; i += 1) pix.fill(x + 4, y + 2 + i * 4, 10, 1, C.mag, 160);
  });
  put(12, (x, y) => {
    pix.fill(x + 7, y + 4, 4, 12, C.steel);
    pix.fill(x + 5, y + 2, 8, 4, C.steelL);
    pix.fill(x + 6, y + 3, 6, 2, C.muted ?? C.steelD);
  });
  put(13, (x, y) => {
    pix.fill(x + 7, y + 4, 4, 12, C.steel);
    pix.fill(x + 5, y + 2, 8, 4, C.cyan);
    pix.fill(x + 6, y + 3, 6, 2, C.mag);
  });
  put(14, (x, y) => {
    pix.fill(x, y + 10, 18, 6, C.steel);
    pix.fill(x, y + 10, 18, 1, C.cyan);
    pix.rect(x, y + 10, 18, 6, C.steelD);
  });
  put(15, (x, y) => {
    pix.fill(x, y + 10, 18, 6, C.rust);
    pix.fill(x, y + 10, 18, 1, C.lamp);
  });
  put(16, (x, y) => {
    pix.fill(x + 3, y + 3, 12, 12, C.steelD);
    pix.rect(x + 3, y + 3, 12, 12, C.steelL);
    pix.fill(x + 5, y + 5, 8, 8, C.cyan, 140);
    pix.fill(x + 8, y + 3, 1, 12, C.steelL);
    pix.fill(x + 3, y + 8, 12, 1, C.steelL);
  });
  put(17, (x, y) => pix.fill(x, y + 7, 18, 4, C.steelL) || pix.rect(x, y + 7, 18, 4, C.steelD));
  put(18, (x, y) => pix.fill(x + 7, y, 4, 18, C.steelL) || pix.rect(x + 7, y, 4, 18, C.steelD));
  put(19, (x, y) => {
    pix.fill(x + 2, y + 4, 14, 12, C.steel);
    pix.rect(x + 2, y + 4, 14, 12, C.steelD);
    pix.fill(x + 4, y + 6, 4, 3, C.red);
    pix.fill(x + 10, y + 6, 4, 3, C.cyan);
    pix.fill(x + 4, y + 11, 10, 2, C.steelD);
  });
  put(20, (x, y) => {
    for (let i = 0; i < 6; i += 1) {
      pix.fill(x + i * 3, y, 3, 18, i % 2 ? C.lamp : C.steelD);
    }
  });
  put(21, (x, y) => {
    pix.fill(x + 2, y + 2, 14, 14, C.steelD);
    for (let i = 0; i < 4; i += 1) pix.fill(x + 4, y + 4 + i * 3, 10, 1, C.steel);
  });
  put(22, (x, y) => {
    pix.fill(x + 5, y + 5, 8, 8, C.cyan);
    pix.rect(x + 4, y + 4, 10, 10, C.mag);
    pix.fill(x + 8, y + 8, 2, 2, C.bg);
  });
  put(23, (x, y) => {
    pix.fill(x + 8, y + 3, 2, 8, C.steel);
    pix.fill(x + 6, y + 2, 6, 4, C.lamp);
    pix.p(x + 8, y + 3, C.red);
  });
  put(24, (x, y) => {
    pix.fill(x + 4, y + 1, 10, 16, C.steelD);
    pix.rect(x + 4, y + 1, 10, 16, C.cyan);
    pix.fill(x + 11, y + 8, 2, 2, C.mag);
  });
  put(26, (x, y) => {
    pix.fill(x, y, 18, 18, "#152033");
    pix.rect(x, y, 18, 18, "#0d1522");
    pix.fill(x + 2, y + 2, 14, 1, "#2a3b55");
  });
  return pix;
}

function makePlayer() {
  const frames = 12;
  const pix = new Pix(24 * frames, 24);
  const body = (ox, bob = 0, arms = 0, kick = 0, hurt = false, dash = false) => {
    const colors = {
      o: "#0b1020",
      1: "#1b2740",
      2: "#8aa0b8",
      3: C.visor,
      4: C.mag,
      5: "#e8d7c4",
      6: C.cyan,
      7: "#9bb4c8",
    };
    const map = [
      "......oooooo......",
      ".....o111111o.....",
      "....o11333311o....",
      "....o11333311o....",
      ".....o111111o.....",
      "....o11111111o....",
      "...o1411111141o...",
      "...o1111111111o...",
      "....o11111111o....",
      "....o11o..o11o....",
      "....o11o..o11o....",
      "....o77o..o77o....",
    ];
    pix.stamp(ox + 3, 5 + bob, map, colors);
    if (hurt) pix.fill(ox + 8, 8, 8, 4, C.red, 180);
    if (dash) pix.fill(ox + 1, 9, 7, 8, C.cyan, 110);
    if (arms) pix.fill(ox + (arms > 0 ? 17 : 2), 12, 5, 2, C.cyan);
    if (kick) pix.fill(ox + 15, 18, 3, 2, "#9bb4c8");
  };
  body(0 * 24, 0);
  body(1 * 24, 1);
  body(2 * 24, 0, 0, 1);
  body(3 * 24, 1, 0, 0);
  body(4 * 24, 0, 0, 1);
  body(5 * 24, 1, 0, 0);
  body(6 * 24, -1, 0, 1);
  body(7 * 24, 1, 0, 1);
  body(8 * 24, 0, 0, 0, true);
  body(9 * 24, 0, 1, 0);
  body(10 * 24, 0, 0, 0, false, true);
  body(11 * 24, 0);
  return pix;
}

function makeDrone() {
  const pix = new Pix(18 * 4, 18);
  for (let f = 0; f < 4; f += 1) {
    const x = f * 18;
    const bob = f % 2;
    pix.fill(x + 4, 5 + bob, 10, 8, C.steel);
    pix.rect(x + 4, 5 + bob, 10, 8, C.steelD);
    pix.fill(x + 7, 7 + bob, 4, 4, f > 1 ? C.mag : C.cyan);
    pix.fill(x + 2, 8 + bob, 2, 2, C.steelL);
    pix.fill(x + 14, 8 + bob, 2, 2, C.steelL);
    pix.fill(x + 6, 13 + bob, 6, 1, C.cyan, 120);
  }
  return pix;
}

function makeSentinel() {
  const pix = new Pix(26 * 6, 24);
  for (let f = 0; f < 6; f += 1) {
    const x = f * 26;
    const glow = f >= 2 ? (f >= 4 ? C.red : C.lamp) : C.cyanD;
    pix.fill(x + 6, 6, 14, 14, C.steel);
    pix.rect(x + 6, 6, 14, 14, C.steelD);
    pix.fill(x + 9, 9, 8, 5, glow);
    pix.fill(x + 8, 16, 10, 3, C.steelD);
    pix.fill(x + 4, 12, 3, 4, C.steelL);
    pix.fill(x + 19, 12, 3, 4, C.steelL);
    if (f >= 4) pix.fill(x + 1, 11, 5, 3, C.red, 180);
  }
  return pix;
}

function makeSlash() {
  const pix = new Pix(24 * 3, 16);
  for (let f = 0; f < 3; f += 1) {
    const x = f * 24;
    pix.fill(x + 4 + f * 2, 4, 12 - f, 8, C.cyan, 160 - f * 30);
    pix.fill(x + 6 + f * 2, 6, 10 - f, 4, C.mag, 140);
  }
  return pix;
}

function makeBg(kind) {
  const pix = new Pix(240, 135);
  pix.fill(0, 0, 240, 135, kind === "far" ? "#08101c" : kind === "mid" ? "#0c1626" : "#122033");
  if (kind === "far") {
    for (let i = 0; i < 50; i += 1) pix.p(8 + (i * 19) % 232, 6 + (i * 13) % 48, C.cyan, 140);
    pix.fill(0, 78, 240, 57, "#10192b");
    for (let i = 0; i < 10; i += 1) {
      const x = i * 24;
      const h = 24 + (i % 5) * 8;
      pix.fill(x + 4, 78 - h, 18, h, "#1a2740");
      pix.fill(x + 8, 78 - h + 5, 3, 3, i % 2 ? C.mag : C.cyan, 200);
      pix.fill(x + 13, 78 - h + 12, 3, 3, C.lamp, 160);
    }
    pix.fill(0, 78, 240, 2, "#2de2e655");
  }
  if (kind === "mid") {
    for (let i = 0; i < 7; i += 1) {
      pix.fill(i * 36 + 4, 28, 26, 107, "#22324d");
      pix.rect(i * 36 + 4, 28, 26, 107, "#0b1220");
      pix.fill(i * 36 + 8, 36, 6, 7, C.cyan, 180);
      pix.fill(i * 36 + 18, 50, 6, 7, C.lamp, 160);
      pix.fill(i * 36 + 8, 66, 6, 7, C.mag, 140);
    }
  }
  if (kind === "near") {
    pix.fill(0, 100, 240, 35, "#1b283d");
    for (let i = 0; i < 14; i += 1) pix.fill(i * 18, 90, 10, 16, "#26344d");
    pix.fill(0, 118, 240, 2, C.cyan, 140);
    pix.fill(0, 120, 240, 1, C.mag, 80);
  }
  return pix;
}

function makeHeart() {
  const pix = new Pix(12, 12);
  pix.fill(2, 3, 3, 3, C.red);
  pix.fill(7, 3, 3, 3, C.red);
  pix.fill(3, 5, 6, 5, C.red);
  pix.p(5, 4, C.mag);
  return pix;
}

function makeDash() {
  const pix = new Pix(12, 12);
  pix.fill(1, 5, 10, 2, C.cyan);
  pix.fill(7, 3, 4, 6, C.mag);
  return pix;
}

save("assets/tilesets/tileset.png", makeTileset());
save("assets/characters/player.png", makePlayer());
save("assets/enemies/drone.png", makeDrone());
save("assets/enemies/sentinel.png", makeSentinel());
save("assets/fx/slash.png", makeSlash());
save("assets/backgrounds/bg-far.png", makeBg("far"));
save("assets/backgrounds/bg-mid.png", makeBg("mid"));
save("assets/backgrounds/bg-near.png", makeBg("near"));
save("assets/ui/heart.png", makeHeart());
save("assets/ui/dash-icon.png", makeDash());
console.log("assets gerados em public/assets");
