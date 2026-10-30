import Phaser from "phaser";
import type { DialogueLine } from "../content/dialogues";
import { elapsedSeconds, formatTime, type RunSnapshot } from "../systems/runState";
import { sfx } from "../utils/audio";
import { GAME, SCENE } from "../utils/constants";
import { GameScene } from "./GameScene";

type HudInfo = {
  room: string;
  objective: string;
  prompt: string;
  ammo: number;
  showCombat: boolean;
};

export class UIScene extends Phaser.Scene {
  private objective!: Phaser.GameObjects.Text;
  private prompt!: Phaser.GameObjects.Text;
  private speaker?: Phaser.GameObjects.Text;
  private line?: Phaser.GameObjects.Text;
  private panel?: Phaser.GameObjects.Image;
  private overlay?: Phaser.GameObjects.Container;

  constructor() {
    super(SCENE.ui);
  }

  create(): void {
    this.objective = this.add.text(14, GAME.height - 16, "", {
      fontFamily: "Georgia, serif",
      fontSize: "10px",
      color: "#c4a36a",
    }).setScrollFactor(0).setDepth(20).setAlpha(0.9);
    this.prompt = this.add.text(GAME.width - 14, GAME.height - 16, "", {
      fontFamily: "Georgia, serif",
      fontSize: "10px",
      color: "#e6c36a",
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(20);
    this.panel = this.add.image(GAME.width / 2, GAME.height - 54, "ui-dialogue").setScrollFactor(0).setDepth(21).setVisible(false);
    this.speaker = this.add.text(78, GAME.height - 82, "", {
      fontFamily: "Georgia, serif",
      fontSize: "11px",
      color: "#e6c36a",
    }).setScrollFactor(0).setDepth(22);
    this.line = this.add.text(78, GAME.height - 66, "", {
      fontFamily: "Georgia, serif",
      fontSize: "12px",
      color: "#efe4d0",
      wordWrap: { width: 460 },
    }).setScrollFactor(0).setDepth(22);

    const game = this.scene.get(SCENE.game) as GameScene;
    game.events.on("hud", (info: HudInfo) => this.drawHud(info));
    game.events.on("dialogue", (line?: DialogueLine) => this.drawDialogue(line));
    game.events.on("pause", () => this.showMenu("PAUSA", ["CONTINUAR", "REINICIAR PROLOGO", "MENU"], (choice) => {
      if (choice === 0) {
        this.clearOverlay();
        game.resumePlay();
      } else if (choice === 1) game.replay();
      else game.restartFull();
    }));
    game.events.on("unpause", () => this.clearOverlay());
    game.events.on("prologue-end", (run: RunSnapshot) => {
      const time = formatTime(elapsedSeconds(run));
      this.showMenu(`BLACK BIRD: REVOLUÇÃO\nO último dia acabou.\n${time}`, ["JOGAR NOVAMENTE", "MENU"], (choice) => {
        if (choice === 0) game.replay();
        else game.restartFull();
      });
    });
  }

  private drawHud(info: HudInfo): void {
    this.objective.setText(info.objective);
    this.prompt.setText(info.prompt);
  }

  private drawDialogue(line?: DialogueLine): void {
    const open = Boolean(line);
    this.panel?.setVisible(open);
    this.speaker?.setText(line?.speaker ?? "");
    this.line?.setText(line ? `${line.text}  ▸` : "");
  }

  private showMenu(title: string, options: string[], onPick: (index: number) => void): void {
    this.clearOverlay();
    sfx.ui();
    let cursor = 0;
    const dim = this.add.rectangle(GAME.width / 2, GAME.height / 2, GAME.width, GAME.height, 0x100c08, 0.82);
    const heading = this.add.text(GAME.width / 2, 96, title, {
      fontFamily: "Georgia, serif",
      fontSize: "16px",
      color: "#c4a36a",
      align: "center",
    }).setOrigin(0.5);
    const labels = options.map((option, index) =>
      this.add.text(GAME.width / 2, 160 + index * 22, option, {
        fontFamily: "Georgia, serif",
        fontSize: "13px",
        color: "#efe4d0",
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }),
    );
    const paint = () => {
      labels.forEach((label, index) => {
        label.setColor(index === cursor ? "#e6c36a" : "#efe4d0");
        label.setText(index === cursor ? `> ${options[index]} <` : options[index]);
      });
    };
    paint();
    labels.forEach((label, index) => {
      label.on("pointerover", () => {
        cursor = index;
        paint();
      });
      label.on("pointerdown", () => onPick(index));
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp" || event.code === "KeyW") cursor = (cursor + options.length - 1) % options.length;
      if (event.code === "ArrowDown" || event.code === "KeyS") cursor = (cursor + 1) % options.length;
      if (event.code === "Enter" || event.code === "Space") onPick(cursor);
      paint();
    };
    this.input.keyboard?.on("keydown", onKey);
    this.overlay = this.add.container(0, 0, [dim, heading, ...labels]);
    this.overlay.setData("onKey", onKey);
  }

  private clearOverlay(): void {
    if (!this.overlay) return;
    const onKey = this.overlay.getData("onKey") as ((event: KeyboardEvent) => void) | undefined;
    if (onKey) this.input.keyboard?.off("keydown", onKey);
    this.overlay.destroy();
    this.overlay = undefined;
  }
}
