import { describe, expect, it } from "vitest";
import { AttackTimeline, NERO_MELEE } from "../src/game/mechanics/attackTimeline";
import { dampingAlpha } from "../src/game/mechanics/smoothing";

describe("contratos de ação", () => {
  it("não causa dano no startup ou recovery e só atinge cada alvo uma vez", () => {
    const action = new AttackTimeline(NERO_MELEE[0], -1);
    const target = {};
    action.tick(90);
    expect(action.consumeHit(target)).toBe(false);
    action.tick(20);
    expect(action.consumeHit(target)).toBe(true);
    action.tick(20);
    expect(action.consumeHit(target)).toBe(false);
    action.tick(100);
    action.tick(1); // Prior tick crossed the last part of the active window.
    expect(action.consumeHit({})).toBe(false);
    expect(action.facing).toBe(-1);
    const next = new AttackTimeline(NERO_MELEE[0], 1);
    next.tick(110);
    expect(next.consumeHit(target)).toBe(true);
  });

  it("resolve janela ativa cruzada por um passo longo uma única vez", () => {
    const action = new AttackTimeline(NERO_MELEE[0], 1);
    action.tick(220);
    expect(action.activeThisTick).toBe(true);
    action.tick(1);
    expect(action.activeThisTick).toBe(false);
  });

  it("mantém a mesma resposta temporal em 30, 60 e 144 Hz", () => {
    const positions = [30, 60, 144].map(hz => {
      let x = 0;
      for (let i = 0; i < hz; i++) x += (100 - x) * dampingAlpha(1000 / hz, 0.14);
      return x;
    });
    expect(positions[0]).toBeCloseTo(positions[1], 8);
    expect(positions[1]).toBeCloseTo(positions[2], 8);
  });
});
