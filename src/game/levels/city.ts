import type { RoomId } from "../systems/progress";
import { GROUND } from "../utils/scale";
import { OPERARIO_BLOCK } from "./paintedBlock";
import { ROOMS, roomSize } from "./rooms";
import { TILE } from "./tiles";

export type CitySegment = {
  id: RoomId;
  x: number;
  width: number;
  title: string;
};

const tiledWidth = (id: RoomId): number => roomSize(ROOMS[id]).width;

export const CITY_SEGMENTS: CitySegment[] = (() => {
  const order: RoomId[] = ["operario", "mercado", "avenida", "escola"];
  let x = 0;
  return order.map((id) => {
    const width = id === "operario" ? OPERARIO_BLOCK.width : tiledWidth(id);
    const segment = { id, x, width, title: ROOMS[id].title };
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
  if (id === "operario" && npc.x !== undefined) return segment.x + npc.x;
  return segment.x + npc.col * TILE + TILE / 2;
}

export function tileOffsetY(): number {
  return CITY_GROUND_Y - 12 * TILE;
}
