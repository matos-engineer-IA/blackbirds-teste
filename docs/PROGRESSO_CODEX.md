# Progresso recuperável — Black Bird: Revolução

## Estado operacional — 04/11/2026 03:06 UTC

- Repositório `/home/matheus/blackbirds-teste`, branch `black-bird-revolucao`. Base recuperada `8661b94`; código funcional agora `401f4c3` (após `1bf06d2`). Conta/autor Git: `matos-engineer-IA`. Evidências e scripts legíveis acompanham este checkpoint; nenhum trabalho alheio removido.
- **VERIFICADO LOCALMENTE**: build `bb-5233fb49e865`, JS `index-DchZ1ExS.js`, imagem `black-bird-revolucao:401f4c3`. Container `black-bird-codex-stable-20261104`, healthy, restart `unless-stopped`, limites 128 MiB/0,5 CPU, apenas **127.0.0.1:4186 → 8080**. Independe do terminal. `build-info.json` identifica o código. Não é URL HML.
- Rollback local preservado: `black-bird-codex-final-20261101` continua healthy em 127.0.0.1:4185, imagem `black-bird-revolucao:codex-local-20261101`. Não parar esse container `--rm`. Candidatos desta rodada foram parados, sem removê-los. Servidor dev antigo do jogo em 4183 não participa da entrega. Nenhum serviço Huddle/externo reiniciado.
- Implementado: Continue/checkpoint robusto, configurações/remapeamento/volumes, captions, pausa/foco de todas as cenas, skip; recarga com reserva atômica, esquiva, tiro com preparação e sweep inicial/por passo, sons ligados à fase ativa. O prólogo continua sem combate obrigatório; Winsth é treino separado.
- Arte: 18 painéis únicos nas quatro regiões, Nero 14 poses/6 fases de caminhada, NPCs articulados, Winsth/filha/coche novos. Pivôs por pés separados do collider/hurtbox. Fontes/prompts preservados em `art/source/production-v2/`; 31 PNGs regenerados byte a byte. Tudo **REVIEW**, não catálogo final/aprovação artística.
- Correções durante a execução: TypeScript interrompido; modais que fechavam com Enter/perdiam o primeiro input; margens abaixo dos pés; overflow de quantização que produzia verde; cadência após preparação do tiro; alvo próximo atrás da boca do cano; slow motion inicial em 30 Hz (`fps.smoothStep=false`, Arcade fixedStep 60). Não trocar engine nem usar o limiter interno para simular monitor.
- Verificações: instalação limpa, **36 testes/14 arquivos**, build local/Docker, audit sem vulnerabilidades. Chromium real/software, 1280×720 e 900×700. Movimento/salto com deltas médios 33,33/16,83 ms; chão Y=318. Abertura inteira **sem fixture de posição**, 192,02 s ativos até a escola, oito fases, preto antes do cue (~102 ms), término e Jogar novamente. Ida até a extremidade 196,53 s ativos; ida/volta 393,28 s na imagem estável. Pausa, dez diálogos/remoção de NPC, três reinícios, recarga/cancelamento/esquiva, quatro ataques/ondas de Winsth e dez resets passaram. Save corrompido, storage bloqueado e asset indisponível com retry passaram nos testes de resiliência.
- Evidência principal: `docs/evidence/20261104/README.md` e relatórios ali vinculados. Os 69 arquivos da candidata e da imagem com commit foram comparados: só metadados de build diferem; JS servido corresponde à imagem. Vídeos reais silenciosos/compactados com hashes; originais e falhas intermediárias preservados em `/home/matheus/blackbird-evidence-20261104-raw/`. Não são imagens ilustrativas geradas.
- **HML BLOQUEADO EXTERNO**: inspeção read-only encontrou dois cadastros, nenhum ambiente/URL do jogo, imports `failed_intervention` (`connection_expired`) e `plan_blocked`, sem aprovação independente; provider e preview gateway desabilitados. Portal HTTPS não é URL do jogo. `hml-readiness.json` registra a fronteira. Não criar túnel, mudar produção/IAM/Morpheus/DNS ou fabricar aprovação.
- Pendências reais: publicação HML depende do fluxo autorizado/recuperação da conexão, ambiente/gateway habilitados por responsáveis e aprovação independente exigida. Arte/catálogos §§16–17, mix/escuta e playtest humano continuam parciais; 144 Hz nativo, hardware de referência, gamepad/acessibilidade completa e perda de contexto WebGL não foram validados. Não declarar todos os critérios concluídos.
- Próxima ação: preservar os serviços estáveis. Quando o fluxo HML estiver disponível e aprovado, usar o SHA autorizado, construir pelo Dockerfile existente, validar a URL real com os mesmos scripts e registrar identidade/rollback. Não realizar infraestrutura externa por iniciativa local.
- Comandos executados: `npm ci`, `npm test`, `npm run build`, `npm run art:production`, `npm run assets:audit`, `npm audit`; scripts `browser-regression.mjs`, `browser-opening.mjs`, `browser-combat.mjs`, `browser-ux.mjs`, `browser-resilience.mjs`, `browser-runtime.mjs` com `GAME_URL=http://127.0.0.1:4186/ CHROMIUM_PATH=/snap/bin/chromium`. Node desta VM: `/home/matheus/.local/share/cursor-agent/versions/2026.09.28-64d2043/node`; npm de suporte `/tmp/blackbird-npm1162/package/bin/npm-cli.js`. Não dependem de instalação global.
- Referências do mestre: §§07–08 percurso/retorno; §§14–23 assets/animação/física/combate; §§25–30 diálogos/cutscene/áudio/UI/save; §§33–38 performance/build/HML/testes; §§44–45 continuidade e pronto.

