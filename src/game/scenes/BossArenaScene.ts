import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Winsth } from "../entities/Winsth";
import { RoomWorld } from "../levels/RoomWorld";
import { palette } from "../palette";
import { GAME, SCENE } from "../utils/constants";
import { GROUND } from "../utils/scale";
import { unlockAudio } from "../utils/audio";

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

  constructor() {
    super(SCENE.boss);
  }

  create(): void {
    unlockAudio();
    this.add.tileSprite(GAME.width / 2, 140, GAME.width + 80, 250, "bg-mid").setScrollFactor(0);
    this.info = this.add.text(14, 10, "", {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#c4a36a",
    }).setScrollFactor(0).setDepth(20);
    this.add.text(14, GAME.height - 16, "DEV  ·  J soco  ·  K revolver  ·  R recarregar  ·  F5 reinicia  ·  ESC menu", {
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
    this.physics.world.setBounds(0, 0, ARENA_W, GROUND.worldHeight);
    this.physics.add.collider(this.player, this.world.solids);
    this.physics.add.collider(this.boss, this.world.solids);
    this.cameras.main.setBackgroundColor(palette.charcoal);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.12);
    this.cameras.main.setDeadzone(80, 30);
    this.cameras.main.setBounds(0, 0, ARENA_W, GROUND.worldHeight);
    this.cameras.main.setRoundPixels(true);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("A,D,W,J,K,Z,X,R,ESC,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.stop(SCENE.ui);
      this.scene.start(SCENE.menu);
    });
    this.input.keyboard?.on("keydown-F5", () => this.scene.restart());
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
      this.shots.add(new Projectile(this, this.player.x + this.player.facing * 22, this.player.y - 52, this.player.facing));
    }
    this.boss.think(this.player.x, delta);
    this.resolveCombat();
    this.keepFightersInView();
    this.jumpWasDown = jumpDown;
    this.meleeWasDown = meleeDown;
    this.fireWasDown = fireDown;
    this.info.setText(
      `WINSTH  ${this.boss.hp}/${this.boss.maxHp}   ${this.boss.phase}   ${this.boss.move}\nNero ${this.player.hp}  munição ${this.player.ammo}/6  ·  escala 184/144`,
    );
  }

  private resolveCombat(): void {
    if (this.boss.phase === "ATTACK" && !this.hitOnce) {
      const box = this.boss.attackBox();
      if (Phaser.Geom.Intersects.RectangleToRectangle(box, this.player.getBounds())) {
        this.player.takeHit(this.boss.x);
        this.hitOnce = true;
        if (this.boss.move === "slam") {
          this.cameras.main.shake(160, 0.004);
          this.add.particles(this.boss.x, this.boss.y - 8, "spark", { lifespan: 280, speed: { min: 20, max: 70 }, quantity: 8, duration: 180 });
        }
      }
    }
    if (this.boss.phase !== "ATTACK") this.hitOnce = false;

    this.shots.getChildren().forEach((child) => {
      const shot = child as Projectile;
      if (shot.active && Phaser.Geom.Intersects.RectangleToRectangle(shot.getBounds(), this.boss.getBounds())) {
        this.boss.hit(1, this.player.x);
        shot.destroy();
      }
    });
    if (this.player.attacking && this.player.anims.currentAnim?.key === "player-melee") {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.attackHitbox(), this.boss.getBounds())) {
        this.boss.hit(this.player.lastMeleeDamage(), this.player.x);
      }
    }
  }

  private keepFightersInView(): void {
    const mid = (this.player.x + this.boss.x) / 2;
    const target = Phaser.Math.Clamp(mid, 320, ARENA_W - 320);
    this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, target - 320, 0.06);
  }
}
