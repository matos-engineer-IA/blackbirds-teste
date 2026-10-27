# GAME-00 — Escolha da base

## Candidatos

1. **JSLegend JavaScript-Metroidvania** — MIT, Kaboom.js. Boa referência de salas, câmera e progressão, mas a engine não é Phaser.
2. **remarkablegames/phaser-platformer** — MIT, Phaser 4.2.1 + Vite, porém depende de `phaser-jsx` e tooling extra que não ajuda o piloto.
3. **phaserjs/template-vite-ts** — MIT, Phaser 4 + Vite 6 + TypeScript. É a base oficial de build web, mas traz `log.js` de telemetria e um jogo de exemplo que não queremos.

## Decisão

Criar um projeto próprio, **inspirado no template oficial Phaser Vite TS**, com:

- Phaser **4.2.1** (sem misturar APIs de Phaser 3)
- Vite 6 e TypeScript 5.7
- `base: ./` e `VITE_BASE_PATH` opcional
- Arcade Physics
- mapas ASCII em vez de Tiled, para o build permanecer simples
- mecânicas de metroidvania estudadas no projeto Kaboom, reescritas em Phaser

Essa combinação é a mais previsível para o Huddle Engineering: `npm ci`, `npm run build`, `dist/`, Dockerfile, Nginx, health check, zero backend.
