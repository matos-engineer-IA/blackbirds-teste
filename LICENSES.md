# Licenças

Este repositório mistura código original e referências open source. Nada aqui reutiliza arte comercial de Hollow Knight, Dead Cells, Blasphemous ou títulos semelhantes.

## Código do jogo

- **NEON FALL: PROTOCOL ZERO** — MIT. Ver `LICENSE`.

## Engine e ferramentas

| Item | Licença | Origem |
| --- | --- | --- |
| Phaser 4.2.1 | MIT | https://github.com/phaserjs/phaser |
| Vite 6 | MIT | https://github.com/vitejs/vite |
| TypeScript 5.7 | Apache-2.0 | https://github.com/microsoft/TypeScript |
| Vitest | MIT | https://github.com/vitest-dev/vitest |
| Template oficial Phaser Vite + TS | MIT | https://github.com/phaserjs/template-vite-ts |
| remarkablegames/phaser-platformer | MIT | usado só como referência de arquitetura |
| JSLegend JavaScript-Metroidvania | MIT | usado só como referência de mecânicas (Kaboom.js) |

O template oficial inclui um `log.js` de telemetria. Este projeto **não** copia esse arquivo.

## Arte

Os sprites versionados em `public/assets` foram gerados para este jogo (`npm run assets`) no tamanho clássico de 18×18 do Kenney Pixel Platformer.

| Referência visual | Licença | Uso neste piloto |
| --- | --- | --- |
| [Kenney Pixel Platformer](https://kenney.nl/assets/pixel-platformer) | CC0 1.0 | tamanho de tile, silhueta de plataforma, props industriais |
| [Kenney Pixel Platformer Industrial Expansion](https://kenney.nl/assets/pixel-platformer-industrial-expansion) | CC0 1.0 | caixas, barris, corredores metálicos |
| Arte original do piloto (tileset, player, inimigos, fundos, HUD) | CC0 1.0 | arquivos em `public/assets` |

Kenney não exige atribuição, mas o crédito é devido: **Kenney.nl**.

Nenhum asset com licença não verificada de itch.io foi copiado.

## Áudio

Efeitos sonoros são sintetizados em tempo de execução via Web Audio API. Não há samples de terceiros nem APIs pagas.

## Tipografia

A interface usa fontes monoespaçadas do sistema (`ui-monospace`, Consolas, Courier New). Nenhum webfont externo é baixado em runtime.
