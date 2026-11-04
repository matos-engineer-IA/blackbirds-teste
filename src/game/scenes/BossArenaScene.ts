import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Winsth } from "../entities/Winsth";
import { RoomWorld } from "../levels/RoomWorld";
import { palette } from "../palette";
import { GAME, SCENE } from "../utils/constants";
import { GROUND } from "../utils/scale";
import { setAudioRegion, unlockAudio } from "../utils/audio";
import { CameraRig } from "../systems/cameraRig";
import { bodyBounds, hurtBounds } from "../utils/footAnchor";
import { PressureWave } from "../entities/PressureWave";
import type { WinsthMove } from "../mechanics/bossAttacks";
import { ActionInput } from "../systems/actionInput";
import { ArenaLifecycle } from "../systems/arenaLifecycle";
import { getSettings, keyFor } from "../systems/settings";

const ARENA_W = 1280;

export class BossArenaScene extends Phaser.Scene {
  private player!: Player;
  private boss!: Winsth;
  private world!: RoomWorld;
  private shots!: Phaser.Physics.Arcade.Group;
  private actions!: ActionInput;
  private lifecycle!: ArenaLifecycle;
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
    unlockAudio();
    setAudioRegion("arena");
    this.actions = new ActionInput(this);
    this.lifecycle = new ArenaLifecycle(this, this.actions);
    this.add.tileSprite(GAME.width / 2, 140, GAME.width + 80, 250, "bg-mid").setScrollFactor(0);
    this.add.image(0, GROUND.y, "worker-street-1").setOrigin(0, 1).setDepth(1).setTint(0xb5a99a);
    this.info = this.add.text(14, 10, "", {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#c4a36a",
    }).setScrollFactor(0).setDepth(20);
    this.add.text(14, GAME.height - 16, `ARENA · 1–4 ataque · 0 auto · ${keyFor("melee")} soco · ${keyFor("fire")} tiro · ${keyFor("dodge")} esquiva · F5 reset · ${keyFor("pause")} pausa`, {
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
    this.physics.add.collider(this.shots, this.world.solids, shot => (shot as Projectile).destroy());
    this.cameras.main.setBackgroundColor(palette.charcoal);
    this.cameraRig = new CameraRig(this.cameras.main);
    this.cameraRig.setup(ARENA_W, GROUND.worldHeight, this.player);
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
    const input = this.actions.sample();
    if (input.pressed.pause) { this.lifecycle.pause(); return; }
    const shotBefore = this.player.shotSerial;
    this.player.updatePlayer(
      {
        left: input.down.left, right: input.down.right, jump: input.down.jump,
        jumpPressed: input.pressed.jump, melee: input.pressed.melee, fire: input.pressed.fire,
        reload: input.pressed.reload, dodgePressed: input.pressed.dodge,
      },
      delta,
    );
    if (this.player.shotSerial !== shotBefore) {
      new Projectile(this, Phaser.Math.Clamp(this.player.x + this.player.facing * 72, 6, this.physics.world.bounds.width - 6), this.player.y - 64, this.player.facing, this.shots, this.player.x + this.player.facing * 18);
    }
    if (this.player.hp > 0) this.boss.think(this.player.x, delta);
    else this.boss.setVelocityX(0);
    if (this.boss.takeWaveRequest()) new PressureWave(this, this.boss.x + this.boss.facing * 32, this.boss.y, this.boss.facing, this.waves);
    this.resolveCombat();
    if (this.boss.defeated || this.player.hp <= 0) { this.lifecycle.pause(this.boss.defeated ? "Confronto concluído" : "Nero precisa recuperar o fôlego", true); return; }
    this.drawTelegraph();
    this.cameraRig.look(this.player.facing, delta);
    this.info.setText(
      `WINSTH  ${this.boss.hp}/${this.boss.maxHp}   ${this.boss.phase}   ${this.boss.move}\nNero ${this.player.hp} · munição ${this.player.ammo}/6 · reserva ${this.player.reserveAmmo}${getSettings().combatAssist ? " · assistência" : ""}`,
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
      if (Phaser.Geom.Intersects.RectangleToRectangle(box, hurtBounds(this.player))) {
        this.player.takeHit(this.boss.x);
        this.hitOnce = true;
        if (this.boss.move === "slam") {
          if (!getSettings().reducedMotion) this.cameras.main.shake(160, 0.004);
          this.add.particles(this.boss.x, this.boss.y - 8, "spark", { lifespan: 280, speed: { min: 20, max: 70 }, quantity: 8, duration: 180 });
        }
      }
    }
    if (this.boss.phase !== "ATTACK") this.hitOnce = false;
    this.waves.getChildren().forEach(child => {
      const wave = child as PressureWave;
      if (wave.active && Phaser.Geom.Intersects.RectangleToRectangle(bodyBounds(wave), hurtBounds(this.player))) {
        this.player.takeHit(wave.x);
        wave.destroy();
      }
    });

    this.shots.getChildren().forEach((child) => {
      const shot = child as Projectile;
      if (shot.active && !this.boss.defeated && Phaser.Geom.Intersects.RectangleToRectangle(shot.sweptBounds(), hurtBounds(this.boss))) {
        this.boss.hit(1, this.player.x);
        shot.destroy();
      } else shot.recordStep();
    });
    if (this.player.meleeActive && !this.boss.defeated) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.attackHitbox(), hurtBounds(this.boss)) && this.player.consumeMeleeHit(this.boss)) {
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
