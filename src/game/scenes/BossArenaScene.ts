import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Winsth } from "../entities/Winsth";
import { RoomWorld } from "../levels/RoomWorld";
import { palette } from "../palette";
import { GAME, SCENE } from "../utils/constants";
import { GROUND } from "../utils/scale";
import { unlockAudio } from "../utils/audio";
import { CameraRig } from "../systems/cameraRig";
import { bodyBounds } from "../utils/footAnchor";
import { PressureWave } from "../entities/PressureWave";
import type { WinsthMove } from "../mechanics/bossAttacks";

const ARENA_W = 1280;

export class BossArenaScene extends Phaser.Scene {
  private player!: Player;
  private boss!: Winsth;
  private world!: RoomWorld;
  private shots!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private jumpWasDown = false;
  private meleeWasDown = false;
  private fireWasDown = false;
  private hitOnce = false;
  private info!: Phaser.GameObjects.Text;
  private cameraRig!: CameraRig;
  private waves!: Phaser.Physics.Arcade.Group;
  private telegraph!: Phaser.GameObjects.Graphics;

  constructor() {
    super(SCENE.boss);
  }

  create(): void {
    this.hitOnce = false;
    this.jumpWasDown = this.meleeWasDown = this.fireWasDown = false;
    unlockAudio();
    this.add.tileSprite(GAME.width / 2, 140, GAME.width + 80, 250, "bg-mid").setScrollFactor(0);
    this.info = this.add.text(14, 10, "", {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#c4a36a",
    }).setScrollFactor(0).setDepth(20);
    this.add.text(14, GAME.height - 16, "DEV · arte provisória · 1–4 ataque · 0 auto · J soco · K tiro · R recarga · F5 reset · ESC menu", {
      fontFamily: "Georgia, serif",
      fontSize: "10px",
      color: "#9a8770",
    }).setScrollFactor(0).setDepth(20);

    this.world = new RoomWorld(this);
    this.world.buildArena(ARENA_W);
    this.player = new Player(this, 180, GROUND.y);
    this.player.combatEnabled = true;
    this.boss = new Winsth(this, 820, GROUND.y);
    this.shots = this.physics.add.group();
    this.waves = this.physics.add.group();
    this.telegraph = this.add.graphics().setDepth(9);
    this.physics.world.setBounds(0, 0, ARENA_W, GROUND.worldHeight);
    this.physics.add.collider(this.player, this.world.solids);
    this.physics.add.collider(this.boss, this.world.solids);
    this.cameras.main.setBackgroundColor(palette.charcoal);
    this.cameraRig = new CameraRig(this.cameras.main);
    this.cameraRig.setup(ARENA_W, GROUND.worldHeight, this.player);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("A,D,W,J,K,Z,X,R,ESC,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.stop(SCENE.ui);
      this.scene.start(SCENE.menu);
    });
    this.input.keyboard?.on("keydown-F5", () => this.scene.restart());
    this.input.keyboard?.addCapture("F5");
    const moves: WinsthMove[] = ["horizontal", "slam", "charge", "wave"];
    this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
      if (event.code === "Digit0") this.boss.forcedMove = undefined;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < moves.length) this.boss.forcedMove = moves[index];
    });
  }

  update(_time: number, delta: number): void {
    const jumpDown = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown;
    const meleeDown = this.keys.J.isDown || this.keys.Z.isDown;
    const fireDown = this.keys.K.isDown || this.keys.X.isDown;
    const ammoBefore = this.player.ammo;
    this.player.updatePlayer(
      {
        left: this.cursors.left.isDown || this.keys.A.isDown,
        right: this.cursors.right.isDown || this.keys.D.isDown,
        jump: jumpDown,
        jumpPressed: jumpDown && !this.jumpWasDown,
        melee: meleeDown && !this.meleeWasDown,
        fire: fireDown && !this.fireWasDown,
        reload: Phaser.Input.Keyboard.JustDown(this.keys.R),
      },
      delta,
    );
    if (this.player.ammo < ammoBefore) {
      new Projectile(this, this.player.x + this.player.facing * 22, this.player.y - 44, this.player.facing, this.shots);
    }
    if (this.player.hp > 0) this.boss.think(this.player.x, delta);
    else this.boss.setVelocityX(0);
    if (this.boss.takeWaveRequest()) new PressureWave(this, this.boss.x + this.boss.facing * 32, this.boss.y, this.boss.facing, this.waves);
    this.resolveCombat();
    this.drawTelegraph();
    this.cameraRig.look(this.player.facing, delta);
    this.jumpWasDown = jumpDown;
    this.meleeWasDown = meleeDown;
    this.fireWasDown = fireDown;
    this.info.setText(
      `WINSTH  ${this.boss.hp}/${this.boss.maxHp}   ${this.boss.phase}   ${this.boss.move}\nNero ${this.player.hp}  munição ${this.player.ammo}/6  ·  ${this.boss.forcedMove ? "ataque isolado" : "seleção automática"}`,
    );
  }

  private resolveCombat(): void {
    if (this.boss.defeated || this.player.hp <= 0) {
      this.waves.clear(true, true);
      this.shots.clear(true, true);
      return;
    }
    if (this.boss.phase === "ATTACK" && !this.hitOnce) {
      const box = this.boss.attackBox();
      if (Phaser.Geom.Intersects.RectangleToRectangle(box, bodyBounds(this.player))) {
        this.player.takeHit(this.boss.x);
        this.hitOnce = true;
        if (this.boss.move === "slam") {
          this.cameras.main.shake(160, 0.004);
          this.add.particles(this.boss.x, this.boss.y - 8, "spark", { lifespan: 280, speed: { min: 20, max: 70 }, quantity: 8, duration: 180 });
        }
      }
    }
    if (this.boss.phase !== "ATTACK") this.hitOnce = false;
    this.waves.getChildren().forEach(child => {
      const wave = child as PressureWave;
      if (wave.active && Phaser.Geom.Intersects.RectangleToRectangle(bodyBounds(wave), bodyBounds(this.player))) {
        this.player.takeHit(wave.x);
        wave.destroy();
      }
    });

    this.shots.getChildren().forEach((child) => {
      const shot = child as Projectile;
      if (shot.active && !this.boss.defeated && Phaser.Geom.Intersects.RectangleToRectangle(shot.getBounds(), bodyBounds(this.boss))) {
        this.boss.hit(1, this.player.x);
        shot.destroy();
      }
    });
    if (this.player.meleeActive && !this.boss.defeated) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.attackHitbox(), bodyBounds(this.boss)) && this.player.consumeMeleeHit(this.boss)) {
        this.boss.hit(this.player.lastMeleeDamage(), this.player.x);
      }
    }
  }

  private drawTelegraph(): void {
    const gfx = this.telegraph.clear();
    if (this.boss.phase !== "TELEGRAPH" || this.player.hp <= 0) return;
    gfx.lineStyle(2, 0xe6c36a, 0.9);
    if (this.boss.move === "wave") {
      gfx.strokeEllipse(this.boss.x + this.boss.facing * 30, GROUND.y - 12, 34, 20);
      gfx.lineBetween(this.boss.x + this.boss.facing * 45, GROUND.y - 4, this.boss.x + this.boss.facing * 200, GROUND.y - 4);
    } else if (this.boss.move === "charge") {
      const endX = this.boss.x + this.boss.facing * 150;
      gfx.lineBetween(this.boss.x, GROUND.y - 12, endX, GROUND.y - 12);
      gfx.strokeTriangle(endX, GROUND.y - 12, endX - this.boss.facing * 16, GROUND.y - 20, endX - this.boss.facing * 16, GROUND.y - 4);
    } else {
      const box = this.boss.attackBox();
      gfx.strokeRect(box.x, box.y, box.width, box.height);
    }
  }
}
