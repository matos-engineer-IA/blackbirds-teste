import Phaser from "phaser";
import { palette } from "../palette";
import { createRun } from "../systems/runState";
import { sfx, unlockAudio } from "../utils/audio";
import { SCENE } from "../utils/constants";

type MenuKey = "start" | "arena" | "boss" | "controls" | "credits";

export class MenuScene extends Phaser.Scene {
  private cursor = 0;
  private labels: Phaser.GameObjects.Text[] = [];
  private panel?: Phaser.GameObjects.Container;
  private readonly items: { key: MenuKey; text: string }[] = [
    { key: "start", text: "NOVO JOGO" },
    { key: "arena", text: "CAMPO DE PROVAS" },
    ...(import.meta.env.DEV ? [{ key: "boss" as const, text: "ARENA WINSTH (DEV)" }] : []),
    { key: "controls", text: "CONTROLES" },
    { key: "credits", text: "CREDITOS" },
  ];

  constructor() {
    super(SCENE.menu);
  }

  create(): void {
    this.cursor = 0;
    this.panel = undefined;
    const { width, height } = this.scale;
    this.add.tileSprite(width / 2, 110, width, 220, "bg-far").setScrollFactor(0);
    this.add.tileSprite(width / 2, 200, width, 250, "bg-mid").setScrollFactor(0).setAlpha(0.92);
    this.add.rectangle(width / 2, height / 2, width, height, palette.bg, 0.22);
    this.add.text(width / 2, 72, "Black Bird: Revolução", {
      fontFamily: "Georgia, serif",
      fontSize: "22px",
      color: "#c4a36a",
    }).setOrigin(0.5);
    this.add.text(width / 2, 110, "Prólogo — O Último Dia", {
      fontFamily: "Georgia, serif",
      fontSize: "12px",
      color: "#e6c36a",
    }).setOrigin(0.5);

    this.labels = this.items.map((item, index) =>
      this.add.text(width / 2, 150 + index * 22, item.text, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#efe4d0",
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }),
    );
    this.labels.forEach((label, index) => {
      label.on("pointerover", () => {
        this.cursor = index;
        this.refresh();
      });
      label.on("pointerdown", () => this.activate());
    });
    this.add.text(width / 2, height - 18, "ENTER inicia  ·  Nero vai buscar a filha na escola", {
      fontFamily: "monospace",
      fontSize: "9px",
      color: "#9a8770",
    }).setOrigin(0.5);
    this.input.keyboard?.on("keydown-UP", () => this.move(-1));
    this.input.keyboard?.on("keydown-DOWN", () => this.move(1));
    this.input.keyboard?.on("keydown-W", () => this.move(-1));
    this.input.keyboard?.on("keydown-S", () => this.move(1));
    this.input.keyboard?.on("keydown-ENTER", () => this.activate());
    this.input.keyboard?.on("keydown-SPACE", () => this.activate());
    this.input.keyboard?.on("keydown-ESC", () => this.panel?.destroy());
    this.refresh();
  }

  private move(delta: number): void {
    unlockAudio();
    this.cursor = (this.cursor + delta + this.items.length) % this.items.length;
    sfx.ui();
    this.refresh();
  }

  private refresh(): void {
    this.labels.forEach((label, index) => {
      const active = index === this.cursor;
      label.setColor(active ? "#e6c36a" : "#efe4d0");
      label.setText(active ? `> ${this.items[index].text} <` : this.items[index].text);
    });
  }

  private activate(): void {
    unlockAudio();
    sfx.ui();
    const selected = this.items[this.cursor];
    if (selected.key === "start") {
      this.registry.set("run", createRun());
      this.scene.start(SCENE.game);
      this.scene.launch(SCENE.ui);
      return;
    }
    if (selected.key === "arena") {
      this.scene.start(SCENE.arena);
      return;
    }
    if (selected.key === "boss") {
      this.scene.start(SCENE.boss);
      return;
    }
    this.showPanel(selected.key);
  }

  private showPanel(kind: "controls" | "credits"): void {
    this.panel?.destroy();
    const { width, height } = this.scale;
    const body =
      kind === "controls"
        ? "A/D ou SETAS  andar\nESPACO / W  pular\nE  falar / interagir\nESC  pausar\nF1  debug de colisao\n\nCombate (arenas):\nJ ou Z  soco\nK ou X  revolver\nR  recarregar"
        : "Jogo original. Arte pintada e pixelizada no projeto.\nPhaser 4 · Vite · TypeScript\nNenhum sprite comercial foi copiado.";
    const box = this.add.rectangle(width / 2, height / 2 + 24, 360, 150, 0x1a1410, 0.94).setStrokeStyle(2, 0xc4a36a);
    const text = this.add.text(width / 2, height / 2 + 24, body, {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#efe4d0",
      align: "center",
    }).setOrigin(0.5);
    this.panel = this.add.container(0, 0, [box, text]);
  }
}
