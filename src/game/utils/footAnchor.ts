import Phaser from "phaser";

/** Pivot nos pés. O body termina no mesmo y dos pés, sem a cartola. */
export function anchorFeet(
  sprite: Phaser.Physics.Arcade.Sprite,
  frameW: number,
  frameH: number,
  bodyW: number,
  bodyH: number,
): void {
  sprite.setOrigin(0.5, 1);
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  body.setSize(bodyW, bodyH);
  body.setOffset(Math.round((frameW - bodyW) / 2), frameH - bodyH);
}

export function addContactShadow(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite): Phaser.GameObjects.Image {
  return scene.add.image(sprite.x, sprite.y - 2, "contact-shadow").setDepth(sprite.depth - 1).setAlpha(0.55);
}
