export type DialogueLine = {
  speaker: string;
  text: string;
};

export const DIALOGUES: Record<string, DialogueLine[]> = {
  vizinha: [
    { speaker: "Dona Ilda", text: "Nero. Hoje você sai cedo. A menina vai gostar." },
    { speaker: "Nero", text: "Prometi buscar ela na porta." },
    { speaker: "Dona Ilda", text: "Tomara que o vapor da fábrica não cubra a rua de novo." },
  ],
  operario: [
    { speaker: "Alonso", text: "Doze horas no forno e o contracheque vem curto." },
    { speaker: "Alonso", text: "Dizem que a Câmara vai 'rever as taxas'. Sempre dizem." },
    { speaker: "Nero", text: "Guarda essa raiva pra quando a sirene parar." },
  ],
  crianca: [
    { speaker: "Téo", text: "Seu chapéu de corvo é de verdade?" },
    { speaker: "Nero", text: "É só ferro velho. Não é pra brincar." },
    { speaker: "Téo", text: "A Lina falou que você não briga mais." },
  ],
  mecanico: [
    { speaker: "Rui", text: "Esse braço ainda chia no frio. Quer que eu calibrei a válvula?" },
    { speaker: "Nero", text: "Depois. Hoje é dia de escola, não de oficina." },
    { speaker: "Rui", text: "Você mudou. O bairro inteiro percebeu." },
  ],
  comerciante: [
    { speaker: "Marta", text: "Mais uma taxa. Agora até o pão quente paga 'ordem pública'." },
    { speaker: "Marta", text: "Se eu reclamar alto, o fiscal fecha a banca. Simples assim." },
  ],
  "guarda-abuso": [
    { speaker: "Guarda", text: "Licença vencida. A banca fecha ou a multa dobra." },
    { speaker: "Marta", text: "Venceu ontem. O cartório estava em greve." },
    { speaker: "Guarda", text: "Problema seu. A República não para por causa de papel." },
    { speaker: "Nero", text: "Ela abre todo santo dia. Você sabe." },
    { speaker: "Guarda", text: "...O mercenário aposentado agora dá palpite. Anda." },
  ],
  vendedor: [
    { speaker: "Otávio", text: "Jornal da tarde: 'Crescimento recorde'. Olha a fila do pão e me diz." },
    { speaker: "Otávio", text: "Desapareceu o filho da costureira. Ninguém imprime isso." },
  ],
  elite: [
    { speaker: "Senhor Valério", text: "Afaste-se da calçada. O coche precisa passar." },
    { speaker: "Nero", text: "A rua é de todo mundo." },
    { speaker: "Senhor Valério", text: "Em teoria." },
  ],
  "guarda-avenida": [
    { speaker: "Guarda", text: "Sem ajuntamento. Sem panfleto. Sem conversa longa." },
    { speaker: "Guarda", text: "Os pássaros pretos que pintam muro... a gente pega." },
  ],
  mae: [
    { speaker: "Helena", text: "A minha vai sair pelo portão da frente. A sua também?" },
    { speaker: "Nero", text: "Lina espera embaixo do relógio." },
    { speaker: "Helena", text: "Esses coches novos não respeitam cruzamento. Vai com calma." },
  ],
  porteiro: [
    { speaker: "Porteiro", text: "A turma da Lina já está se arrumando. Mais um minuto." },
    { speaker: "Nero", text: "Eu espero." },
  ],
  "porta-casa": [
    { speaker: "Nero", text: "A casa fica. O jantar também. Primeiro a escola." },
  ],
  "porta-loja": [
    { speaker: "Nero", text: "Fechado por 'inspeção sanitária'. De novo." },
  ],
  alavanca: [
    { speaker: "Nero", text: "A válvula solta vapor demais. Melhor não mexer com a rua cheia." },
  ],
};

export function dialogueOf(id: string): DialogueLine[] {
  return DIALOGUES[id] ?? [{ speaker: "Nero", text: "..." }];
}
