import { describe, expect, it } from "vitest";
import { canStartDash, tickDash } from "../src/game/mechanics/mobility";
import { afterShot, canFire, meleeDamage, nextMeleeStep } from "../src/game/mechanics/weapons";

describe("mobilidade futura e armas da arena", () => {
  it("so inicia dash se estiver desbloqueado", () => {
    expect(canStartDash({ unlocked: false, activeMs: 0, cooldownMs: 0, airUsed: false, onGround: true }, true)).toBe(false);
    expect(canStartDash({ unlocked: true, activeMs: 0, cooldownMs: 0, airUsed: false, onGround: true }, true)).toBe(true);
  });

  it("combo de soco e revolver com municao", () => {
    expect(nextMeleeStep(1, true)).toBe(2);
    expect(meleeDamage(3)).toBe(2);
    expect(canFire(6, 0, false)).toBe(true);
    expect(afterShot(1)).toBe(0);
    expect(canFire(0, 0, false)).toBe(false);
    const cooled = tickDash({ unlocked: true, activeMs: 20, cooldownMs: 0, airUsed: true, onGround: false }, 20, 180, 700);
    expect(cooled.cooldownMs).toBe(700);
  });
});
