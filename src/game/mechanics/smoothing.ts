/** Seconds-based damping. Comparable response at 30, 60 and 144 Hz. */
export function dampingAlpha(deltaMs: number, responseSeconds: number): number {
  return 1 - Math.exp(-Math.max(0, deltaMs) / (responseSeconds * 1000));
}
