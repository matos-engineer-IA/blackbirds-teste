import type { RoomId } from "../systems/progress";
import { OPERARIO_BLOCK, type PaintedBlock } from "./paintedBlock";
import { TILE } from "./tiles";

export type ExitDir = "left" | "right";
export type NpcKind = "worker" | "merchant" | "guard" | "child" | "poor" | "elite" | "mechanic";
export type WeatherId = "fog" | "steam" | "clear" | "rain";

export type NpcSpawn = {
  id: string;
  kind: NpcKind;
  col: number;
  row: number;
  x?: number;
  patrol: number;
  dialogue: string;
};

export type RoomDef = {
  id: RoomId;
  title: string;
  wall: string;
  weather: WeatherId;
  map: string[];
  npcs: NpcSpawn[];
  connections: Partial<Record<ExitDir, RoomId>>;
  painted?: PaintedBlock;
};

const H = 16;

function grid(width: number): string[] {
  return Array.from({ length: H }, () => ".".repeat(width));
}

function setCell(rows: string[], x: number, y: number, ch: string): void {
  if (y < 0 || y >= rows.length) return;
  const row = rows[y];
  if (x < 0 || x >= row.length) return;
  rows[y] = `${row.slice(0, x)}${ch}${row.slice(x + 1)}`;
}

function fill(rows: string[], x: number, y: number, w: number, h: number, ch: string): void {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) setCell(rows, xx, yy, ch);
  }
}

function ground(rows: string[], wall: string, from = 12): void {
  fill(rows, 0, from, rows[0].length, rows.length - from, wall);
}

function facade(rows: string[], x: number, w: number, windows = true): void {
  fill(rows, x, 5, w, 1, "H");
  if (windows) {
    for (let i = 1; i < w - 1; i += 3) {
      setCell(rows, x + i, 7, "W");
      setCell(rows, x + i, 9, "W");
    }
  }
  setCell(rows, x + Math.max(1, Math.floor(w / 2)), 11, "*");
}

function finish(rows: string[], wall: string): string[] {
  const width = rows[0].length;
  rows[0] = wall.repeat(width);
  for (let y = 1; y < rows.length; y += 1) {
    if (rows[y][0] !== wall) setCell(rows, 0, y, wall);
    if (rows[y][width - 1] !== wall) setCell(rows, width - 1, y, wall);
  }
  return rows;
}

function buildOperario(): string[] {
  const w = 108;
  const rows = grid(w);
  ground(rows, "#");
  setCell(rows, 8, 11, "D");
  setCell(rows, 46, 11, "D");
  setCell(rows, 72, 11, "V");
  setCell(rows, 94, 11, "D");
  setCell(rows, 3, 11, "S");
  setCell(rows, w - 2, 11, ">");
  return finish(rows, "#");
}

function buildMercado(): string[] {
  const w = 114;
  const rows = grid(w);
  ground(rows, "=");
  facade(rows, 6, 14);
  facade(rows, 28, 16);
  facade(rows, 56, 12);
  facade(rows, 80, 18);
  fill(rows, 20, 10, 4, 1, "-");
  fill(rows, 48, 9, 5, 1, "-");
  fill(rows, 72, 10, 4, 1, "-");
  setCell(rows, 10, 11, "I");
  setCell(rows, 16, 11, "I");
  setCell(rows, 24, 11, "M");
  setCell(rows, 34, 11, "*");
  setCell(rows, 40, 11, "V");
  setCell(rows, 52, 11, "N");
  setCell(rows, 62, 11, "D");
  setCell(rows, 70, 11, "O");
  setCell(rows, 78, 11, "I");
  setCell(rows, 88, 11, "*");
  setCell(rows, 96, 11, "M");
  setCell(rows, 104, 11, "G");
  setCell(rows, 1, 11, "<");
  setCell(rows, w - 2, 11, ">");
  return finish(rows, "=");
}

function buildAvenida(): string[] {
  const w = 120;
  const rows = grid(w);
  ground(rows, "R");
  facade(rows, 8, 18);
  facade(rows, 36, 20);
  facade(rows, 70, 16);
  facade(rows, 96, 14);
  fill(rows, 30, 9, 6, 1, "-");
  fill(rows, 64, 10, 4, 1, "-");
  setCell(rows, 14, 11, "*");
  setCell(rows, 22, 11, "F");
  setCell(rows, 44, 11, "N");
  setCell(rows, 54, 11, "*");
  setCell(rows, 60, 11, "G");
  setCell(rows, 80, 11, "*");
  setCell(rows, 90, 11, "B");
  setCell(rows, 102, 11, "C");
  setCell(rows, 1, 11, "<");
  setCell(rows, w - 2, 11, ">");
  return finish(rows, "R");
}

