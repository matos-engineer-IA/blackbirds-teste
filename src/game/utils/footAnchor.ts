import Phaser from "phaser";

/** Pivot nos pés. O body termina no mesmo y dos pés, sem a cartola. */
export function anchorFeet(
  sprite: Phaser.Physics.Arcade.Sprite,
  frameW: number,
  frameH: number,
  bodyW: number,
  bodyH: number,
  renderScale = 1,
  footY = frameH,
): void {
  sprite.setScale(renderScale).setOrigin(0.5, footY / frameH);
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  // Arcade's size/offset are source pixels; callers specify world units.
  body.setSize(bodyW / renderScale, bodyH / renderScale, false);
  body.setOffset((frameW - bodyW / renderScale) / 2, footY - bodyH / renderScale);
  body.updateFromGameObject();
}

export function addContactShadow(scene: Phaser.Scene, sprite: Phaser.GameObjects.Sprite): Phaser.GameObjects.Image {
  const shadow = scene.add.image(sprite.x, sprite.y + 1, "contact-shadow").setDepth(sprite.depth - 1).setAlpha(0.55).setScale(0.65);
  sprite.once(Phaser.GameObjects.Events.DESTROY, () => shadow.destroy());
  return shadow;
}

/** Physical contact/hurt region; excludes transparent margins, hats and weapons. */
export function bodyBounds(sprite: Phaser.Physics.Arcade.Sprite): Phaser.Geom.Rectangle {
  const body = sprite.body as Phaser.Physics.Arcade.Body;
  return new Phaser.Geom.Rectangle(body.x, body.y, body.width, body.height);
}

/** Damage volume is independent of the narrower movement collider and image. */
export function hurtBounds(sprite: Phaser.Physics.Arcade.Sprite): Phaser.Geom.Rectangle {
  const bounds = bodyBounds(sprite);
  const height = sprite.texture.key === "winsth" ? 92 : sprite.texture.key === "nero" ? 72 : 70;
  return new Phaser.Geom.Rectangle(bounds.x, sprite.y - height, bounds.width, height);
}
