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
  sceneCount: 6,
  port: 8080,
  title: "Black Bird: Revolução",
} as const;
