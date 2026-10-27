import { describe, expect, it } from "vitest";
import { ROOM_IDS, ROOMS, findCells, roomSize } from "../src/game/levels/rooms";
import { tileAt } from "../src/game/levels/tiles";

describe("salas e transicoes", () => {
  it("mantem mapas retangulares e tres areas", () => {
    expect(ROOM_IDS).toHaveLength(6);
    for (const id of ROOM_IDS) {
      const def = ROOMS[id];
      expect(def.map).toHaveLength(16);
      const width = def.map[0].length;
      def.map.forEach((line) => expect(line.length).toBe(width));
      expect(roomSize(def).width).toBe(width * 18);
    }
  });

  it("conecta distrito, fabrica e nucleo com dash gate", () => {
    expect(ROOMS["distrito-a"].connections.right).toBe("distrito-b");
    expect(ROOMS["distrito-b"].connections.right).toBe("ferrugem-a");
    expect(ROOMS["distrito-b"].connections.nexus).toBe("nexus-a");
    expect(ROOMS["ferrugem-a"].connections.right).toBe("ferrugem-b");
    expect(ROOMS["nexus-a"].connections.right).toBe("nexus-b");
    expect(findCells(ROOMS["ferrugem-b"], "K")).toHaveLength(1);
    expect(findCells(ROOMS["nexus-b"], "V")).toHaveLength(1);
    expect(findCells(ROOMS["distrito-b"], "B").length).toBeGreaterThan(0);
  });

  it("classifica tiles de colisao e inimigos", () => {
    expect(tileAt("#").solid).toBe(true);
    expect(tileAt("B").kind).toBe("barrier");
    expect(tileAt("D").kind).toBe("drone");
    expect(tileAt("Y").kind).toBe("sentinel");
    expect(tileAt("X").kind).toBe("hazard");
  });
});
