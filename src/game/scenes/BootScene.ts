import Phaser from "phaser";
import { SCALE } from "../utils/scale";
import { SCENE } from "../utils/constants";
import { CITY_SEGMENTS } from "../levels/city";

export class BootScene extends Phaser.Scene {
  private failedAssets: string[] = [];
  constructor() {
    super(SCENE.boot);
  }

  preload(): void {
    this.failedAssets = [];
    this.load.on("loaderror", (file: Phaser.Loader.File) => this.failedAssets.push(file.key));
    if (import.meta.env.PROD) this.load.json("build-info", "build-info.json");
    this.load.spritesheet("nero", "assets/characters/nero-production-v2.png", {
      frameWidth: SCALE.neroFrame.w,
      frameHeight: SCALE.neroFrame.h,
    });
    this.load.spritesheet("winsth", "assets/characters/winsth-production-v2.png", {
      frameWidth: SCALE.winsthFrame.w,
      frameHeight: SCALE.winsthFrame.h,
    });
    this.load.spritesheet("npc-ilda", "assets/characters/npc-ilda-v2.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("npc-worker", "assets/characters/npc-worker-v2.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("npc-mechanic", "assets/characters/npc-mechanic-v2.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("npc-guard", "assets/characters/npc-guard-v2.png", { frameWidth: 96, frameHeight: 128 });
    this.load.spritesheet("npc-child", "assets/characters/daughter-v2.png", { frameWidth: 96, frameHeight: 112 });
    this.load.spritesheet("lina", "assets/characters/daughter-v2.png", { frameWidth: 96, frameHeight: 112 });
    this.load.spritesheet("tiles", "assets/tilesets/tileset.png", { frameWidth: 18, frameHeight: 18 });
    this.load.image("carriage", "assets/characters/carriage-v2.png");
    for (const key of CITY_SEGMENTS.flatMap(segment => segment.panels)) this.load.image(key, `assets/painted/${key}.png`);
    this.load.image("door-leaf", "assets/painted/door-leaf-v2.png");
    this.load.image("pressure-wheel", "assets/painted/pressure-wheel-v2.png");
    this.load.image("bg-far", "assets/backgrounds/bg-far.png");
    this.load.image("bg-mid", "assets/backgrounds/bg-mid.png");
    this.load.image("bg-near", "assets/backgrounds/bg-near.png");
    this.load.image("cobble", "assets/tilesets/cobble-review-v2.png");
    this.load.image("steam", "assets/fx/steam.png");
    this.load.image("spark", "assets/fx/spark.png");
    this.load.image("contact-shadow", "assets/fx/contact-shadow.png");
    this.load.image("lamp", "assets/fx/lamp.png");
    this.load.image("lamp-glow", "assets/fx/lamp-glow.png");
    this.load.image("ui-dialogue", "assets/ui/dialogue.png");
    this.load.image("crow", "assets/ui/crow.png");
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x120e0b);
    const progress = this.add.text(width / 2, height / 2, "A cidade acorda...", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#c4a36a",
    }).setOrigin(0.5);
    this.load.on("progress", (value: number) => progress.setText(`A cidade acorda... ${Math.round(value * 100)}%`));
  }

  create(): void {
    if (this.failedAssets.length) {
      this.add.rectangle(320, 180, 640, 360, 0x120e0b).setDepth(100);
      this.add.text(320, 150, "A cidade não terminou de carregar.\nVerifique a conexão e tente novamente.", { fontFamily: "Georgia, serif", fontSize: "15px", color: "#e0c594", align: "center" }).setOrigin(.5).setDepth(101);
      const retry = this.add.text(320, 215, "TENTAR NOVAMENTE", { fontFamily: "Georgia, serif", fontSize: "14px", color: "#efd4a0", backgroundColor: "#37291d", padding: { x: 14, y: 10 } }).setOrigin(.5).setDepth(101).setInteractive({ useHandCursor: true });
      retry.on("pointerdown", () => location.reload());
      this.input.keyboard?.once("keydown-ENTER", () => location.reload());
      console.error("Assets failed to load:", this.failedAssets.join(", "));
      return;
    }
    this.anims.create({ key: "player-idle", frames: this.anims.generateFrameNumbers("nero", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    this.anims.create({ key: "player-run", frames: this.anims.generateFrameNumbers("nero", { start: 2, end: 7 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "player-jump", frames: [{ key: "nero", frame: 8 }] });
    this.anims.create({ key: "player-fall", frames: [{ key: "nero", frame: 9 }] });
    this.anims.create({ key: "player-land", frames: [{ key: "nero", frame: 0 }] });
    this.anims.create({ key: "player-melee", frames: this.anims.generateFrameNumbers("nero", { start: 10, end: 11 }), frameRate: 10 });
    this.anims.create({ key: "player-shoot", frames: this.anims.generateFrameNumbers("nero", { start: 12, end: 13 }), frameRate: 8 });
    this.anims.create({ key: "player-reload", frames: [{ key: "nero", frame: 12 }] });
    this.anims.create({ key: "player-hurt", frames: [{ key: "nero", frame: 0 }] });
    this.anims.create({ key: "winsth-idle", frames: this.anims.generateFrameNumbers("winsth", { start: 0, end: 1 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: "winsth-walk", frames: this.anims.generateFrameNumbers("winsth", { start: 2, end: 3 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: "winsth-telegraph", frames: [{ key: "winsth", frame: 4 }] });
    this.anims.create({ key: "winsth-swing", frames: [{ key: "winsth", frame: 5 }] });
    this.anims.create({ key: "winsth-slam", frames: [{ key: "winsth", frame: 6 }] });
    this.anims.create({ key: "winsth-hurt", frames: [{ key: "winsth", frame: 7 }] });
    this.anims.create({ key: "lina-run", frames: this.anims.generateFrameNumbers("lina", { start: 2, end: 5 }), frameRate: 10, repeat: -1 });
    for (const key of ["npc-ilda", "npc-worker", "npc-mechanic", "npc-guard"]) {
      this.anims.create({ key: `${key}-idle`, frames: [{ key, frame: 1 }] });
      this.anims.create({ key: `${key}-walk`, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    }
    this.anims.create({ key: "npc-child-idle", frames: [{ key: "npc-child", frame: 0 }] });
    this.anims.create({ key: "npc-child-walk", frames: this.anims.generateFrameNumbers("npc-child", { start: 2, end: 5 }), frameRate: 7, repeat: -1 });
    this.scene.start(SCENE.menu);
  }
}
