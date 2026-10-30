import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const files = [
  "public/assets/painted/street-operario.png",
  "public/assets/characters/nero-sheet.png",
  "public/assets/characters/winsth.png",
  "public/assets/tilesets/cobble.png",
  "public/assets/characters/player.png",
  "public/assets/characters/npc-ilda.png",
  "public/assets/characters/npc-worker.png",
  "public/assets/characters/npc-child.png",
  "public/assets/characters/npc-mechanic.png",
  "public/assets/backgrounds/bg-far.png",
  "public/assets/ui/dialogue.png",
];

describe("arte pintada do quarteirao", () => {
  it("empacota sprites e rua como PNG, nao como retangulos de codigo", () => {
    for (const file of files) {
      const path = resolve(file);
      expect(existsSync(path), file).toBe(true);
      const bytes = readFileSync(path);
      expect(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe(true);
      expect(bytes.length).toBeGreaterThan(1500);
    }
  });
});
