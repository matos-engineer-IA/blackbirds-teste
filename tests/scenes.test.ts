import { describe, expect, it } from "vitest";
import { SCENE } from "../src/game/utils/constants";
import { shouldPlayCrash, startCutscene, tickCutscene } from "../src/game/systems/cutscene";
import { advanceDialogue, currentLine, openDialogue } from "../src/game/systems/dialogue";

describe("cenas e narrativa", () => {
  it("nomeia boot, menu, prologo, hud e arena", () => {
    expect(SCENE.boot).toBe("BootScene");
    expect(SCENE.menu).toBe("MenuScene");
    expect(SCENE.game).toBe("GameScene");
    expect(SCENE.ui).toBe("UIScene");
    expect(SCENE.arena).toBe("ArenaScene");
    expect(SCENE.boss).toBe("BossArenaScene");
  });

  it("avanca dialogo com trava contra clique repetido", () => {
    const open = openDialogue("vizinha");
    expect(currentLine(open)?.speaker).toBe("Dona Ilda");
    expect(advanceDialogue(open).index).toBe(0);
    const unlocked = { ...open, lockMs: 0 };
    expect(advanceDialogue(unlocked).index).toBe(1);
  });

  it("corta para o preto antes do impacto", () => {
    let state = startCutscene();
    let previous = state.phase;
    for (let i = 0; i < 80 && state.phase !== "black"; i += 1) {
      previous = state.phase;
      state = tickCutscene(state, 200);
    }
    expect(state.phase).toBe("black");
    expect(shouldPlayCrash(previous, "black")).toBe(true);
  });
});
