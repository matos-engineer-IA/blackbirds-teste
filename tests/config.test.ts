import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { GAME, PLAYER, buildProfile, palette } from "../src/game/config";

describe("configuracao do jogo", () => {
  it("inicializa canvas e perfil de build", () => {
    expect(GAME.width).toBe(640);
    expect(GAME.height).toBe(360);
    expect(buildProfile.framework).toBe("phaser");
    expect(buildProfile.sceneCount).toBe(6);
    expect(buildProfile.title).toBe("Black Bird: Revolução");
  });

  it("usa paleta steampunk e movimento responsivo", () => {
    expect(palette.bronze).toBe(0xc4a36a);
    expect(palette.leather).toBe(0x5c3a24);
    expect(PLAYER.coyoteMs).toBeGreaterThan(0);
    expect(PLAYER.walkSpeed).toBeGreaterThan(100);
  });

  it("declara scripts npm obrigatorios", () => {
    const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf8")) as {
      name: string;
      scripts: Record<string, string>;
    };
    expect(pkg.name).toBe("black-bird-revolucao");
    for (const name of ["dev", "build", "preview", "test", "typecheck"]) {
      expect(pkg.scripts[name]).toBeTruthy();
    }
  });
});
