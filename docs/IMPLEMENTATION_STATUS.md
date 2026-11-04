# Status da implementação — 04/11/2026

Referência: `BLACK_BIRD_DOCUMENTO_MESTRE_CODEX.md`. Continuidade: `PROGRESSO_CODEX.md`.
Código funcional: `401f4c3`, build `bb-5233fb49e865`. Evidências em `evidence/20261104/`.

| Sistema | Classificação e limite da verificação |
|---|---|
| Repositório original, Phaser 4.2.1, seis cenas, build/container | VERIFICADO: instalação limpa, 36 testes, build Docker/Nginx e identidade do artefato |
| Física, chão e pivôs separados da imagem | VERIFICADO nos estados exercitados: idle, caminhada, salto/aterrissagem e combate; matrizes completas de plataformas não executadas |
| Relógio da simulação | VERIFICADO: corrigido slow motion inicial em 30 Hz; testes com deltas médios 33,33 / 16,83 ms, contato em Y=318 |
| Câmera contínua e retorno entre quatro regiões | VERIFICADO na imagem estável: ida 196,53 s ativos até a extremidade; ida/volta 393,28 s, câmera contínua e retorno ao bairro |
| Diálogos, interlocutores parados, rotina e limpeza | VERIFICADO: conversa completa, tecla mantida, pausa, remoção de interlocutor, dez ciclos e reinícios |
| Abertura até encerramento e nova partida | VERIFICADO: percurso por teclado sem fixture, 192,02 s ativos até a escola, oito fases, preto antes do cue e reinício |
| Portas, válvulas e persistência de mundo | VERIFICADO: resposta visual, flags após reload e retorno; objetos não substituem exploração por teletransporte |
| Save, Continue e configurações | VERIFICADO: checkpoint válido, versão/corrupção/quota tratadas, controles e volume preservados |
| Remapeamento, captions e conforto | VERIFICADO nos controles exercitados; acessibilidade completa por leitor de tela/gamepad NÃO VERIFICADA |
| Pausa/foco de prólogo e arenas | VERIFICADO: cenas/timers suspendem, diálogo recuperado, modal de arena e foco sintético exercitados |
| Combate de Nero | VERIFICADO nos casos registrados: ledger por alvo, janelas, tiro/muzzle sweep, reserva/recarga atômicas, cancelamento, esquiva e recuperação |
| Winsth separado da narrativa | VERIFICADO: quatro padrões, preparação/direção/recuperação, onda com dano/evasão, derrota e dez resets; balanceamento humano PARCIAL |
| Arte e animação | PARCIAL: 18 painéis únicos, Nero 14 poses/6 fases de caminhada, NPCs articulados, filha/coche/Winsth integrados; tudo REVIEW, catálogos §§16–17 incompletos |
| Pipeline de arte | VERIFICADO tecnicamente: 31 derivados regenerados byte a byte, fontes/prompts e pivôs preservados; não concede aprovação artística |
| Áudio | PARCIAL: buses, volume, ambiente regional, passos/cues e captions conectados; Web Audio observado running; escuta/mix e trilha definitiva não aprovados |
| Performance e navegadores | PARCIAL: Chromium/software, duas resoluções desktop, movimento/salto em rAF 30/60; hardware de referência, 144 Hz nativo e perda de contexto WebGL NÃO VERIFICADOS |
| Serviço estático local | VERIFICADO: build de produção, container healthy com restart policy, cache revalidável, sem dependência do terminal |
| Demonstração no navegador com login | VERIFICADO pela VM em 10.100.62.4:4187: HTTP Basic no servidor, assets protegidos, jogo carregado e movimento. Acesso pela rede/VPN; confirmação do Edge do cliente pendente; não é publicação Engineering |
| HML pelo Huddle | BLOQUEADO EXTERNO: sem ambiente/URL do jogo, conexão expirada/import bloqueado, provider/gateway desabilitados e sem aprovação independente |

Não há erro bloqueante conhecido no percurso normal que foi exercitado. Isso não
certifica ausência de bugs, publicação externa, aprovação artística ou todos os
casos da matriz. Arte REVIEW não é RELEASE_READY. A história permanece somente
na abertura; o nome legado da filha não decide as pendências canônicas.
