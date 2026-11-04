import type { RoomId } from "../systems/progress";
import { GROUND } from "../utils/scale";
import { OPERARIO_BLOCK } from "./paintedBlock";
import { ROOMS } from "./rooms";
import { TILE } from "./tiles";

export type CitySegment = {
  id: RoomId;
  x: number;
  width: number;
  title: string;
  panels: string[];
};
const panels: Record<RoomId, string[]> = {
  operario: ["worker-street-0", "worker-street-1", "worker-street-2"],
  mercado: ["market-a-0", "market-a-1", "market-a-2", "market-b-0", "market-b-1"],
  avenida: ["avenue-a-0", "avenue-a-1", "avenue-a-2", "avenue-b-1", "avenue-b-2"],
  escola: ["school-a-0", "school-a-1", "school-b-0", "school-b-2", "school-b-1"],
};

export const CITY_SEGMENTS: CitySegment[] = (() => {
  const order: RoomId[] = ["operario", "mercado", "avenida", "escola"];
  let x = 0;
  return order.map((id) => {
    const width = panels[id].length * 1536;
    const segment = { id, x, width, title: ROOMS[id].title, panels: panels[id] };
    x += width;
    return segment;
  });
})();

export const CITY_WIDTH = CITY_SEGMENTS[CITY_SEGMENTS.length - 1].x + CITY_SEGMENTS[CITY_SEGMENTS.length - 1].width;
export const CITY_HEIGHT = GROUND.worldHeight;
export const CITY_GROUND_Y = GROUND.y;
export const CITY_SPAWN_X = OPERARIO_BLOCK.spawnX;

export function segmentAt(x: number): CitySegment {
  return CITY_SEGMENTS.find((_, index) => {
    const next = CITY_SEGMENTS[index + 1];
    return !next || x < next.x;
  }) ?? CITY_SEGMENTS[0];
}

export function cityNpcX(id: RoomId, npc: { x?: number; col: number }): number {
  const segment = CITY_SEGMENTS.find((item) => item.id === id)!;
  if (id === "operario" && npc.x !== undefined) return segment.x + (npc.x === 360 ? 360 : npc.x * 2.4);
  return segment.x + npc.col / ROOMS[id].map[0].length * segment.width;
}

export function tileOffsetY(): number {
  return CITY_GROUND_Y - 12 * TILE;
}
