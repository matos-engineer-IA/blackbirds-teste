import Phaser from "phaser";
import { applyDamage, isDefeated } from "../mechanics/combat";
import { ENEMY } from "../utils/constants";
import { anchorFeet } from "../utils/footAnchor";
import { getSettings } from "../systems/settings";
import { sfx } from "../utils/audio";

export class Dummy extends Phaser.Physics.Arcade.Sprite {
  hp: number = ENEMY.dummyHp;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "npc-worker", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(7);
    anchorFeet(this, 96, 128, 18, 60, 0.8, 112);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setImmovable(false);
    this.setPushable(false);
  }

  hit(damage: number): boolean {
    if (this.hp <= 0) return false;
    this.hp = applyDamage(this.hp, damage, false);
    if (!getSettings().reducedFlashes) this.setTint(0xd9b979).setTintMode(Phaser.TintModes.FILL);
    sfx.hit();
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
