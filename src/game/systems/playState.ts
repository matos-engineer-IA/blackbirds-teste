export type PlayMode = "EXPLORING" | "INTERACTING" | "DIALOGUE" | "CUTSCENE" | "COMBAT" | "PAUSED";

export function canMove(mode: PlayMode): boolean {
  return mode === "EXPLORING" || mode === "COMBAT";
}

export function canInteract(mode: PlayMode): boolean {
  return mode === "EXPLORING";
}

export function locksNpc(mode: PlayMode): boolean {
  return mode === "DIALOGUE" || mode === "INTERACTING";
}
