import Phaser from "phaser";
import { applyDamage, isDefeated } from "../mechanics/combat";
import { addContactShadow, anchorFeet } from "../utils/footAnchor";
import { SCALE } from "../utils/scale";
import { sfx } from "../utils/audio";
import { chooseWinsthMove, WINSTH_ATTACKS, type WinsthMove } from "../mechanics/bossAttacks";
import { getSettings } from "../systems/settings";

export type WinsthPhase =
  | "IDLE"
  | "PATROL"
  | "AGGRO"
  | "APPROACH"
  | "TELEGRAPH"
  | "ATTACK"
  | "RECOVERY"
  | "STAGGER"
  | "DEFEATED";

export type { WinsthMove } from "../mechanics/bossAttacks";

export class Winsth extends Phaser.Physics.Arcade.Sprite {
  hp = 28;
  maxHp = 28;
  phase: WinsthPhase = "IDLE";
  facing: -1 | 1 = -1;
  move: WinsthMove = "horizontal";
  cooldownMs = 800;
  phaseMs = 0;
  private homeX = 0;
  private shadow: Phaser.GameObjects.Image;
  private previousMove?: WinsthMove;
  private attackTurn = 0;
  private wavePending = false;
  forcedMove?: WinsthMove;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "winsth", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.homeX = x;
    this.setDepth(8);
    anchorFeet(this, SCALE.winsthFrame.w, SCALE.winsthFrame.h, 46, 86, SCALE.actorRenderScale, SCALE.winsthFrame.footY);
    const body = this.body as Phaser.Physics.Arcade.Body;
    // An immovable actor cannot separate from an immovable static floor.
    // Non-pushable preserves weight while still allowing ground resolution.
    body.setImmovable(false).setCollideWorldBounds(true);
    this.setPushable(false);
    body.setMaxVelocity(220, 560);
    this.shadow = addContactShadow(scene, this).setScale(1.6, 1);
    this.play("winsth-idle", true);
  }

  get defeated(): boolean {
    return this.phase === "DEFEATED";
  }

  hit(damage: number, fromX: number): boolean {
    if (this.phase === "DEFEATED" || this.phase === "STAGGER") return false;
    this.hp = applyDamage(this.hp, damage, false);
    if (!getSettings().reducedFlashes) this.setTint(0xd9b979).setTintMode(Phaser.TintModes.FILL);
    this.scene.tweens.add({ targets: this, duration: 70, onComplete: () => this.clearTint() });
    if (isDefeated(this.hp)) {
      this.phase = "DEFEATED";
      this.phaseMs = 0;
      this.setVelocity(0, 0);
      this.play("winsth-hurt", true);
      sfx.crash(false);
      return true;
    }
    if (this.hp % 7 === 0) {
      this.phase = "STAGGER";
      this.phaseMs = 700;
      this.setVelocity((this.x < fromX ? -1 : 1) * 40, 0);
      this.play("winsth-hurt", true);
    }
    sfx.hit();
    return false;
  }

  attackBox(): Phaser.Geom.Rectangle {
    if (this.move === "slam") return new Phaser.Geom.Rectangle(this.x - 70, this.y - 36, 140, 36);
    if (this.move === "wave") return new Phaser.Geom.Rectangle(this.x, this.y, 0, 0);
    if (this.move === "charge") return new Phaser.Geom.Rectangle(this.x - 40, this.y - 90, 80, 90);
    const x = this.facing > 0 ? this.x + 20 : this.x - 120;
    return new Phaser.Geom.Rectangle(x, this.y - 80, 100, 70);
  }

  think(targetX: number, dtMs: number): void {
    this.shadow.setPosition(this.x, this.y + 1);
    if (this.phase === "DEFEATED") {
      this.setVelocityX(0);
      this.setAlpha(0.7);
      return;
    }
    this.cooldownMs = Math.max(0, this.cooldownMs - dtMs);
    this.phaseMs = Math.max(0, this.phaseMs - dtMs);
    const dist = targetX - this.x;
    if (["IDLE", "PATROL", "AGGRO", "APPROACH"].includes(this.phase)) this.facing = dist >= 0 ? 1 : -1;
    this.setFlipX(this.facing < 0);

    if (this.phase === "STAGGER") {
      if (this.phaseMs <= 0) this.enter("RECOVERY", 400);
      return;
    }
    if (this.phase === "IDLE" || this.phase === "PATROL") {
      if (Math.abs(dist) < 340) this.enter("AGGRO", 200);
      else this.patrol();
      return;
    }
    if (this.phase === "AGGRO" || this.phase === "APPROACH") {
      if (Math.abs(dist) > 260) {
        this.setVelocityX(this.facing * 70);
        this.play("winsth-walk", true);
        this.phase = "APPROACH";
      } else {
        this.setVelocityX(0);
        if (this.cooldownMs <= 0) this.beginAttack(dist);
      }
      return;
    }
    if (this.phase === "TELEGRAPH") {
      this.setVelocityX(0);
      if (this.phaseMs <= 0) this.enter("ATTACK", WINSTH_ATTACKS[this.move].activeMs);
      return;
    }
    if (this.phase === "ATTACK") {
      if (this.move === "charge") this.setVelocityX(this.facing * 180);
      if (this.phaseMs <= 0 || (this.move === "charge" && ((this.body as Phaser.Physics.Arcade.Body).blocked.left || (this.body as Phaser.Physics.Arcade.Body).blocked.right))) {
        this.enter("RECOVERY", WINSTH_ATTACKS[this.move].recoveryMs);
        this.cooldownMs = WINSTH_ATTACKS[this.move].recoveryMs + 250;
      }
      return;
    }
    if (this.phase === "RECOVERY" && this.phaseMs <= 0) {
      this.enter("AGGRO", 0);
      this.play("winsth-idle", true);
    }
  }

  private enter(phase: WinsthPhase, duration: number): void {
    this.phase = phase;
    this.phaseMs = duration;
    this.setVelocityX(0);
    if (phase === "TELEGRAPH") this.play("winsth-telegraph", true);
    if (phase === "ATTACK") {
      if (this.move === "wave" || this.move === "charge") sfx.steam();
      else sfx.attack();
      this.play(this.move === "slam" ? "winsth-slam" : "winsth-swing", true);
      this.wavePending = this.move === "wave";
    }
  }

  takeWaveRequest(): boolean {
    const emit = this.wavePending && !this.defeated;
    this.wavePending = false;
    return emit;
  }

  private beginAttack(dist: number): void {
    const abs = Math.abs(dist);
    this.move = this.forcedMove ?? chooseWinsthMove(abs, this.previousMove, this.attackTurn++);
    this.previousMove = this.move;
    this.enter("TELEGRAPH", WINSTH_ATTACKS[this.move].startupMs * (getSettings().combatAssist ? 1.35 : 1));
    this.setVelocityX(0);
  }

  private patrol(): void {
    this.phase = "PATROL";
    if (this.x > this.homeX + 80) this.setVelocityX(-30);
    else if (this.x < this.homeX - 80) this.setVelocityX(30);
    else if (Math.abs(this.body!.velocity.x) < 4) this.setVelocityX(24);
    this.play("winsth-walk", true);
  }
}
