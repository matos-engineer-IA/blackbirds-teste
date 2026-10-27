export const TILE = 18;

export type TileKind =
  | "empty"
  | "solid"
  | "hazard"
  | "barrier"
  | "spawn"
  | "checkpoint"
  | "drone"
  | "sentinel"
  | "dash"
  | "terminal"
  | "core"
  | "exit-right"
  | "exit-left"
  | "exit-nexus"
  | "moving"
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
  R: { kind: "solid", frame: 4, solid: true },
  U: { kind: "solid", frame: 6, solid: true },
  "=": { kind: "solid", frame: 14, solid: true },
  P: { kind: "solid", frame: 8, solid: true },
  O: { kind: "solid", frame: 9, solid: true },
  X: { kind: "hazard", frame: 10, solid: false },
  B: { kind: "barrier", frame: 11, solid: true },
  S: { kind: "spawn", frame: 0, solid: false },
  C: { kind: "checkpoint", frame: 12, solid: false },
  D: { kind: "drone", frame: 0, solid: false },
  Y: { kind: "sentinel", frame: 0, solid: false },
  K: { kind: "dash", frame: 22, solid: false },
  T: { kind: "terminal", frame: 19, solid: false },
  V: { kind: "core", frame: 22, solid: false },
  ">": { kind: "exit-right", frame: 24, solid: false },
  "<": { kind: "exit-left", frame: 24, solid: false },
  "{": { kind: "exit-nexus", frame: 24, solid: false },
  M: { kind: "moving", frame: 14, solid: false },
  W: { kind: "deco", frame: 16, solid: false },
  I: { kind: "deco", frame: 19, solid: false },
  "*": { kind: "deco", frame: 23, solid: false },
};

export function tileAt(char: string): TileDef {
  return TILES[char] ?? TILES["."];
}
