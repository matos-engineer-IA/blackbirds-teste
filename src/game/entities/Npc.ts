import Phaser from "phaser";
import type { NpcKind } from "../levels/rooms";
import { addContactShadow, anchorFeet } from "../utils/footAnchor";

const TEXTURE: Record<NpcKind, string> = {
  worker: "npc-worker",
  merchant: "npc-ilda",
  guard: "npc-guard",
  child: "npc-child",
  poor: "npc-ilda",
  elite: "npc-ilda",
  mechanic: "npc-mechanic",
};

export class Npc extends Phaser.Physics.Arcade.Sprite {
  readonly npcId: string;
  readonly dialogueId: string;
  busy = false;
  private dir: -1 | 1 = 1;
  private homeX = 0;
  private range = 0;
  private pauseMs = 0;
  private shadow: Phaser.GameObjects.Image;
  private readonly textureKey: string;
  private readonly facesLeft: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    kind: NpcKind,
    npcId: string,
    dialogueId: string,
    patrol = 0,
  ) {
    super(scene, x, y, TEXTURE[kind], 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.npcId = npcId;
    this.dialogueId = dialogueId;
    this.homeX = x;
    this.range = patrol;
    this.textureKey = TEXTURE[kind];
    this.facesLeft = kind === "child";
    this.setDepth(7);
    const child = kind === "child";
    if (child) anchorFeet(this, 96, 112, 14, 44, 0.55, 104);
    else anchorFeet(this, 96, 128, 18, 60, 0.8, 112);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(true);
    body.setImmovable(false);
    this.setPushable(false);
    this.shadow = addContactShadow(scene, this);
    this.play(this.range > 0 ? `${TEXTURE[kind]}-walk` : `${TEXTURE[kind]}-idle`, true);
  }

  setBusy(value: boolean): void {
    this.busy = value;
    if (value) {
      this.setVelocityX(0);
      this.play(`${this.textureKey}-idle`, true);
    }
  }

  face(targetX: number): void {
    this.setFlipX(this.facesLeft ? targetX > this.x : targetX < this.x);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.shadow.setPosition(this.x, this.y + 1);
    if (!this.active || this.busy || this.range <= 0) {
      this.setVelocityX(0);
      this.play(`${this.textureKey}-idle`, true);
      return;
    }
    this.pauseMs = Math.max(0, this.pauseMs - delta);
    if (this.pauseMs > 0) {
      this.setVelocityX(0);
      this.play(`${this.textureKey}-idle`, true);
      return;
    }
    if (this.x > this.homeX + this.range) {
      this.dir = -1;
      this.pauseMs = 400;
    }
    if (this.x < this.homeX - this.range) {
      this.dir = 1;
      this.pauseMs = 400;
    }
    this.setVelocityX(this.dir * 28);
    this.play(`${this.textureKey}-walk`, true);
    this.setFlipX(this.facesLeft ? this.dir > 0 : this.dir < 0);
  }
}