O registro abaixo é histórico do checkpoint anterior, não o estado de conclusão da retomada.

Checkpoint de 01/11/2026. Documento-mestre: `BLACK_BIRD_DOCUMENTO_MESTRE_CODEX.md`.
Leitura inicial feita conforme §00; disciplinas de movimento/câmera/diálogo/arte/combate/cutscene consultadas antes das mudanças.

## Base e resultado

Base recebida por `git pull --ff-only`: **faeb5d5**, branch `black-bird-revolucao`, sem alterações locais do usuário.
Projeto preservado: Phaser **4.2.1**, Arcade, TypeScript **5.7.3**, Vite **6.3.5**.
Nenhuma engine, repositório, capítulo narrativo ou infraestrutura externa substituídos.

Esta é uma rodada de implementação da fundação e da arena, não a conclusão de toda a especificação.
A classificação atual por sistema está em `IMPLEMENTATION_STATUS.md`.

## Alterações efetivas

- Piso em Y=318, 42 unidades visíveis; Nero/Winsth exibidos a 0,5. Collider em unidades de mundo, independente do PNG. Acessórios não definem collider. Winsth usa o limite dos pés medido em Y=235 da fonte.
- Corte de salto aplicado na liberação, em vez de multiplicar a subida a cada tick; contato ascendente não rearma coyote. Playback walk usa somente 2–4, sem a pose de salto 5.
- Câmera com um dono por cena, antecipação amortecida e resposta temporal. Removida disputa de scroll na arena. Retorno contínuo pelas quatro regiões, sem colisão do coche decorativo no caminho pedestre.
- Pausa suspende a cena real: física, animações, timers e cutscene. Retorno preserva diálogo/cutscene; foco limpa input. Pulsos curtos de pulo/interação/pausa são registrados por evento.
- Diálogo começa somente no chão, trava Nero e o interlocutor, interrompe a animação de patrulha e limpa falas/bloqueio se o NPC desaparece. Reinício recria sessão e UI sem acumular listeners.
- Corrigido erro de canvas após reiniciar: o menu não repinta Text destruído pela seleção.
- Calçamento novo **REVIEW**, fonte/prompt preservados e preparo reproduzível. Removidos bob artificial dos NPCs e a linha visual de limite da antiga sala no teto das regiões. Mercado/avenida/escola continuam com arte legada parcial.
- Melee possui preparação/ativo/recuperação e ledger por instância/alvo; direção esquerda espelhada corretamente. Dano/derrota cancelam ação. Recarga atômica concede munição no fim; cancelar antes não concede balas.
- Winsth: quatro padrões alcançáveis, direção comprometida, recuperação sem deslizar, onda separada com velocidade/vida; seleção técnica 1–4/0, reset F5, limpeza após derrota.
- Corrigido corpo imóvel de Winsth contra chão estático: corpo agora pode ser separado do piso, sem ser empurrável. Configuração de projétil/onda ocorre **depois** da inserção no grupo Arcade, que antes zerava velocidade e reativava gravidade.
- Cutscene usa deslocamento por segundo, atores ancorados, veículo entra apenas em sua fase; preto cobre o viewport/UI e o cue é agendado 100 ms depois. Pausa congela a sequência. Não há capítulo/boss após o encerramento.
- Pipeline não sobrescreve fontes existentes com cache externo; Nero pode ser regenerado da fonte versionada. Pipeline Python completo não foi executado (Pillow ausente); os PNGs já versionados bastam para build.

