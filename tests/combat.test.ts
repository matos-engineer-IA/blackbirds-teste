import { describe, expect, it } from "vitest";
import { applyDamage, isDefeated, resolveAttack, shouldGrantIFrames } from "../src/game/mechanics/combat";

describe("combate", () => {
  it("aplica dano e derrota", () => {
    expect(applyDamage(3, 1, false)).toBe(2);
    expect(applyDamage(1, 1, true)).toBe(1);
    expect(isDefeated(0)).toBe(true);
    expect(shouldGrantIFrames(3, 2)).toBe(true);
  });

  it("detecta acerto na frente do jogador", () => {
    expect(resolveAttack(22, 1, 16, 12)).toBe(true);
    expect(resolveAttack(22, 1, -40, 12)).toBe(false);
    expect(resolveAttack(22, -1, -16, 12)).toBe(true);
  });
});
