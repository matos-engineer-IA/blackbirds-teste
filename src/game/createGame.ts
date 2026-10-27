import Phaser from "phaser";
import { palette } from "./palette";
import { BootScene } from "./scenes/BootScene";
import { GameScene } from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";
import { UIScene } from "./scenes/UIScene";
import { GAME } from "./utils/constants";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: palette.bg,
  width: GAME.width,
  height: GAME.height,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: GAME.gravity },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, UIScene],
};

export function startGame(parent: string): Phaser.Game {
  const game = new Phaser.Game({ ...gameConfig, parent });
  (window as Window & { neonFall?: Phaser.Game }).neonFall = game;
  return game;
}