## Evidências e testes

- `evidence/baseline/`: antes das correções. Pausa confirmada com mode=PAUSED, mas física ativa: X=279,27 → 419,27 em 1 s.
- `evidence/container/`: rodada final do jogo servido por **Nginx no container**, capturas, vídeo e `report.json`. Consultar o resultado final ali; não inferir sucesso apenas do HTTP 200.
- `evidence/combat-final/`: testes de integração da arena no dev server. Incluem fixture explícita para posições/ataques; não comprovam travessia normal. Relatório final sem erros de página na rodada concluída.
- `npm test`: **27 testes / 12 arquivos passaram**. `npm run build`: passou; chunk Phaser ~1,68 MB gera aviso do Vite. `npm run assets:audit`: **29 PNGs** inspecionados, não aprovados artisticamente.
- Navegador: Chromium **156.0.8078.47**, viewport 1280×720, renderização headless por software. Vídeos sem áudio.
- Casos exercitados: parado 30 s; salto curto/longo (~26/~53 unidades nesta rodada); pausa em movimento; NPC/Nero param; E mantido não atravessa falas; pausa sobre diálogo; 10 conversas e remoção de interlocutor; ida/volta por quatro regiões; resize 900×700; blur DOM sintético e recuperação; 3 reinícios; cutscene pausada, preto e encerramento sem boss.
- Arena: dano único, miss, esquerda/direita, tecla mantida, tiro alcançando alvo, tambor vazio, recarga/cancelamento; chão do boss; quatro preparações/execuções/recuperações; direção fixa; onda acerta parado e pode ser saltada; derrota limpa ameaça; 10 resets com 12 objetos retornando ao baseline.
- A ida pela cidade medida na rodada anterior foi **55,26 s de deslocamento ativo** até a extremidade da escola; a ida+volta ~111,46 s. **NAR-01 falha o requisito de 180 s**. O relatório final registra a nova medição. Não somar diálogos/pausa/ida+volta para aprovar esse requisito.
- IDs agrupados nos scripts indicam aspectos exercitados, não aprovação integral de todos os critérios daqueles casos. A matriz completa de 92 testes não foi executada.

A inspeção visual encontrou o boss afundando mesmo após testes iniciais com fixtures passarem. Os testes foram reforçados com apoio no piso e comprovação de que a onda realmente atinge Nero antes de testar evasão. Rodadas intermediárias não são a evidência de aceite.

## Build e publicação

Docker build executado com Node 22 Alpine/Nginx. Imagem local:
`black-bird-revolucao:codex-local-20261101`.
Container desta sessão: `black-bird-codex-final-20261101`, somente **127.0.0.1:4185 → 8080**.
Bundle servido: `assets/index-DMbcotKe.js`.
Identidade e health final em `evidence/container/service.json`.
HML, HTTPS externo, atualização pelo Huddle e rollback **não executados**. Nenhum push/merge/deploy externo nesta rodada.

