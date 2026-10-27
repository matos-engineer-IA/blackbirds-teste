import { describe, expect, it } from "vitest";
import { canJump, clamp, cutJump, integrateHorizontal, nextCoyote, nextJumpBuffer } from "../src/game/mechanics/movement";

describe("movimento", () => {
  it("acelera, desacelera e limita velocidade", () => {
    const mid = integrateHorizontal(0, 1, 0.1, 1800, 2100, 155);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThanOrEqual(155);
    expect(integrateHorizontal(80, 0, 0.1, 1800, 2100, 155)).toBeLessThan(80);
    expect(clamp(200, -155, 155)).toBe(155);
  });

  it("oferece coyote time e jump buffer", () => {
    expect(canJump(false, 40)).toBe(true);
    expect(canJump(false, 0)).toBe(false);
    expect(nextCoyote(true, 0, 16, 90)).toBe(90);
    expect(nextJumpBuffer(true, 0, 16, 90)).toBe(90);
    expect(cutJump(-200, false, 0.48)).toBeCloseTo(-96);
  });
});
