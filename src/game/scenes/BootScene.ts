import Phaser from "phaser";
import { SCALE } from "../utils/scale";
import { SCENE } from "../utils/constants";

export class BootScene extends Phaser.Scene {
  constructor() {
    super(SCENE.boot);
  }

  preload(): void {
    this.load.spritesheet("nero", "assets/characters/nero-sheet.png", {
      frameWidth: SCALE.neroFrame.w,
      frameHeight: SCALE.neroFrame.h,
    });
    this.load.spritesheet("winsth", "assets/characters/winsth.png", {
      frameWidth: SCALE.winsthFrame.w,
      frameHeight: SCALE.winsthFrame.h,
    });
    this.load.spritesheet("npc-ilda", "assets/characters/npc-ilda.png", { frameWidth: 52, frameHeight: 88 });
    this.load.spritesheet("npc-worker", "assets/characters/npc-worker.png", { frameWidth: 52, frameHeight: 88 });
    this.load.spritesheet("npc-mechanic", "assets/characters/npc-mechanic.png", { frameWidth: 52, frameHeight: 88 });
    this.load.spritesheet("npc-child", "assets/characters/npc-child.png", { frameWidth: 40, frameHeight: 64 });
    this.load.spritesheet("lina", "assets/characters/lina.png", { frameWidth: 20, frameHeight: 28 });
    this.load.spritesheet("tiles", "assets/tilesets/tileset.png", { frameWidth: 18, frameHeight: 18 });
    this.load.image("carriage", "assets/characters/carriage.png");
    this.load.image("street-operario", "assets/painted/street-operario.png");
    this.load.image("bg-far", "assets/backgrounds/bg-far.png");
    this.load.image("bg-mid", "assets/backgrounds/bg-mid.png");
    this.load.image("bg-near", "assets/backgrounds/bg-near.png");
    this.load.image("cobble", "assets/tilesets/cobble.png");
    this.load.image("steam", "assets/fx/steam.png");
    this.load.image("spark", "assets/fx/spark.png");
    this.load.image("contact-shadow", "assets/fx/contact-shadow.png");
    this.load.image("lamp", "assets/fx/lamp.png");
    this.load.image("lamp-glow", "assets/fx/lamp-glow.png");
    this.load.image("ui-dialogue", "assets/ui/dialogue.png");
    this.load.image("crow", "assets/ui/crow.png");
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x120e0b);
    this.add.text(width / 2, height / 2, "A cidade acorda...", {
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      color: "#c4a36a",
    }).setOrigin(0.5);
  }

  create(): void {
    this.anims.create({ key: "player-idle", frames: this.anims.generateFrameNumbers("nero", { start: 0, end: 1 }), frameRate: 3, repeat: -1 });
    this.anims.create({ key: "player-run", frames: this.anims.generateFrameNumbers("nero", { start: 2, end: 5 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "player-jump", frames: [{ key: "nero", frame: 6 }] });
    this.anims.create({ key: "player-fall", frames: [{ key: "nero", frame: 6 }] });
    this.anims.create({ key: "player-land", frames: [{ key: "nero", frame: 0 }] });
    this.anims.create({ key: "player-melee", frames: this.anims.generateFrameNumbers("nero", { start: 7, end: 8 }), frameRate: 10 });
    this.anims.create({ key: "player-shoot", frames: this.anims.generateFrameNumbers("nero", { start: 9, end: 10 }), frameRate: 8 });
    this.anims.create({ key: "player-reload", frames: [{ key: "nero", frame: 9 }] });
    this.anims.create({ key: "player-hurt", frames: [{ key: "nero", frame: 0 }] });
    this.anims.create({ key: "winsth-idle", frames: this.anims.generateFrameNumbers("winsth", { start: 0, end: 1 }), frameRate: 2, repeat: -1 });
    this.anims.create({ key: "winsth-walk", frames: this.anims.generateFrameNumbers("winsth", { start: 2, end: 3 }), frameRate: 4, repeat: -1 });
    this.anims.create({ key: "winsth-telegraph", frames: [{ key: "winsth", frame: 4 }] });
    this.anims.create({ key: "winsth-swing", frames: [{ key: "winsth", frame: 5 }] });
    this.anims.create({ key: "winsth-slam", frames: [{ key: "winsth", frame: 6 }] });
    this.anims.create({ key: "winsth-hurt", frames: [{ key: "winsth", frame: 7 }] });
    this.anims.create({ key: "lina-run", frames: this.anims.generateFrameNumbers("lina", { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    for (const key of ["npc-ilda", "npc-worker", "npc-mechanic", "npc-child"]) {
      this.anims.create({ key: `${key}-idle`, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }), frameRate: 2, repeat: -1 });
      this.anims.create({ key: `${key}-walk`, frames: this.anims.generateFrameNumbers(key, { start: 0, end: 1 }), frameRate: 4, repeat: -1 });
    }
    this.scene.start(SCENE.menu);
  }
}
