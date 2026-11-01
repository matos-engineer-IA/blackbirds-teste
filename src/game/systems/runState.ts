import { nextObjective, type ObjectiveId, type RoomId } from "./progress";

export type RunSnapshot = {
  roomId: RoomId;
  talked: string[];
  startedAt: number;
  prologueEnded: boolean;
  objective: ObjectiveId;
  activeWalkMs: number;
  walkDistance: number;
};

export const createRun = (now = Date.now()): RunSnapshot => ({
  roomId: "operario",
  talked: [],
  startedAt: now,
  prologueEnded: false,
  objective: "sair-casa",
  activeWalkMs: 0,
  walkDistance: 0,
});

export function markTalk(run: RunSnapshot, npcId: string): RunSnapshot {
  if (run.talked.includes(npcId)) return run;
  return { ...run, talked: [...run.talked, npcId] };
}

export function enterRoom(run: RunSnapshot, roomId: RoomId): RunSnapshot {
  return {
    ...run,
    roomId,
    objective: nextObjective(roomId, run.prologueEnded),
  };
}

export function endPrologue(run: RunSnapshot): RunSnapshot {
  return {
    ...run,
    prologueEnded: true,
    objective: "chegar-escola",
  };
}

export function elapsedSeconds(run: RunSnapshot, now = Date.now()): number {
  return Math.max(0, Math.floor((now - run.startedAt) / 1000));
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
