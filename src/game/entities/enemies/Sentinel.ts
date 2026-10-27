import Phaser from "phaser";
import { applyDamage, isDefeated } from "../../mechanics/combat";
import { ENEMY } from "../../utils/constants";

type SentinelPhase = "idle" | "telegraph" | "attack" | "recover";

export class Sentinel extends Phaser.Physics.Arcade.Sprite {
  hp: number = ENEMY.sentinelHp;
  private dir: -1 | 1 = -1;
  private homeX = 0;
  private range = 40;
  private phase: SentinelPhase = "idle";
  private timer = 0;
  private pulse?: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, range = 40) {
    super(scene, x, y, "sentinel", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.homeX = x;
    this.range = range;
    this.setDepth(7);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setSize(16, 18);
    body.setOffset(5, 6);
    body.setImmovable(true);
    this.play("sentinel-idle");
    this.pulse = scene.add.rectangle(x, y, 28, 10, 0xff3355, 0).setDepth(6);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (!this.active) return;
    this.timer += delta;
    this.pulse?.setPosition(this.x + this.dir * 20, this.y);

    if (this.phase === "idle") {
      if (this.x > this.homeX + this.range) this.dir = -1;
      if (this.x < this.homeX - this.range) this.dir = 1;
      this.setVelocityX(this.dir * ENEMY.sentinelSpeed);
      this.setFlipX(this.dir > 0);
      if (this.timer > 1600) {
        this.phase = "telegraph";
        this.timer = 0;
        this.setVelocityX(0);
        this.play("sentinel-telegraph", true);
        this.pulse?.setFillStyle(0xffb020, 0.55);
      }
      return;
    }

    if (this.phase === "telegraph" && this.timer > ENEMY.sentinelTelegraphMs) {
      this.phase = "attack";
      this.timer = 0;
      this.play("sentinel-attack", true);
      this.pulse?.setFillStyle(0xff3355, 0.85);
      this.setVelocityX(this.dir * 180);
      return;
    }

    if (this.phase === "attack" && this.timer > ENEMY.sentinelAttackMs) {
      this.phase = "recover";
      this.timer = 0;
      this.setVelocityX(0);
      this.pulse?.setFillStyle(0xff3355, 0);
      this.play("sentinel-idle", true);
      return;
    }

    if (this.phase === "recover" && this.timer > 400) {
      this.phase = "idle";
      this.timer = 0;
    }
  }

  isDamaging(): boolean {
    return this.phase === "attack" || this.phase === "idle";
  }

  hit(damage: number): boolean {
    this.hp = applyDamage(this.hp, damage, false);
    this.setTint(0xffffff).setTintMode(Phaser.TintModes.FILL);
    this.scene.tweens.add({
      targets: this,
      duration: 70,
      onComplete: () => this.clearTint(),
    });
    if (isDefeated(this.hp)) {
      this.pulse?.destroy();
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        angle: 20,
        duration: 200,
        onComplete: () => this.destroy(),
      });
      this.disableBody(true, false);
      return true;
    }
    return false;
  }

  destroy(fromScene?: boolean): void {
    this.pulse?.destroy();
    super.destroy(fromScene);
  }
}
