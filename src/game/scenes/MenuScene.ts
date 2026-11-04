import Phaser from "phaser";
import { palette } from "../palette";
import { sfx, setAudioRegion, unlockAudio } from "../utils/audio";
import { SCENE } from "../utils/constants";
import { loadOpening } from "../systems/saveGame";
import { ACTIONS, ACTION_NAMES, getSettings, keyLabel } from "../systems/settings";
import { CITY_WIDTH, segmentAt } from "../levels/city";
import { openSettings } from "../ui/settingsPanel";

type MenuKey = "continue" | "start" | "arena" | "boss" | "settings" | "controls" | "credits";
export class MenuScene extends Phaser.Scene {
  private cursor = 0;
  private labels: Phaser.GameObjects.Text[] = [];
  private closePanel?: () => void;
  private items: { key: MenuKey; text: string }[] = [];
  constructor() { super(SCENE.menu); }
  create(): void {
    this.cursor = 0; this.closePanel = undefined; setAudioRegion("menu");
    const loaded = loadOpening(), save = loaded.save;
    const resumable = save && !save.completed && save.checkpoint.x >= 12 && save.checkpoint.x <= CITY_WIDTH - 12 && segmentAt(save.checkpoint.x).id === save.checkpoint.roomId;
    this.items = [
      ...(resumable ? [{ key: "continue" as const, text: "CONTINUAR" }] : []),
      { key: "start", text: "NOVO JOGO" }, { key: "arena", text: "CAMPO DE PROVAS" },
      { key: "boss", text: "ARENA WINSTH — TREINO" },
      { key: "settings", text: "CONFIGURAÇÕES" }, { key: "controls", text: "CONTROLES" }, { key: "credits", text: "CRÉDITOS" },
    ];
    const { width, height } = this.scale;
    this.add.tileSprite(width / 2, 110, width, 220, "bg-far");
    this.add.tileSprite(width / 2, 200, width, 250, "bg-mid").setAlpha(0.9);
    this.add.rectangle(width / 2, height / 2, width, height, palette.bg, 0.38);
    this.add.text(width / 2, 59, "Black Bird: Revolução", { fontFamily: "Georgia, serif", fontSize: "25px", color: "#e1bf7a" }).setOrigin(0.5);
    this.add.text(width / 2, 95, "Prólogo — O Último Dia", { fontFamily: "Georgia, serif", fontSize: "12px", color: "#c9b798" }).setOrigin(0.5);
    this.labels = this.items.map((item, index) => this.add.text(width / 2, 135 + index * 24, item.text, { fontFamily: "Georgia, serif", fontSize: "12px", color: "#efe4d0" }).setOrigin(0.5).setInteractive({ useHandCursor: true }));
    this.labels.forEach((label, index) => { label.on("pointerover", () => { this.cursor = index; this.refresh(); }); label.on("pointerdown", () => this.activate()); });
    if (loaded.error) this.add.text(width / 2, height - 43, loaded.error, { fontFamily: "Georgia, serif", fontSize: "10px", color: "#e0b589", wordWrap: { width: 590 }, align: "center" }).setOrigin(0.5);
    this.add.text(width / 2, height - 18, "↑ ↓ escolher  ·  Enter confirmar  ·  Nero vai buscar a filha na escola", { fontFamily: "Georgia, serif", fontSize: "10px", color: "#b7a287" }).setOrigin(0.5);
    const build = this.cache.json.get("build-info") as { buildId?: string } | undefined;
    this.add.text(width - 8, height - 5, build?.buildId ?? "Desenvolvimento", { fontFamily: "monospace", fontSize: "8px", color: "#907d62" }).setOrigin(1, 1);
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (["ArrowUp", "KeyW"].includes(event.code)) this.move(-1);
      else if (["ArrowDown", "KeyS"].includes(event.code)) this.move(1);
      else if (["Enter", "Space"].includes(event.code)) { event.preventDefault(); this.activate(); }
    };
    this.input.keyboard!.on("keydown", onKey);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => { this.input.keyboard?.off("keydown", onKey); this.closePanel?.(); });
    this.refresh();
  }
  private move(delta: number): void { unlockAudio(); this.cursor = (this.cursor + delta + this.items.length) % this.items.length; sfx.ui(); this.refresh(); }
  private refresh(): void { this.labels.forEach((label, index) => { label.setColor(index === this.cursor ? "#f2cf80" : "#e3d5ba"); label.setText(index === this.cursor ? `›  ${this.items[index].text}  ‹` : this.items[index].text); }); }
  private activate(): void {
    unlockAudio(); sfx.ui(); const selected = this.items[this.cursor];
    if (selected.key === "start" || selected.key === "continue") { this.scene.start(SCENE.game, { resume: selected.key === "continue" }); this.scene.launch(SCENE.ui); return; }
    if (selected.key === "arena" || selected.key === "boss") { this.scene.start(selected.key === "arena" ? SCENE.arena : SCENE.boss); return; }
    this.input.keyboard!.enabled = false;
    if (selected.key === "settings") this.closePanel = openSettings(() => { if (this.input.keyboard) this.input.keyboard.enabled = true; });
    else this.showInformation(selected.key);
  }
  private showInformation(kind: "controls" | "credits"): void {
    const dialog = document.createElement("dialog"); dialog.className = "game-settings";
    const heading = document.createElement("h2"); heading.textContent = kind === "controls" ? "Controles" : "Créditos"; dialog.append(heading);
    const body = document.createElement("div");
    if (kind === "controls") {
      for (const action of ACTIONS) { const row = document.createElement("p"); row.textContent = `${ACTION_NAMES[action]} — ${getSettings().bindings[action].map(keyLabel).join(" / ")}`; body.append(row); }
      const note = document.createElement("p"); note.textContent = "Na abertura, os ataques ficam guardados. O campo de provas e a arena de Winsth são experiências de combate separadas."; body.append(note);
    } else {
      const text = document.createElement("p"); text.textContent = "Black Bird: Revolução — obra original em desenvolvimento. Arte do projeto, incluindo materiais criados com assistência de IA e integrados após revisão técnica. Phaser, Vite e ferramentas conforme suas licenças. Nenhum personagem ou cenário de jogo comercial foi incorporado."; body.append(text);
    }
    let disposed = false;
    const dispose = () => { if (disposed) return; disposed = true; dialog.remove(); if (this.input.keyboard) this.input.keyboard.enabled = true; };
    const dismiss = () => { dialog.close(); dispose(); };
    const close = document.createElement("button"); close.textContent = "Voltar"; close.addEventListener("click", dismiss); dialog.append(body, close);
    dialog.addEventListener("keydown", event => event.stopPropagation());
    dialog.addEventListener("cancel", event => { event.preventDefault(); dismiss(); });
    dialog.addEventListener("close", dispose, { once: true });
    this.closePanel = () => { if (dialog.isConnected) dismiss(); }; dialog.tabIndex = -1; document.body.append(dialog); dialog.showModal(); dialog.focus();
  }
}
