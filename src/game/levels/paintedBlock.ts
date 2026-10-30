export type PaintedLamp = { x: number; y: number };
export type PaintedMark = { x: number; y: number; dialogue?: string };

export type PaintedBlock = {
  width: number;
  height: number;
  groundY: number;
  spawnX: number;
  exitRightX: number;
  doors: PaintedMark[];
  vents: PaintedMark[];
  lamps: PaintedLamp[];
  machine: PaintedMark;
};

/** Quarteirão operário pintado — 1 tela = 640×360, rua = 3 telas. */
export const OPERARIO_BLOCK: PaintedBlock = {
  width: 1944,
  height: 360,
  groundY: 348,
  spawnX: 176,
  exitRightX: 1910,
  doors: [
    { x: 318, y: 348, dialogue: "porta-casa" },
    { x: 842, y: 348, dialogue: "porta-loja" },
    { x: 1688, y: 348, dialogue: "porta-loja" },
  ],
  vents: [
    { x: 1388, y: 188 },
    { x: 786, y: 150 },
  ],
  lamps: [
    { x: 628, y: 228 },
    { x: 1766, y: 92 },
  ],
  machine: { x: 1410, y: 300 },
};
