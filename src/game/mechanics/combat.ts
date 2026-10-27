export function applyDamage(hp: number, amount: number, invulnerable: boolean): number {
  if (invulnerable || amount <= 0) return hp;
  return Math.max(0, hp - amount);
}

export function isDefeated(hp: number): boolean {
  return hp <= 0;
}

export function shouldGrantIFrames(previousHp: number, nextHp: number): boolean {
  return nextHp < previousHp && nextHp > 0;
}

export function resolveAttack(range: number, facing: -1 | 1, targetOffsetX: number, targetWidth: number): boolean {
  const reach = facing * range;
  const min = Math.min(0, reach);
  const max = Math.max(0, reach);
  const targetMin = targetOffsetX - targetWidth / 2;
  const targetMax = targetOffsetX + targetWidth / 2;
  return targetMax >= min && targetMin <= max;
}
