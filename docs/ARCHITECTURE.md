# Arquitetura

Preservado do piloto anterior: Phaser 4, Vite, Arcade Physics, movimento com coyote/buffer, Docker/Nginx, testes Vitest.

## Módulos

- `mechanics/` movimento, dano, armas, mobilidade futura
- `systems/` diálogo, clima, cutscene, progresso
- `content/dialogues.ts` falas em PT-BR
- `levels/` mapas da cidade e `RoomWorld`
- `entities/` Nero, NPCs, projétil, dummy
- `scenes/` Boot, Menu, Game (prólogo), UI, Arena

Combate vive na `ArenaScene`. O prólogo trava `player.combatEnabled`.
