import { dialogueOf, type DialogueLine } from "../content/dialogues";

export type DialogueState = {
  open: boolean;
  id: string;
  index: number;
  lines: DialogueLine[];
  lockMs: number;
};

export function closedDialogue(): DialogueState {
  return { open: false, id: "", index: 0, lines: [], lockMs: 0 };
}

export function openDialogue(id: string): DialogueState {
  return { open: true, id, index: 0, lines: dialogueOf(id), lockMs: 220 };
}

export function tickDialogue(state: DialogueState, dtMs: number): DialogueState {
  if (!state.open) return state;
  return { ...state, lockMs: Math.max(0, state.lockMs - dtMs) };
}

export function advanceDialogue(state: DialogueState): DialogueState {
  if (!state.open || state.lockMs > 0) return state;
  const next = state.index + 1;
  if (next >= state.lines.length) return closedDialogue();
  return { ...state, index: next, lockMs: 180 };
}

export function currentLine(state: DialogueState): DialogueLine | undefined {
  if (!state.open) return undefined;
  return state.lines[state.index];
}
