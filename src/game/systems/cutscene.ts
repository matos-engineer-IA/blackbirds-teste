export type CutscenePhase =
  | "idle"
  | "lock"
  | "approach"
  | "daughter"
  | "vehicle"
  | "black"
  | "silence"
  | "title"
  | "done";

export type CutsceneState = {
  phase: CutscenePhase;
  elapsed: number;
};

export function startCutscene(): CutsceneState {
  return { phase: "lock", elapsed: 0 };
}

export function tickCutscene(state: CutsceneState, dtMs: number): CutsceneState {
  const elapsed = state.elapsed + dtMs;
  const next = (phase: CutscenePhase) => ({ phase, elapsed: 0 });
  if (state.phase === "lock" && elapsed > 400) return next("approach");
  if (state.phase === "approach" && elapsed > 900) return next("daughter");
  if (state.phase === "daughter" && elapsed > 1400) return next("vehicle");
  if (state.phase === "vehicle" && elapsed > 1100) return next("black");
  if (state.phase === "black" && elapsed > 900) return next("silence");
  if (state.phase === "silence" && elapsed > 1200) return next("title");
  if (state.phase === "title" && elapsed > 1600) return next("done");
  return { ...state, elapsed };
}

export function shouldPlayCrash(previous: CutscenePhase, next: CutscenePhase): boolean {
  return previous !== "black" && next === "black";
}
