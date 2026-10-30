export type RoomId = "operario" | "mercado" | "avenida" | "escola";

export type ObjectiveId = "sair-casa" | "atravessar-mercado" | "cruzar-avenida" | "chegar-escola";

export const OBJECTIVE_TEXT: Record<ObjectiveId, string> = {
  "sair-casa": "Busque Lina na escola. Saia do bairro.",
  "atravessar-mercado": "Atravesse o mercado industrial.",
  "cruzar-avenida": "Siga pela avenida até o caminho da escola.",
  "chegar-escola": "Lina deve estar saindo agora.",
};

export function nextObjective(roomId: RoomId, prologueEnded: boolean): ObjectiveId {
  if (prologueEnded) return "chegar-escola";
  if (roomId === "escola") return "chegar-escola";
  if (roomId === "avenida") return "cruzar-avenida";
  if (roomId === "mercado") return "atravessar-mercado";
  return "sair-casa";
}

export function roomArea(roomId: RoomId): "operario" | "mercado" | "avenida" | "escola" {
  return roomId;
}
