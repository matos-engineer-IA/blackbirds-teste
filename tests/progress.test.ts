import { describe, expect, it } from "vitest";
import { nextObjective } from "../src/game/systems/progress";
import { createRun, enterRoom, endPrologue, formatTime, markTalk } from "../src/game/systems/runState";

describe("progressao do prologo", () => {
  it("avanca objetivos pelas regioes da cidade", () => {
    expect(createRun(0).objective).toBe("sair-casa");
    expect(enterRoom(createRun(0), "mercado").objective).toBe("atravessar-mercado");
    expect(enterRoom(createRun(0), "avenida").objective).toBe("cruzar-avenida");
    expect(enterRoom(createRun(0), "escola").objective).toBe("chegar-escola");
    expect(nextObjective("operario", false)).toBe("sair-casa");
  });

  it("registra conversas e encerra o prologo", () => {
    const talked = markTalk(createRun(0), "vizinha");
    expect(talked.talked).toContain("vizinha");
    expect(endPrologue(talked).prologueEnded).toBe(true);
    expect(formatTime(185)).toBe("03:05");
  });
});
