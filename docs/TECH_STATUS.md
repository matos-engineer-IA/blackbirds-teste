# Status técnico — física, câmera, Nero e Winsth

## Causas dos bugs

- **Flutuação:** NPCs somavam `sin(time)` em `y` a cada frame. O body do Nero não terminava nos pés. O chão pintado e o collider não compartilhavam a mesma linha.
- **Câmera estática / quadros:** o prólogo teletransportava entre salas (`loadRoom`). Isso parecia uma sequência de telas, não um metroidvania.
- **Sem retorno:** o bairro pintado só tinha saída à direita; ao voltar, o spawn usava o início da sala, não a borda leste.
- **NPC andava no diálogo:** só Nero parava. `Npc.preUpdate` ignorava conversa.

## Correções

- Cidade contínua (`CITY_SEGMENTS`), ~7884 px, câmera com follow + deadzone + lookahead.
- Um chão físico em `GROUND.y = 350` e calçamento irregular (`cobble.png`).
- Pivot nos pés (`anchorFeet`). Sombra de contato. F1 desenha body, origem e superfície.
- Estados `EXPLORING | DIALOGUE | CUTSCENE | PAUSED`. O interlocutor para e olha Nero.

## Nero

Spritesheet anexado fatiado em `public/assets/characters/nero-sheet.png`.

Corpo = 144 px. Cartola fora da medida.

| Animação | Quadros | Situação |
| --- | --- | --- |
| Idle | 2 | Integrado |
| Caminhada | 3 | Integrado |
| Salto / queda | 2 | Integrado |
| Melee | 2 | Integrado (3º golpe reutiliza o 2º) |
| Revólver | 2 | Integrado |
| Aterrissagem, virada, recarga, interação | — | Pendente de novos sprites |

## Winsth

Não veio spritesheet utilizável, só o guia de escala. Há um stand-in em `winsth.png` (corpo 184 px, massa maior). Arena DEV: menu **ARENA WINSTH (DEV)** no `npm run dev`.

IA: IDLE → PATROL → AGGRO → APPROACH → TELEGRAPH → ATTACK → RECOVERY / STAGGER / DEFEATED.

Ataques: horizontal, slam, investida, onda. Sem aviso visual final de artista.

## Como testar

- Prólogo: `npm run dev`, Novo jogo. Andar à direita e voltar à esquerda sem fade.
- Diálogo: E perto de Ilda. Ela deve parar. E avança falas.
- Debug: F1 ou `?debug=1`.
- Winsth: menu DEV. J/Z soco, K/X revólver.
