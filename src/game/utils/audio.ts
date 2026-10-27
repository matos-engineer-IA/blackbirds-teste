type Tone = {
  freq: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
};

let context: AudioContext | null = null;
let muted = false;

function ctx(): AudioContext | null {
  if (muted || typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  context ??= new AudioCtor();
  return context;
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
    gain.gain.setValueAtTime(tone.gain ?? 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now);
    oscillator.stop(now + tone.duration);
  }
}

export const sfx = {
  jump: () => playTones([{ freq: 420, duration: 0.08, type: "square" }]),
  land: () => playTones([{ freq: 140, duration: 0.06, type: "triangle", gain: 0.04 }]),
  attack: () => playTones([{ freq: 220, duration: 0.07, type: "sawtooth", gain: 0.04 }]),
  hit: () => playTones([{ freq: 90, duration: 0.12, type: "square", gain: 0.06 }]),
  dash: () => playTones([{ freq: 680, duration: 0.1, type: "square" }, { freq: 920, duration: 0.08, type: "triangle", gain: 0.03 }]),
  unlock: () => playTones([{ freq: 520, duration: 0.16 }, { freq: 740, duration: 0.2 }, { freq: 980, duration: 0.24 }]),
  checkpoint: () => playTones([{ freq: 600, duration: 0.1 }, { freq: 800, duration: 0.12 }]),
  death: () => playTones([{ freq: 180, duration: 0.3, type: "sawtooth", gain: 0.05 }]),
  win: () => playTones([{ freq: 523, duration: 0.18 }, { freq: 659, duration: 0.18 }, { freq: 784, duration: 0.28 }]),
  ui: () => playTones([{ freq: 300, duration: 0.05, type: "triangle", gain: 0.03 }]),
};

export function setMuted(value: boolean): void {
  muted = value;
}
