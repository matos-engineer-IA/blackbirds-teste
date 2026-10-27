import { PLAYER } from "../utils/constants";
import {
  type Checkpoint,
  type ObjectiveId,
  type RoomId,
  nextObjective,
  resolveCheckpoint,
} from "./progress";

export type RunSnapshot = {
  hp: number;
  hasDash: boolean;
  extracted: boolean;
  roomId: RoomId;
  checkpoint: Checkpoint;
  startedAt: number;
  objective: ObjectiveId;
};

const initialCheckpoint = (): Checkpoint => ({
  roomId: "distrito-a",
  x: 54,
  y: 216,
});

export const createRun = (now = Date.now()): RunSnapshot => ({
  hp: PLAYER.maxHp,
  hasDash: false,
  extracted: false,
  roomId: "distrito-a",
  checkpoint: initialCheckpoint(),
  startedAt: now,
  objective: "infiltrar",
});

export function touchCheckpoint(run: RunSnapshot, checkpoint: Checkpoint): RunSnapshot {
  const next = resolveCheckpoint(run.checkpoint, checkpoint);
  return {
    ...run,
    hp: PLAYER.maxHp,
    checkpoint: next,
    objective: nextObjective(run.hasDash, run.roomId, run.extracted),
  };
}

export function unlockDash(run: RunSnapshot): RunSnapshot {
  return {
    ...run,
    hasDash: true,
    objective: nextObjective(true, run.roomId, run.extracted),
  };
}

export function extractCore(run: RunSnapshot): RunSnapshot {
  return {
    ...run,
    extracted: true,
    objective: "extrair-nucleo",
  };
}

export function enterRoom(run: RunSnapshot, roomId: RoomId): RunSnapshot {
  return {
    ...run,
    roomId,
    objective: nextObjective(run.hasDash, roomId, run.extracted),
  };
}

export function respawn(run: RunSnapshot): RunSnapshot {
  return {
    ...run,
    hp: PLAYER.maxHp,
    roomId: run.checkpoint.roomId,
    extracted: false,
    objective: nextObjective(run.hasDash, run.checkpoint.roomId, false),
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
