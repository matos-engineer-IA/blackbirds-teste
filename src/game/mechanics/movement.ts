export function integrateHorizontal(
  velocityX: number,
  input: -1 | 0 | 1,
  dt: number,
  accel: number,
  decel: number,
  maxSpeed: number,
): number {
  if (input === 0) {
    if (velocityX > 0) return Math.max(0, velocityX - decel * dt);
    if (velocityX < 0) return Math.min(0, velocityX + decel * dt);
    return 0;
  }

  const next = velocityX + input * accel * dt;
  return Math.max(-maxSpeed, Math.min(maxSpeed, next));
}

export function canJump(onGround: boolean, coyoteMs: number): boolean {
  return onGround || coyoteMs > 0;
}

export function nextCoyote(onGround: boolean, current: number, dtMs: number, maxMs: number): number {
  if (onGround) return maxMs;
  return Math.max(0, current - dtMs);
}

export function nextJumpBuffer(pressed: boolean, current: number, dtMs: number, maxMs: number): number {
  if (pressed) return maxMs;
  return Math.max(0, current - dtMs);
}

export function cutJump(velocityY: number, holdingJump: boolean, cut: number): number {
  if (!holdingJump && velocityY < 0) {
    return velocityY * cut;
  }
  return velocityY;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
