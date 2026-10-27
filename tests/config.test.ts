import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ENEMY, GAME, PLAYER, buildProfile, palette } from "../src/game/config";

describe("configuracao do jogo", () => {
  it("inicializa canvas, fisica e cenas", () => {
    expect(GAME.width).toBe(480);
    expect(GAME.height).toBe(270);
    expect(buildProfile.physics).toBe("arcade");
    expect(buildProfile.framework).toBe("phaser");
    expect(buildProfile.sceneCount).toBe(4);
    expect(buildProfile.output).toBe("dist");
  });

  it("mantem paleta cyberpunk e limites do jogador", () => {
    expect(palette.cyan).toBe(0x2de2e6);
    expect(PLAYER.maxHp).toBe(3);
    expect(PLAYER.dashMs).toBeGreaterThan(0);
    expect(ENEMY.droneHp).toBe(1);
    expect(ENEMY.sentinelHp).toBeGreaterThan(ENEMY.droneHp);
  });

  it("declara scripts npm obrigatorios", () => {
    const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    for (const name of ["dev", "build", "preview", "test", "typecheck"]) {
      expect(pkg.scripts[name]).toBeTruthy();
    }
  });
});
