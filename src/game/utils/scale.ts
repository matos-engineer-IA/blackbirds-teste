/** Medidas de referência; escala de exibição proposta, sujeita a revisão artística. */
export const SCALE = {
  neroMeters: 1.8,
  winsthMeters: 2.3,
  neroBodyPx: 144,
  winsthBodyPx: 184,
  neroFrame: { w: 320, h: 224, footY: 208 },
  winsthFrame: { w: 384, h: 288, footY: 264 },
  actorRenderScale: 0.5,
  hatExcluded: true,
} as const;

export const GROUND = {
  y: 318,
  colliderHeight: 42,
  worldHeight: 360,
} as const;

export function winsthScale(): number {
  return SCALE.winsthMeters / SCALE.neroMeters;
}
