import { browserStorage } from "./settings";
import type { RoomId } from "./progress";

export const SAVE_KEY = "black-bird.opening.v1";
export type OpeningSave = {
  version: 1;
  contentVersion: "opening-2";
  savedAt: number;
  checkpoint: { x: number; roomId: RoomId; facing: -1 | 1 };
  talked: string[];
  flags: Record<string, boolean>;
  activeWalkMs: number;
  walkDistance: number;
  completed: boolean;
};
export type SaveResult = { save?: OpeningSave; error?: string };
const finite = (x: unknown, max = 1e9): x is number => typeof x === "number" && Number.isFinite(x) && x >= 0 && x <= max;
const object = (x: unknown): x is Record<string, unknown> => x !== null && typeof x === "object" && !Array.isArray(x);
export function parseSave(raw: string | null): SaveResult {
  if (!raw) return {};
  if (raw.length > 65536) return { error: "O arquivo de progresso é grande demais." };
  try {
    const data: unknown = JSON.parse(raw);
    if (!object(data) || data.version !== 1 || data.contentVersion !== "opening-2") return { error: "Este progresso usa uma versão incompatível. Suas configurações foram preservadas." };
    const cp = data.checkpoint;
    if (!object(cp) || !finite(cp.x, 1e6) || !["operario", "mercado", "avenida", "escola"].includes(String(cp.roomId)) || (cp.facing !== -1 && cp.facing !== 1)
      || !Array.isArray(data.talked) || data.talked.length > 256 || !data.talked.every(id => typeof id === "string" && /^[\w-]{1,64}$/.test(id))
      || !object(data.flags) || Object.keys(data.flags).length > 512 || !Object.entries(data.flags).every(([id, value]) => /^[\w.-]{1,96}$/.test(id) && typeof value === "boolean")
      || !finite(data.activeWalkMs) || !finite(data.walkDistance) || !finite(data.savedAt, 1e14) || typeof data.completed !== "boolean") return { error: "Não foi possível ler o progresso. Você pode iniciar uma nova abertura; suas configurações continuam salvas." };
    return { save: data as unknown as OpeningSave };
  } catch { return { error: "O progresso está danificado. Suas configurações foram preservadas." }; }
}
export function loadOpening(storage = browserStorage()): SaveResult {
  try { return parseSave(storage?.getItem(SAVE_KEY) ?? null); } catch { return { error: "O navegador bloqueou o acesso ao progresso. A sessão pode continuar sem salvamento." }; }
}
export function saveOpening(save: OpeningSave, storage = browserStorage()): boolean {
  if (!parseSave(JSON.stringify(save)).save) return false;
  try { if (!storage) return false; storage.setItem(SAVE_KEY, JSON.stringify(save)); return true; } catch { return false; }
}
