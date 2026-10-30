type Tone = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

let context: AudioContext | null = null;
let muted = false;
let unlocked = false;

function ctx(): AudioContext | null {
  if (muted || typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  context ??= new AudioCtor();
  return context;
}

export function unlockAudio(): void {
  const audio = ctx();
  if (!audio) return;
  void audio.resume();
  unlocked = audio.state === "running";
}

function playTones(tones: Tone[]): void {
  const audio = ctx();
  if (!audio) return;
  void audio.resume();
  const now = audio.currentTime;
  for (const tone of tones) {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = tone.type ?? "square";
    oscillator.frequency.setValueAtTime(tone.freq, now);
    gain.gain.setValueAtTime(tone.gain ?? 0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + tone.duration);
  }
}

export const sfx = {
  jump: () => playTones([{ freq: 300, duration: 0.07, type: "triangle" }]),
  land: () => playTones([{ freq: 110, duration: 0.08, type: "triangle", gain: 0.04 }]),
  step: () => playTones([{ freq: 80, duration: 0.04, type: "triangle", gain: 0.02 }]),
  attack: () => playTones([{ freq: 160, duration: 0.08, type: "sawtooth", gain: 0.04 }]),
  steam: () => playTones([{ freq: 420, duration: 0.12, type: "triangle", gain: 0.02 }]),
  shot: () => playTones([{ freq: 90, duration: 0.12, type: "sawtooth", gain: 0.07 }, { freq: 700, duration: 0.05, type: "square", gain: 0.03 }]),
  reload: () => playTones([{ freq: 220, duration: 0.08, type: "square" }, { freq: 180, duration: 0.1, type: "triangle" }]),
  hit: () => playTones([{ freq: 90, duration: 0.12, type: "square", gain: 0.06 }]),
  door: () => playTones([{ freq: 140, duration: 0.16, type: "triangle", gain: 0.05 }]),
  ui: () => playTones([{ freq: 240, duration: 0.05, type: "triangle", gain: 0.03 }]),
  talk: () => playTones([{ freq: 260, duration: 0.04, type: "triangle", gain: 0.025 }]),
  cart: () => playTones([{ freq: 70, duration: 0.2, type: "sawtooth", gain: 0.03 }]),
  crash: () => playTones([
    { freq: 60, duration: 0.45, type: "sawtooth", gain: 0.09 },
    { freq: 140, duration: 0.28, type: "square", gain: 0.06 },
    { freq: 40, duration: 0.55, type: "triangle", gain: 0.05 },
  ]),
  bell: () => playTones([{ freq: 520, duration: 0.35, type: "sine", gain: 0.04 }, { freq: 390, duration: 0.4, type: "sine", gain: 0.03 }]),
};

export function setMuted(value: boolean): void {
  muted = value;
}

export function isAudioUnlocked(): boolean {
  return unlocked;
}
