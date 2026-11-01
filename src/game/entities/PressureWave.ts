import Phaser from "phaser";

/** Technical VFX, not a final animation. The emitted entity owns its damage. */
export class PressureWave extends Phaser.Physics.Arcade.Sprite {
  private lifeMs = 2000;
  constructor(scene: Phaser.Scene, x: number, footY: number, facing: -1 | 1, group: Phaser.Physics.Arcade.Group) {
    super(scene, x, footY - 10, "steam");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    group.add(this);
    this.setDisplaySize(38, 18).setDepth(10).setTint(0xe6c36a).setAlpha(0.85);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false).setVelocityX(facing * 250);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.lifeMs -= delta;
    if (this.lifeMs <= 0 || this.x < 0 || this.x > this.scene.physics.world.bounds.width) this.destroy();
  }
}
