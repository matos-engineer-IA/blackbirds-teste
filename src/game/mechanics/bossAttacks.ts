export type WinsthMove = "horizontal" | "slam" | "charge" | "wave";

/** Initial timings from §23; validate game feel independently of sprite approval. */
export const WINSTH_ATTACKS: Record<WinsthMove, { startupMs: number; activeMs: number; recoveryMs: number }> = {
  horizontal: { startupMs: 650, activeMs: 160, recoveryMs: 650 },
  slam: { startupMs: 900, activeMs: 120, recoveryMs: 900 },
  charge: { startupMs: 700, activeMs: 650, recoveryMs: 700 },
  wave: { startupMs: 1000, activeMs: 120, recoveryMs: 900 },
};

export function chooseWinsthMove(distance: number, previous: WinsthMove | undefined, turn: number): WinsthMove {
  const valid: WinsthMove[] = distance < 110 ? ["horizontal", "slam"] : distance < 160 ? ["horizontal", "charge", "wave"] : ["charge", "wave"];
  const alternatives = valid.filter(move => move !== previous);
  return alternatives[Math.abs(turn) % alternatives.length];
}
