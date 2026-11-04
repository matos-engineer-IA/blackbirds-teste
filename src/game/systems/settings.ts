export const ACTIONS = ["left", "right", "jump", "interact", "melee", "fire", "reload", "dodge", "pause", "skip"] as const;
export type Action = typeof ACTIONS[number];
export type Settings = {
  version: 1;
  masterVolume: number;
  effectsVolume: number;
  ambienceVolume: number;
  musicVolume: number;
  textScale: number;
  reducedMotion: boolean;
  reducedFlashes: boolean;
  captions: boolean;
  combatAssist: boolean;
  bindings: Record<Action, string[]>;
};
export type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export const SETTINGS_KEY = "black-bird.settings.v1";
export const ACTION_NAMES: Record<Action, string> = { left: "Andar à esquerda", right: "Andar à direita", jump: "Pular", interact: "Interagir / diálogo", melee: "Braço mecânico", fire: "Revólver", reload: "Recarregar", dodge: "Esquivar", pause: "Pausar", skip: "Pular cena" };

export function defaultSettings(): Settings {
  return { version: 1, masterVolume: 0.7, effectsVolume: 0.8, ambienceVolume: 0.55, musicVolume: 0.35,
    textScale: 1, reducedMotion: false, reducedFlashes: false, captions: true, combatAssist: false,
    bindings: { left: ["KeyA", "ArrowLeft"], right: ["KeyD", "ArrowRight"], jump: ["Space", "KeyW", "ArrowUp"], interact: ["KeyE", "Enter"], melee: ["KeyJ", "KeyZ"], fire: ["KeyK", "KeyX"], reload: ["KeyR"], dodge: ["ShiftLeft"], pause: ["Escape"], skip: ["KeyF"] },
  };
}

export function browserStorage(): StoragePort | undefined {
  try { return typeof window !== "undefined" ? window.localStorage : undefined; } catch { return undefined; }
}

const isObject = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
export function validKey(code: unknown): code is string {
  return typeof code === "string" && /^(Key[A-Z]|Digit[0-9]|Arrow(Left|Right|Up|Down)|Space|Enter|Escape|Shift(Left|Right))$/.test(code);
}

export function parseSettings(raw: string | null): Settings | undefined {
  if (!raw || raw.length > 16384) return undefined;
  try {
    const data: unknown = JSON.parse(raw);
    if (!isObject(data) || data.version !== 1 || !isObject(data.bindings)) return undefined;
    const result = defaultSettings();
    for (const key of ["masterVolume", "effectsVolume", "ambienceVolume", "musicVolume", "textScale"] as const) {
      const value = data[key];
      if (typeof value !== "number" || !Number.isFinite(value) || value < (key === "textScale" ? 1 : 0) || value > (key === "textScale" ? 1.5 : 1)) return undefined;
      result[key] = value;
    }
    for (const key of ["reducedMotion", "reducedFlashes", "captions", "combatAssist"] as const) {
      if (typeof data[key] !== "boolean") return undefined;
      result[key] = data[key];
    }
    const used = new Set<string>();
    for (const action of ACTIONS) {
      const codes = data.bindings[action];
      if (!Array.isArray(codes) || codes.length < 1 || codes.length > 3 || !codes.every(validKey)) return undefined;
      for (const code of codes) { if (used.has(code)) return undefined; used.add(code); }
      result.bindings[action] = [...codes];
    }
    return result;
  } catch { return undefined; }
}

let current: Settings | undefined;
const listeners = new Set<(settings: Settings) => void>();
export function getSettings(): Settings {
  if (!current) { let raw: string | null = null; try { raw = browserStorage()?.getItem(SETTINGS_KEY) ?? null; } catch { /* Storage is optional; memory remains usable. */ }
    current = parseSettings(raw) ?? defaultSettings(); }
  return current;
}
export function saveSettings(next: Settings, storage = browserStorage()): boolean {
  const validated = parseSettings(JSON.stringify(next));
  if (!validated) return false;
  current = validated;
  for (const listener of listeners) listener(validated);
  try { if (!storage) return false; storage.setItem(SETTINGS_KEY, JSON.stringify(validated)); return true; } catch { return false; }
}
export function onSettingsChanged(listener: (settings: Settings) => void): () => void {
  listeners.add(listener); return () => listeners.delete(listener);
}
export function keyFor(action: Action): string { return keyLabel(getSettings().bindings[action][0]); }
export function keyLabel(code: string): string {
  return ({ Space: "Espaço", Enter: "Enter", Escape: "Esc", ShiftLeft: "Shift", ShiftRight: "Shift", ControlLeft: "Ctrl", ControlRight: "Ctrl", ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓" } as Record<string, string>)[code] ?? code.replace(/^Key|^Digit/, "");
}
export function rebind(settings: Settings, action: Action, code: string): { settings?: Settings; error?: string } {
  if (!validKey(code)) return { error: "Escolha uma letra, seta, número, Espaço, Enter, Esc ou Shift." };
  const conflict = ACTIONS.find(other => other !== action && settings.bindings[other].includes(code));
  if (conflict) return { error: `${keyLabel(code)} já está em uso: ${ACTION_NAMES[conflict]}.` };
  return { settings: { ...settings, bindings: { ...settings.bindings, [action]: [code] } } };
}
