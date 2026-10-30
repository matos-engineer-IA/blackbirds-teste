import { describe, expect, it } from "vitest";
import { CITY_SEGMENTS, CITY_WIDTH, segmentAt } from "../src/game/levels/city";
import { winsthScale, SCALE } from "../src/game/utils/scale";
import { canMove, locksNpc } from "../src/game/systems/playState";
import { ROOMS } from "../src/game/levels/rooms";

describe("cidade continua e escala", () => {
  it("une as quatro regioes numa faixa unica", () => {
    expect(CITY_SEGMENTS.map((s) => s.id)).toEqual(["operario", "mercado", "avenida", "escola"]);
    expect(CITY_WIDTH).toBeGreaterThan(7000);
    expect(segmentAt(100).id).toBe("operario");
    expect(segmentAt(CITY_SEGMENTS[2].x + 10).id).toBe("avenida");
    expect(ROOMS.operario.connections.right).toBe("mercado");
  });

  it("mantem Winsth 27,8% mais alto que Nero, sem contar cartola", () => {
    expect(SCALE.neroBodyPx).toBe(144);
    expect(SCALE.winsthBodyPx).toBe(184);
    expect(SCALE.hatExcluded).toBe(true);
    expect(winsthScale()).toBeCloseTo(1.2778, 3);
  });

  it("trava movimento e NPC no dialogo", () => {
    expect(canMove("DIALOGUE")).toBe(false);
    expect(canMove("EXPLORING")).toBe(true);
    expect(locksNpc("DIALOGUE")).toBe(true);
  });
});
