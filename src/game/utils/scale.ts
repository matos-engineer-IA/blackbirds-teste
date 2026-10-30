/** Convenção oficial: cartola e efeitos NÃO entram na altura do corpo. */
export const SCALE = {
  neroMeters: 1.8,
  winsthMeters: 2.3,
  neroBodyPx: 144,
  winsthBodyPx: 184,
  neroFrame: { w: 120, h: 192 },
  winsthFrame: { w: 148, h: 236 },
  hatExcluded: true,
} as const;

export const GROUND = {
  y: 350,
  colliderHeight: 24,
  worldHeight: 360,
} as const;

export function winsthScale(): number {
  return SCALE.winsthMeters / SCALE.neroMeters;
}
