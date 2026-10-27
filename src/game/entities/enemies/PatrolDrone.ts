import Phaser from "phaser";
import { applyDamage, isDefeated } from "../../mechanics/combat";
import { ENEMY } from "../../utils/constants";

export class PatrolDrone extends Phaser.Physics.Arcade.Sprite {
  hp: number = ENEMY.droneHp;
  private dir: -1 | 1 = 1;
  private homeX = 0;
  private range = 64;

  constructor(scene: Phaser.Scene, x: number, y: number, range = 64) {
    super(scene, x, y, "drone", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.homeX = x;
    this.range = range;
    this.setDepth(7);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setSize(12, 12);
    body.setImmovable(true);
    this.play("drone-fly");
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (!this.active) return;
    if (this.x > this.homeX + this.range) this.dir = -1;
    if (this.x < this.homeX - this.range) this.dir = 1;
    this.setVelocityX(this.dir * ENEMY.droneSpeed);
    this.setFlipX(this.dir < 0);
    this.y += Math.sin(time / 180) * 0.15;
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
      this.defeat();
      return true;
    }
    return false;
  }

  private defeat(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 1.4,
      duration: 160,
      onComplete: () => this.destroy(),
    });
    this.disableBody(true, false);
  }
}
