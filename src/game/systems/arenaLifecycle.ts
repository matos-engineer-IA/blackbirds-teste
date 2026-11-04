import Phaser from "phaser";
import type { ActionInput } from "./actionInput";
import { pauseAudio, resumeAudio } from "../utils/audio";
import { openSettings } from "../ui/settingsPanel";
import { SCENE } from "../utils/constants";

/** Pause remains operable while the gameplay scene and all its clocks are suspended. */
export class ArenaLifecycle {
  private dialog?: HTMLDialogElement;
  private closeSettings?: () => void;
  private dead = false;
  constructor(private readonly scene: Phaser.Scene, private readonly actions: ActionInput) {
    const blur = () => this.pause();
    scene.game.events.on(Phaser.Core.Events.BLUR, blur).on(Phaser.Core.Events.HIDDEN, blur);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.dead = true;
      scene.game.events.off(Phaser.Core.Events.BLUR, blur).off(Phaser.Core.Events.HIDDEN, blur);
      this.closeSettings?.(); this.dialog?.remove(); this.dialog = undefined;
    });
  }
  pause(title = "Pausa", finished = false): void {
    if (this.dialog || this.dead) return;
    this.scene.scene.pause(); this.actions.clear(); pauseAudio();
    const dialog = document.createElement("dialog"); dialog.className = "game-settings";
    const heading = document.createElement("h2"); heading.textContent = title; dialog.append(heading);
    const button = (name: string, callback: () => void) => { const b = document.createElement("button"); b.textContent = name; b.addEventListener("click", callback); dialog.append(b); return b; };
    if (!finished) button("Continuar", () => dialog.close());
    button("Reiniciar arena", () => { resumeAudio(); this.scene.scene.restart(); });
    button("Configurações", () => { this.closeSettings = openSettings(); });
    button("Menu", () => { resumeAudio(); this.scene.scene.start(SCENE.menu); });
    dialog.addEventListener("keydown", event => { event.stopPropagation(); if (finished && event.code === "Escape") event.preventDefault(); });
    dialog.addEventListener("close", () => {
      dialog.remove(); this.dialog = undefined;
      if (!this.dead) { this.actions.clear(); this.scene.input.keyboard?.resetKeys(); this.scene.scene.resume(); resumeAudio(); }
    }, { once: true });
    document.body.append(dialog); this.dialog = dialog; dialog.showModal(); (dialog.querySelector("button") as HTMLButtonElement)?.focus();
  }
}
