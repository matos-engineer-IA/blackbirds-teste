export type DashState = {
  unlocked: boolean;
  activeMs: number;
  cooldownMs: number;
  airUsed: boolean;
  onGround: boolean;
};

export function canStartDash(state: DashState, requested: boolean): boolean {
  if (!requested || !state.unlocked) return false;
  if (state.activeMs > 0 || state.cooldownMs > 0) return false;
  if (!state.onGround && state.airUsed) return false;
  return true;
}

export function tickDash(
  state: DashState,
  dtMs: number,
  _dashMs: number,
  cooldownMs: number,
): DashState {
  const activeMs = Math.max(0, state.activeMs - dtMs);
  const cooling = state.activeMs > 0 && activeMs === 0;
  return {
    ...state,
    activeMs,
    cooldownMs: cooling ? cooldownMs : Math.max(0, state.cooldownMs - dtMs),
    airUsed: state.onGround ? false : state.airUsed,
  };
}
