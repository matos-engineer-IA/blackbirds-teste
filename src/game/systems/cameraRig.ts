import Phaser from "phaser";
import { dampingAlpha } from "../mechanics/smoothing";

export class CameraRig {
  private lookAhead = 28;
  constructor(private readonly camera: Phaser.Cameras.Scene2D.Camera) {}

  setup(width: number, height: number, target: Phaser.GameObjects.GameObject): void {
    this.lookAhead = 28;
    this.camera.startFollow(target, true, 1, 1);
    this.camera.setDeadzone(70, 36);
    this.camera.setRoundPixels(true);
    this.camera.setBounds(0, 0, width, height);
    this.camera.setFollowOffset(-28, 18);
    const actor = target as Phaser.GameObjects.Sprite;
    this.camera.centerOn(actor.x + 28, actor.y - 90);
  }

  look(facing: -1 | 1, deltaMs: number, locked = false): void {
    if (locked) return;
    this.lookAhead += (facing * 42 - this.lookAhead) * dampingAlpha(deltaMs, 0.2);
    this.camera.setFollowOffset(-this.lookAhead, 18);
    this.camera.setLerp(dampingAlpha(deltaMs, 0.14), dampingAlpha(deltaMs, 0.22));
  }

  cinematic(x: number, y: number): void {
    this.camera.stopFollow();
    this.camera.pan(x, y, 600);
  }
}
