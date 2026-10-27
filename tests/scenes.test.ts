import { describe, expect, it } from "vitest";
import { SCENE } from "../src/game/utils/constants";
import { ROOM_IDS, ROOMS } from "../src/game/levels/rooms";

describe("transicoes de cena e salas", () => {
  it("nomeia boot, menu, jogo e HUD", () => {
    expect(SCENE.boot).toBe("BootScene");
    expect(SCENE.menu).toBe("MenuScene");
    expect(SCENE.game).toBe("GameScene");
    expect(SCENE.ui).toBe("UIScene");
  });

  it("permite voltar do nucleo para o distrito apos o dash", () => {
    expect(ROOMS["nexus-a"].connections.left).toBe("distrito-b");
    expect(ROOMS["distrito-b"].connections.nexus).toBe("nexus-a");
    expect(ROOM_IDS.includes("ferrugem-b")).toBe(true);
  });
});
