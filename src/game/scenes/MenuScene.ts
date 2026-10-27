import Phaser from "phaser";
import { palette } from "../palette";
import { createRun } from "../systems/runState";
import { sfx } from "../utils/audio";
import { SCENE } from "../utils/constants";

type MenuKey = "start" | "controls" | "credits";

export class MenuScene extends Phaser.Scene {
  private cursor = 0;
  private labels: Phaser.GameObjects.Text[] = [];
  private panel?: Phaser.GameObjects.Container;
  private readonly items: { key: MenuKey; text: string }[] = [
    { key: "start", text: "INICIAR" },
    { key: "controls", text: "CONTROLES" },
    { key: "credits", text: "CREDITOS" },
  ];

  constructor() {
    super(SCENE.menu);
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.tileSprite(width / 2, height / 2, width, height, "bg-far").setScrollFactor(0);
    this.add.tileSprite(width / 2, height / 2 + 20, width, height, "bg-mid").setScrollFactor(0).setAlpha(0.85);
    this.add.tileSprite(width / 2, height / 2 + 40, width, height, "bg-near").setScrollFactor(0).setAlpha(0.9);
    this.add.rectangle(width / 2, height / 2, width, height, palette.bg, 0.28);

    this.add.text(width / 2, 42, "NEON FALL", {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#2de2e6",
    }).setOrigin(0.5);

    this.add.text(width / 2, 64, "PROTOCOL ZERO", {
      fontFamily: "monospace",
      fontSize: "11px",
      color: "#ff2d95",
    }).setOrigin(0.5);

    this.add.text(width / 2, 86, "Vesper-9 sob controle da NEXUS. Recupere o nucleo.", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#7f93a8",
    }).setOrigin(0.5);

    this.labels = this.items.map((item, index) =>
      this.add.text(width / 2, 128 + index * 22, item.text, {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#d6f6ff",
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }),
    );

    this.labels.forEach((label, index) => {
      label.on("pointerover", () => {
        this.cursor = index;
        this.refresh();
      });
      label.on("pointerdown", () => this.activate());
    });

    this.add.text(width / 2, height - 16, "ENTER / CLIQUE  ·  ESC fecha paineis", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#7f93a8",
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
    this.cursor = (this.cursor + delta + this.items.length) % this.items.length;
    sfx.ui();
    this.refresh();
  }

  private refresh(): void {
    this.labels.forEach((label, index) => {
      const active = index === this.cursor;
      label.setColor(active ? "#2de2e6" : "#d6f6ff");
      label.setText(active ? `> ${this.items[index].text} <` : this.items[index].text);
    });
  }

  private activate(): void {
    sfx.ui();
    const selected = this.items[this.cursor];
    if (selected.key === "start") {
      this.registry.set("run", createRun());
      this.scene.start(SCENE.game);
      this.scene.launch(SCENE.ui);
      return;
    }
    this.showPanel(selected.key);
  }

  private showPanel(kind: "controls" | "credits"): void {
    this.panel?.destroy();
    const { width, height } = this.scale;
    const body =
      kind === "controls"
        ? "A/D ou SETAS  mover\nESPACO / W  pular\nZ / J  atacar\nSHIFT / L  Neon Dash\nE  interagir\nESC  pausar"
        : "Jogo original para o piloto Huddle Engineering.\nEngine Phaser 4  ·  Vite  ·  TypeScript\nArte pixel 18x18 inspirada em Kenney CC0\nAudio sintetizado no navegador";
    const box = this.add.rectangle(width / 2, height / 2 + 18, 300, 130, 0x070b14, 0.92).setStrokeStyle(1, 0x2de2e6);
    const text = this.add.text(width / 2, height / 2 + 18, body, {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#d6f6ff",
      align: "center",
    }).setOrigin(0.5);
    this.panel = this.add.container(0, 0, [box, text]);
  }
}
