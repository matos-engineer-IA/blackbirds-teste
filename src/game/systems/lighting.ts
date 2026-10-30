import Phaser from "phaser";
import type { PaintedLamp } from "../levels/paintedBlock";

export class LightingRig {
  private nodes: Phaser.GameObjects.GameObject[] = [];

  constructor(private readonly scene: Phaser.Scene) {}

  clear(): void {
    this.nodes.forEach((node) => node.destroy());
    this.nodes = [];
  }

  place(lamps: PaintedLamp[]): void {
    this.clear();
    lamps.forEach((lamp, index) => {
      const post = this.scene.add.image(lamp.x, lamp.y, "lamp").setDepth(6);
      const glow = this.scene.add.image(lamp.x, lamp.y + 10, "lamp-glow").setDepth(5).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5);
      this.scene.tweens.add({
        targets: glow,
        alpha: { from: 0.38, to: 0.62 },
        duration: 1400 + index * 180,
        yoyo: true,
        repeat: -1,
      });
      this.nodes.push(post, glow);
    });
  }
}
