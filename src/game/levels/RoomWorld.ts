import Phaser from "phaser";
import { Npc } from "../entities/Npc";
import { CITY_GROUND_Y, CITY_HEIGHT, CITY_SEGMENTS, CITY_WIDTH, cityNpcX } from "./city";
import { ROOMS } from "./rooms";
import { TILE } from "./tiles";
import { GROUND } from "../utils/scale";

export type WorldInteractable = {
  id: string;
  kind: "door" | "lever" | "cutscene" | "inspect";
  dialogue?: string;
  x: number;
  y: number;
  sprite: Phaser.GameObjects.GameObject;
};

export class RoomWorld {
  flags: Record<string, boolean> = {};
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

  buildCity(flags: Record<string, boolean> = {}): void {
    this.clear();
    this.flags = { ...flags };
    this.placeFloor(CITY_WIDTH);
    CITY_SEGMENTS.forEach(segment => {
      segment.panels.forEach((key, index) => {
        this.deco.push(this.scene.add.image(segment.x + index * 1536, CITY_GROUND_Y, key).setOrigin(0, 1).setDepth(2));
      });
      this.placeStreetInteractions(segment.id, segment.x);
    });
    Object.values(ROOMS).forEach((def) => {
      def.npcs.forEach((npc) => {
        this.npcs.add(
          new Npc(this.scene, cityNpcX(def.id, npc), CITY_GROUND_Y, npc.kind, npc.id, npc.dialogue, npc.patrol),
        );
      });
    });
    this.interactives.forEach(item => this.applyInteraction(item, false));
  }

  toggleInteraction(item: WorldInteractable): boolean {
    this.flags[item.id] = !this.flags[item.id];
    this.applyInteraction(item);
    return this.flags[item.id];
  }

  private applyInteraction(item: WorldInteractable, animate = true): void {
    const opened = Boolean(this.flags[item.id]);
    item.sprite.setData("opened", opened);
    if (item.sprite instanceof Phaser.GameObjects.Image) {
      this.scene.tweens.killTweensOf(item.sprite);
      if (item.kind === "door") {
        if (animate) this.scene.tweens.add({ targets: item.sprite, scaleX: opened ? 0.12 : 1, duration: 320, ease: "Sine.easeInOut" });
        else item.sprite.setScale(opened ? 0.12 : 1, 1);
      }
      if (item.kind === "lever") {
        if (animate) this.scene.tweens.add({ targets: item.sprite, angle: opened ? 110 : 0, duration: 420, ease: "Sine.easeInOut" });
        else item.sprite.setAngle(opened ? 110 : 0);
      }
    }
  }

  buildArena(width: number): void {
    this.clear();
    this.placeFloor(width);
  }

  updateMoving(playerX: number): void {
    const market = CITY_SEGMENTS[1], avenue = CITY_SEGMENTS[2];
    if (!this.flags["event.market-tax"] && Math.abs(playerX - (market.x + 1100)) < 220) {
      this.flags["event.market-tax"] = true;
      this.streetCaption(market.x + 1180, "— A licença venceu ontem.\n— A multa dobra amanhã.");
    }
    if (!this.flags["event.pressure"] && Math.abs(playerX - 2100) < 200) {
      this.flags["event.pressure"] = true;
      this.scene.add.particles(2110, 245, "steam", { lifespan: 1100, speedY: -28, speedX: { min: -10, max: 10 }, scale: { start: .7, end: 0 }, alpha: { start: .45, end: 0 }, duration: 2200, frequency: 90 });
      this.streetCaption(2110, "Uma descarga de vapor.\nA rua conhece esse som.");
    }
    if (!this.cart) return;
    const near = Math.abs(playerX - (avenue.x + 2750)) < 420;
    if (near && !this.flags["event.carriage"]) { this.flags["event.carriage"] = true; this.cart.setVisible(true).setVelocityX(-65); }
    if (this.cart.x < avenue.x + 1900) this.cart.setVisible(false).setVelocityX(0);
  }

  private streetCaption(x: number, text: string): void {
    const label = this.scene.add.text(x, 182, text, { fontFamily: "Georgia, serif", fontSize: "11px", color: "#ead3a3", backgroundColor: "#211b16e8", padding: { x: 9, y: 6 }, align: "center" }).setOrigin(.5).setDepth(14);
    this.scene.time.delayedCall(4500, () => label.destroy());
  }

