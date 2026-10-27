export const GAME = {
  width: 480,
  height: 270,
  tile: 18,
  gravity: 980,
} as const;

export const PLAYER = {
  maxHp: 3,
  walkSpeed: 155,
  accel: 1800,
  decel: 2100,
  jumpVelocity: 340,
  coyoteMs: 90,
  jumpBufferMs: 90,
  jumpCut: 0.48,
  iFrameMs: 1000,
  attackMs: 150,
  attackCooldownMs: 320,
  attackRange: 22,
  attackDamage: 1,
  dashSpeed: 520,
  dashMs: 220,
  dashCooldownMs: 680,
  knockbackX: 160,
  knockbackY: 140,
} as const;

export const ENEMY = {
  droneHp: 1,
  droneSpeed: 48,
  sentinelHp: 3,
  sentinelSpeed: 28,
  sentinelTelegraphMs: 520,
  sentinelAttackMs: 280,
  contactDamage: 1,
} as const;

export const SCENE = {
  boot: "BootScene",
  menu: "MenuScene",
  game: "GameScene",
  ui: "UIScene",
} as const;
