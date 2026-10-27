import Phaser from "phaser";
import { PatrolDrone } from "../entities/enemies/PatrolDrone";
import { Sentinel } from "../entities/enemies/Sentinel";
import type { ExitDir, RoomDef } from "./rooms";
import { TILE, tileAt } from "./tiles";

export type Interactable = {
  kind: "terminal" | "core" | "dash" | "checkpoint";
  x: number;
  y: number;
  sprite: Phaser.GameObjects.Sprite;
};

export class RoomWorld {
  solids: Phaser.Physics.Arcade.StaticGroup;
  hazards: Phaser.Physics.Arcade.StaticGroup;
  barriers: Phaser.Physics.Arcade.StaticGroup;
  exits: Phaser.Physics.Arcade.StaticGroup;
  enemies: Phaser.Physics.Arcade.Group;
  moving?: Phaser.Physics.Arcade.Image;
  interactives: Interactable[] = [];
  deco: Phaser.GameObjects.GameObject[] = [];

  constructor(private readonly scene: Phaser.Scene) {
    this.solids = scene.physics.add.staticGroup();
    this.hazards = scene.physics.add.staticGroup();
    this.barriers = scene.physics.add.staticGroup();
    this.exits = scene.physics.add.staticGroup();
    this.enemies = scene.physics.add.group();
  }

  clear(): void {
    this.solids.clear(true, true);
    this.hazards.clear(true, true);
    this.barriers.clear(true, true);
    this.exits.clear(true, true);
    this.enemies.clear(true, true);
    this.interactives.forEach((item) => item.sprite.destroy());
    this.interactives = [];
    this.deco.forEach((item) => item.destroy());
    this.deco = [];
    this.moving?.destroy();
    this.moving = undefined;
  }

  build(def: RoomDef): void {
    this.clear();
    def.map.forEach((line, row) => {
      [...line].forEach((char, col) => {
        const tile = tileAt(char);
        const x = col * TILE + TILE / 2;
        const y = row * TILE + TILE / 2;
        this.deco.push(this.scene.add.image(x, y, "tiles", 26).setDepth(0).setAlpha(0.55));

        if (tile.kind === "solid") {
          this.solids.create(x, y, "tiles", tile.frame).refreshBody();
          return;
        }
        if (tile.kind === "hazard") {
          this.hazards.create(x, y, "tiles", tile.frame).refreshBody();
          return;
        }
        if (tile.kind === "barrier") {
          this.barriers.create(x, y, "tiles", tile.frame).refreshBody();
          return;
        }
        if (tile.kind === "exit-right" || tile.kind === "exit-left" || tile.kind === "exit-nexus") {
          const sprite = this.exits.create(x, y, "tiles", tile.frame) as Phaser.Physics.Arcade.Sprite;
          sprite.setData("dir", tile.kind === "exit-right" ? "right" : tile.kind === "exit-left" ? "left" : "nexus");
          sprite.setAlpha(0.9);
          sprite.refreshBody();
          return;
        }
        if (tile.kind === "drone") {
          this.enemies.add(new PatrolDrone(this.scene, x, y - 8));
          return;
        }
        if (tile.kind === "sentinel") {
          this.enemies.add(new Sentinel(this.scene, x, y - 6));
          return;
        }
        if (tile.kind === "moving") {
          this.moving = this.scene.physics.add.image(x, y, "tiles", 14);
          this.moving.setImmovable(true);
          const body = this.moving.body as Phaser.Physics.Arcade.Body;
          body.allowGravity = false;
          this.moving.setVelocityX(45);
          this.moving.setData("minX", x - 70);
          this.moving.setData("maxX", x + 70);
          return;
        }
        if (tile.kind === "checkpoint" || tile.kind === "dash" || tile.kind === "terminal" || tile.kind === "core") {
          const sprite = this.scene.add.sprite(x, y, "tiles", tile.frame).setDepth(5);
          if (tile.kind === "checkpoint") sprite.play("checkpoint-idle");
          if (tile.kind === "dash" || tile.kind === "core") sprite.play("core-spin");
          this.interactives.push({ kind: tile.kind, x, y, sprite });
          return;
        }
        if (tile.kind === "deco") {
          this.deco.push(this.scene.add.image(x, y, "tiles", tile.frame).setDepth(1));
        }
      });
    });
  }

  updateMoving(): void {
    if (!this.moving) return;
    const minX = this.moving.getData("minX") as number;
    const maxX = this.moving.getData("maxX") as number;
    if (this.moving.x >= maxX) this.moving.setVelocityX(-45);
    if (this.moving.x <= minX) this.moving.setVelocityX(45);
  }

  nearestInteractive(x: number, y: number, range = 22): Interactable | undefined {
    return this.interactives.find((item) => Phaser.Math.Distance.Between(x, y, item.x, item.y) <= range);
  }

  consume(item: Interactable): void {
    this.interactives = this.interactives.filter((entry) => entry !== item);
    item.sprite.destroy();
  }

  exitDir(sprite: Phaser.GameObjects.GameObject): ExitDir {
    return (sprite.getData("dir") as ExitDir) ?? "right";
  }
}
