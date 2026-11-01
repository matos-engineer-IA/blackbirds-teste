# Licenças de assets

## Original do projeto

- Pinturas-fonte em `art/source` (Nero, NPCs, ruas, parallax, painel de diálogo)
- PNG de jogo em `public/assets/painted`, `public/assets/characters`, `public/assets/backgrounds`
- Tileset auxiliar, Lina, coche e corvo de `scripts/generate-assets.mjs`
- Lâmpada, brilho e vapor de `scripts/process-painted-art.py`
- Áudio sintético via Web Audio API

## Calçamento em revisão — 1 de novembro de 2026

- Fonte: `art/source/cobble-review-v2-source.png`, criada nesta sessão pelo tool
  integrado **imagegen**, sem imagens de jogos comerciais como referência.
- Prompt exato: `art/source/cobble-review-v2-prompt.txt`.
- Derivado: `public/assets/tilesets/cobble-review-v2.png`, 768×42, produzido por
  `scripts/prepare-ground.mjs` (recorte, amostragem nearest-neighbor e espelhamento
  para fechar a emenda horizontal). O PNG antigo continua preservado.
- Status: **REVIEW**. Integrado e visualizado; nenhuma aprovação artística humana presumida.
- Registro técnico de todos os PNGs: `art/asset-audit.json`, com dimensões,
  hashes, fontes declaradas, limites de frames e pendências. O manifest não
  certifica a autoria histórica dos materiais recebidos nem os promove a finais.

## Ferramentas de verificação adicionadas

Playwright (Apache-2.0) e pngjs (MIT), somente em desenvolvimento.

Licença: a mesma do repositório (uso do jogo). Autoria: produção interna de Black Bird: Revolução.

## Terceiros

- Phaser 4, Vite, TypeScript, Vitest: licenças dos pacotes
- Pillow (somente pipeline de arte, não vai para o build web)

## Não utilizados

- Nenhum sprite de Blasphemous, Blasphemous 2, Dishonored, The Last Night, Dead Cells ou Kenney
- Nenhuma fonte comercial de pixel art foi baixada
- Nenhum serviço externo é chamado em runtime
