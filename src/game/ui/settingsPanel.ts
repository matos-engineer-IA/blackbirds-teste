import { ACTIONS, ACTION_NAMES, defaultSettings, getSettings, keyLabel, rebind, saveSettings, type Action, type Settings } from "../systems/settings";

/** Native modal gives keyboard focus, semantic labels and text reflow outside the pixel canvas. */
export function openSettings(onClose: () => void = () => {}): () => void {
  const dialog = document.createElement("dialog");
  dialog.className = "game-settings";
  dialog.setAttribute("aria-labelledby", "settings-heading");
  const header = document.createElement("header");
  const title = document.createElement("h2"); title.id = "settings-heading"; title.textContent = "Configurações";
  const close = document.createElement("button"); close.textContent = "Voltar"; close.className = "settings-close";
  header.append(title, close); dialog.append(header);
  const status = document.createElement("p"); status.className = "settings-status"; status.setAttribute("role", "status");
  let pending: Action | undefined;
  const bindingButtons = new Map<Action, HTMLButtonElement>();
  const persist = (settings: Settings) => {
    const stored = saveSettings(settings);
    document.documentElement.style.setProperty("--game-text-scale", String(settings.textScale));
    status.textContent = stored ? "Configurações salvas." : "Aplicado nesta sessão. O navegador não permitiu salvar as configurações.";
    for (const [action, button] of bindingButtons) button.textContent = settings.bindings[action].map(keyLabel).join(" / ");
  };
  const group = (name: string) => { const field = document.createElement("fieldset"); const legend = document.createElement("legend"); legend.textContent = name; field.append(legend); dialog.append(field); return field; };
  const audio = group("Som e leitura");
  for (const [key, label, min, max, step] of [
    ["masterVolume", "Volume geral", 0, 1, 0.05], ["effectsVolume", "Efeitos", 0, 1, 0.05],
    ["ambienceVolume", "Ambiente", 0, 1, 0.05], ["musicVolume", "Música", 0, 1, 0.05], ["textScale", "Tamanho do texto", 1, 1.5, 0.1],
  ] as const) {
    const row = document.createElement("label"); row.className = "settings-row"; row.textContent = label;
    const input = document.createElement("input"); input.type = "range"; input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(getSettings()[key]); input.setAttribute("aria-label", label);
    const value = document.createElement("output"); value.textContent = `${Math.round(getSettings()[key] * 100)}%`;
    input.addEventListener("input", () => { const n = Number(input.value); value.textContent = `${Math.round(n * 100)}%`; persist({ ...getSettings(), [key]: n }); });
    row.append(input, value); audio.append(row);
  }
  const access = group("Conforto e acessibilidade");
  for (const [key, label] of [["captions", "Legendas de sons essenciais"], ["reducedMotion", "Reduzir movimento de câmera e efeitos"], ["reducedFlashes", "Reduzir flashes"], ["combatAssist", "Assistência de combate na arena"]] as const) {
    const row = document.createElement("label"); row.className = "settings-toggle";
    const input = document.createElement("input"); input.type = "checkbox"; input.checked = getSettings()[key]; input.addEventListener("change", () => persist({ ...getSettings(), [key]: input.checked }));
    row.append(input, document.createTextNode(label)); access.append(row);
  }
  const controls = group("Controles");
  const help = document.createElement("p"); help.textContent = "Selecione uma ação e pressione a nova tecla. Esc cancela a escolha. As setas dos menus e Enter permanecem disponíveis."; controls.append(help);
  for (const action of ACTIONS) {
    const row = document.createElement("div"); row.className = "settings-binding";
    const label = document.createElement("span"); label.textContent = ACTION_NAMES[action];
    const button = document.createElement("button"); button.textContent = getSettings().bindings[action].map(keyLabel).join(" / "); button.setAttribute("aria-label", `Alterar tecla: ${ACTION_NAMES[action]}`);
    button.addEventListener("click", () => { pending = action; button.textContent = "Pressione uma tecla…"; status.textContent = `Escolha uma tecla para ${ACTION_NAMES[action]}.`; });
    bindingButtons.set(action, button); row.append(label, button); controls.append(row);
  }
  const footer = document.createElement("footer");
  const reset = document.createElement("button"); reset.textContent = "Restaurar controles padrão";
  reset.addEventListener("click", () => persist({ ...getSettings(), bindings: defaultSettings().bindings }));
  const fullscreen = document.createElement("button"); fullscreen.textContent = "Alternar tela cheia";
  fullscreen.addEventListener("click", () => { const target = document.documentElement; const request = document.fullscreenElement ? document.exitFullscreen() : target.requestFullscreen(); void request.catch(() => { status.textContent = "O navegador não permitiu abrir em tela cheia."; }); });
  footer.append(reset, fullscreen); dialog.append(footer, status);
  let disposed = false;
  const dispose = () => { if (disposed) return; disposed = true; dialog.remove(); onClose(); };
  const closeDialog = () => { dialog.close(); dispose(); };
  dialog.addEventListener("close", dispose, { once: true });
  dialog.addEventListener("cancel", event => { event.preventDefault(); closeDialog(); });
  dialog.addEventListener("keydown", event => {
    event.stopPropagation();
    if (!pending) return;
    event.preventDefault();
    if (event.code === "Escape") { pending = undefined; persist(getSettings()); return; }
    const next = rebind(getSettings(), pending, event.code);
    if (next.error) { status.textContent = next.error; return; }
    pending = undefined; persist(next.settings!);
  });
  close.addEventListener("click", closeDialog);
  dialog.tabIndex = -1;
  document.body.append(dialog); dialog.showModal(); dialog.focus();
  return () => { if (dialog.isConnected) closeDialog(); };
}
