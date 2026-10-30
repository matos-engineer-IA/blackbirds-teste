import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, dir: -1 | 1) {
    super(scene, x, y, "steam");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(9);
    this.setTint(0xe6c36a);
    this.setScale(0.6);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(dir * 320);
    scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 700,
      onComplete: () => this.destroy(),
    });
  }
}
