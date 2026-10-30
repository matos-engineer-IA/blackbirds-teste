# Como expandir o padrão do quarteirão

Não replique o Bairro Operário com o tileset de 18×18. Cada nova região deve nascer como pintura própria.

## Passos

1. Pintar a rua em 16:9, nível da rua, sem personagens e sem HUD.
2. Pintar horizonte e um meio-termo de telhados em camadas separadas.
3. Pintar ou recortar NPCs isolados, de corpo inteiro.
4. Guardar as fontes em `art/source` com nomes estáveis.
5. Acrescentar recortes e exportações em `scripts/process-painted-art.py`.
6. Criar um bloco em `src/game/levels/paintedBlock.ts` com `width`, `groundY`, portas, lâmpadas e saídas.
7. Ligar o bloco em `rooms.ts` via `painted`.
8. Validar no navegador com screenshot estática: a cena precisa funcionar sem partículas.

## Escala

Portas da pintura devem ter altura próxima do Nero (cerca de 100–130 px no canvas 360). Se o personagem ficar gigante, recorte menos céu e menos rua vazia, não encolha o sprite até ele virar silhueta.

## Licenças

Só entre arte original do projeto ou arquivos com licença verificada em `docs/ASSET_LICENSES.md`.
