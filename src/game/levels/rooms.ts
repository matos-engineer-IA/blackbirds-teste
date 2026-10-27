import type { RoomId } from "../systems/progress";
import { TILE } from "./tiles";

export type ExitDir = "left" | "right" | "nexus";

export type RoomDef = {
  id: RoomId;
  title: string;
  wall: "#" | "R" | "U";
  map: string[];
  musicTint: number;
  connections: Partial<Record<ExitDir, RoomId>>;
};

function room(lines: string[]): string[] {
  if (lines.length !== 16) {
    throw new Error(`Sala precisa ter 16 linhas, veio ${lines.length}`);
  }
  const width = Math.max(...lines.map((line) => line.length));
  return lines.map((line) => {
    if (line.length === width) return line;
    const wall = line.at(-1) ?? ".";
    const body = line.slice(0, -1);
    const fill = /[.#RUS<>{}]/.test(body) && body.includes(".") ? "." : wall;
    return `${body.padEnd(width - 1, fill)}${wall}`;
  });
}

export const ROOMS: Record<RoomId, RoomDef> = {
  "distrito-a": {
    id: "distrito-a",
    title: "Distrito Zero",
    wall: "#",
    musicTint: 0x6ecbff,
    connections: { right: "distrito-b" },
    map: room([
      "########################################",
      "#......................................#",
      "#..W........W........W........W........#",
      "#......................................#",
      "#......................................#",
      "#.................====.................#",
      "#......................................#",
      "#.........===................===.......#",
      "#......................................#",
      "#......................................#",
      "#...T..................................#",
      "#S....................................>#",
      "#P...............O..............*......#",
      "########################################",
      "########################################",
      "########################################",
    ]),
  },
  "distrito-b": {
    id: "distrito-b",
    title: "Viela 09",
    wall: "#",
    musicTint: 0x7ad7ff,
    connections: { left: "distrito-a", right: "ferrugem-a", nexus: "nexus-a" },
    map: room([
      "################################################",
      "#{B.............................................#",
      "#{B.............................................#",
      "#{B.........====................................#",
      "#......................=======..................#",
      "#...............................................#",
      "#............====...............................#",
      "#...............................................#",
      "#...............................................#",
      "#...............................................#",
      "#...............................................#",
      "#.......D........C.............................>#",
      "#P................O.............................#",
      "################################################",
      "################################################",
      "################################################",
    ]),
  },
  "ferrugem-a": {
    id: "ferrugem-a",
    title: "Setor Ferrugem",
    wall: "R",
    musicTint: 0xffb070,
    connections: { left: "distrito-b", right: "ferrugem-b" },
    map: room([
      "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
      "#..........................................#",
      "#..I........I........I.....................#",
      "#..........................................#",
      "#..............=======.....................#",
      "#..........................................#",
      "#..........................................#",
      "#............M.............................#",
      "#..........................................#",
      "#..........................................#",
      "#...............................Y..........#",
      "#<..............C.........................>#",
      "#RRRRRRRRRR........RRRRRRRRRRRRRRRRRRRRO...#",
      "RRRRRRRRRRRRXXXXXXXXRRRRRRRRRRRRRRRRRRRRRRRR",
      "RRRRRRRRRRRRXXXXXXXXRRRRRRRRRRRRRRRRRRRRRRRR",
      "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    ]),
  },
  "ferrugem-b": {
    id: "ferrugem-b",
    title: "Câmara do Protocolo",
    wall: "R",
    musicTint: 0xff9a4a,
    connections: { left: "ferrugem-a" },
    map: room([
      "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
      "#..................................#",
      "#..I........................I......#",
      "#..................................#",
      "#..................................#",
      "#.............====.................#",
      "#..................................#",
      "#..................................#",
      "#..........==========..............#",
      "#..................................#",
      "#.............K....................#",
      "#<............C...........D........#",
      "#RR...........................O....#",
      "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
      "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
      "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    ]),
  },
  "nexus-a": {
    id: "nexus-a",
    title: "Corredor NEXUS",
    wall: "U",
    musicTint: 0xe08cff,
    connections: { left: "distrito-b", right: "nexus-b" },
    map: room([
      "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
      "#................................................#",
      "#................................................#",
      "#....====........................................#",
      "#................................................#",
      "#................................................#",
      "#................................................#",
      "#................................................#",
      "#................................................#",
      "#................................................#",
      "#.........................................Y......#",
      "#<...C.........B................................>#",
      "#UUUUUUUUU.........UUUUUUUUUUUUUUUUUUUUUUUUUUUUUU#",
      "UUUUUUUUUUXXXXXXXXXUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
      "UUUUUUUUUUXXXXXXXXXUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
      "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
    ]),
  },
  "nexus-b": {
    id: "nexus-b",
    title: "Núcleo NEXUS",
    wall: "U",
    musicTint: 0xff66cc,
    connections: { left: "nexus-a" },
    map: room([
      "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
      "#................................#",
      "#.............**.................#",
      "#..........========..............#",
      "#................................#",
      "#.............V..................#",
      "#..........========..............#",
      "#................................#",
      "#................................#",
      "#................................#",
      "#................................#",
      "#<...............................#",
      "#UU.........................U....#",
      "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
      "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
      "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU",
    ]),
  },
};

export function roomSize(def: RoomDef): { cols: number; rows: number; width: number; height: number } {
  const rows = def.map.length;
  const cols = def.map[0]?.length ?? 0;
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
  const marked = findCells(def, "S");
  if (from === "right") {
    const left = findCells(def, "<S");
    if (left[0]) return { x: left[0].x + 20, y: left[0].y };
  }
  if (from === "left") {
    const right = findCells(def, ">");
    if (right[0]) return { x: right[0].x - 20, y: right[0].y };
  }
  if (from === "nexus") {
    const gate = findCells(def, "{");
    if (gate[0]) return { x: gate[0].x + 28, y: gate[0].y };
  }
  if (marked[0]) return marked[0];
  const fallback = findCells(def, "<");
  return fallback[0] ?? { x: TILE * 2, y: TILE * 11 };
}

export const ROOM_IDS = Object.keys(ROOMS) as RoomId[];
