export type AttackDefinition = {
  id: string;
  startupMs: number;
  activeMs: number;
  recoveryMs: number;
  damage: number;
};

// Timings are calibration candidates (§22). Retain the game's existing HP units.
export const NERO_MELEE: readonly AttackDefinition[] = [
  { id: "punch-1", startupMs: 100, activeMs: 80, recoveryMs: 200, damage: 1 },
  { id: "punch-2", startupMs: 130, activeMs: 90, recoveryMs: 210, damage: 1 },
  { id: "punch-3", startupMs: 230, activeMs: 100, recoveryMs: 350, damage: 2 },
];

/** One action instance owns its timing, committed direction and hit ledger. */
export class AttackTimeline {
  elapsedMs = 0;
  activeThisTick = false;
  private readonly hits = new Set<object>();

  constructor(readonly definition: AttackDefinition, readonly facing: -1 | 1) {
    if (definition.startupMs < 0 || definition.activeMs <= 0 || definition.recoveryMs < 0) {
      throw new Error(`Timeline inválida: ${definition.id}`);
    }
  }

  get durationMs(): number {
    return this.definition.startupMs + this.definition.activeMs + this.definition.recoveryMs;
  }

  get finished(): boolean { return this.elapsedMs >= this.durationMs; }
  get remainingMs(): number { return Math.max(0, this.durationMs - this.elapsedMs); }

  tick(deltaMs: number): void {
    const previous = this.elapsedMs;
    this.elapsedMs += Math.max(0, deltaMs);
    // Swept temporal interval: do not lose a hit if a step crosses the window.
    this.activeThisTick = previous < this.definition.startupMs + this.definition.activeMs
      && this.elapsedMs >= this.definition.startupMs;
  }

  consumeHit(target: object): boolean {
    if (!this.activeThisTick || this.hits.has(target)) return false;
    this.hits.add(target);
    return true;
  }
}
