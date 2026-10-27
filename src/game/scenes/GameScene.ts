import Phaser from "phaser";
import { Player } from "../entities/Player";
import { PatrolDrone } from "../entities/enemies/PatrolDrone";
import { Sentinel } from "../entities/enemies/Sentinel";
import { RoomWorld } from "../levels/RoomWorld";
import { ROOMS, defaultSpawn, roomSize, type ExitDir } from "../levels/rooms";
import { canPassBarrier } from "../mechanics/neonDash";
import { palette } from "../palette";
import { OBJECTIVE_TEXT, shouldWin, type RoomId } from "../systems/progress";
import {
  createRun,
  enterRoom,
  extractCore,
  respawn,
  touchCheckpoint,
  unlockDash,
  type RunSnapshot,
} from "../systems/runState";
import { sfx } from "../utils/audio";
import { GAME, PLAYER, SCENE } from "../utils/constants";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private world!: RoomWorld;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private far!: Phaser.GameObjects.TileSprite;
  private mid!: Phaser.GameObjects.TileSprite;
  private near!: Phaser.GameObjects.TileSprite;
  private paused = false;
  private ended = false;
  private jumpWasDown = false;
  private interactWasDown = false;
  private dashWasDown = false;
  private pauseWasDown = false;

  constructor() {
    super(SCENE.game);
  }

  create(): void {
    this.paused = false;
    this.ended = false;
    this.world = new RoomWorld(this);
    const { width, height } = this.scale;
    this.far = this.add.tileSprite(width / 2, height / 2, width + 40, height + 40, "bg-far").setScrollFactor(0).setDepth(-3);
    this.mid = this.add.tileSprite(width / 2, height / 2, width + 40, height + 40, "bg-mid").setScrollFactor(0).setDepth(-2);
    this.near = this.add.tileSprite(width / 2, height / 2, width + 40, height + 40, "bg-near").setScrollFactor(0).setDepth(-1);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys({
      A: "A",
      D: "D",
      W: "W",
      Z: "Z",
      J: "J",
      K: "K",
      L: "L",
      E: "E",
      SHIFT: "SHIFT",
      ESC: "ESC",
      SPACE: "SPACE",
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    const run = this.run();
    const spawn = defaultSpawn(ROOMS[run.roomId]);
    this.player = new Player(this, spawn.x, spawn.y);
    this.player.syncFromRun(run.hp, run.hasDash);
    const slash = this.add.sprite(spawn.x, spawn.y, "slash", 0);
    this.player.attachSlash(slash);
    this.loadRoom(run.roomId);
    this.cameras.main.startFollow(this.player, true, 0.14, 0.14);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setDeadzone(36, 20);
    this.cameras.main.setBackgroundColor(palette.bg);
    this.physics.add.collider(this.player, this.world.solids);
    this.physics.add.overlap(this.player, this.world.hazards, () => this.hurtPlayer(this.player.x));
    this.physics.add.overlap(this.player, this.world.exits, (_player, exit) => {
      this.tryExit(this.world.exitDir(exit as Phaser.GameObjects.GameObject));
    });
    this.physics.add.overlap(this.player, this.world.enemies, (_player, enemy) => {
      this.hurtPlayer((enemy as Phaser.GameObjects.Sprite).x);
    });
    this.physics.world.on("worldbounds", () => undefined);
    this.events.emit("hud", this.hudPayload());
  }

  update(_time: number, delta: number): void {
    if (!this.player?.active) return;
    const pauseDown = this.keys.ESC.isDown;
    if (pauseDown && !this.pauseWasDown && !this.ended) {
      this.togglePause();
    }
    this.pauseWasDown = pauseDown;
    if (this.paused || this.ended) return;

    const jumpDown = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown;
    const dashDown = this.keys.SHIFT.isDown || this.keys.L.isDown;
    const interactDown = this.keys.E.isDown;
    this.player.updatePlayer(
      {
        left: this.cursors.left.isDown || this.keys.A.isDown,
        right: this.cursors.right.isDown || this.keys.D.isDown,
        jump: jumpDown,
        jumpPressed: jumpDown && !this.jumpWasDown,
        attack: this.keys.Z.isDown || this.keys.J.isDown || this.keys.K.isDown,
        dash: dashDown && !this.dashWasDown,
      },
      delta,
    );
    this.jumpWasDown = jumpDown;
    this.dashWasDown = dashDown;
    this.world.updateMoving();
    if (this.world.moving) {
      this.physics.collide(this.player, this.world.moving);
    }
    this.updateBarriers();
    this.updateCombat();
    if (interactDown && !this.interactWasDown) this.tryInteract();
    this.interactWasDown = interactDown;
    this.far.tilePositionX = this.cameras.main.scrollX * 0.12;
    this.mid.tilePositionX = this.cameras.main.scrollX * 0.28;
    this.near.tilePositionX = this.cameras.main.scrollX * 0.48;
    this.events.emit("hud", this.hudPayload());
  }

  restartFromCheckpoint(): void {
    this.ended = false;
    this.paused = false;
    this.registry.set("run", respawn(this.run()));
    const run = this.run();
    this.player.syncFromRun(run.hp, run.hasDash);
    this.loadRoom(run.checkpoint.roomId, undefined, run.checkpoint);
    this.scene.resume();
    this.events.emit("hud", this.hudPayload());
  }

  restartFull(): void {
    this.scene.stop(SCENE.ui);
    this.scene.start(SCENE.menu);
  }

  replay(): void {
    this.ended = false;
    this.paused = false;
    this.registry.set("run", createRun());
    this.scene.restart();
  }

  resumePlay(): void {
    this.paused = false;
    this.scene.resume();
  }

  private togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.events.emit("pause");
    } else {
      this.events.emit("unpause");
    }
  }

  private run(): RunSnapshot {
    return this.registry.get("run") as RunSnapshot;
  }

  private setRun(next: RunSnapshot): void {
    this.registry.set("run", next);
  }

  private loadRoom(roomId: RoomId, from?: ExitDir, exact?: { x: number; y: number }): void {
    const def = ROOMS[roomId];
    const size = roomSize(def);
    this.world.build(def);
    this.physics.world.setBounds(0, 0, size.width, size.height);
    this.cameras.main.setBounds(0, 0, size.width, size.height);
    const spawn = exact ?? defaultSpawn(def, from);
    this.player.setPosition(spawn.x, spawn.y);
    this.player.setVelocity(0, 0);
    this.setRun(enterRoom(this.run(), roomId));
    this.player.syncFromRun(this.run().hp, this.run().hasDash);
    this.cameras.main.flash(180, 8, 16, 28);
  }

  private tryExit(dir: ExitDir): void {
    const target = ROOMS[this.run().roomId].connections[dir];
    if (!target) return;
    if (dir === "nexus" && !this.run().hasDash) return;
    this.loadRoom(target, dir === "nexus" ? undefined : dir === "right" ? "left" : "right");
  }

  private updateBarriers(): void {
    const pass = canPassBarrier(this.player.hasDash, this.player.isDashing);
    this.world.barriers.getChildren().forEach((child) => {
      const body = (child as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.StaticBody;
      body.checkCollision.none = pass;
    });
    if (!pass) {
      this.physics.collide(this.player, this.world.barriers);
    }
  }

  private updateCombat(): void {
    if (!this.player.attacking) return;
    const box = this.player.attackHitbox();
    this.world.enemies.getChildren().forEach((child) => {
      const enemy = child as PatrolDrone | Sentinel;
      if (!enemy.active) return;
      if (Phaser.Geom.Intersects.RectangleToRectangle(box, enemy.getBounds())) {
        const dead = enemy.hit(PLAYER.attackDamage);
        if (dead) this.cameras.main.shake(70, 0.002);
      }
    });
  }

  private tryInteract(): void {
    const item = this.world.nearestInteractive(this.player.x, this.player.y);
    if (!item) return;
    if (item.kind === "checkpoint") {
      this.setRun(touchCheckpoint(this.run(), { roomId: this.run().roomId, x: item.x, y: item.y }));
      this.player.hp = this.run().hp;
      sfx.checkpoint();
      return;
    }
    if (item.kind === "dash") {
      this.setRun(unlockDash(this.run()));
      this.player.hasDash = true;
      this.world.consume(item);
      sfx.unlock();
      this.cameras.main.flash(220, 45, 226, 230);
      return;
    }
    if (item.kind === "terminal") {
      this.events.emit("toast", "Terminal NEXUS: avance para o Setor Ferrugem.");
      sfx.ui();
      return;
    }
    if (item.kind === "core") {
      this.setRun(extractCore(this.run()));
      if (shouldWin(this.run().roomId, this.run().extracted)) {
        this.ended = true;
        sfx.win();
        this.events.emit("win", this.run());
      }
    }
  }

  private hurtPlayer(fromX: number): void {
    if (this.ended) return;
    const hit = this.player.takeHit(fromX);
    if (!hit) return;
    this.setRun({ ...this.run(), hp: this.player.hp });
    if (this.player.hp <= 0) {
      this.ended = true;
      sfx.death();
      this.events.emit("death");
    }
  }

  private hudPayload() {
    const run = this.run();
    return {
      hp: this.player.hp,
      maxHp: PLAYER.maxHp,
      hasDash: run.hasDash,
      dashing: this.player.isDashing,
      room: ROOMS[run.roomId].title,
      objective: OBJECTIVE_TEXT[run.objective],
    };
  }
}

export const VIEW = GAME;
