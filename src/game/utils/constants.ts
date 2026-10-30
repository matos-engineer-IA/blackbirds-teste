export const GAME = {
  width: 640,
  height: 360,
  tile: 18,
  gravity: 980,
} as const;

export const PLAYER = {
  maxHp: 5,
  walkSpeed: 140,
  accel: 1900,
  decel: 2200,
  jumpVelocity: 330,
  coyoteMs: 90,
  jumpBufferMs: 90,
  jumpCut: 0.48,
  iFrameMs: 900,
  attackMs: 160,
  attackCooldownMs: 280,
  attackRange: 26,
  attackDamage: 1,
  dashSpeed: 480,
  dashMs: 180,
  dashCooldownMs: 700,
  knockbackX: 150,
  knockbackY: 130,
  meleeComboWindowMs: 420,
  revolverCooldownMs: 380,
  revolverRecoil: 40,
  maxAmmo: 6,
  reloadMs: 900,
} as const;

export const ENEMY = {
  dummyHp: 8,
  droneHp: 1,
  droneSpeed: 40,
  sentinelHp: 3,
  sentinelSpeed: 24,
  sentinelTelegraphMs: 520,
  sentinelAttackMs: 280,
  contactDamage: 1,
} as const;

export const SCENE = {
  boot: "BootScene",
  menu: "MenuScene",
  game: "GameScene",
  ui: "UIScene",
  arena: "ArenaScene",
  boss: "BossArenaScene",
} as const;
