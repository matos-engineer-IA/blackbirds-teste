import { describe, expect, it } from "vitest";
import { defaultSettings, parseSettings, rebind, saveSettings, SETTINGS_KEY } from "../src/game/systems/settings";
import { loadOpening, parseSave, saveOpening, SAVE_KEY, type OpeningSave } from "../src/game/systems/saveGame";

const example = (): OpeningSave => ({ version: 1, contentVersion: "opening-2", savedAt: 1000, checkpoint: { x: 176, roomId: "operario", facing: 1 }, talked: ["vizinha"], flags: { "door.home": true }, activeWalkMs: 1200, walkDistance: 170, completed: false });
function memory() { const data = new Map<string, string>(); return { data, getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); }, removeItem: (key: string) => { data.delete(key); } }; }
describe("persistência e configurações", () => {
  it("restaura checkpoint e flags sem misturar configurações ou arena", () => {
    const storage = memory();
    expect(saveSettings(defaultSettings(), storage)).toBe(true);
    expect(saveOpening(example(), storage)).toBe(true);
    expect(loadOpening(storage).save).toEqual(example());
    expect(parseSettings(storage.getItem(SETTINGS_KEY))).toEqual(defaultSettings());
    storage.removeItem(SAVE_KEY);
    expect(storage.getItem(SETTINGS_KEY)).toBeTruthy();
  });
  it("recusa dados danificados, versão futura e coordenadas não finitas", () => {
    for (const raw of ["{", JSON.stringify({ ...example(), version: 99 }), JSON.stringify({ ...example(), checkpoint: { x: null } }), "x".repeat(70000)]) {
      expect(parseSave(raw).save).toBeUndefined(); expect(parseSave(raw).error).toBeTruthy();
    }
  });
  it("trata falha de armazenamento sem lançar ou apagar dados", () => {
    const blocked = { getItem: () => { throw Error("denied"); }, setItem: () => { throw Error("quota"); }, removeItem: () => { throw Error("denied"); } };
    expect(loadOpening(blocked).error).toBeTruthy();
    expect(saveOpening(example(), blocked)).toBe(false);
    expect(saveSettings(defaultSettings(), blocked)).toBe(false);
  });
  it("remapeia ações e recusa conflitos em vez de perder controles", () => {
    expect(rebind(defaultSettings(), "jump", "KeyD").error).toContain("direita");
    const next = rebind(defaultSettings(), "jump", "KeyV").settings!;
    expect(next.bindings.jump).toEqual(["KeyV"]);
    expect(parseSettings(JSON.stringify(next))).toEqual(next);
    expect(rebind(next, "pause", "Tab").error).toBeTruthy();
  });
  it("valida limites, tipos e bindings duplicados nas configurações", () => {
    expect(parseSettings(JSON.stringify({ ...defaultSettings(), masterVolume: 9 }))).toBeUndefined();
    expect(parseSettings(JSON.stringify({ ...defaultSettings(), captions: "yes" }))).toBeUndefined();
    expect(parseSettings(JSON.stringify({ ...defaultSettings(), bindings: { ...defaultSettings().bindings, jump: ["KeyA"] } }))).toBeUndefined();
  });
});
