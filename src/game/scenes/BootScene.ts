import Phaser from "phaser";
import { SCENE } from "../utils/constants";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE.boot);
  }

  preload(): void {
    this.load.spritesheet("tiles", "assets/tilesets/tileset.png", { frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet("player", "assets/characters/player.png", { frameWidth: 24, frameHeight: 24 });
    this.load.spritesheet("drone", "assets/enemies/drone.png", { frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet("sentinel", "assets/enemies/sentinel.png", { frameWidth: 26, frameHeight: 24 });
    this.load.spritesheet("slash", "assets/fx/slash.png", { frameWidth: 24, frameHeight: 16 });
    this.load.image("bg-far", "assets/backgrounds/bg-far.png");
    this.load.image("bg-mid", "assets/backgrounds/bg-mid.png");
    this.load.image("bg-near", "assets/backgrounds/bg-near.png");
    this.load.image("heart", "assets/ui/heart.png");
    this.load.image("dash-icon", "assets/ui/dash-icon.png");

    const { width, height } = this.scale;
    const bar = this.add.rectangle(width / 2, height / 2, 160, 6, 0x1c2430).setOrigin(0.5);
    const fill = this.add.rectangle(width / 2 - 80, height / 2, 4, 6, 0x2de2e6).setOrigin(0, 0.5);
    this.add.text(width / 2, height / 2 - 18, "SINCRONIZANDO NEXUS...", {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#2de2e6",
    }).setOrigin(0.5);
    this.load.on("progress", (value: number) => {
      fill.width = 160 * value;
      bar;
    });
  }

  create(): void {
    this.anims.create({ key: "player-idle", frames: this.anims.generateFrameNumbers("player", { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: "player-run", frames: this.anims.generateFrameNumbers("player", { start: 2, end: 5 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "player-jump", frames: [{ key: "player", frame: 6 }], frameRate: 1 });
    this.anims.create({ key: "player-fall", frames: [{ key: "player", frame: 7 }], frameRate: 1 });
    this.anims.create({ key: "player-hurt", frames: [{ key: "player", frame: 8 }], frameRate: 1 });
    this.anims.create({ key: "player-attack", frames: [{ key: "player", frame: 9 }], frameRate: 1 });
    this.anims.create({ key: "player-dash", frames: [{ key: "player", frame: 10 }], frameRate: 1 });
    this.anims.create({ key: "drone-fly", frames: this.anims.generateFrameNumbers("drone", { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "sentinel-idle", frames: this.anims.generateFrameNumbers("sentinel", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    this.anims.create({ key: "sentinel-telegraph", frames: this.anims.generateFrameNumbers("sentinel", { start: 2, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "sentinel-attack", frames: this.anims.generateFrameNumbers("sentinel", { start: 4, end: 5 }), frameRate: 10, repeat: -1 });
    this.anims.create({ key: "slash", frames: this.anims.generateFrameNumbers("slash", { start: 0, end: 2 }), frameRate: 16 });
    this.anims.create({ key: "checkpoint-idle", frames: [{ key: "tiles", frame: 12 }, { key: "tiles", frame: 13 }], frameRate: 4, repeat: -1 });
    this.anims.create({ key: "core-spin", frames: [{ key: "tiles", frame: 22 }, { key: "tiles", frame: 23 }], frameRate: 6, repeat: -1 });
    this.scene.start(SCENE.menu);
  }
}
