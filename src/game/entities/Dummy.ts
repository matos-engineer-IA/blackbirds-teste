import Phaser from "phaser";
import { applyDamage, isDefeated } from "../mechanics/combat";
import { ENEMY } from "../utils/constants";

export class Dummy extends Phaser.Physics.Arcade.Sprite {
  hp: number = ENEMY.dummyHp;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "npc-worker", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(7);
    this.setOrigin(0.5, 1);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(false);
    this.setPushable(false);
    body.setSize(18, 52);
    body.setOffset(17, 36);
  }

  hit(damage: number): boolean {
    if (this.hp <= 0) return false;
    this.hp = applyDamage(this.hp, damage, false);
    this.setTint(0xffffff);
    this.scene.tweens.add({
      targets: this,
      duration: 70,
      onComplete: () => this.clearTint(),
    });
    if (isDefeated(this.hp)) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 180,
        onComplete: () => this.destroy(),
      });
      this.disableBody(true, false);
      return true;
    }
    return false;
  }
}
