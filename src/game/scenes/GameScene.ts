import Phaser from "phaser";
import { Player } from "../entities/Player";
import { Npc } from "../entities/Npc";
import { RoomWorld } from "../levels/RoomWorld";
import { ROOMS } from "../levels/rooms";
import { CITY_GROUND_Y, CITY_HEIGHT, CITY_SPAWN_X, CITY_WIDTH, segmentAt } from "../levels/city";
import { palette } from "../palette";
import { OBJECTIVE_TEXT, type RoomId } from "../systems/progress";
import {
  advanceDialogue,
  closedDialogue,
  currentLine,
  openDialogue,
  tickDialogue,
  type DialogueState,
} from "../systems/dialogue";
import { shouldPlayCrash, startCutscene, tickCutscene, type CutsceneState } from "../systems/cutscene";
import { enterRoom, endPrologue, markTalk, type RunSnapshot } from "../systems/runState";
import { WeatherSystem } from "../systems/weather";
import { LightingRig } from "../systems/lighting";
import { CameraRig } from "../systems/cameraRig";
import { canInteract, canMove, type PlayMode } from "../systems/playState";
import { sfx, unlockAudio } from "../utils/audio";
import { SCENE } from "../utils/constants";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private world!: RoomWorld;
  private weather!: WeatherSystem;
  private lighting!: LightingRig;
  private cam!: CameraRig;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private far!: Phaser.GameObjects.TileSprite;
  private mid!: Phaser.GameObjects.TileSprite;
  private steam?: Phaser.GameObjects.Particles.ParticleEmitter;
  private dialogue: DialogueState = closedDialogue();
  private speaker?: Npc;
  private cutscene?: CutsceneState;
  private lina?: Phaser.GameObjects.Sprite;
  private killer?: Phaser.GameObjects.Image;
  private blackout?: Phaser.GameObjects.Rectangle;
  private mode: PlayMode = "EXPLORING";
  private ended = false;
  private jumpWasDown = false;
  private interactWasDown = false;
  private pauseWasDown = false;
  private debugOn = false;

  constructor() {
    super(SCENE.game);
  }

  create(): void {
    unlockAudio();
    this.ended = false;
    this.cutscene = undefined;
    this.dialogue = closedDialogue();
    this.mode = "EXPLORING";
    this.world = new RoomWorld(this);
    this.weather = new WeatherSystem(this);
    this.lighting = new LightingRig(this);
    this.far = this.add.tileSprite(GAME_CENTER, 96, 760, 220, "bg-far").setScrollFactor(0).setDepth(-4);
    this.mid = this.add.tileSprite(GAME_CENTER, 150, 760, 250, "bg-mid").setScrollFactor(0).setDepth(-3).setAlpha(0.88);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys({
      A: "A",
      D: "D",
      W: "W",
      E: "E",
      ESC: "ESC",
      SPACE: "SPACE",
      ENTER: "ENTER",
      F1: "F1",
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    this.player = new Player(this, CITY_SPAWN_X, CITY_GROUND_Y);
    this.player.combatEnabled = false;
    this.steam = this.add.particles(0, 0, "steam", {
      lifespan: 420,
      speed: { min: 10, max: 30 },
      scale: { start: 0.5, end: 0 },
      emitting: false,
    }).setDepth(12);
    this.player.attachSteam(this.steam);
    this.world.buildCity();
    this.lighting.place(ROOMS.operario.painted?.lamps ?? []);
    this.physics.world.setBounds(0, 0, CITY_WIDTH, CITY_HEIGHT);
    this.cam = new CameraRig(this.cameras.main);
    this.cam.setup(CITY_WIDTH, CITY_HEIGHT, this.player);
    this.cameras.main.setBackgroundColor(palette.bg);
    this.physics.add.collider(this.player, this.world.solids);
    this.physics.add.collider(this.world.npcs, this.world.solids);
    this.debugOn = new URLSearchParams(window.location.search).has("debug");
    if (this.debugOn) this.drawDebug();
    this.setRun(enterRoom(this.run(), "operario"));
    this.weather.apply("clear");
    this.events.emit("hud", this.hudPayload());
  }

  update(_time: number, delta: number): void {
    if (!this.player?.active) return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.F1)) this.toggleDebug();
    const pauseDown = this.keys.ESC.isDown;
    if (pauseDown && !this.pauseWasDown && !this.ended && this.mode !== "CUTSCENE") {
      this.mode = this.mode === "PAUSED" ? "EXPLORING" : "PAUSED";
      this.events.emit(this.mode === "PAUSED" ? "pause" : "unpause");
    }
    this.pauseWasDown = pauseDown;
    if (this.mode === "PAUSED" || this.ended) return;

    this.dialogue = tickDialogue(this.dialogue, delta);
    if (this.mode === "CUTSCENE" || this.cutscene) {
      this.updateCutscene(delta);
      return;
    }

    const interactDown = this.keys.E.isDown || this.keys.ENTER.isDown;
    if (this.mode === "DIALOGUE") {
      this.player.updatePlayer({
        left: false, right: false, jump: false, jumpPressed: false, melee: false, fire: false, reload: false,
      }, delta);
      this.speaker?.setVelocity(0, 0);
      if (interactDown && !this.interactWasDown) {
        this.dialogue = advanceDialogue(this.dialogue);
        sfx.talk();
        if (!this.dialogue.open) this.endDialogue();
      }
      this.interactWasDown = interactDown;
      this.events.emit("dialogue", currentLine(this.dialogue));
      this.events.emit("hud", this.hudPayload());
      return;
    }

    const jumpDown = this.cursors.up.isDown || this.keys.W.isDown || this.keys.SPACE.isDown;
    this.player.updatePlayer(
      {
        left: canMove(this.mode) && (this.cursors.left.isDown || this.keys.A.isDown),
        right: canMove(this.mode) && (this.cursors.right.isDown || this.keys.D.isDown),
        jump: canMove(this.mode) && jumpDown,
        jumpPressed: canMove(this.mode) && jumpDown && !this.jumpWasDown,
        melee: false,
        fire: false,
        reload: false,
      },
      delta,
    );
    this.jumpWasDown = jumpDown;
    this.world.updateMoving();
    if (this.world.cart) this.physics.collide(this.player, this.world.cart);
    this.weather.follow(this.cameras.main.scrollX);
    this.far.tilePositionX = this.cameras.main.scrollX * 0.05;
    this.mid.tilePositionX = this.cameras.main.scrollX * 0.16;
    this.cam.look(this.player.facing);
    this.puffVents();
    this.syncRegion();
    if (this.debugOn) this.drawDebug();

    if (interactDown && !this.interactWasDown && canInteract(this.mode)) this.tryInteract();
    this.interactWasDown = interactDown;
    this.events.emit("dialogue", undefined);
    this.events.emit("hud", this.hudPayload());
  }

  restartFull(): void {
    this.scene.stop(SCENE.ui);
    this.scene.start(SCENE.menu);
  }

  replay(): void {
    this.scene.restart();
  }

  resumePlay(): void {
    this.mode = "EXPLORING";
  }

  private syncRegion(): void {
    const segment = segmentAt(this.player.x);
    if (segment.id !== this.run().roomId) {
      this.setRun(enterRoom(this.run(), segment.id));
      this.weather.apply(ROOMS[segment.id].weather);
    }
  }

  private tryInteract(): void {
    const npc = this.world.nearestNpc(this.player.x, this.player.y);
    if (npc) {
      this.speaker = npc;
      npc.setBusy(true);
      npc.face(this.player.x);
      this.world.freezeNpcs(npc);
      this.dialogue = openDialogue(npc.dialogueId);
      this.mode = "DIALOGUE";
      this.player.setVelocityX(0);
      this.setRun(markTalk(this.run(), npc.npcId));
      sfx.talk();
      this.events.emit("dialogue", currentLine(this.dialogue));
      return;
    }
    const item = this.world.nearestInteractive(this.player.x, this.player.y);
    if (!item) return;
    if (item.kind === "door") {
      const region = segmentAt(this.player.x).id;
      this.dialogue = openDialogue(region === "escola" ? "porteiro" : region === "operario" ? "porta-casa" : "porta-loja");
      this.mode = "DIALOGUE";
      this.player.setVelocityX(0);
      sfx.door();
      this.events.emit("dialogue", currentLine(this.dialogue));
      return;
    }
    if (item.kind === "lever") {
      this.dialogue = openDialogue("alavanca");
      this.mode = "DIALOGUE";
      sfx.steam();
      this.events.emit("dialogue", currentLine(this.dialogue));
      return;
    }
    if (item.kind === "cutscene") this.beginCutscene();
  }

  private endDialogue(): void {
    this.mode = "EXPLORING";
    this.speaker = undefined;
    this.world.releaseNpcs();
  }

  private beginCutscene(): void {
    if (this.cutscene) return;
    this.mode = "CUTSCENE";
    this.cutscene = startCutscene();
    this.player.locked = true;
    this.player.setFlipX(false);
    const school = this.world.nearestInteractive(this.player.x, this.player.y);
    const startX = (school?.x ?? this.player.x) + 90;
    this.lina = this.add.sprite(startX, this.player.y, "lina", 0).setDepth(9);
    this.lina.play("lina-run");
    this.killer = this.add.image(startX + 220, this.player.y + 4, "carriage").setDepth(10);
    this.cameras.main.stopFollow();
    this.cameras.main.pan(this.player.x + 40, this.player.y - 10, 600);
    sfx.bell();
  }

  private updateCutscene(delta: number): void {
    if (!this.cutscene) return;
    const previous = this.cutscene.phase;
    this.cutscene = tickCutscene(this.cutscene, delta);
    if (shouldPlayCrash(previous, this.cutscene.phase)) {
      this.blackout = this.add.rectangle(this.cameras.main.scrollX + 320, this.cameras.main.scrollY + 180, 800, 500, 0x000000, 1).setScrollFactor(1).setDepth(40);
      sfx.crash();
      this.lina?.setVisible(false);
      this.killer?.setVisible(false);
    }
    if (this.cutscene.phase === "approach") this.player.x += 0.15;
    if (this.cutscene.phase === "daughter" && this.lina) {
      this.lina.x -= 1.15;
      this.player.setFlipX(false);
    }
    if (this.cutscene.phase === "vehicle" && this.killer && this.lina) {
      this.killer.x -= 3.4;
      this.lina.x -= 1.05;
    }
    if (this.cutscene.phase === "title") {
      this.blackout?.setAlpha(1);
      this.setRun(endPrologue(this.run()));
    }
    if (this.cutscene.phase === "done") {
      this.ended = true;
      this.events.emit("prologue-end", this.run());
    }
    this.events.emit("cutscene", this.cutscene.phase);
    this.events.emit("hud", this.hudPayload());
  }

  private puffVents(): void {
    if (!this.steam || this.time.now % 18 > 2) return;
    this.world.vents.forEach((vent) => this.steam?.emitParticle(1, vent.x, vent.y));
  }

  private debugGfx?: Phaser.GameObjects.Graphics;

  private toggleDebug(): void {
    this.debugOn = !this.debugOn;
    this.drawDebug();
  }

  private drawDebug(): void {
    this.debugGfx?.destroy();
    this.debugGfx = undefined;
    if (!this.debugOn) return;
    const gfx = this.add.graphics().setDepth(30);
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    gfx.lineStyle(1, 0xe6c36a, 1);
    gfx.strokeRect(body.x, body.y, body.width, body.height);
    gfx.fillStyle(0xff3355, 1);
    gfx.fillCircle(this.player.x, this.player.y, 2);
    gfx.lineStyle(1, 0x7d8894, 0.9);
    gfx.lineBetween(0, CITY_GROUND_Y, CITY_WIDTH, CITY_GROUND_Y);
    this.debugGfx = gfx;
  }

  private run(): RunSnapshot {
    return this.registry.get("run") as RunSnapshot;
  }

  private setRun(next: RunSnapshot): void {
    this.registry.set("run", next);
  }

  private hudPayload() {
    const run = this.run();
    const near = this.world.nearestNpc(this.player.x, this.player.y) || this.world.nearestInteractive(this.player.x, this.player.y);
    return {
      room: ROOMS[run.roomId as RoomId].title,
      objective: OBJECTIVE_TEXT[run.objective],
      prompt: this.mode === "DIALOGUE" || this.cutscene ? "" : near ? "E  interagir" : "",
      ammo: 0,
      showCombat: false,
    };
  }
}

const GAME_CENTER = 320;
