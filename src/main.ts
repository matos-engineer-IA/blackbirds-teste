import { startGame } from "./game/createGame";
import "./styles/global.css";

const mount = () => {
  const parent = document.getElementById("game-container");
  if (!parent) {
    throw new Error("game-container ausente");
  }
  startGame("game-container");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
