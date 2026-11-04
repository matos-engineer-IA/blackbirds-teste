# Progresso recuperável — Black Bird: Revolução

## Retomada operacional — 04/11/2026

- Base: `8661b94`, branch `black-bird-revolucao`, ahead 1 do origin. Nada staged; alterações herdadas preservadas: package/lock e módulos `settings.ts`, `saveGame.ts`, `actionInput.ts`, `tests/persistence.test.ts`.
- P0 encontrado: import de tipo não usado em `saveGame.ts` quebrava TypeScript. Corrigido; build passou. Os 32 testes atuais passaram. Save, Continue validado, remapeamento, configurações, captions, áudio regional, pausa e lifecycle das arenas foram conectados às cenas. Revalidar build após integração artística.
- Última versão estável continua no container `black-bird-codex-final-20261101`, loopback `127.0.0.1:4185`, healthy. Isso não é URL HML.
- VM compartilhada com Huddle e outros serviços; nenhum serviço externo reiniciado/alterado. Dev server do jogo existente em 4183.
- HML **BLOQUEADO EXTERNO**: inspeção read-only no Huddle confirmou dois cadastros do repositório, nenhum ambiente/URL de jogo. Imports `failed_intervention` (`connection_expired`) e `plan_blocked`; sem aprovação independente. Provider e preview gateway desabilitados. Portal HTTPS responde, mas não é URL do jogo. Não alterar Huddle, credenciais ou infraestrutura para contornar.
- Recuperadas as três imagens geradas antes da interrupção, copiadas para `art/source/production-v2/`, com prompts originais. Não haviam sido integradas. Próximo passo: empacotar/medir pivôs, inspecionar gameplay e substituir stand-in/recortes defeituosos com segurança.
- Evidência 04/11 02:15 UTC: `docs/evidence/20261104/ux/report.json`, Chromium real, remapeamento V/salto, pausa/checkpoint, reload/Continue e save corrompido passaram; nenhum pageerror. Falha intermediária era fixture de corrupção sobrescrita pelo salvamento correto ao perder foco; fixture agora injeta corrupção com jogo pausado. Modais corrigidos: Enter inicial não os fecha e fechamento devolve teclado imediatamente.
- Marco 04/11 02:30 UTC: pipeline `art:production` integrado, fontes/prompts preservados em `art/source/production-v2/`; Nero 14 poses/6 fases de caminhada, NPCs 4 fases, Winsth 8 poses, filha 6 poses, coche e 18 painéis únicos. Todos REVIEW. Teste de envelope encontrou pés antigos 3–7 px acima do pivô: calibração corrigida, 36 testes passaram. Inspeção visual encontrou overflow 256→0 na quantização: clamp corrigido e PNGs regenerados. Não confundir o catálogo parcial com animação final aprovada.
- Cidade ampliada para 27.648 unidades, regiões contínuas com fachadas distintas, 14 NPCs, portas articuladas, válvulas e observações; eventos de vapor, fiscalização e coche preservam flags. Duração real ainda sendo medida, não aprovada por estimativa.
- Container candidato `black-bird-codex-candidate-20261104`, 127.0.0.1:4186, healthy, restart unless-stopped. Build inicial `bb-d381a869bb6a`; contém versão ANTERIOR às últimas correções de cor/pivô/cadência. Não é candidato final nem HML. Container 4185 estável anterior continua intacto.
- Navegador do candidato inicial: chão 30 s, pausa física, diálogo/retomada, 10 ciclos/remoção de NPC e salto curto/longo passaram; travessia extensa ainda em execução (`candidate-route/`). Melee passou; tiro revelou cadência deslocada pela nova preparação de 60 ms: cooldown agora começa no início da ação. Revalidar combate na próxima imagem.
- Build ganhou identificação por hash em `/build-info.json`, falha de assets visível/retry e cache revalidável. Vite atualizado 6.4.5. Upgrade do Vitest por advisory em andamento; npm10/arborist falhou com edgesOut, resolução isolada via npm11 em execução. Não alterar engine ou aplicar audit fix --force.
- Marco 04/11 02:38 UTC: instalação limpa e auditoria retornaram zero vulnerabilidades; Vitest 4.1.12 e Vite 6.4.5, 36 testes passaram. Build Docker RC3 `bb-abb1bf3fe190` / `index-BiBqkniX.js`, container `black-bird-codex-rc3-20261104` em 4186, autônomo/healthy. UX e combate passaram: tiro próximo corrigido pelo segmento inicial da mão à boca do cano, munição/reserva atômicas, esquiva, pausa/foco/configurações da arena, quatro padrões de Winsth, ondas/acerto/evasão e dez resets. Evidências `ux-final/` e `combat-rc3/`.
- A regressão extensa da candidata inicial terminou: ida 196,49 s ativos até a extremidade, ida+volta 393,75 s; chão/retorno/cutscene/reinícios sem pageerrors. Evidência `candidate-route/` declara o bundle antigo, não o final. Capturas/vídeo incluem o defeito de cor corrigido depois.
- `browser-opening.mjs` está percorrendo RC3 sem fixtures, interagindo com porta/NPC/válvulas e medindo o tempo até o trigger real. RC4 está sendo compilada: mesmo percurso, melhoria de fundo das arenas, passos ligados aos quadros de contato, indicador de carregamento, suspensão sonora em blur e fechamento de painel de informações. Não trocar 4186 antes de finalizar o teste em execução.
- Próxima ação: validar RC4 no navegador, consolidar evidências/commit e preservar serviço estável. HML segue bloqueado externamente conforme relatório; não alterar infraestrutura.

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
