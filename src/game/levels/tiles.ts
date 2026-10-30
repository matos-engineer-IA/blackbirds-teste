export const TILE = 18;

export type TileKind =
  | "empty"
  | "solid"
  | "spawn"
  | "exit-right"
  | "exit-left"
  | "door"
  | "lever"
  | "cutscene"
  | "deco";

export type TileDef = {
  kind: TileKind;
  frame: number;
  solid: boolean;
};

export const TILES: Record<string, TileDef> = {
  ".": { kind: "empty", frame: 0, solid: false },
  " ": { kind: "empty", frame: 0, solid: false },
  "#": { kind: "solid", frame: 1, solid: true },
  "=": { kind: "solid", frame: 3, solid: true },
  R: { kind: "solid", frame: 5, solid: true },
  U: { kind: "solid", frame: 16, solid: true },
  P: { kind: "solid", frame: 9, solid: true },
  O: { kind: "solid", frame: 10, solid: true },
  "-": { kind: "solid", frame: 25, solid: true },
  S: { kind: "spawn", frame: 0, solid: false },
  ">": { kind: "exit-right", frame: 13, solid: false },
  "<": { kind: "exit-left", frame: 13, solid: false },
  D: { kind: "door", frame: 13, solid: false },
  L: { kind: "lever", frame: 24, solid: false },
  "!": { kind: "cutscene", frame: 0, solid: false },
  W: { kind: "deco", frame: 14, solid: false },
  H: { kind: "deco", frame: 6, solid: false },
  I: { kind: "deco", frame: 15, solid: false },
  "*": { kind: "deco", frame: 11, solid: false },
  G: { kind: "deco", frame: 20, solid: false },
  V: { kind: "deco", frame: 19, solid: false },
  F: { kind: "deco", frame: 22, solid: false },
  T: { kind: "deco", frame: 17, solid: false },
  N: { kind: "deco", frame: 12, solid: false },
  B: { kind: "deco", frame: 21, solid: false },
  M: { kind: "deco", frame: 24, solid: false },
  Y: { kind: "deco", frame: 18, solid: false },
  C: { kind: "deco", frame: 27, solid: false },
};

export function tileAt(char: string): TileDef {
  return TILES[char] ?? TILES["."];
}
