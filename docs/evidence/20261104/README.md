# Evidências de execução — 04/11/2026

Atualização de acesso: demonstração temporária na rede/VPN em
**http://10.100.62.4:4187/**, com autenticação da aplicação.
[Testes de login e jogo pelo IP privado](browser-auth-private/README.md).
Navegador na VM validado; Edge do computador do usuário ainda não confirmado.
Esse endereço não é HML gerada pelo Engineering. O registro abaixo corresponde
à versão estável anterior preservada, cujo gameplay permanece igual.

Código funcional `401f4c3`; build **bb-5233fb49e865**. Serviço local em
`127.0.0.1:4186`, Nginx/container persistente. **Não é HML nem acesso externo.**

| Evidência | O que foi executado |
|---|---|
| [Abertura completa](rc5-opening/report.json), [vídeo](rc5-opening/opening.webm) | Teclado, sem fixture de posição: porta, conversa completa, válvulas, quatro regiões, escola após 192,02 s de deslocamento ativo, oito fases, encerramento e Jogar novamente. Crash caption ~102 ms depois do preto. Web Audio running, 544 inícios de oscilador observados. |
| [Regressão estável](stable-regression/report.json), [vídeo](stable-regression/regression.webm) | 30 s no chão, pausa física, diálogo/tecla mantida, dez ciclos/remoção de NPC, salto curto/longo, ida/volta real, resize 900×700/1280×720, blur sintético, três reinícios e cutscene pausada. Ida até a extremidade 196,53 s ativos; ida/volta 393,28 s. A cutscene deste script usa fixture; a abertura acima não. |
| [Combate](rc5-combat/report.json), [vídeo](rc5-combat/combat.webm) | Melee único/miss/esquerda/direita, tambor vazio, reserva/recarga/cancelamento atômicos, tiro próximo nos dois sentidos, esquiva com recuperação vulnerável, pausa/foco/configurações, quatro padrões de Winsth, direção, recuperação, onda com dano e evasão, derrota e dez resets. Fixtures de combate explicitadas. |
| [Configurações e Continue](stable-ux/report.json) | Salto remapeado para V, volume/movimento reduzido, checkpoint/Continue após reload, corrupção sem apagar configurações. |
| [Resiliência](stable-resilience/report.json) | Porta/estado visual após reload e retorno; skip sem cue tardio; quota bloqueada com aviso e movimento; falha de asset intencional com retry por Enter e recuperação. |
| [30/60 callbacks](stable-runtime/report.json) | rAF limitado no navegador, não pelo limiter interno da engine. Deltas médios 33,33/16,83 ms; salto máximo ~52,83 unidades nos dois casos; contato em Y=318. Não é teste de monitor 144 Hz ou hardware de referência. |
| [Arte reproduzível](art-reproducibility.json) | 31 PNGs derivados regenerados byte a byte após calibração de pivôs/cor. Arte continua REVIEW. |
| [Identidade do artefato](artifact-match.json), [serviço](service.json) | 69 arquivos comparados entre candidata RC5 e imagem identificada pelo commit: somente build-info.json mudou. JS servido corresponde à imagem. Cópias somente PARA FORA dos containers para inspeção; nenhum patch manual no container. |
| [Testes](unit-tests.txt), [build](build.txt), [audit](dependency-audit.json) | 36 testes/14 arquivos em Node24, TypeScript/Vite, build/instalação limpa Docker/Node22 e auditoria sem vulnerabilidades na execução registrada. Aviso de chunk Phaser grande permanece. |
| [Logs](server-log-review.json) | Revisão dos logs do container do jogo, sem entradas em nível error/crit/emerg no conjunto examinado. Falha de rede do teste de resiliência é intencional. |
| [HML](hml-readiness.json) | Inspeção read-only: nenhum ambiente/URL, import com conexão expirada/outro bloqueado, sem aprovação independente e provider/gateway desabilitados. Nenhum deploy HML executado. |

Capturas PNG são do navegador real. Vídeos são gravações Playwright sem áudio;
os longos foram recodificados em VP8 12 fps. Hashes e originais preservados estão
nos respectivos `video-provenance.json`. A instrumentação Web Audio/captions não
substitui escuta humana do mix. Frames do vídeo de caminhada e capturas da arena
foram inspecionados, além das verificações de posição/timeline.

Resultados intermediários, inclusive falhas anteriores corrigidas, foram
preservados em `/home/matheus/blackbird-evidence-20261104-raw/intermediate`.
O snapshot antigo de 01/11 continua nas pastas históricas do repositório.
Não há aprovação artística definitiva, prova de diversão humana, validação de
144 Hz nativo, perda de contexto WebGL ou acesso externo/HML neste registro.
