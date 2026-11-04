import Phaser from "phaser";
import { ACTIONS, getSettings, type Action } from "./settings";

export type ActionFrame = { down: Record<Action, boolean>; pressed: Record<Action, boolean> };
/** Raw devices produce actions. A short key pulse survives until one simulation sample. */
export class ActionInput {
  private held = new Set<string>();
  private pulses = new Set<Action>();
  constructor(scene: Phaser.Scene) {
    const down = (event: KeyboardEvent) => {
      if (event.metaKey || event.altKey || event.ctrlKey) return;
      this.held.add(event.code);
      if (!event.repeat) for (const action of ACTIONS) if (getSettings().bindings[action].includes(event.code)) this.pulses.add(action);
    };
    const up = (event: KeyboardEvent) => { this.held.delete(event.code); };
    const clear = () => this.clear();
    scene.input.keyboard!.on("keydown", down).on("keyup", up);
    scene.game.events.on(Phaser.Core.Events.BLUR, clear);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.keyboard?.off("keydown", down).off("keyup", up);
      scene.game.events.off(Phaser.Core.Events.BLUR, clear);
      this.clear();
    });
  }
  sample(): ActionFrame {
    const settings = getSettings();
    const down = {} as Record<Action, boolean>, pressed = {} as Record<Action, boolean>;
    for (const action of ACTIONS) { down[action] = settings.bindings[action].some(code => this.held.has(code)); pressed[action] = this.pulses.has(action); }
    this.pulses.clear();
    return { down, pressed };
  }
  clear(): void { this.held.clear(); this.pulses.clear(); }
}
