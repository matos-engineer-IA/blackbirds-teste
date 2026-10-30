import Phaser from "phaser";
import { Npc } from "../entities/Npc";
import { CITY_GROUND_Y, CITY_HEIGHT, CITY_SEGMENTS, CITY_WIDTH, cityNpcX, tileOffsetY } from "./city";
import { OPERARIO_BLOCK } from "./paintedBlock";
import { ROOMS, type RoomDef } from "./rooms";
import { TILE, tileAt } from "./tiles";
import { GROUND } from "../utils/scale";

export type WorldInteractable = {
  kind: "door" | "lever" | "cutscene";
  x: number;
  y: number;
  sprite: Phaser.GameObjects.GameObject;
};

export class RoomWorld {
  solids: Phaser.Physics.Arcade.StaticGroup;
  exits: Phaser.Physics.Arcade.StaticGroup;
  npcs: Phaser.Physics.Arcade.Group;
  interactives: WorldInteractable[] = [];
  deco: Phaser.GameObjects.GameObject[] = [];
  vents: Phaser.Math.Vector2[] = [];
  cobble?: Phaser.GameObjects.TileSprite;
  cart?: Phaser.Physics.Arcade.Image;

  constructor(private readonly scene: Phaser.Scene) {
    this.solids = scene.physics.add.staticGroup();
    this.exits = scene.physics.add.staticGroup();
    this.npcs = scene.physics.add.group();
  }

  clear(): void {
    this.solids.clear(true, true);
    this.exits.clear(true, true);
    this.npcs.clear(true, true);
    this.interactives = [];
    this.deco.forEach((item) => item.destroy());
    this.deco = [];
    this.vents = [];
    this.cobble?.destroy();
    this.cobble = undefined;
    this.cart?.destroy();
    this.cart = undefined;
  }

  buildCity(): void {
    this.clear();
    this.placeFloor(CITY_WIDTH);
    const street = this.scene.add.image(0, 0, "street-operario").setOrigin(0, 0).setDepth(2);
    this.deco.push(street);
    CITY_SEGMENTS.forEach((segment) => {
      if (segment.id === "operario") {
        this.placePaintedProps(segment.x);
        return;
      }
      this.placeTiledSegment(ROOMS[segment.id], segment.x);
    });
    Object.values(ROOMS).forEach((def) => {
      def.npcs.forEach((npc) => {
        this.npcs.add(
          new Npc(this.scene, cityNpcX(def.id, npc), CITY_GROUND_Y, npc.kind, npc.id, npc.dialogue, npc.patrol),
        );
      });
    });
  }

  buildArena(width: number): void {
    this.clear();
    this.placeFloor(width);
  }

  updateMoving(): void {
    if (!this.cart) return;
    const minX = this.cart.getData("minX") as number;
    const maxX = this.cart.getData("maxX") as number;
    if (this.cart.x >= maxX) this.cart.setVelocityX(-36);
    if (this.cart.x <= minX) this.cart.setVelocityX(36);
    this.cart.setFlipX((this.cart.body as Phaser.Physics.Arcade.Body).velocity.x < 0);
  }

  nearestNpc(x: number, y: number, range = 48): Npc | undefined {
    return this.npcs.getChildren().find((child) => {
      const npc = child as Npc;
      return npc.active && !npc.busy && Phaser.Math.Distance.Between(x, y, npc.x, npc.y) <= range;
    }) as Npc | undefined;
  }

  nearestInteractive(x: number, y: number, range = 40): WorldInteractable | undefined {
    return this.interactives.find((item) => Phaser.Math.Distance.Between(x, y, item.x, item.y) <= range);
  }

  freezeNpcs(except?: Npc): void {
    this.npcs.getChildren().forEach((child) => {
      const npc = child as Npc;
      npc.setBusy(npc === except);
    });
  }

  releaseNpcs(): void {
    this.npcs.getChildren().forEach((child) => (child as Npc).setBusy(false));
  }

  private placeFloor(width: number): void {
    const floor = this.solids.create(width / 2, CITY_GROUND_Y + GROUND.colliderHeight / 2, "tiles", 1) as Phaser.Physics.Arcade.Sprite;
    floor.setVisible(false);
    floor.setScale(width / TILE, GROUND.colliderHeight / TILE);
    floor.refreshBody();
    this.cobble = this.scene.add
      .tileSprite(0, CITY_GROUND_Y, width, 36, "cobble")
      .setOrigin(0, 0)
      .setDepth(4);
    this.deco.push(this.cobble);
    const left = this.solids.create(4, CITY_HEIGHT / 2, "tiles", 1) as Phaser.Physics.Arcade.Sprite;
    const right = this.solids.create(width - 4, CITY_HEIGHT / 2, "tiles", 1) as Phaser.Physics.Arcade.Sprite;
    left.setVisible(false).setScale(1, CITY_HEIGHT / TILE).refreshBody();
    right.setVisible(false).setScale(1, CITY_HEIGHT / TILE).refreshBody();
  }

  private placePaintedProps(originX: number): void {
    OPERARIO_BLOCK.doors.forEach((door) => {
      const zone = this.scene.add.rectangle(originX + door.x, CITY_GROUND_Y - 24, 28, 48, 0x000000, 0);
      this.interactives.push({ kind: "door", x: originX + door.x, y: CITY_GROUND_Y, sprite: zone });
    });
    OPERARIO_BLOCK.vents.forEach((vent) => this.vents.push(new Phaser.Math.Vector2(originX + vent.x, vent.y)));
  }

  private placeTiledSegment(def: RoomDef, originX: number): void {
    const yOff = tileOffsetY();
    const cols = def.map[0].length;
    def.map.forEach((line, row) => {
      [...line].forEach((char, col) => {
        if (col === 0 || col === cols - 1 || row >= 12) return;
        const tile = tileAt(char);
        const x = originX + col * TILE + TILE / 2;
        const y = row * TILE + TILE / 2 + yOff;
        if (tile.kind === "door" || tile.kind === "lever" || tile.kind === "cutscene") {
          const sprite = this.scene.add.image(x, y, "tiles", tile.kind === "cutscene" ? 0 : tile.frame).setDepth(5);
          if (tile.kind === "cutscene") sprite.setVisible(false);
          this.interactives.push({ kind: tile.kind, x, y: CITY_GROUND_Y, sprite });
          return;
        }
        if (tile.kind === "deco" || tile.kind === "solid") {
          this.deco.push(this.scene.add.image(x, y, "tiles", tile.frame).setDepth(2));
          if (char === "V") this.vents.push(new Phaser.Math.Vector2(x, y - 8));
        }
      });
    });
    if (def.id === "avenida") {
      const segment = CITY_SEGMENTS.find((item) => item.id === "avenida")!;
      this.cart = this.scene.physics.add.image(segment.x + 220, CITY_GROUND_Y, "carriage");
      this.cart.setImmovable(true);
      const body = this.cart.body as Phaser.Physics.Arcade.Body;
      body.allowGravity = false;
      this.cart.setVelocityX(36);
      this.cart.setDepth(6);
      this.cart.setOrigin(0.5, 1);
      this.cart.setData("minX", segment.x + 180);
      this.cart.setData("maxX", segment.x + segment.width - 80);
    }
  }
}
