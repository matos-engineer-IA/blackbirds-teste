export { ENEMY, GAME, PLAYER, SCENE } from "./utils/constants";
export { palette } from "./palette";

export const buildProfile = {
  language: "typescript",
  framework: "phaser",
  bundler: "vite",
  runtime: "node",
  server: "nginx",
  physics: "arcade",
  output: "dist",
  sceneCount: 4,
  port: 8080,
} as const;
