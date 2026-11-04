import Phaser from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private previousBodyX = 0;
  constructor(scene: Phaser.Scene, x: number, y: number, dir: -1 | 1, group: Phaser.Physics.Arcade.Group, traceFromX = x) {
    super(scene, x, y, "steam");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // Group defaults reset body velocity/gravity; configure the shot afterwards.
    group.add(this);
    this.setDepth(9);
    this.setTint(0xe6c36a);
    this.setScale(0.6);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setVelocityX(dir * 320);
    body.updateFromGameObject();
    // Cover the initial segment from the hand to the muzzle as well. Otherwise
    // a close target can stand behind the drawn barrel and never receive a hit.
    this.previousBodyX = traceFromX - body.width / 2;
    scene.tweens.add({
      targets: this,
      alpha: 0.2,
      duration: 700,
      onComplete: () => this.destroy(),
    });
  }

  sweptBounds(): Phaser.Geom.Rectangle {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return new Phaser.Geom.Rectangle(Math.min(this.previousBodyX, body.x), body.y, Math.abs(body.x - this.previousBodyX) + body.width, body.height);
  }
  recordStep(): void { if (this.body) this.previousBodyX = (this.body as Phaser.Physics.Arcade.Body).x; }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.x < 0 || this.x > this.scene.physics.world.bounds.width) this.destroy();
  }
}
