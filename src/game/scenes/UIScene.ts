import Phaser from "phaser";
import { palette } from "../palette";
import { elapsedSeconds, formatTime, type RunSnapshot } from "../systems/runState";
import { sfx } from "../utils/audio";
import { GAME, SCENE } from "../utils/constants";
import { GameScene } from "./GameScene";

type HudInfo = {
  hp: number;
  maxHp: number;
  hasDash: boolean;
  dashing: boolean;
  room: string;
  objective: string;
};

export class UIScene extends Phaser.Scene {
  private hearts: Phaser.GameObjects.Image[] = [];
  private dashIcon!: Phaser.GameObjects.Image;
  private objective!: Phaser.GameObjects.Text;
  private roomLabel!: Phaser.GameObjects.Text;
  private overlay?: Phaser.GameObjects.Container;

  constructor() {
    super(SCENE.ui);
  }

  create(): void {
    this.hearts = [0, 1, 2].map((index) =>
      this.add.image(16 + index * 16, 16, "heart").setScrollFactor(0).setDepth(20),
    );
    this.dashIcon = this.add.image(GAME.width - 18, 16, "dash-icon").setScrollFactor(0).setDepth(20).setAlpha(0.25);
    this.roomLabel = this.add.text(16, 28, "", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#7f93a8",
    }).setScrollFactor(0).setDepth(20);
    this.objective = this.add.text(16, GAME.height - 16, "", {
      fontFamily: "monospace",
      fontSize: "8px",
      color: "#d6f6ff",
    }).setScrollFactor(0).setDepth(20);

    const game = this.scene.get(SCENE.game) as GameScene;
    game.events.on("hud", (info: HudInfo) => this.drawHud(info));
    game.events.on("pause", () => this.showMenu("PAUSA", ["CONTINUAR", "REINICIAR", "MENU PRINCIPAL"], (choice) => {
      if (choice === 0) {
        this.clearOverlay();
        game.resumePlay();
      } else if (choice === 1) {
        this.clearOverlay();
        game.restartFromCheckpoint();
      } else {
        game.restartFull();
      }
    }));
    game.events.on("unpause", () => this.clearOverlay());
    game.events.on("death", () => this.showMenu("SINAL PERDIDO", ["REINICIAR DO CHECKPOINT", "MENU PRINCIPAL"], (choice) => {
      if (choice === 0) {
        this.clearOverlay();
        game.restartFromCheckpoint();
      } else {
        game.restartFull();
      }
    }));
    game.events.on("win", (run: RunSnapshot) => {
      const time = formatTime(elapsedSeconds(run));
      this.showMenu(`MISSAO CONCLUIDA\nTEMPO ${time}`, ["JOGAR NOVAMENTE", "MENU PRINCIPAL"], (choice) => {
        this.clearOverlay();
        if (choice === 0) game.replay();
        else game.restartFull();
      });
    });
    game.events.on("toast", (message: string) => {
      const toast = this.add.text(GAME.width / 2, 48, message, {
        fontFamily: "monospace",
        fontSize: "9px",
        color: "#2de2e6",
        backgroundColor: "#070b14cc",
        padding: { x: 8, y: 4 },
      }).setOrigin(0.5).setScrollFactor(0).setDepth(22);
      this.time.delayedCall(1800, () => toast.destroy());
    });
  }

  private drawHud(info: HudInfo): void {
    this.hearts.forEach((heart, index) => heart.setAlpha(index < info.hp ? 1 : 0.2));
    this.dashIcon.setAlpha(info.hasDash ? (info.dashing ? 1 : 0.9) : 0.2);
    this.dashIcon.setTint(info.hasDash ? palette.cyan : palette.muted);
    this.roomLabel.setText(info.room);
    this.objective.setText(info.objective);
  }

  private showMenu(title: string, options: string[], onPick: (index: number) => void): void {
    this.clearOverlay();
    sfx.ui();
    let cursor = 0;
    const dim = this.add.rectangle(GAME.width / 2, GAME.height / 2, GAME.width, GAME.height, 0x05070d, 0.72);
    const heading = this.add.text(GAME.width / 2, 88, title, {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#2de2e6",
      align: "center",
    }).setOrigin(0.5);
    const labels = options.map((option, index) =>
      this.add.text(GAME.width / 2, 128 + index * 18, option, {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#d6f6ff",
      }).setOrigin(0.5).setInteractive({ useHandCursor: true }),
    );
    const paint = () => {
      labels.forEach((label, index) => {
        label.setColor(index === cursor ? "#ff2d95" : "#d6f6ff");
        label.setText(index === cursor ? `> ${options[index]} <` : options[index]);
      });
    };
    paint();
    const choose = (index: number) => onPick(index);
    labels.forEach((label, index) => {
      label.on("pointerover", () => {
        cursor = index;
        paint();
      });
      label.on("pointerdown", () => choose(index));
    });
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp" || event.code === "KeyW") cursor = (cursor + options.length - 1) % options.length;
      if (event.code === "ArrowDown" || event.code === "KeyS") cursor = (cursor + 1) % options.length;
      if (event.code === "Enter" || event.code === "Space") choose(cursor);
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