  nearestNpc(x: number, y: number, range = 48): Npc | undefined {
    return [...this.npcs.getChildren()].sort((a, b) => Math.abs((a as Npc).x - x) - Math.abs((b as Npc).x - x)).find((child) => {
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
      .tileSprite(0, CITY_GROUND_Y, width, GROUND.worldHeight - CITY_GROUND_Y, "cobble")
      .setOrigin(0, 0)
      .setDepth(4);
    this.deco.push(this.cobble);
    const left = this.solids.create(-TILE / 2, CITY_HEIGHT / 2, "tiles", 1) as Phaser.Physics.Arcade.Sprite;
    const right = this.solids.create(width + TILE / 2, CITY_HEIGHT / 2, "tiles", 1) as Phaser.Physics.Arcade.Sprite;
    left.setVisible(false).setScale(1, CITY_HEIGHT / TILE).refreshBody();
    right.setVisible(false).setScale(1, CITY_HEIGHT / TILE).refreshBody();
  }

  private placeStreetInteractions(id: string, originX: number): void {
    const doors: Record<string, number[]> = { operario: [139, 690, 1536 + 1380], mercado: [1536 + 150, 3 * 1536 + 215], avenida: [365, 2 * 1536 + 425], escola: [270, 2 * 1536 + 1285] };
    (doors[id] ?? []).forEach((x, index) => {
      const opening = this.scene.add.rectangle(originX + x, CITY_GROUND_Y, 60, 90, 0x100d0b).setOrigin(.5, 1).setDepth(3);
      const leaf = this.scene.add.image(originX + x - 30, CITY_GROUND_Y, "door-leaf").setOrigin(0, 1).setDepth(3);
      this.deco.push(opening, leaf);
      this.interactives.push({ id: `${id}-door-${index}`, kind: "door", x: originX + x, y: CITY_GROUND_Y, sprite: leaf });
    });
    const valveX = originX + (id === "operario" ? 1920 : id === "mercado" ? 2 * 1536 + 110 : id === "avenida" ? 3 * 1536 + 552 : 1536 + 790);
    const wheel = this.scene.add.image(valveX, CITY_GROUND_Y - 50, "pressure-wheel").setDepth(5);
    this.deco.push(wheel);
    this.interactives.push({ id: `${id}-valve`, kind: "lever", x: valveX, y: CITY_GROUND_Y, sprite: wheel });
    this.vents.push(new Phaser.Math.Vector2(valveX + 18, CITY_GROUND_Y - 66));
    const observations: Record<string, [number, string, string][]> = {
      operario: [[3200, "Relógio da fábrica", "relogio-fabrica"]],
      mercado: [[550, "Licenças e taxas", "quadro-taxas"], [6800, "Jornal da tarde", "jornal"]],
      avenida: [[2200, "Câmara Municipal", "camara"], [6800, "Passagem da escola →", "caminho-escola"]],
      escola: [[3300, "Jardim da escola", "jardim"], [5800, "Saída dos alunos →", "caminho-escola"]],
    };
    for (const [x, text, dialogue] of observations[id] ?? []) {
      const marker = this.scene.add.text(originX + x, CITY_GROUND_Y - 116, text, { fontFamily: "Georgia, serif", fontSize: "10px", color: "#c9ad70", backgroundColor: "#211b16", padding: { x: 5, y: 3 } }).setOrigin(.5).setDepth(5);
      this.deco.push(marker);
      this.interactives.push({ id: `${id}-inspect-${x}`, kind: "inspect", dialogue, x: originX + x, y: CITY_GROUND_Y, sprite: marker });
    }
    if (id === "avenida") {
      this.cart = this.scene.physics.add.image(originX + 3180, CITY_GROUND_Y, "carriage").setOrigin(.5, 248 / 256).setScale(.5).setDepth(6).setVisible(false);
      (this.cart.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
      this.cart.setVelocityX(0);
    }
    if (id === "escola") {
      const x = originX + 4 * 1536 + 420;
      const zone = this.scene.add.zone(x, CITY_GROUND_Y, 50, 80);
      this.interactives.push({ id: "school-finale", kind: "cutscene", x, y: CITY_GROUND_Y, sprite: zone });
      this.deco.push(zone);
    }
  }
}
