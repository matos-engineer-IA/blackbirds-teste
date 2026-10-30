import Phaser from "phaser";
import { applyDamage } from "../mechanics/combat";
import { canJump, cutJump, integrateHorizontal, nextCoyote, nextJumpBuffer } from "../mechanics/movement";
import { afterShot, canFire, meleeDamage, nextMeleeStep } from "../mechanics/weapons";
import { addContactShadow, anchorFeet } from "../utils/footAnchor";
import { PLAYER } from "../utils/constants";
import { SCALE } from "../utils/scale";
import { sfx } from "../utils/audio";

export type PlayerInput = {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpPressed: boolean;
  melee: boolean;
  fire: boolean;
  reload: boolean;
};

type AnimState = "idle" | "walk" | "jump" | "fall" | "land" | "melee" | "shoot" | "reload" | "hurt";

export class Player extends Phaser.Physics.Arcade.Sprite {
  hp: number = PLAYER.maxHp;
  facing: -1 | 1 = 1;
  coyoteMs = 0;
  jumpBufferMs = 0;
  iFrameMs = 0;
  attackMs = 0;
  attackCdMs = 0;
  meleeStep = 0;
  comboMs = 0;
  fireCdMs = 0;
  reloadMs = 0;
  landMs = 0;
  ammo: number = PLAYER.maxAmmo;
  combatEnabled = false;
  locked = false;
  wasOnGround = false;
  private steam?: Phaser.GameObjects.Particles.ParticleEmitter;
  private shadow: Phaser.GameObjects.Image;
  private animState: AnimState = "idle";

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "nero", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(8);
    anchorFeet(this, SCALE.neroFrame.w, SCALE.neroFrame.h, 24, 86);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setMaxVelocity(420, 560);
    body.setCollideWorldBounds(true);
    this.setDrag(0);
    this.shadow = addContactShadow(scene, this);
  }

  attachSteam(emitter: Phaser.GameObjects.Particles.ParticleEmitter): void {
    this.steam = emitter;
  }

  get onGround(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return body.blocked.down || body.touching.down;
  }

  get attacking(): boolean {
    return this.attackMs > 0;
  }

  updatePlayer(input: PlayerInput, dtMs: number): void {
    const dt = dtMs / 1000;
    const body = this.body as Phaser.Physics.Arcade.Body;
    const grounded = this.onGround;
    this.coyoteMs = nextCoyote(grounded, this.coyoteMs, dtMs, PLAYER.coyoteMs);
    this.jumpBufferMs = nextJumpBuffer(input.jumpPressed, this.jumpBufferMs, dtMs, PLAYER.jumpBufferMs);
    this.iFrameMs = Math.max(0, this.iFrameMs - dtMs);
    this.attackMs = Math.max(0, this.attackMs - dtMs);
    this.attackCdMs = Math.max(0, this.attackCdMs - dtMs);
    this.comboMs = Math.max(0, this.comboMs - dtMs);
    this.fireCdMs = Math.max(0, this.fireCdMs - dtMs);
    this.reloadMs = Math.max(0, this.reloadMs - dtMs);
    this.landMs = Math.max(0, this.landMs - dtMs);
    this.shadow.setPosition(this.x, this.y - 1).setVisible(grounded);

    if (this.locked) {
      body.setVelocity(0, body.velocity.y);
      this.setAnim("idle");
      return;
    }

    const dir: -1 | 0 | 1 = input.left ? -1 : input.right ? 1 : 0;
    if (dir !== 0 && this.attackMs <= 0) this.facing = dir;
    const speed = this.attackMs > 0 ? PLAYER.walkSpeed * 0.35 : PLAYER.walkSpeed;
    body.setVelocityX(integrateHorizontal(body.velocity.x, this.attackMs > 80 ? 0 : dir, dt, PLAYER.accel, PLAYER.decel, speed));

    if (this.jumpBufferMs > 0 && canJump(grounded, this.coyoteMs) && this.attackMs <= 0) {
      body.setVelocityY(-PLAYER.jumpVelocity);
      this.coyoteMs = 0;
      this.jumpBufferMs = 0;
      sfx.jump();
    } else {
      body.setVelocityY(cutJump(body.velocity.y, input.jump, PLAYER.jumpCut));
    }

    if (this.combatEnabled && input.melee && this.attackCdMs <= 0) {
      this.meleeStep = nextMeleeStep(this.meleeStep, this.comboMs > 0);
      this.attackMs = this.meleeStep >= 3 ? 220 : PLAYER.attackMs;
      this.attackCdMs = PLAYER.attackCooldownMs;
      this.comboMs = PLAYER.meleeComboWindowMs;
      sfx.attack();
      if (this.meleeStep >= 3) {
        sfx.steam();
        this.steam?.explode(6, this.x + this.facing * 18, this.y - 48);
      }
    }

    if (this.combatEnabled && input.reload && this.reloadMs <= 0 && this.ammo < PLAYER.maxAmmo) {
      this.reloadMs = PLAYER.reloadMs;
      this.ammo = PLAYER.maxAmmo;
      this.animState = "reload";
      sfx.reload();
    }

    if (this.combatEnabled && input.fire && canFire(this.ammo, this.fireCdMs, this.reloadMs > 0)) {
      this.ammo = afterShot(this.ammo);
      this.fireCdMs = PLAYER.revolverCooldownMs;
      this.attackMs = 140;
      body.setVelocityX(body.velocity.x - this.facing * PLAYER.revolverRecoil);
      sfx.shot();
      this.scene.cameras.main.shake(40, 0.0012);
    }

    if (grounded && !this.wasOnGround && body.velocity.y >= 0) {
      sfx.land();
      this.landMs = 90;
    }
    this.wasOnGround = grounded;
    this.setFlipX(this.facing < 0);
    this.refreshAnim();
    this.setAlpha(this.iFrameMs > 0 && Math.floor(this.iFrameMs / 80) % 2 === 0 ? 0.45 : 1);
  }

  takeHit(fromX: number): boolean {
    const next = applyDamage(this.hp, 1, this.iFrameMs > 0);
    if (next === this.hp) return false;
    this.hp = next;
    this.iFrameMs = PLAYER.iFrameMs;
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity((this.x < fromX ? -1 : 1) * PLAYER.knockbackX, -PLAYER.knockbackY);
    sfx.hit();
    return true;
  }

  attackHitbox(): Phaser.Geom.Rectangle {
    const wide = this.meleeStep >= 3 ? PLAYER.attackRange + 18 : PLAYER.attackRange;
    const x = this.facing > 0 ? this.x + 18 : this.x - 18 - wide;
    return new Phaser.Geom.Rectangle(x, this.y - 70, wide + 14, 42);
  }

  lastMeleeDamage(): number {
    return meleeDamage(this.meleeStep);
  }

  private setAnim(next: AnimState): void {
    if (this.animState === next && this.anims.isPlaying) return;
    this.animState = next;
    const key = `player-${next === "walk" ? "run" : next}`;
    if (this.anims.currentAnim?.key !== key) this.play(key, true);
  }

  private refreshAnim(): void {
    if (this.iFrameMs > 750) {
      this.setAnim("hurt");
      return;
    }
    if (this.reloadMs > 0) {
      this.setAnim("reload");
      return;
    }
    if (this.attacking) {
      this.setAnim(this.fireCdMs > PLAYER.revolverCooldownMs - 90 ? "shoot" : "melee");
      return;
    }
    if (!this.onGround) {
      this.setAnim((this.body as Phaser.Physics.Arcade.Body).velocity.y < 0 ? "jump" : "fall");
      return;
    }
    if (this.landMs > 0) {
      this.setAnim("land");
      return;
    }
    if (Math.abs((this.body as Phaser.Physics.Arcade.Body).velocity.x) > 12) {
      this.setAnim("walk");
      return;
    }
    this.setAnim("idle");
  }
}
