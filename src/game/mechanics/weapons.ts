export type WeaponKind = "melee" | "revolver";

export function nextMeleeStep(step: number, withinCombo: boolean): number {
  if (!withinCombo) return 1;
  return step >= 3 ? 1 : step + 1;
}

export function meleeDamage(step: number): number {
  return step >= 3 ? 2 : 1;
}

export function canFire(ammo: number, cooldownMs: number, reloading: boolean): boolean {
  return ammo > 0 && cooldownMs <= 0 && !reloading;
}

export function afterShot(ammo: number): number {
  return Math.max(0, ammo - 1);
}

export function reloadAmmo(maxAmmo: number): number {
  return maxAmmo;
}
