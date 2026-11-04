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
import { createRun, enterRoom, endPrologue, markTalk, type RunSnapshot } from "../systems/runState";
import { WeatherSystem } from "../systems/weather";
import { LightingRig } from "../systems/lighting";
import { CameraRig } from "../systems/cameraRig";
import { canInteract, canMove, type PlayMode } from "../systems/playState";
import { clearAudioCaption, pauseAudio, quietAmbience, resumeAudio, setAudioRegion, sfx, unlockAudio } from "../utils/audio";
import { SCENE } from "../utils/constants";
import { ActionInput } from "../systems/actionInput";
import { keyFor } from "../systems/settings";
import { loadOpening, saveOpening } from "../systems/saveGame";

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private world!: RoomWorld;
  private weather!: WeatherSystem;
  private lighting!: LightingRig;
  private cam!: CameraRig;
  private actions!: ActionInput;
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
  private debugOn = false;
  private modeBeforePause: PlayMode = "EXPLORING";
  private lastPlayerX = CITY_SPAWN_X;
  private lastSaveAt = 0;
  private lastSaveX = CITY_SPAWN_X;
  private warnedStorage = false;
  private crashTimer?: Phaser.Time.TimerEvent;
  private initialSavePending = true;

  constructor() {
    super(SCENE.game);
  }

  create(data: { resume?: boolean } = {}): void {
    unlockAudio();
    this.ended = false;
    this.cutscene = undefined;
    this.dialogue = closedDialogue();
    this.mode = "EXPLORING";
    this.speaker = undefined;
    this.lina = undefined;
    this.killer = undefined;
    this.blackout = undefined;
    this.crashTimer = undefined;
    const saved = data.resume ? loadOpening().save : undefined;
    const restored = saved && !saved.completed && saved.checkpoint.x >= 12 && saved.checkpoint.x <= CITY_WIDTH - 12 && segmentAt(saved.checkpoint.x).id === saved.checkpoint.roomId ? saved : undefined;
    const spawnX = restored?.checkpoint.x ?? CITY_SPAWN_X;
    this.lastPlayerX = spawnX;
    this.lastSaveX = spawnX;
    this.lastSaveAt = this.time.now;
    this.warnedStorage = false;
    this.initialSavePending = !restored;
    this.debugGfx = undefined;
    this.setRun(restored ? { ...createRun(), roomId: restored.checkpoint.roomId, talked: restored.talked, activeWalkMs: restored.activeWalkMs, walkDistance: restored.walkDistance } : createRun());
    this.world = new RoomWorld(this);
    this.weather = new WeatherSystem(this);
    this.lighting = new LightingRig(this);
    this.far = this.add.tileSprite(GAME_CENTER, 96, 760, 220, "bg-far").setScrollFactor(0).setDepth(-4);
    this.mid = this.add.tileSprite(GAME_CENTER, 150, 760, 250, "bg-mid").setScrollFactor(0).setDepth(-3).setAlpha(0.88);
    this.actions = new ActionInput(this);
    this.keys = this.input.keyboard!.addKeys("F1") as Record<string, Phaser.Input.Keyboard.Key>;
    this.player = new Player(this, spawnX, CITY_GROUND_Y);
    this.player.facing = restored?.checkpoint.facing ?? 1;
    this.player.combatEnabled = false;
    this.steam = this.add.particles(0, 0, "steam", {
      lifespan: 420,
      speed: { min: 10, max: 30 },
      scale: { start: 0.5, end: 0 },
      emitting: false,
    }).setDepth(12);
    this.player.attachSteam(this.steam);
    this.world.buildCity(restored?.flags);
    this.lighting.place([]); // Lamps are painted into the new facades, not floating over them.
    this.physics.world.setBounds(0, 0, CITY_WIDTH, CITY_HEIGHT);
    this.cam = new CameraRig(this.cameras.main);
    this.cam.setup(CITY_WIDTH, CITY_HEIGHT, this.player);
    this.cameras.main.setBackgroundColor(palette.bg);
    this.physics.add.collider(this.player, this.world.solids);
    this.physics.add.collider(this.world.npcs, this.world.solids);
    this.debugOn = new URLSearchParams(window.location.search).has("debug");
    if (this.debugOn) this.drawDebug();
    const initialRegion = segmentAt(spawnX).id;
    this.setRun(enterRoom(this.run(), initialRegion));
    this.weather.apply(ROOMS[initialRegion].weather);
    setAudioRegion(initialRegion);
    const onBlur = () => {
      this.input.keyboard?.resetKeys();
      this.actions.clear();
      this.pausePlay();
    };
    this.game.events.on(Phaser.Core.Events.BLUR, onBlur);
    this.game.events.on(Phaser.Core.Events.HIDDEN, onBlur);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off(Phaser.Core.Events.BLUR, onBlur);
      this.game.events.off(Phaser.Core.Events.HIDDEN, onBlur);
    });
    this.events.emit("hud", this.hudPayload());
  }

  update(_time: number, delta: number): void {
    if (!this.player?.active) return;
    const input = this.actions.sample();
    if (Phaser.Input.Keyboard.JustDown(this.keys.F1)) this.toggleDebug();
    if (input.pressed.pause && !this.ended) this.pausePlay();
    if (this.mode === "PAUSED" || this.ended) return;

    this.dialogue = tickDialogue(this.dialogue, delta);
    if (this.mode === "CUTSCENE" || this.cutscene) {
      if (input.pressed.skip) { this.finishCutscene(); return; }
      this.updateCutscene(delta);
      return;
    }

    if (this.mode === "DIALOGUE") {
      if (this.speaker && !this.speaker.active) this.endDialogue();
      this.player.updatePlayer({
        left: false, right: false, jump: false, jumpPressed: false, melee: false, fire: false, reload: false,
      }, delta);
      this.speaker?.setVelocityX(0);
      if (input.pressed.interact) {
        this.dialogue = advanceDialogue(this.dialogue);
        sfx.talk();
        if (!this.dialogue.open) this.endDialogue();
      }
      this.events.emit("dialogue", currentLine(this.dialogue));
      this.events.emit("hud", this.hudPayload());
      return;
    }

    this.player.updatePlayer(
      {
        left: canMove(this.mode) && input.down.left,
        right: canMove(this.mode) && input.down.right,
        jump: canMove(this.mode) && input.down.jump,
        jumpPressed: canMove(this.mode) && input.pressed.jump,
        melee: false,
        fire: false,
        reload: false,
      },
      delta,
    );
    this.world.updateMoving(this.player.x);
    // The avenue carriage travels behind the pedestrian plane; it is scenery,
    // not an invisible moving gate on the only route back to the neighbourhood.
    this.weather.follow(this.cameras.main.scrollX);
    this.far.tilePositionX = this.cameras.main.scrollX * 0.05;
    this.mid.tilePositionX = this.cameras.main.scrollX * 0.16;
    this.cam.look(this.player.facing, delta);
    this.puffVents();
    this.syncRegion();
    const moved = Math.abs(this.player.x - this.lastPlayerX);
    if (moved > 0.05 && this.mode === "EXPLORING") {
      const run = this.run();
      this.setRun({ ...run, activeWalkMs: run.activeWalkMs + Math.min(delta, 50), walkDistance: run.walkDistance + moved });
    }
    this.lastPlayerX = this.player.x;
    if (this.initialSavePending && this.player.onGround) this.saveCheckpoint();
    if (this.time.now - this.lastSaveAt >= 5000 && Math.abs(this.player.x - this.lastSaveX) > 100) this.saveCheckpoint();
    if (this.debugOn) this.drawDebug();

    if (input.pressed.interact && canInteract(this.mode)) this.tryInteract();
    this.events.emit("dialogue", currentLine(this.dialogue));
    this.events.emit("hud", this.hudPayload());
  }

  restartFull(): void {
    this.saveCheckpoint();
    resumeAudio();
    this.scene.stop(SCENE.ui);
    this.scene.start(SCENE.menu);
  }

  replay(): void {
    resumeAudio();
    this.events.emit("unpause");
    this.scene.stop(SCENE.ui);
    this.scene.restart({ resume: false });
    this.scene.launch(SCENE.ui);
  }

  resumePlay(): void {
    if (this.mode !== "PAUSED") return;
    this.input.keyboard?.resetKeys();
    this.actions.clear();
    this.mode = this.modeBeforePause;
    this.scene.resume();
    resumeAudio();
    this.events.emit("unpause");
  }

  pausePlay(): void {
    if (this.mode === "PAUSED" || this.ended) return;
    this.saveCheckpoint();
    this.modeBeforePause = this.mode;
    this.mode = "PAUSED";
    this.scene.pause();
    pauseAudio();
    this.events.emit("pause");
  }

  private syncRegion(): void {
    const segment = segmentAt(this.player.x);
    if (segment.id !== this.run().roomId) {
      this.setRun(enterRoom(this.run(), segment.id));
      this.weather.apply(ROOMS[segment.id].weather);
      setAudioRegion(segment.id);
      this.saveCheckpoint();
    }
  }

  private tryInteract(): void {
    // Conversations start on a valid contact, never freeze Nero in midair.
    if (!this.player.onGround) return;
    const npc = this.world.nearestNpc(this.player.x, this.player.y);
    if (npc) {
      this.speaker = npc;
      npc.setBusy(true);
      npc.face(this.player.x);
      this.dialogue = openDialogue(npc.dialogueId);
      this.mode = "DIALOGUE";
      this.player.locked = true;
      this.player.setVelocityX(0);
      this.setRun(markTalk(this.run(), npc.npcId));
      sfx.talk();
      this.events.emit("dialogue", currentLine(this.dialogue));
      return;
    }
    const item = this.world.nearestInteractive(this.player.x, this.player.y);
    if (!item) return;
    if (item.kind === "inspect") {
      this.dialogue = openDialogue(item.dialogue ?? "porta-casa");
      this.mode = "DIALOGUE"; this.player.locked = true; this.player.setVelocityX(0);
      this.events.emit("dialogue", currentLine(this.dialogue));
      return;
    }
    if (item.kind === "door") {
      this.world.toggleInteraction(item);
      const region = segmentAt(this.player.x).id;
      this.dialogue = openDialogue(region === "escola" ? "porteiro" : region === "operario" ? "porta-casa" : "porta-loja");
      this.mode = "DIALOGUE";
      this.player.locked = true;
      this.player.setVelocityX(0);
      sfx.door();
      this.events.emit("dialogue", currentLine(this.dialogue));
      return;
    }
    if (item.kind === "lever") {
      this.world.toggleInteraction(item);
      this.dialogue = openDialogue("alavanca");
      this.mode = "DIALOGUE";
      this.player.locked = true;
      this.player.setVelocityX(0);
      sfx.steam();
      this.events.emit("dialogue", currentLine(this.dialogue));
      return;
    }
    if (item.kind === "cutscene") this.beginCutscene();
  }

  private endDialogue(): void {
    this.dialogue = closedDialogue();
    this.mode = "EXPLORING";
    this.player.locked = false;
    this.player.jumpBufferMs = 0;
    this.speaker?.setBusy(false);
    this.speaker = undefined;
    this.world.releaseNpcs();
    this.actions.sample();
    this.saveCheckpoint();
  }

  private saveCheckpoint(x = this.player?.x, completed = this.run()?.prologueEnded ?? false): void {
    if (!this.player || x === undefined || (!this.player.onGround && !completed)) return;
    this.initialSavePending = false;
    const safeX = Math.max(12, Math.min(CITY_WIDTH - 12, x));
    const run = this.run();
    const stored = saveOpening({ version: 1, contentVersion: "opening-2", savedAt: Date.now(), checkpoint: { x: safeX, roomId: segmentAt(safeX).id, facing: this.player.facing }, talked: run.talked, flags: { ...this.world.flags }, activeWalkMs: run.activeWalkMs, walkDistance: run.walkDistance, completed });
    this.lastSaveAt = this.time.now;
    this.lastSaveX = safeX;
    if (!stored && !this.warnedStorage) { this.warnedStorage = true; this.events.emit("notice", "Não foi possível salvar. Esta sessão continua normalmente."); }
  }

  private beginCutscene(): void {
    if (this.cutscene) return;
    this.saveCheckpoint(this.player.x - 64);
    this.mode = "CUTSCENE";
    this.cutscene = startCutscene();
    this.player.locked = true;
    this.player.setVelocityX(0);
    this.player.anims.play("player-idle", true);
    this.player.setFlipX(false);
    const school = this.world.nearestInteractive(this.player.x, this.player.y);
    const startX = (school?.x ?? this.player.x) + 90;
    this.lina = this.add.sprite(startX, this.player.y, "lina", 0).setOrigin(0.5, 104 / 112).setScale(.55).setDepth(9);
    this.killer = this.add.image(startX + 330, this.player.y, "carriage").setOrigin(0.5, 248 / 256).setScale(.5).setDepth(10).setVisible(false);
    this.cam.cinematic(this.player.x + 100, this.player.y - 100);
    sfx.bell();
  }

  private updateCutscene(delta: number): void {
    if (!this.cutscene) return;
    const previous = this.cutscene.phase;
    this.cutscene = tickCutscene(this.cutscene, delta);
    if (this.cutscene.phase === "approach") this.lina?.setFrame(1);
    if (shouldPlayCrash(previous, this.cutscene.phase)) {
      this.blackout = this.add.rectangle(320, 180, 640, 360, 0x000000, 1).setScrollFactor(0).setDepth(40);
      // Render at least one black frame before the audible accident.
      this.crashTimer = this.time.delayedCall(100, () => { quietAmbience(); sfx.crash(); });
      this.lina?.setVisible(false);
      this.killer?.setVisible(false);
    }
    if (this.cutscene.phase === "daughter" && this.lina) {
      this.lina.play("lina-run", true);
      this.lina.x -= 38 * delta / 1000;
      this.player.setFlipX(false);
    }
    if (this.cutscene.phase === "vehicle" && this.killer && this.lina) {
      this.killer.setVisible(true);
      if (previous !== "vehicle") sfx.cart();
      this.killer.x = Math.max(this.lina.x + 128, this.killer.x - 190 * delta / 1000);
      this.lina.x -= 32 * delta / 1000;
    }
    if (this.cutscene.phase === "title" && !this.run().prologueEnded) {
      setAudioRegion("menu");
      this.blackout?.setAlpha(1);
      this.setRun(endPrologue(this.run()));
      this.saveCheckpoint(this.player.x - 64, true);
    }
    if (this.cutscene.phase === "done") {
      this.finishCutscene();
    }
    this.events.emit("cutscene", this.cutscene.phase);
    this.events.emit("hud", this.hudPayload());
  }

  private finishCutscene(): void {
    if (this.ended) return;
    this.crashTimer?.remove();
    clearAudioCaption();
    this.cutscene = { phase: "done", elapsed: 0 };
    this.lina?.setVisible(false); this.killer?.setVisible(false);
    if (!this.blackout) this.blackout = this.add.rectangle(320, 180, 640, 360, 0x000000, 1).setScrollFactor(0).setDepth(40);
    this.setRun(endPrologue(this.run()));
    this.saveCheckpoint(this.player.x - 64, true);
    this.ended = true;
    this.events.emit("cutscene", "done");
    this.events.emit("prologue-end", this.run());
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
      prompt: this.cutscene ? `${keyFor("skip")}  pular cena` : this.mode === "DIALOGUE" ? "" : near ? `${keyFor("interact")}  interagir` : "",
      ammo: 0,
      showCombat: false,
    };
  }
}

const GAME_CENTER = 320;
