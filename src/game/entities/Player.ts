import Phaser from "phaser";
import { applyDamage } from "../mechanics/combat";
import { canJump, cutJump, integrateHorizontal, nextCoyote, nextJumpBuffer } from "../mechanics/movement";
import { canStartDash, tickDash } from "../mechanics/neonDash";
import { PLAYER } from "../utils/constants";
import { sfx } from "../utils/audio";

export type PlayerInput = {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpPressed: boolean;
  attack: boolean;
  dash: boolean;
};

export class Player extends Phaser.Physics.Arcade.Sprite {
  hp: number = PLAYER.maxHp;
  facing: -1 | 1 = 1;
  coyoteMs = 0;
  jumpBufferMs = 0;
  iFrameMs = 0;
  attackMs = 0;
  attackCdMs = 0;
  dashMs = 0;
  dashCdMs = 0;
  airDashUsed = false;
  hasDash = false;
  wasOnGround = false;
  private slash?: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "player", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(8);
    this.setScale(1.15);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(10, 16);
    body.setOffset(7, 8);
    body.setMaxVelocity(720, 560);
    body.setCollideWorldBounds(true);
    this.setDrag(0);
  }

  attachSlash(slash: Phaser.GameObjects.Sprite): void {
    this.slash = slash;
    this.slash.setVisible(false).setDepth(9);
  }

  get onGround(): boolean {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return body.blocked.down || body.touching.down;
  }

  get isDashing(): boolean {
    return this.dashMs > 0;
  }

  get invulnerable(): boolean {
    return this.iFrameMs > 0 || this.isDashing;
  }

  get attacking(): boolean {
    return this.attackMs > 0;
  }

  syncFromRun(hp: number, hasDash: boolean): void {
    this.hp = hp;
    this.hasDash = hasDash;
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

    const dash = tickDash(
      {
        unlocked: this.hasDash,
        activeMs: this.dashMs,
        cooldownMs: this.dashCdMs,
        airUsed: this.airDashUsed,
        onGround: grounded,
      },
      dtMs,
      PLAYER.dashMs,
      PLAYER.dashCooldownMs,
    );
    this.dashMs = dash.activeMs;
    this.dashCdMs = dash.cooldownMs;
    this.airDashUsed = dash.airUsed;

    if (canStartDash({ ...dash, activeMs: this.dashMs, cooldownMs: this.dashCdMs }, input.dash)) {
      this.dashMs = PLAYER.dashMs;
      this.airDashUsed = !grounded;
      body.setVelocity(this.facing * PLAYER.dashSpeed, 0);
      body.allowGravity = false;
      sfx.dash();
      this.scene.cameras.main.shake(80, 0.002);
    }

    if (this.isDashing) {
      body.setVelocity(this.facing * PLAYER.dashSpeed, 0);
      body.allowGravity = false;
    } else {
      body.allowGravity = true;
      const dir: -1 | 0 | 1 = input.left ? -1 : input.right ? 1 : 0;
      if (dir !== 0) this.facing = dir;
      body.setVelocityX(
        integrateHorizontal(body.velocity.x, dir, dt, PLAYER.accel, PLAYER.decel, PLAYER.walkSpeed),
      );
    }

    if (this.jumpBufferMs > 0 && canJump(grounded, this.coyoteMs) && !this.isDashing) {
      body.setVelocityY(-PLAYER.jumpVelocity);
      this.coyoteMs = 0;
      this.jumpBufferMs = 0;
      this.airDashUsed = false;
      sfx.jump();
    } else if (!this.isDashing) {
      body.setVelocityY(cutJump(body.velocity.y, input.jump, PLAYER.jumpCut));
    }

    if (input.attack && this.attackCdMs <= 0 && !this.isDashing) {
      this.attackMs = PLAYER.attackMs;
      this.attackCdMs = PLAYER.attackCooldownMs;
      sfx.attack();
    }

    if (grounded && !this.wasOnGround && body.velocity.y >= 0) {
      sfx.land();
    }
    this.wasOnGround = grounded;
    this.setFlipX(this.facing < 0);
    this.updateAnim();
    this.updateSlash();
    this.setAlpha(this.iFrameMs > 0 && !this.isDashing && Math.floor(this.iFrameMs / 80) % 2 === 0 ? 0.45 : 1);
  }

  takeHit(fromX: number): boolean {
    const next = applyDamage(this.hp, 1, this.invulnerable);
    if (next === this.hp) return false;
    this.hp = next;
    this.iFrameMs = PLAYER.iFrameMs;
    const body = this.body as Phaser.Physics.Arcade.Body;
    const dir = this.x < fromX ? -1 : 1;
    body.setVelocity(dir * PLAYER.knockbackX, -PLAYER.knockbackY);
    this.scene.cameras.main.shake(120, 0.004);
    sfx.hit();
    return true;
  }

  attackHitbox(): Phaser.Geom.Rectangle {
    const x = this.facing > 0 ? this.x + 8 : this.x - 8 - PLAYER.attackRange;
    return new Phaser.Geom.Rectangle(x, this.y - 8, PLAYER.attackRange + 8, 16);
  }

  private updateAnim(): void {
    if (this.iFrameMs > 800) {
      this.play("player-hurt", true);
      return;
    }
    if (this.isDashing) {
      this.play("player-dash", true);
      return;
    }
    if (this.attacking) {
      this.play("player-attack", true);
      return;
    }
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!this.onGround) {
      this.play(body.velocity.y < 0 ? "player-jump" : "player-fall", true);
      return;
    }
    if (Math.abs(body.velocity.x) > 12) {
      this.play("player-run", true);
      return;
    }
    this.play("player-idle", true);
  }

  private updateSlash(): void {
    if (!this.slash) return;
    if (!this.attacking) {
      this.slash.setVisible(false);
      return;
    }
    this.slash.setVisible(true);
    this.slash.setPosition(this.x + this.facing * 16, this.y);
    this.slash.setFlipX(this.facing < 0);
    this.slash.play("slash", true);
  }
}
