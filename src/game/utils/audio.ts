import { getSettings, onSettingsChanged } from "../systems/settings";

type Tone = { freq: number; duration: number; type?: OscillatorType; gain?: number };
type Region = "menu" | "operario" | "mercado" | "avenida" | "escola" | "arena";
let context: AudioContext | null = null;
let muted = false;
let paused = false;
let unlocked = false;
let region: Region = "menu";
let quietBackground = false;
let ambience: GainNode | undefined;
let music: GainNode | undefined;
const drones: OscillatorNode[] = [];
const captions = new Set<(text: string) => void>();

function updateMix(): void {
  if (!context) return;
  const settings = getSettings(), master = muted ? 0 : settings.masterVolume;
  const level = quietBackground ? 0 : region === "menu" ? 0.3 : 1;
  ambience?.gain.setTargetAtTime(master * settings.ambienceVolume * 0.012 * level, context.currentTime, 0.4);
  music?.gain.setTargetAtTime(master * settings.musicVolume * 0.018 * level, context.currentTime, 0.6);
  const root = { menu: 55, operario: 55, mercado: 65.4, avenida: 73.4, escola: 49, arena: 61.7 }[region];
  drones.forEach((voice, index) => voice.frequency.setTargetAtTime(root * [1, 1.5, 2][index], context!.currentTime, 2));
}
onSettingsChanged(updateMix);

function ctx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!context) {
    context = new AudioCtor();
    const compressor = context.createDynamicsCompressor(); compressor.threshold.value = -12; compressor.ratio.value = 5; compressor.connect(context.destination);
    ambience = context.createGain(); ambience.connect(compressor);
    music = context.createGain(); music.connect(compressor);
    const noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate), data = noise.getChannelData(0);
    let seed = 7919; for (let i = 0; i < data.length; i++) { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; data[i] = seed / 0x80000000 - 1; }
    const source = context.createBufferSource(); source.buffer = noise; source.loop = true;
    const filter = context.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 480; source.connect(filter); filter.connect(ambience); source.start();
    for (let i = 0; i < 3; i++) { const voice = context.createOscillator(), gain = context.createGain(); voice.type = "sine"; gain.gain.value = [0.65, 0.18, 0.1][i]; voice.connect(gain); gain.connect(music); voice.start(); drones.push(voice); }
    updateMix();
  }
  return context;
}
export function unlockAudio(): void { paused = false; const audio = ctx(); if (audio) void audio.resume().then(() => { unlocked = audio.state === "running"; }).catch(() => { unlocked = false; }); }
export function pauseAudio(): void { paused = true; if (context) void context.suspend().catch(() => {}); }
export function resumeAudio(): void { unlockAudio(); }
export function setAudioRegion(next: Region): void { region = next; quietBackground = false; updateMix(); }
export function quietAmbience(): void { quietBackground = true; updateMix(); }
export function onAudioCaption(listener: (text: string) => void): () => void { captions.add(listener); return () => captions.delete(listener); }
function cue(text?: string): void { if (text !== undefined) for (const listener of captions) listener(text); }
export function clearAudioCaption(): void { cue(""); }
function playTones(tones: Tone[], caption?: string): void {
  if (paused) return;
  cue(caption);
  const audio = ctx(); if (!audio || muted) return;
  const settings = getSettings(), volume = settings.masterVolume * settings.effectsVolume;
  if (volume <= 0 || audio.state !== "running") return;
  const now = audio.currentTime;
  for (const tone of tones) {
    const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.type = tone.type ?? "triangle"; oscillator.frequency.setValueAtTime(tone.freq, now);
    gain.gain.setValueAtTime(Math.max(0.0001, (tone.gain ?? 0.035) * volume), now); gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
    oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(now); oscillator.stop(now + tone.duration);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }
}
export const sfx = {
  jump: () => playTones([{ freq: 230, duration: 0.07, gain: 0.018 }]),
  land: () => playTones([{ freq: 75, duration: 0.1, gain: 0.025 }]),
  step: () => playTones([{ freq: 65, duration: 0.035, gain: 0.012 }]),
  attack: () => playTones([{ freq: 125, duration: 0.08, type: "sawtooth", gain: 0.025 }]),
  steam: () => playTones([{ freq: 380, duration: 0.16, gain: 0.018 }]),
  shot: () => playTones([{ freq: 80, duration: 0.13, type: "sawtooth", gain: 0.055 }, { freq: 720, duration: 0.035, type: "square", gain: 0.018 }]),
  reload: () => playTones([{ freq: 280, duration: 0.045, type: "square", gain: 0.02 }, { freq: 170, duration: 0.09, gain: 0.02 }]),
  hit: () => playTones([{ freq: 85, duration: 0.11, type: "square", gain: 0.035 }]),
  door: () => playTones([{ freq: 130, duration: 0.16, gain: 0.025 }]),
  ui: () => playTones([{ freq: 240, duration: 0.04, gain: 0.012 }]),
  talk: () => playTones([{ freq: 250, duration: 0.025, gain: 0.01 }]),
  cart: () => playTones([{ freq: 65, duration: 0.3, type: "sawtooth", gain: 0.025 }], "[Rodas e motor a vapor se aproximam.]"),
  crash: (caption = true) => playTones([{ freq: 55, duration: 0.5, type: "sawtooth", gain: 0.07 }, { freq: 135, duration: 0.28, type: "square", gain: 0.04 }, { freq: 37, duration: 0.65, gain: 0.04 }], caption ? "[Um estrondo na rua. Depois, silêncio.]" : undefined),
  bell: () => playTones([{ freq: 520, duration: 0.4, type: "sine", gain: 0.03 }, { freq: 390, duration: 0.5, type: "sine", gain: 0.02 }], "[O sino da escola toca.]"),
};
export function setMuted(value: boolean): void { muted = value; updateMix(); }
export function isAudioUnlocked(): boolean { return unlocked; }
export function installCaptions(): () => void {
  const element = document.createElement("div"); element.id = "game-caption"; element.setAttribute("role", "status"); element.setAttribute("aria-live", "polite"); document.body.append(element);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const off = onAudioCaption(text => { if (timer) clearTimeout(timer); element.textContent = getSettings().captions ? text : ""; timer = setTimeout(() => { element.textContent = ""; }, 3500); });
  const offSettings = onSettingsChanged(settings => { if (!settings.captions) element.textContent = ""; document.documentElement.style.setProperty("--game-text-scale", String(settings.textScale)); });
  document.documentElement.style.setProperty("--game-text-scale", String(getSettings().textScale));
  return () => { off(); offSettings(); if (timer) clearTimeout(timer); element.remove(); };
}
