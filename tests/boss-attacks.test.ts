import { describe, expect, it } from "vitest";
import { chooseWinsthMove, WINSTH_ATTACKS, type WinsthMove } from "../src/game/mechanics/bossAttacks";

describe("seleção de Winsth", () => {
  it("alcança os quatro padrões sem repetir quando há alternativa", () => {
    const seen = new Set<WinsthMove>();
    let previous: WinsthMove | undefined;
    for (let turn = 0; turn < 40; turn++) {
      const move = chooseWinsthMove([60, 140, 220][turn % 3], previous, turn);
      expect(move).not.toBe(previous);
      expect(WINSTH_ATTACKS[move].startupMs).toBeGreaterThanOrEqual(650);
      seen.add(move);
      previous = move;
    }
    expect([...seen].sort()).toEqual(["charge", "horizontal", "slam", "wave"]);
  });
});
