import { describe, expect, it } from "vitest";
import { ROOM_IDS, ROOMS, estimatedWalkSeconds, findCells, roomSize } from "../src/game/levels/rooms";
import { tileAt } from "../src/game/levels/tiles";
import { DIALOGUES } from "../src/game/content/dialogues";

describe("cidade do prologo", () => {
  it("mantem quatro regioes conectadas e o quarteirao pintado", () => {
    expect(ROOM_IDS).toEqual(["operario", "mercado", "avenida", "escola"]);
    expect(ROOMS.operario.painted?.width).toBe(1944);
    expect(roomSize(ROOMS.operario).height).toBe(360);
    for (const id of ROOM_IDS) {
      const def = ROOMS[id];
      expect(def.map).toHaveLength(16);
      const width = def.map[0].length;
      def.map.forEach((line) => expect(line.length).toBe(width));
      if (!def.painted) expect(roomSize(def).width).toBe(width * 18);
      expect(def.npcs.length).toBeGreaterThan(0);
    }
  });

  it("liga o bairro a escola e marca a cutscene", () => {
    expect(ROOMS.operario.connections.right).toBe("mercado");
    expect(ROOMS.mercado.connections.right).toBe("avenida");
    expect(ROOMS.avenida.connections.right).toBe("escola");
    expect(findCells(ROOMS.escola, "!").length).toBeGreaterThan(0);
    expect(estimatedWalkSeconds()).toBeGreaterThan(45);
  });

  it("classifica tiles da cidade e dialogos em portugues", () => {
    expect(tileAt("#").solid).toBe(true);
    expect(tileAt("D").kind).toBe("door");
    expect(tileAt("!").kind).toBe("cutscene");
    expect(DIALOGUES.vizinha[0].speaker).toBe("Dona Ilda");
    expect(DIALOGUES["guarda-abuso"].length).toBeGreaterThan(2);
  });
});
