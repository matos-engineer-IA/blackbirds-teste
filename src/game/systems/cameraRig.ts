import Phaser from "phaser";

export class CameraRig {
  constructor(private readonly camera: Phaser.Cameras.Scene2D.Camera) {}

  setup(width: number, height: number, target: Phaser.GameObjects.GameObject): void {
    this.camera.startFollow(target, true, 0.1, 0.14);
    this.camera.setDeadzone(70, 36);
    this.camera.setRoundPixels(true);
    this.camera.setBounds(0, 0, width, height);
    this.camera.setFollowOffset(-28, 18);
  }

  look(facing: -1 | 1, locked = false): void {
    if (locked) return;
    this.camera.setFollowOffset(-facing * 42, 18);
  }

  hold(): void {
    this.camera.setFollowOffset(this.camera.followOffset.x, this.camera.followOffset.y);
  }
}
