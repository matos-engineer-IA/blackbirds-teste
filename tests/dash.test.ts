import { describe, expect, it } from "vitest";
import { canPassBarrier, canStartDash, tickDash } from "../src/game/mechanics/neonDash";

describe("neon dash", () => {
  it("so inicia se estiver desbloqueado e fora de cooldown", () => {
    expect(
      canStartDash({ unlocked: false, activeMs: 0, cooldownMs: 0, airUsed: false, onGround: true }, true),
    ).toBe(false);
    expect(
      canStartDash({ unlocked: true, activeMs: 0, cooldownMs: 0, airUsed: false, onGround: true }, true),
    ).toBe(true);
    expect(
      canStartDash({ unlocked: true, activeMs: 0, cooldownMs: 0, airUsed: true, onGround: false }, true),
    ).toBe(false);
  });

  it("consome o dash e libera a barreira apenas durante o dash", () => {
    const next = tickDash(
      { unlocked: true, activeMs: 30, cooldownMs: 0, airUsed: true, onGround: false },
      30,
      220,
      680,
    );
    expect(next.activeMs).toBe(0);
    expect(next.cooldownMs).toBe(680);
    expect(canPassBarrier(true, true)).toBe(true);
    expect(canPassBarrier(true, false)).toBe(false);
  });
});
