export type RoomId =
  | "distrito-a"
  | "distrito-b"
  | "ferrugem-a"
  | "ferrugem-b"
  | "nexus-a"
  | "nexus-b";

export type ObjectiveId =
  | "infiltrar"
  | "avancar-fabrica"
  | "obter-dash"
  | "atravessar-barreira"
  | "alcancar-nucleo"
  | "extrair-nucleo";

export type Checkpoint = {
  roomId: RoomId;
  x: number;
  y: number;
};

export const OBJECTIVE_TEXT: Record<ObjectiveId, string> = {
  infiltrar: "Infiltre-se no Distrito Zero.",
  "avancar-fabrica": "Avance até o Setor Ferrugem.",
  "obter-dash": "Recupere o protocolo Neon Dash.",
  "atravessar-barreira": "Retorne e atravesse a barreira.",
  "alcancar-nucleo": "Alcance o núcleo NEXUS.",
  "extrair-nucleo": "Extraia o núcleo de dados.",
};

export function nextObjective(hasDash: boolean, roomId: RoomId, extracted: boolean): ObjectiveId {
  if (extracted) return "extrair-nucleo";
  if (hasDash && roomId === "nexus-b") return "extrair-nucleo";
  if (hasDash && roomId === "nexus-a") return "alcancar-nucleo";
  if (hasDash) return "atravessar-barreira";
  if (roomId.startsWith("ferrugem")) return "obter-dash";
  if (roomId === "distrito-b") return "avancar-fabrica";
  return "infiltrar";
}

export function resolveCheckpoint(current: Checkpoint | null, candidate: Checkpoint): Checkpoint {
  if (!current) return candidate;
  if (current.roomId === candidate.roomId && current.x === candidate.x && current.y === candidate.y) {
    return current;
  }
  return candidate;
}

export function shouldWin(roomId: RoomId, extracted: boolean): boolean {
  return roomId === "nexus-b" && extracted;
}

export function roomArea(roomId: RoomId): "distrito" | "ferrugem" | "nexus" {
  if (roomId.startsWith("ferrugem")) return "ferrugem";
  if (roomId.startsWith("nexus")) return "nexus";
  return "distrito";
}