A amostra de frame intervals (5 s após 2 s de aquecimento) registrou p50/p95 ~16,7 ms e p99 ~16,8 ms em headless; não é garantia de desktop. O JS do container corresponde byte a byte ao build local.

## Arte e cânone

- Fonte nova: `art/source/cobble-review-v2-source.png`; prompt exato em `art/source/cobble-review-v2-prompt.txt`. Ferramenta integrada imagegen. Derivado `public/assets/tilesets/cobble-review-v2.png`, 768×42, original antigo preservado.
- `art/asset-audit.json`: dimensões, hashes, alpha/bounds, fontes e maturidade. Nero/NPCs/cenário REVIEW; Winsth e filha BLOCKOUT. A auditoria técnica não certifica anatomia, licença histórica ou aprovação do proprietário.
- Preservados: um braço mecânico em Nero, dois em Winsth, escala de referência 144/184, boss separado e narrativa somente na abertura. Lado anatômico da prótese e nome final da filha continuam pendentes; `Lina` é alias legado, não nova decisão canônica.

## Pendências e próxima prioridade

1. **G2 / BRF-01, 02, 04–07:** revisar Nero idle/walk/soco a tamanho de jogo, corrigir recortes laterais e assimetria; produzir ciclos articulados de NPCs e sprites de Winsth. A fonte existente corta armas e não contém os catálogos finais. Não expandir repetindo uma faixa para fingir 180 s.
2. Construir quarteirão de referência de 30–45 s com fachadas, materiais, marcos e interações reais; atual rua pintada é menor. Depois expandir regiões e medir 180 s significativos (§§07, 41).
3. Refinar hitstop, buffer/combos, esquiva, tiro contra paredes/sweep, recarga com reserva e clips/eventos. A unidade de HP do jogo foi preservada, não convertida cegamente para os números propostos.
4. Save robusto/Continuar, remapeamento, volume/configurações persistentes, captions e skip; foco/pausa das arenas ainda pedem trabalho próprio. Escuta/mix e aprovação artística humana não executados.
5. Testar PHY-03/04/06–09, física em 30/60/144 Hz, contexto WebGL, áudio real e demais casos não listados; unidade de suavização em taxas diferentes não equivale a testar física nessas taxas.
6. HML somente pelo fluxo autorizado; não alterar Huddle/IAM/Morpheus/produção para este jogo.

## Comandos de retomada

```bash
npm ci
npm test
npm run build
npm run assets:audit
npm run art:ground
npm run dev -- --port 4183 --strictPort
# Em outro terminal, com Chromium instalado:
npx playwright install chromium ffmpeg
GAME_URL=http://127.0.0.1:4183/ npm run test:browser
GAME_URL=http://127.0.0.1:4183/ npm run test:combat:browser
# Artefato estático/servidor local:
GAME_URL=http://127.0.0.1:4185/ npm run test:browser
```

`CHROMIUM_PATH=/snap/bin/chromium` foi usado aqui. Node 24.5.0 desta máquina está
fora do PATH, em `/home/matheus/.local/share/cursor-agent/versions/2026.09.28-64d2043/node`;
bootstrap temporário de npm 10.9.2 em `/tmp/blackbird-tools/package/bin/npm-cli.js`.
No ambiente normal, usar Node/npm do projeto. Build Docker também confirmou Node 22.

Referências primárias consultadas: código instalado do Phaser 4.2.1
(`physics/arcade/SeparateY.js`, `PhysicsGroup.js`, `Body.js`, componentes Pushable e Camera);
[API Body](https://docs.phaser.io/api-documentation/class/physics-arcade-body),
[API Camera](https://docs.phaser.io/api-documentation/class/cameras-scene2d-camera) e
[vídeos Playwright](https://playwright.dev/docs/videos).
A página web Phaser anuncia 4.1.0; as assinaturas usadas foram conferidas no pacote
4.2.1 instalado. Nenhum código de outro jogo foi incorporado. Licenças das ferramentas preservadas.