function buildEscola(): string[] {
  const w = 96;
  const rows = grid(w);
  ground(rows, "U");
  facade(rows, 6, 10);
  facade(rows, 58, 22);
  fill(rows, 20, 10, 3, 1, "-");
  setCell(rows, 12, 11, "T");
  setCell(rows, 18, 11, "T");
  setCell(rows, 26, 11, "Y");
  setCell(rows, 28, 11, "Y");
  setCell(rows, 30, 11, "Y");
  setCell(rows, 36, 11, "*");
  setCell(rows, 42, 11, "B");
  setCell(rows, 50, 11, "Y");
  setCell(rows, 62, 11, "D");
  setCell(rows, 70, 11, "*");
  setCell(rows, 78, 11, "!");
  setCell(rows, 1, 11, "<");
  return finish(rows, "U");
}

export const ROOMS: Record<RoomId, RoomDef> = {
  operario: {
    id: "operario",
    title: "Bairro Operário",
    wall: "#",
    weather: "clear",
    painted: OPERARIO_BLOCK,
    connections: { right: "mercado" },
    map: buildOperario(),
    npcs: [
      { id: "vizinha", kind: "poor", col: 10, row: 11, x: 360, patrol: 70, dialogue: "vizinha" },
      { id: "operario", kind: "worker", col: 38, row: 11, x: 780, patrol: 90, dialogue: "operario" },
      { id: "crianca", kind: "child", col: 50, row: 11, x: 1088, patrol: 64, dialogue: "crianca" },
      { id: "mecanico", kind: "mechanic", col: 80, row: 11, x: 1496, patrol: 48, dialogue: "mecanico" },
    ],
  },
  mercado: {
    id: "mercado",
    title: "Mercado Industrial",
    wall: "=",
    weather: "steam",
    connections: { left: "operario", right: "avenida" },
    map: buildMercado(),
    npcs: [
      { id: "comerciante", kind: "merchant", col: 14, row: 11, patrol: 0, dialogue: "comerciante" },
      { id: "guarda-abuso", kind: "guard", col: 18, row: 11, patrol: 8, dialogue: "guarda-abuso" },
      { id: "vendedor", kind: "poor", col: 46, row: 11, patrol: 20, dialogue: "vendedor" },
      { id: "mecanico-mercado", kind: "mechanic", col: 86, row: 11, patrol: 14, dialogue: "mecanico" },
    ],
  },
  avenida: {
    id: "avenida",
    title: "Avenida Central",
    wall: "R",
    weather: "clear",
    connections: { left: "mercado", right: "escola" },
    map: buildAvenida(),
    npcs: [
      { id: "elite", kind: "elite", col: 26, row: 11, patrol: 12, dialogue: "elite" },
      { id: "guarda-avenida", kind: "guard", col: 48, row: 11, patrol: 30, dialogue: "guarda-avenida" },
      { id: "pobre-avenida", kind: "poor", col: 88, row: 11, patrol: 18, dialogue: "operario" },
    ],
  },
  escola: {
    id: "escola",
    title: "Caminho da Escola",
    wall: "U",
    weather: "rain",
    connections: { left: "avenida" },
    map: buildEscola(),
    npcs: [
      { id: "mae", kind: "poor", col: 24, row: 11, patrol: 10, dialogue: "mae" },
      { id: "crianca-escola", kind: "child", col: 40, row: 11, patrol: 16, dialogue: "crianca" },
      { id: "porteiro", kind: "worker", col: 66, row: 11, patrol: 0, dialogue: "porteiro" },
    ],
  },
};

export function roomSize(def: RoomDef): { cols: number; rows: number; width: number; height: number } {
  const rows = def.map.length;
  const cols = def.map[0]?.length ?? 0;
  if (def.painted) {
    return { cols, rows, width: def.painted.width, height: def.painted.height };
  }
  return { cols, rows, width: cols * TILE, height: rows * TILE };
}

export function findCells(def: RoomDef, kindChars: string): { x: number; y: number; char: string }[] {
  const found: { x: number; y: number; char: string }[] = [];
  def.map.forEach((line, row) => {
    [...line].forEach((char, col) => {
      if (kindChars.includes(char)) {
        found.push({ x: col * TILE + TILE / 2, y: row * TILE + TILE / 2, char });
      }
    });
  });
  return found;
}

export function defaultSpawn(def: RoomDef, from?: ExitDir): { x: number; y: number } {
  if (def.painted) {
    if (from === "left") return { x: def.painted.exitRightX - 40, y: def.painted.groundY };
    return { x: def.painted.spawnX, y: def.painted.groundY };
  }
  if (from === "right") {
    const left = findCells(def, "<S");
    if (left[0]) return { x: left[0].x + 24, y: left[0].y };
  }
  if (from === "left") {
    const right = findCells(def, ">");
    if (right[0]) return { x: right[0].x - 24, y: right[0].y };
  }
  const marked = findCells(def, "S");
  return marked[0] ?? { x: TILE * 3, y: TILE * 11 };
}

export const ROOM_IDS = Object.keys(ROOMS) as RoomId[];

export function estimatedWalkSeconds(): number {
  const pixels = ROOM_IDS.reduce((sum, id) => sum + roomSize(ROOMS[id]).width, 0);
  return Math.round(pixels / 140);
}
