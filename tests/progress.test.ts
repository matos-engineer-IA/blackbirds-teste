import { describe, expect, it } from "vitest";
import { nextObjective, resolveCheckpoint, shouldWin } from "../src/game/systems/progress";
import { createRun, enterRoom, extractCore, formatTime, respawn, unlockDash } from "../src/game/systems/runState";

describe("progressao e checkpoints", () => {
  it("avanca objetivos e desbloqueia o dash", () => {
    const run = createRun(0);
    expect(run.objective).toBe("infiltrar");
    expect(enterRoom(run, "distrito-b").objective).toBe("avancar-fabrica");
    expect(unlockDash(enterRoom(run, "ferrugem-b")).hasDash).toBe(true);
    expect(nextObjective(true, "distrito-b", false)).toBe("atravessar-barreira");
    expect(nextObjective(true, "nexus-a", false)).toBe("alcancar-nucleo");
  });

  it("salva checkpoint e respawna sem perder o dash", () => {
    let run = unlockDash(createRun(0));
    run = { ...run, hp: 1 };
    run = { ...run, checkpoint: resolveCheckpoint(run.checkpoint, { roomId: "ferrugem-a", x: 10, y: 20 }) };
    const after = respawn(run);
    expect(after.hp).toBe(3);
    expect(after.hasDash).toBe(true);
    expect(after.roomId).toBe("ferrugem-a");
  });

  it("vence apenas no nucleo extraido", () => {
    const run = extractCore(enterRoom(createRun(0), "nexus-b"));
    expect(shouldWin(run.roomId, run.extracted)).toBe(true);
    expect(shouldWin("nexus-a", true)).toBe(false);
    expect(formatTime(125)).toBe("02:05");
  });
});
