import Phaser from "phaser";
import type { WeatherId } from "../levels/rooms";
import { GAME } from "../utils/constants";

export class WeatherSystem {
  private fog?: Phaser.GameObjects.Rectangle;
  private rain?: Phaser.GameObjects.Particles.ParticleEmitter;
  private current: WeatherId = "clear";

  constructor(private readonly scene: Phaser.Scene) {}

  apply(id: WeatherId): void {
    this.fog?.destroy();
    this.rain?.destroy();
    this.fog = undefined;
    this.rain = undefined;
    this.current = id;
    if (id === "fog" || id === "steam") {
      this.fog = this.scene.add
        .rectangle(GAME.width / 2, GAME.height / 2, GAME.width + 40, GAME.height + 40, 0x7d8894, id === "steam" ? 0.05 : 0.07)
        .setScrollFactor(0)
        .setDepth(16);
    }
    if (id === "rain") {
      this.rain = this.scene.add.particles(0, 0, "steam", {
        x: { min: 0, max: GAME.width },
        y: 0,
        lifespan: 900,
        speedY: { min: 180, max: 260 },
        scale: { start: 0.35, end: 0.1 },
        quantity: 2,
        frequency: 40,
        tint: 0xa8b4c0,
        alpha: 0.45,
      }).setScrollFactor(0).setDepth(15);
    }
  }

  follow(_scrollX: number): void {
    // Emitter is screen-relative. Adding scrollX again moved rain offscreen.
  }

  get id(): WeatherId {
    return this.current;
  }
}
