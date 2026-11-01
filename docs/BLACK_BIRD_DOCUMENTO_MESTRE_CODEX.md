# BLACK BIRD: REVOLUÇÃO
## Documento-mestre de apoio ao Codex
### Desenvolvimento sobre o código existente · Direção criativa, produção e engenharia

**Edição 1.0 — 31 de outubro de 2026**

| Campo | Definição |
|---|---|
| Natureza | Especificação de apoio; não é código de um novo jogo. |
| Base de implementação | Repositório atual do Black Bird: Revolução. |
| Escopo narrativo | Somente a abertura; Winsth em arena de desenvolvimento separada. |
| Referência de qualidade | Acabamento artístico e experiência refinada, sem promessa de equivalência automática a uma produção AAA. |
| Estado | Requisitos, propostas e critérios de validação; implementação e testes do jogo precisam ser auditados no repositório. |
| Conteúdo | 49 seções, 37 clips propostos de Nero, 21 de Winsth, 20 efeitos, 12 briefs, 92 casos de teste, 45 tarefas e 24 fontes técnicas. |
| Formato recomendado ao agente | Este Markdown, com leitura progressiva por seções e registro de progresso no projeto. |

> **Mandato essencial:** evoluir o jogo que já existe. Não substituir o repositório por outro projeto, não tratar referências visuais como animações finalizadas e não ampliar a história além do início definido pelo proprietário.

---

<a id="indice"></a>

## Índice navegável


- [00 · Mandato de implementação e como usar este documento](#sec-00)
- [01 · Cânone consolidado, requisitos do proprietário e decisões em aberto](#sec-01)
- [02 · Barra de qualidade: ambição AAA sem inflar o escopo](#sec-02)
- [03 · Auditoria do repositório existente e plano de intervenção](#sec-03)
- [04 · Pesquisa de código e referências: o que aproveitar e o que não copiar](#sec-04)
- [05 · Experiência do jogador e ciclos de jogo](#sec-05)
- [06 · Narrativa: limites, atuação e escrita da abertura](#sec-06)
- [07 · Prólogo: roteiro jogável, duração e sequência de espaços](#sec-07)
- [08 · Level design, cidade contínua e exploração com retorno](#sec-08)
- [09 · Bíblia de arte: identidade, cor, materiais e hierarquia visual](#sec-09)
- [10 · Cenários, chão, parallax, iluminação e correção de texturas](#sec-10)
- [11 · Nero: ficha de personagem para produção artística](#sec-11)
- [12 · Winsth Chave Inglesa: massa, mecânica e escala do boss](#sec-12)
- [13 · Filha de Nero e população: design, atuação e diversidade funcional](#sec-13)
- [14 · Pipeline de assets: do conceito ao recurso de produção](#sec-14)
- [15 · Animação: regras de produção, sincronização e aprovação](#sec-15)
- [16 · Catálogo de animações de Nero](#sec-16)
- [17 · Catálogo de animações de Winsth, NPCs e objetos](#sec-17)
- [18 · Input, controles, modos e máquinas de estado](#sec-18)
- [19 · Movimentação, chão, colisão e estabilidade física](#sec-19)
- [20 · Câmera contínua, enquadramento e pixel art estável](#sec-20)
- [21 · Combate: arquitetura, tempo, colisão e justiça](#sec-21)
- [22 · Nero: golpes, revólver, esquiva e parâmetros de balanceamento](#sec-22)
- [23 · Winsth: encontro, IA, telegraphs e arena](#sec-23)
- [24 · Inimigos de apoio, alvos de treino e dificuldade](#sec-24)
- [25 · Interações, diálogos e rotinas que não quebram o controle](#sec-25)
- [26 · Efeitos visuais, clima e interatividade ambiental](#sec-26)
- [27 · Direção cinematográfica e cutscene final](#sec-27)
- [28 · Áudio, música e paisagem sonora](#sec-28)
- [29 · Interface, acessibilidade, controles e localização](#sec-29)
- [30 · Persistência, checkpoints e progressão sem expansão narrativa](#sec-30)
- [31 · Arquitetura orientadora: adaptar, não substituir o projeto](#sec-31)
- [32 · Contratos de dados, exemplos e convenções de integração](#sec-32)
- [33 · Renderização, performance e orçamentos mensuráveis](#sec-33)
- [34 · Ciclo de vida no navegador e resiliência](#sec-34)
- [35 · Build, empacotamento de assets e identidade da versão](#sec-35)
- [36 · Huddle Engineering: contrato de aplicação e validação em HML](#sec-36)
- [37 · Segurança operacional, licenças e proveniência](#sec-37)
- [38 · Estratégia de testes: lógica, navegador, visual e experiência](#sec-38)
- [39 · Matriz de casos de teste e regressão](#sec-39)
- [40 · Playtest, avaliação artística e métricas de experiência](#sec-40)
- [41 · Plano de produção por marcos e dependências](#sec-41)
- [42 · Briefs de produção: pedidos de arte, animação e som](#sec-42)
- [43 · Backlog executável e rastreabilidade](#sec-43)
- [44 · Protocolo de trabalho autônomo do Codex](#sec-44)
- [45 · Definição de pronto, revisão final e handoff](#sec-45)
- [46 · Glossário, unidades e registro de decisões](#sec-46)
- [47 · Fontes, proveniência e limites da pesquisa](#sec-47)
- [48 · Diretiva final para o Codex — início da execução](#sec-48)


---


<a id="sec-00"></a>

## 00 · Mandato de implementação e como usar este documento

**Documento-mestre de apoio ao desenvolvimento sobre o repositório existente. Não é uma implementação alternativa, um pacote de assets finalizados ou uma autorização para recomeçar o jogo.**

O Codex deve abrir o código que já existe, descobrir como ele realmente funciona e evoluí-lo até atender a esta especificação. Não criar um segundo jogo ao lado do primeiro, não substituir o projeto pelo laboratório de uma resposta anterior e não migrar de engine por conveniência. O objeto da entrega é o jogo do usuário.

A prioridade é uma experiência de alta qualidade: Nero agradável de controlar; cidade steampunk autoral, viva e legível; animações coerentes; combate com intenção; abertura emocional; publicação reproduzível no Huddle Engineering. Grande quantidade de arquivos, documentação ou efeitos não é evidência de qualidade.

### 0.1 Hierarquia de autoridade

| Ordem | Fonte de decisão | Como agir |
|---|---|---|
| 1 | Pedido mais recente do proprietário | Prevalece sobre prompts e propostas anteriores. |
| 2 | Cânone explicitamente estabelecido pelo proprietário | Preservar nomes, aparência, escala, premissa e acontecimentos definidos. |
| 3 | Evidência do repositório e da execução atual | Define o que existe, a versão das ferramentas e os limites reais do ambiente. |
| 4 | Requisitos verificáveis deste documento | Adaptar ao projeto existente sem mudar sua intenção. |
| 5 | Propostas de design deste documento | Implementar experimentalmente, medir e ajustar; não convertê-las silenciosamente em cânone. |
| 6 | Exemplos de terceiros | Estudar técnicas; não copiar identidade artística, conteúdo protegido ou estrutura incompatível. |

Nenhuma passagem deste documento comprova que o jogo atual já possui uma funcionalidade. Não foi disponibilizado, para esta redação, um checkout completo do repositório do jogo. A arquitetura, os nomes de arquivos, as versões e os resultados de testes devem ser verificados pelo Codex no ambiente real.

### 0.2 Etiquetas de autoridade

- **CÂNONE:** decisão do proprietário, a preservar.
- **REQUISITO:** comportamento exigido para a entrega.
- **PROPOSTA:** solução ou parâmetro inicial; pode ser melhorado com evidência.
- **AUDITAR:** informação ainda não verificada no código ou ambiente.
- **FUTURO:** capacidade reservada, fora da abertura atual.
- **BLOQUEADO:** depende de recurso, permissão ou produção artística ainda indisponível.

Salvo indicação expressa de cânone, números de dano, quadros, velocidades, cores, dimensões de arquivo, personagens secundários, nomes de ruas e organização de módulos são **propostas**, não decisões irrevogáveis.

### 0.3 Leitura em camadas para o agente

Na primeira passagem, ler §§00–08, 18–23, 31, 36, 38–45 e 48. Depois ler integralmente as seções da disciplina que será alterada. Para trabalhar em animações, por exemplo, ler §§11–17, 21–23 e 32 antes de editar.

Manter um resumo de trabalho curto no próprio repositório, com referências a seções estáveis. Não reler automaticamente o documento inteiro a cada mudança de linha. Não resumir a ponto de perder critérios de aceitação, restrições narrativas ou convenções de escala.

Ao encontrar conflito, registrar: requisito afetado, evidência do código, opções, escolha reversível e forma de validação. Se a divergência envolver cânone ou publicação externa, não presumir autorização. Continuar nas frentes independentes.

### 0.4 O que a tarefa NÃO pede

Não pede outro repositório, outro motor de jogo, uma demo desconectada, uma camada corporativa dentro do gameplay, multiplayer, monetização, contas online, inventário de centenas de itens, expansão da história após o início ou reprodução de Blasphemous.

Pede um plano de execução suficientemente específico para que o Codex produza melhorias reais no código atual. O agente deve implementar, executar, observar, corrigir e documentar resultados. Planejamento sem implementação é insuficiente; implementação sem inspeção visual também.

### 0.5 Tratamento de materiais anteriores

Imagens de Nero, fichas de Winsth, atlas, recortes e pacotes anteriores são **insumos a auditar**. Uma ficha conceitual não é automaticamente um spritesheet. Uma coleção de poses não comprova uma animação. Um relatório antigo não comprova o estado do checkout atual.

Preservar os originais e sua proveniência. Somente promover um derivado a asset de produção após conferir transparência, escala, anatomia, pivô, consistência entre quadros, licença e funcionamento no build real. Não importar o código de outro laboratório apenas porque veio acompanhado de testes.

[Voltar ao índice](#indice)

---


<a id="sec-01"></a>

## 01 · Cânone consolidado, requisitos do proprietário e decisões em aberto

### 1.1 Identidade e finalidade

| ID | Decisão consolidada |
|---|---|
| CAN-001 | Nome público: **Black Bird: Revolução**. “Bird” no singular no título. |
| CAN-002 | Organização revolucionária: **Black Birds**, no plural. |
| CAN-003 | Metroidvania 2D em pixel art, com ambientação steampunk industrial e cidade artisticamente rica. |
| CAN-004 | Plataforma inicial: navegador desktop; hospedagem em VM, por meio do fluxo de HML do Huddle Engineering. |
| CAN-005 | A referência de ambição artística é o acabamento de Blasphemous, sem copiar seus assets, religião ficcional ou identidade. |
| CAN-006 | Cidade social e politicamente distópica: pobreza, corrupção, violência, desigualdade e impunidade. |
| CAN-007 | Mundo dinâmico: névoa, faíscas, vapor, mudanças ambientais, portas que abrem e objetos que podem quebrar. |
| CAN-008 | Combate fluido combinando braço mecânico de perto e revólver à distância. |

### 1.2 Nero

| ID | Decisão consolidada |
|---|---|
| CAN-009 | Nero é um ex-mercenário que abandonou o trabalho após o nascimento da filha. |
| CAN-010 | Altura corporal: **1,80 m**. |
| CAN-011 | Um braço mecânico movido a vapor; não dois. |
| CAN-012 | Revólver antigo, sobretudo marrom de couro e máscara steampunk de corvo. |
| CAN-013 | A filha morre em atropelamento causado pelo filho de um integrante do alto governo. |
| CAN-014 | O responsável não é responsabilizado devido à proteção política. |
| CAN-015 | Nero passa a perseguir integrantes corruptos do governo e, posteriormente, se une aos Black Birds. |
| CAN-016 | Os Black Birds desejam derrubar a república autoritária e restaurar a monarquia. |

A premissa futura existe, mas **a implementação narrativa desta etapa para na abertura**. Não criar o julgamento, a primeira execução, a adesão à organização, a identidade do governante, líderes revolucionários, reviravoltas ou finais como acontecimentos definidos.

### 1.3 Primeiro boss

Usar **Winsth Chave Inglesa** como grafia de referência neste documento, derivada do primeiro pedido do personagem. “Winth” e “Win” aparecem como variações na conversa. Auditar o nome adotado no repositório; manter aliases de compatibilidade, sem quebrar saves e identificadores. A grafia editorial pode ser ajustada pelo proprietário.

| ID | Decisão consolidada |
|---|---|
| CAN-017 | Primeiro boss: Winsth Chave Inglesa. |
| CAN-018 | Altura corporal: **2,30 m**; peso superior a 250 kg. |
| CAN-019 | Corpo muito musculoso, grande e desproporcional. |
| CAN-020 | Dois braços mecânicos e mandíbula mecânica. |
| CAN-021 | Parte superior: apenas colete social, sem camisa. Parte inferior: calça de fábrica. |
| CAN-022 | Cartola preta e marreta movida a vapor. |

Não atribuir a Winsth um cargo político, parentesco com o motorista, história militar ou vínculo obrigatório com uma facção. Seu papel no enredo ainda não está fechado. A arena de desenvolvimento permite produzir o combate sem avançar a história.

### 1.4 Abertura obrigatória

Nero atravessa uma cidade viva para buscar a filha na escola. O trajeto oferece **pelo menos três minutos de caminhada significativa em ritmo normal**, não três minutos de diálogo, carregamento ou espera. Há NPCs e oportunidades de conhecer o mundo.

A sequência final mostra a filha indo na direção dele; um veículo aparece; **a imagem corta para preto antes do impacto**; o acidente é comunicado pelo som. Não mostrar o atropelamento graficamente. Não transformar a cena em uma prova de habilidade na qual o jogador supostamente poderia salvá-la.

### 1.5 Problemas relatados pelo proprietário

Registrar como defeitos a reproduzir, não como diagnósticos técnicos já confirmados: texturas bugadas; fundo genérico; animações ruins; chão estranho; personagens aparentando flutuar; câmera parecendo uma sequência de quadros; impossibilidade de retornar; NPC que continua andando durante a conversa; golpes ainda sem integração convincente.

### 1.6 Decisões que continuam abertas

Lado anatômico do braço mecânico de Nero; nome e idade exata da filha; nome da cidade; ano ou país ficcional; cor final do colete de Winsth; postura moral de personagens secundários; localização narrativa do boss; lado inicial da câmera; tecnologia e versão efetivamente instaladas; resolução interna; densidade final de pixels.

Adotar convenções técnicas reversíveis quando necessárias, registradas como propostas. Não apresentar essas convenções como se tivessem sido aprovadas pelo proprietário. A sugestão anterior de Nero guardar a máscara no prólogo não é cânone: preservar a aparência pedida até que haja decisão explícita.

[Voltar ao índice](#indice)

---


<a id="sec-02"></a>

## 02 · Barra de qualidade: ambição AAA sem inflar o escopo

Neste projeto, “padrão AAA” é uma ambição de acabamento e integração entre disciplinas, não uma promessa de orçamento, quantidade de conteúdo ou equivalência com uma produção comercial concluída. A tradução prática é rigor em direção de arte, animação, resposta, som, estabilidade, acessibilidade, ferramentas e validação.

Não adicionar sistemas só porque jogos grandes os possuem. Um bairro inesquecível com controles excelentes vale mais que uma cidade extensa sem acabamento. O volume de tokens disponível não substitui decisões artísticas, recursos licenciados nem avaliação humana.

### 2.1 Sete dimensões inseparáveis

| Dimensão | O jogador percebe | Evidência exigida |
|---|---|---|
| Controle | Nero obedece e é previsível. | Vídeo de deslocamento, salto, parada e retorno em diferentes taxas de atualização. |
| Direção de arte | Reconhece Black Bird sem ler o título. | Capturas sem pós-processamento excessivo; composição e materialidade consistentes. |
| Animação | Entende intenção, peso e contato. | Sequências isoladas e em gameplay, sem deslizamento de pés ou anatomia variável. |
| Combate | Aprende padrões e sente impacto justo. | Hitboxes sincronizadas, telegraph legível e possibilidade demonstrada de resposta. |
| Mundo | A cidade parece continuar além da tela. | Rotinas, eventos contextuais, profundidade e diferenças sociais observáveis. |
| Narrativa e som | Importa-se com a caminhada e com Nero. | Prólogo completo, atuação, silêncio, diálogo natural e ritmo sem exposição excessiva. |
| Produto | Abre, responde, persiste e atualiza de forma confiável. | Build real, testes no navegador, recuperação de falhas e validação da publicação. |

### 2.2 Bloqueadores de qualidade

Um defeito em qualquer item abaixo impede chamar a entrega de pronta: personagem flutuando; comando perdido de forma reproduzível; softlock; tela preta involuntária; recurso ausente; dano antes do aviso; progressão sem retorno não justificada; diálogo que quebra controles; cutscene repetida indevidamente; arte central provisória apresentada como final.

Performance não compensa esses defeitos. Beleza estática não compensa controles ruins. Um build que compila não é uma aprovação de experiência.

### 2.3 Etapas de aprovação

**G0 — Base reproduzível:** código atual identificado, execução inicial registrada, arquivos do usuário preservados.

**G1 — Controle confiável:** chão, câmera, input, retorno e diálogo passam pelos testes obrigatórios.

**G2 — Quarteirão de referência:** trecho de 30–45 segundos com arte, animação, áudio e interação integrados. O trecho é um padrão de produção, não substitui o prólogo completo.

**G3 — Abertura completa:** três minutos de caminhada significativa, cidade variada, ida e volta, NPCs e sequência final.

**G4 — Combate demonstrável:** Nero e Winsth em arena separada, com ataques justos, animações e efeitos coerentes.

**G5 — Publicação verificável:** o mesmo jogo validado é construído e servido no ambiente autorizado, com identidade do build e teste de atualização.

Não pular G1 para produzir mais cenários. G2 pode ter classificação “tecnicamente qualificado, aguardando avaliação artística do proprietário”; o agente não deve simular essa aprovação. Enquanto aguarda, trabalhar em sistemas independentes e manter a arte em revisão.

### 2.4 O que cortar antes de reduzir qualidade

Adiar árvores de habilidade, lojas, crafting, dezenas de inimigos, múltiplas fases do boss, dublagem completa, multiplayer e mapas gigantes. Não cortar alinhamento dos pés, legibilidade, pausa, tratamento de erros, controle de áudio ou teste do fluxo final.

A liberdade criativa existe para melhorar a experiência dentro do cânone. Não é autorização para alterar o gênero, matar personagens adicionais, avançar capítulos ou transformar o prólogo em combate obrigatório.

### 2.5 Avaliação visual honesta

Usar uma escala editorial de 0 a 4: ausente; provisório; funcional inconsistente; consistente; refinado. Pontuar composição, silhueta, material, animação, contato, cor, profundidade e legibilidade. Não calcular uma média que esconda um bloqueador: um personagem refinado em um cenário sem chão funcional continua reprovado.

Cada avaliação deve citar uma captura, um vídeo ou uma observação de teste. “Parece profissional” sem referência visual e sem análise não constitui evidência.

[Voltar ao índice](#indice)

---


<a id="sec-03"></a>

## 03 · Auditoria do repositório existente e plano de intervenção

### 3.1 Antes de editar

Ler as instruções existentes do projeto, inclusive `AGENTS.md` quando houver. Identificar a raiz real do jogo; ele pode estar em um monorepo. Registrar branch, alterações não commitadas e arquivos que pertencem ao trabalho do usuário. Não executar limpeza destrutiva, reset, checkout forçado ou exclusão de diretórios para “começar organizado”.

Descobrir o gerenciador pelo lockfile, os scripts declarados, a versão de Node requerida e a engine realmente instalada. Não assumir Phaser 4 porque um prompt anterior o mencionou. Confirmar versões resolvidas e APIs disponíveis. Preservar o lockfile e não atualizar dependências em massa.

### 3.2 Inventário mínimo

| Área | Pergunta que a auditoria precisa responder |
|---|---|
| Entrada | Qual arquivo inicializa o jogo e qual cena/menu é aberto? |
| Física | Arcade, Matter, customizada ou combinação? Quem escreve posição e velocidade? |
| Câmera | Quem a controla? Existe código de transição sobrescrevendo o follow? |
| Arte | Quais texturas são imagens reais, atlas, tiles e desenhos gerados em runtime? |
| Animação | Quais clips têm quadros distintos? Quais são placeholders ou tweens de uma pose? |
| Input | Há camada de ações ou teclas espalhadas? Existem listeners duplicados? |
| Mundo | Mapa contínuo, salas, chunks ou cenas? Como funciona o retorno? |
| Persistência | O que é salvo, onde e com qual versão? |
| Áudio | Quais sons existem, quais licenças e como o áudio é desbloqueado? |
| Build | Qual comando gera o artefato real? Existem diferenças entre dev e produção? |
| Publicação | Qual porta, diretório, base path e contrato de health já existem? |
| Testes | O que realmente é executado e o que é apenas um script vazio? |

### 3.3 Reprodução dos defeitos conhecidos

Para cada defeito, criar uma ficha: passos; resultado esperado; resultado real; cena e posição; navegador; resolução; build; captura; hipótese; observação que confirmaria ou rejeitaria a hipótese.

Exemplo: “os pés parecem elevados” pode vir de margem transparente, origem errada, atlas recortado, collider alto, textura de chão desenhada abaixo da colisão, câmera fracionária ou desenho de um salto usado como idle. Não escolher a causa por intuição e adicionar um offset global de alguns pixels sem medir.

Exemplo: “não dá para voltar” pode ser limite do mundo, trigger de sentido único, descarregamento sem ligação reversa, spawn inválido ou flag consumida. Não corrigir teletransportando Nero para a tela anterior sem preservar estado.

### 3.4 Estratégia de alteração

Classificar cada sistema como **preservar**, **corrigir localmente**, **refatorar por contrato** ou **substituir pontualmente**. A última opção exige demonstrar por que uma correção local não resolve e como evitar regressões.

Preferir adaptar componentes existentes. Uma tabela de ataques pode substituir números espalhados sem reescrever o renderer. Um árbitro de câmera pode resolver disputa entre scripts sem alterar a engine. Um contrato de pivô pode corrigir sprites sem recriar a física inteira.

Não deixar duas implementações concorrentes ligadas ao mesmo personagem. Se uma nova camada assumir uma responsabilidade, desativar a antiga de forma explícita e testável.

### 3.5 Baseline e recuperação

Guardar capturas do mesmo enquadramento antes/depois; resultados de build; trajeto de teste; tamanho dos assets; frame times de uma sessão curta. Checkpoints locais devem respeitar a política Git existente. Não criar branches, commits ou pushes remotos contradizendo as instruções do repositório.

Trabalhar em mudanças pequenas o suficiente para diagnosticar. Se o resultado piorar, reverter apenas a própria alteração ou corrigi-la; nunca apagar trabalho alheio. Não usar flag de teste para esconder bug em produção.

### 3.6 Saída da auditoria

Um relatório curto com evidência, mapa dos arquivos relevantes, lista priorizada de causas prováveis, versões confirmadas, riscos e primeira intervenção. A auditoria não precisa virar um tratado separado. Ao obter informação suficiente para a primeira correção, implementar e validar, continuando a descoberta de forma incremental.

[Voltar ao índice](#indice)

---


<a id="sec-04"></a>

## 04 · Pesquisa de código e referências: o que aproveitar e o que não copiar

As fontes abaixo foram consultadas para orientar esta especificação. A leitura foi focal, em arquivos e documentação específicos; não equivale a uma auditoria completa dos projetos nem comprova compatibilidade com o jogo do usuário. Fixar commit/versão ao usá-las durante a implementação.

### 4.1 Celeste: tolerância de input e limites de arquitetura

No arquivo público `Source/PICO-8/Classic.cs`, a entrada de salto é registrada em um buffer e combinada com uma tolerância de contato com o solo. O próprio arquivo se apresenta como uma tradução próxima do original, não uma arquitetura recomendada para começar outro projeto. Aplicação proposta: estudar a intenção desses mecanismos e reimplementar seus invariantes nas unidades e no loop existentes, sem copiar números cegamente. [[S01]](#fonte-s01)

O comentário dos desenvolvedores sobre a classe do jogador defende a ordem explícita das operações e aponta que a animação poderia ser mais orientada a dados. Aplicação: não criar centenas de classes apenas para parecer modular; separar conteúdo e eventos, preservando uma sequência de atualização compreensível. A opinião sobre testes daquele projeto não dispensa os testes de regressão necessários aqui. [[S02]](#fonte-s02)

### 4.2 SuperTux: câmera como sistema próprio

O arquivo `src/object/camera.cpp` contém modos, limites, parâmetros de enquadramento e efeitos de câmera. Serve como estudo de responsabilidades distintas, não como código pronto para Phaser. Aplicação: um único proprietário da câmera decide exploração, arena, diálogo e cutscene; efeitos não devem alterar a posição física de Nero. O arquivo consultado declara GPL-3.0-or-later; tratar qualquer incorporação como decisão de licença, não como simples colagem. [[S03]](#fonte-s03)

### 4.3 doukutsu-rs: arte, colisão e comportamento separados

Em `src/game/player/mod.rs`, limites de exibição e limites de contato aparecem como dados distintos, junto de controlador e aparência. Aplicação: o PNG inteiro não determina a colisão; renderização e física compartilham um referencial, mas têm finalidades diferentes. [[S04]](#fonte-s04)

Em `src/game/npc/boss/balfrog.rs`, os comportamentos são divididos em estados e contadores de ação. Aplicação: Winsth precisa de preparação, execução e recuperação explícitas. Não importar a luta, os padrões, a arte ou as constantes de Cave Story. Uma engine aberta não libera automaticamente os dados do jogo original. [[S05]](#fonte-s05)

### 4.4 Frameworks e demos de metroidvania

KoBeWi/Metroidvania-System é referência de organização de um framework para Godot. GDQuest/godot-platformer-2d é um projeto educacional, não o código de um grande jogo comercial. Usá-los como trilhas de investigação de salas, mapas e componentes; a consulta realizada aqui foi à apresentação dos repositórios, não uma certificação de todos os módulos. Não migrar para Godot só para reaproveitá-los. [[S06]](#fonte-s06)[[S07]](#fonte-s07)

### 4.5 Documentação da engine instalada

A documentação de Phaser descreve follow, deadzone e bounds de câmera; animações por quadros; e os limites do Arcade Physics. O Codex deve conferir essas APIs na versão efetivamente instalada. Arcade e Matter são sistemas diferentes: misturá-los não cria colisão automática entre seus corpos. [[S08]](#fonte-s08)[[S09]](#fonte-s09)[[S10]](#fonte-s10)

### 4.6 Produção artística

O relato de Thomas Vasseur sobre Dead Cells apresenta um processo com personagens 3D renderizados para produzir animação 2D. É uma alternativa de produção a avaliar, não uma solução que transforma qualquer modelo em pixel art refinada. Para Black Bird, testar uma sequência curta antes de adotar uma mudança de pipeline. A decisão depende de artistas, ferramentas, consistência e custo de revisão. [[S11]](#fonte-s11)

Aseprite documenta exportação de imagem e JSON por linha de comando. Tiled documenta camadas de tiles, objetos, imagens e propriedades. São referências de integração de conteúdo editável; não pressupor que estejam instalados nem que um arquivo de imagem seja um mapa completo. [[S12]](#fonte-s12)[[S13]](#fonte-s13)

### 4.7 Ficha de pesquisa obrigatória

Para cada trecho realmente estudado pelo Codex: URL; commit; caminho; função/sistema; observação concreta; restrição de licença; padrão a adaptar; problema do Black Bird que ele resolve; diferença de engine; teste que valida a adaptação.

Ler o README e afirmar “entendi o código” não atende. Clonar repositórios inteiros sem uma pergunta de implementação também não. A pesquisa deve responder a um problema e encerrar com uma decisão.

Não afirmar que Blasphemous, Hollow Knight ou Dead Cells disponibilizam seu jogo comercial completo como código aberto. Aqui são referências de qualidade e, quando houver fonte primária, de processos publicados.

[Voltar ao índice](#indice)

---


<a id="sec-05"></a>

## 05 · Experiência do jogador e ciclos de jogo

### 5.1 Fantasia central

O jogador controla alguém que carrega peso físico e história pessoal, mas continua preciso nas mãos. O braço de vapor não torna Nero lento de responder; torna seus impactos e suas poses particulares. O sobretudo, a máscara e o revólver precisam ser reconhecíveis durante a ação, não apenas na ficha de conceito.

A cidade não é cenário neutro. Ela oferece rotinas, sons, desigualdade, beleza e pequenas decisões de exploração. Seu desenho deve permitir caminhar sem pressa e perceber acontecimentos, mas sem transformar o prólogo em uma fila de textos obrigatórios.

### 5.2 Ciclos por horizonte de tempo

| Horizonte | Ciclo pretendido |
|---|---|
| Segundo a segundo | Observar → mover → sentir resposta → reconhecer espaço seguro. |
| Alguns segundos, em combate | Ler intenção → escolher distância → atacar/esquivar → reconhecer resultado. |
| Dezenas de segundos | Descobrir um detalhe → interagir ou seguir → perceber mudança de ambiente. |
| Minutos do prólogo | Conhecer a cidade → antecipar o encontro familiar → chegar à escola → vivenciar a ruptura. |
| Sessões futuras | Exploração, habilidades e retorno; especificar infraestrutura, não inventar capítulos. |

### 5.3 Contrato emocional do prólogo

Começar com curiosidade e rotina, não com uma cidade inteira gritando tragédia. A pobreza pode coexistir com humor, cuidado, comércio e trabalho competente. A filha precisa parecer uma pessoa esperada por Nero, não apenas um recurso de roteiro. Pequenas referências cotidianas funcionam melhor que um monólogo sobre o quanto ele a ama.

Não atribuir ao jogador culpa mecânica pelo acidente. Não esconder uma ação salvadora inexistente, não exibir “você falhou” e não premiar velocidade de chegada com resultados diferentes. A tragédia é um acontecimento narrativo definido, não um desafio secreto.

### 5.4 Justiça e agência

Durante exploração, o jogador deve entender onde pode andar, o que pode abrir e quais ações estão disponíveis. Durante diálogo, entender como continuar ou sair. Durante combate, compreender por que sofreu dano. Durante cutscene, reconhecer que o controle está temporariamente cedido.

Agência não significa permitir violência contra qualquer NPC. O prólogo pode desabilitar ataques ofensivos de forma coerente, mantendo o combate na arena técnica. Não permitir matar civis e depois reproduzir diálogos cotidianos como se nada tivesse acontecido.

### 5.5 Sensações que devem orientar decisões

**Preciso, não rígido.** Inputs tolerantes; colisão previsível; direção clara.

**Pesado, não atrasado.** Preparação visual enxuta para Nero; recuperação e som comunicam massa; Winsth pode ter antecipações maiores.

**Rico, não poluído.** Hierarquia de contraste; atividade em camadas; focos separados.

**Sombrio, não ilegível.** Escuro com informação suficiente para jogar; detalhes não dependem de brilho máximo.

**Contínuo, não corredor.** Retorno possível; espaços com identidade; marcos que ligam as áreas.

### 5.6 Antifuncionalidades

Não adicionar navegação de dashboard, cadastro, painel de nuvem ou linguagem do Huddle ao HUD. O jogo é uma aplicação de teste da plataforma, não uma demonstração dentro do universo ficcional. Dados de build podem existir em tela técnica separada.

Não criar moeda, XP, árvore de talentos, loot ou diálogos ramificados antes de saber que melhoram esta abertura. Nenhum desses sistemas resolve cenário genérico, pé flutuante ou animação ruim.

[Voltar ao índice](#indice)

---


<a id="sec-06"></a>

## 06 · Narrativa: limites, atuação e escrita da abertura

### 6.1 O que pode ser desenvolvido agora

Ritmo do caminho até a escola; interações cotidianas; sinais visuais da sociedade; familiaridade de Nero com moradores; preparação afetiva discreta; chegada da filha; corte para preto; silêncio e encerramento.

O agente pode propor diálogos curtos, nomes funcionais de NPC e detalhes ambientais. Identificá-los como propostas editoriais. Não criar uma cronologia política extensa nem fixar a história da monarquia para preencher documentos.

### 6.2 Nero em um dia comum

Sua experiência anterior aparece em postura, economia de palavras, atenção à rua e manutenção do braço, não em exposição automática. Não fazê-lo ameaçar cada pessoa que encontra. Ele está buscando a filha, não recrutando uma revolução.

A máscara permanece parte da identidade solicitada. Se a atuação facial ficar limitada, usar orientação da cabeça, postura do ombro, pausa, direção do olhar sugerida pelas lentes e gesto da mão livre. A relação familiar precisa funcionar sem depender de um rosto descoberto ainda não aprovado.

### 6.3 A filha

Nome, idade exata e aparência definitiva continuam abertos. Não inventar uma doença, poder secreto ou filiação política. Proposta de atuação: reconhecer Nero antes de correr; ajustar a mochila ou um objeto escolar; pequena hesitação feliz; corrida infantil com passos mais curtos que os de um adulto.

Não sexualizar, não tornar a criança um alvo de combate e não produzir sprites de dano, mutilação ou impacto do acidente. O corte anterior ao impacto é parte obrigatória da direção.

### 6.4 Política por observação

Usar fatos locais observáveis: uma cobrança abusiva; manutenção privilegiada na avenida; propaganda contrastando com fila de comida; um guarda ocupado protegendo mercadoria de luxo; reparos feitos pela própria população.

Não pressupor que toda pessoa pobre seja miserável, toda pessoa rica seja vilã ou todo trabalhador seja revolucionário. A especificidade melhora o mundo. O autoritarismo pertence ao regime ficcional; a história não precisa transformar todo diálogo em uma tese sobre formas de governo.

### 6.5 Black Birds na abertura

Podem aparecer como símbolo discreto, panfleto parcialmente arrancado ou comentário ambíguo. Não estabelecer líderes, rituais, juramentos, programa completo ou encontro de recrutamento. Nero ainda não se uniu a eles.

A restauração monárquica é objetivo definido da organização; sua legitimidade moral não está estabelecida. Não alterar esse objetivo para outro porque o agente prefere uma narrativa diferente.

### 6.6 Critérios de diálogo

Uma fala deve cumprir ao menos uma função: revelar pessoa, lugar, relação ou tensão. Evitar falas que apenas repetem a missão. Preferir duas a quatro intervenções curtas por conversa opcional, com saída clara. Não bloquear o trajeto com oito NPCs explicativos.

Manter texto em português brasileiro, com acentuação e fontes que tenham os caracteres necessários. Identificadores internos podem ser ASCII; conteúdo apresentado ao jogador não deve perder acentos.

### 6.7 Exemplos editoriais, não cânone

**Mecânica de rua:** “A válvula aguenta. O aluguel é que não.” Nero pode responder com um gesto ou “Quanto tempo até parar?”. A fala comunica material e vida cotidiana sem história inventada.

**Comerciante conhecida:** “Hoje você passou cedo.” Nero: “Prometi chegar antes do sino.” A promessa é uma proposta de diálogo, não um novo acontecimento obrigatório.

**Conversa de fundo:** “A rua de cima ganhou luz nova.” “Aqui mandaram outro cartaz.” O contraste social emerge de um detalhe.

Nenhum exemplo deve virar a única voz de todos os NPCs. Revisar repetição, naturalidade e duração em gameplay real.

[Voltar ao índice](#indice)

---


<a id="sec-07"></a>

## 07 · Prólogo: roteiro jogável, duração e sequência de espaços

### 7.1 Duração verificável

O requisito é pelo menos três minutos de caminhada significativa em ritmo normal. Medir tempo de deslocamento ativo pelo caminho principal, excluindo menus, conversa, pausa, carregamento, espera artificial e cutscene. Não reduzir a velocidade para cumprir uma duração arbitrária.

A extensão necessária depende do controlador real. Como estimativa: `distância de percurso ≈ velocidade média de caminhada × tempo ativo`. Se a proposta de 140 unidades lógicas/s for adotada, 180 segundos representam aproximadamente 25.200 unidades de percurso, antes de considerar acelerações e desníveis. Isso é uma estimativa de dimensionamento, não uma ordem para criar um corredor de 25 mil pixels.

Se um trajeto de teste de 40 segundos estiver polido, classificá-lo como quarteirão de referência, não como prólogo concluído. Corrida ou rota otimizada podem reduzir o tempo; a validação deve declarar o modo de deslocamento. Não criar portões temporizados para impedir jogadores rápidos.

### 7.2 Quatro regiões propostas

| Região | Tempo ativo inicial | Experiência | Marco visual |
|---|---:|---|---|
| Bairro operário | 45–60 s | Familiaridade, manutenção, moradia e trabalho. | Grande fábrica vista entre telhados. |
| Mercado industrial | 45–60 s | Densidade humana, comércio, conflito cotidiano. | Passarela ou viaduto de transporte. |
| Avenida central | 45–60 s | Contraste de riqueza, propaganda e controle. | Relógio ou edifício cívico monumental. |
| Aproximação da escola | 45–60 s | Descompressão, rotina familiar e expectativa. | Fachada e portão da escola. |

Esses nomes são funcionais. Não são bairros oficialmente batizados no cânone. O Codex deve ajustar geografia e duração à movimentação verificada.

### 7.3 Ritmo por acontecimentos

No início, ensinar andar, observar e interagir sem painéis longos. Na primeira rua, apresentar uma porta ou mecanismo que responda. No mercado, um acontecimento social curto pode ser percebido sem interromper o jogador. Na avenida, abrir a composição e mostrar a escala do poder. Na escola, reduzir ruído visual e preparar o enquadramento final.

Espaçar acontecimentos para que cada um seja percebido. Não disparar conversa, trem, explosão de vapor e cartaz de tutorial no mesmo segundo. Um momento de silêncio ou espaço vazio intencional pode dar valor ao trecho seguinte.

### 7.4 Caminho principal e desvios

O caminho principal deve ser reconhecível por continuidade de piso, iluminação e marcos. Desvios pequenos podem conter conversa, objeto ou vista, mas não uma habilidade obrigatória de combate. A abertura é apresentação de mundo.

Prever retorno completo até o ponto narrativo final. O trigger da escola deve ser suficientemente claro para não ser acionado por um projétil, um NPC ou uma câmera passando. Antes da cutscene, estabilizar Nero em uma posição segura.

### 7.5 Conteúdo mínimo proposto

Uma identidade visual distinta por região; ao menos uma interação ambiental demonstrável em cada uma; um conjunto de NPCs com atividades diferenciadas; dois ou mais pequenos acontecimentos espontâneos; marcos visíveis de pontos diferentes; variação sonora perceptível.

Quantidade de NPCs não é critério isolado. Oito moradores com propósito são preferíveis a quarenta cópias andando em sincronia. Para o trecho de referência, três personagens distintos já permitem validar a linguagem de população.

### 7.6 Encerramento

A sequência conclui a abertura, apresenta o título e oferece retorno ao menu ou reinício. Não emendar automaticamente uma missão de vingança. Não mostrar um boss como se fosse continuação narrativa concluída.

Reiniciar deve limpar flags da sessão adequadas, mas preservar configurações do usuário. Continuar só aparece se houver estado salvo válido e funcional. Não exibir botão “Continuar” que apenas chama “Novo jogo”.

### 7.7 Evidências de conclusão

Vídeo do percurso completo com marcação de tempo ativo; mapa do caminho principal; teste de ida e volta; captura por região; conversas funcionando; cutscene na primeira execução e no reinício; reprodução sem depender de rede externa após carregar os recursos necessários.

[Voltar ao índice](#indice)

---


<a id="sec-08"></a>

## 08 · Level design, cidade contínua e exploração com retorno

### 8.1 Espaço jogável antes da decoração

Desenhar a rota no sistema atual de mapas. Separar piso, paredes, plataformas, objetos interativos, triggers, volumes de câmera e elementos decorativos. A silhueta visual do caminho deve corresponder às superfícies físicas, mas cada pedra não precisa de um collider.

Um percurso interessante alterna compressão e abertura: uma passagem estreita enquadra uma fábrica; um mercado oferece uma área de pausa; uma avenida amplia o horizonte; um trecho mais íntimo aproxima a escola. A variedade vem de composição, função e ritmo, não de obstáculos aleatórios.

### 8.2 Topologia proposta

```text
Bairro operário <-> Rua de manutenção <-> Mercado <-> Avenida <-> Escola
       |                                      |
  Pátio opcional                         Vista / passagem curta
       |                                      |
       +---- retorno reconhecível ------------+
```

Este desenho é um exemplo de relações, não um mapa aprovado. Não criar um atalho que permita pular toda a experiência inicial sem avaliar a narrativa; também não bloquear o retorno apenas para obrigar a passagem por eventos.

### 8.3 Transições bidirecionais

Cada conexão entre áreas tem ID estável, origem, destino, entrada segura e ligação inversa. A posição de chegada deve ficar fora do volume que dispara o retorno imediato. Usar condição de saída/reentrada ou breve supressão específica do portal, não um bloqueio global de controles.

No carregamento, aplicar flags persistentes antes de mostrar a região: porta já aberta continua aberta; objeto quebrado não reaparece sem regra explícita; evento único não se repete. NPCs podem retomar uma rotina plausível, sem necessidade de simular toda a vida da cidade fora da tela.

### 8.4 Mundo contínuo não exige uma única cena gigante

Manter a ilusão espacial com chunks ou salas conectadas quando a arquitetura já usa esse modelo. O requisito é rolagem natural, retorno, continuidade de estado e ausência de cortes arbitrários — não um arquivo monolítico de mapa.

Não trocar de cena em toda largura de tela. Limites técnicos podem coincidir com portas, interiores ou passagens que ocultem carregamento, sem virarem o principal mecanismo de navegação.

### 8.5 Métricas de espaço

Usar a altura corporal de Nero como referência: uma porta comum deve comportá-lo visual e fisicamente; corredores não devem parecer construídos para o boss; saliências decorativas não podem prender o collider.

Proposta inicial: passagens principais com folga lateral confortável; plataformas opcionais com superfície legível; largura de área segura suficiente para frear antes de um perigo. Validar com as velocidades reais de §19, não com medidas isoladas de um desenho.

Uma queda sem retorno no prólogo não deve gerar softlock. Evitar perigos letais nesta caminhada cotidiana. Se houver degraus, escadas ou rampas, escolher uma solução coerente com a física existente; não adicionar colisão inclinada visualmente sem suporte real.

### 8.6 Composição de um quarteirão de referência

Entrada com plano médio; uma fachada característica; um equipamento industrial com função; uma porta; três NPCs; uma interação; fábrica distante; foreground que enquadra sem ocultar; som próprio; saída que revela o próximo marco.

O quarteirão deve funcionar parado, caminhando, correndo e voltando. Avaliar também o enquadramento na direção inversa: o cenário não pode ser bonito apenas quando o jogador anda à direita.

### 8.7 Progressão metroidvania reservada

Preparar portas por habilidade, identificação de regiões e mapa descoberto somente na medida necessária à arquitetura. A abertura não precisa entregar uma árvore de progressão. Não conceder um “dash neon” herdado do projeto antigo apenas porque o código existe.

Uma futura habilidade a vapor pode abrir acessos, mas seu nome, origem e momento narrativo ficam pendentes. Os dados devem permitir esse crescimento sem colocar a habilidade em uso antes da decisão de design.

### 8.8 Testes de espaço

Percorrer todos os links nos dois sentidos; voltar imediatamente após transição; atravessar com salto; conversar perto de uma porta; carregar save em cada entrada; redimensionar janela perto do limite; repetir o circuito sem acumular NPCs ou efeitos. Todo beco sem saída deve ser intencional e reconhecível.

[Voltar ao índice](#indice)

---


<a id="sec-09"></a>

## 09 · Bíblia de arte: identidade, cor, materiais e hierarquia visual

### 9.1 Tese visual

**Beleza construída sobre desgaste industrial.** A cidade foi desenhada por pessoas com ambição estética e passou a ser mantida de forma desigual. Não é um amontoado de ruínas aleatórias. Existem ornamentação, engenharia, reparos improvisados, materiais nobres e infraestrutura explorada.

O vapor é uma linguagem recorrente: energia, trabalho, desigualdade, risco e expressão do corpo mecânico. Usá-lo em pontos com função, não como uma névoa branca uniforme cobrindo todo o mundo.

### 9.2 Referência de acabamento, não de conteúdo

Da referência solicitada de Blasphemous, perseguir densidade controlada de detalhes, silhuetas fortes, materialidade, arquitetura memorável e composição. Não reproduzir personagens, ícones, interfaces ou cenários.

Black Bird deve ser reconhecido por corvo, couro marrom, cobre envelhecido, aço escuro, gás quente, trabalhadores, máquinas e arquitetura cívica industrial. Engrenagens coladas em tudo não bastam.

### 9.3 Paleta de partida — proposta

| Uso | Cor de referência | Função |
|---|---|---|
| Sombra profunda | `#171A21` | Bases frias; preservar informação sem esmagar tudo em preto. |
| Carvão | `#2B3038` | Aço escuro, fuligem, estruturas. |
| Névoa distante | `#667681` | Separação atmosférica dos planos. |
| Pedra envelhecida | `#8A8170` | Arquitetura e calçamento. |
| Couro de Nero | `#6E4634` | Identidade principal do protagonista. |
| Bronze opaco | `#8F6940` | Mecanismos e acabamentos. |
| Cobre iluminado | `#B58B55` | Pontos selecionados, não toda a armadura. |
| Verdete | `#4E7168` | Oxidação localizada, contraste de material. |
| Luz a gás | `#E7BC79` | Focos quentes de navegação e vida. |
| Papel | `#C5B998` | Cartazes, jornais, sinais de uso. |
| Vermelho institucional | `#7A3438` | Propaganda e tensão, sem virar neon. |
| Realce claro | `#E9DDC2` | Pequenos acentos, olhos/lentes e contraste. |

Essas cores são um ponto de partida, não uma paleta universal obrigatória. Construir rampas por material e testar em cenas. Não recolorir tudo com a mesma multiplicação marrom: isso destrói separação de planos e legibilidade.

### 9.4 Valores antes da cor

Em escala de cinza, Nero deve se separar do fundo na maior parte do caminho. O foreground pode ser escuro, o plano jogável ter informação mais definida e a distância perder contraste. Um prédio do fundo não deve competir com a mão que ataca.

Concentrar detalhes de alta frequência onde contribuem para identidade. Paredes de repouso visual ajudam a ler NPCs. A variação de densidade é parte da direção, não uma falha de preenchimento.

### 9.5 Materiais

**Couro:** vincos amplos, bordas gastas, brilho baixo; não parecer plástico.

**Aço:** planos claros, sombras frias, pontos duros; desgaste junto de articulações e contato.

**Bronze/cobre:** reflexos quentes contidos; oxidação em encontros, vazamentos e peças antigas.

**Pedra:** volume por grupos de pixels; irregularidade com direção; desgaste nas rotas de uso.

**Tecido:** dobras conforme tensão e peso; não repetir a mesma textura do metal.

**Vapor:** massa que se expande e perde definição; emissão localizada; não uma sequência de bolas sólidas idênticas.

### 9.6 Linguagem arquitetônica

Bairro operário: módulos menores, adições, canos expostos e reparos. Mercado: toldos, letreiros, estruturas adaptadas e circulação. Avenida: escala cívica, fachadas alinhadas, materiais mais cuidados e infraestrutura protegida. Escola: construção reconhecível, vestígios de uso humano e enquadramento menos ameaçador.

Um marco monumental deve ter projeto visual próprio. Escolher massa, função, motivo repetido e detalhe de assinatura antes de desenhar janelas. Fábrica não é só um retângulo com três chaminés.

### 9.7 Pixel art e acabamento

Definir a grade efetiva e a escala por asset. Não misturar pixels de personagem duas vezes maiores que os da parede sem uma decisão deliberada. Evitar linhas serrilhadas inconsistentes, contornos excessivos e texturas filtradas.

Upscale de uma imagem pequena não cria detalhe novo. Redução de uma ilustração grande não garante pixel art coerente. Geração de conceitos pode ajudar, mas cada asset de produção exige revisão de clusters, anatomia, perspectiva e continuidade.

### 9.8 Critérios de aprovação de estilo

Nero reconhecível em silhueta; três materiais distinguíveis sem legenda; piso legível; fundo com profundidade sem competir; nenhum asset com perspectiva incompatível; cores coerentes entre personagens e mundo; cena interessante com bloom e partículas desligados; identidade própria sem precisar citar um jogo de referência.

[Voltar ao índice](#indice)

---


<a id="sec-10"></a>

## 10 · Cenários, chão, parallax, iluminação e correção de texturas

### 10.1 Chão como superfície, não tapete de quadrados

Desenhar uma linha de apoio clara, com espessura, borda e material. A superfície visível precisa coincidir com o lugar onde os pés tocam. A parte frontal do calçamento pode ocupar altura abaixo dela; não confundir essa face vertical com a superfície física.

Criar módulos de transição, borda, encontro com parede, escada, trilho, poça e tampa. Variar grupos de pedras e desgaste, não cada pixel de forma aleatória. Evitar repetição óbvia em intervalos curtos. Usar decals para sujeira e marcas sem multiplicar colliders.

### 10.2 Camadas de profundidade propostas

| Camada | Conteúdo | Movimento relativo inicial |
|---|---|---:|
| Céu | Nuvens e gradiente discretizado | 0,02–0,08 |
| Horizonte | Silhueta industrial | 0,08–0,18 |
| Monumentos distantes | Fábrica, relógio, viaduto | 0,18–0,35 |
| Cidade média | Telhados e fachadas recuadas | 0,35–0,60 |
| Fundo próximo | Pátios e estruturas atrás da rua | 0,65–0,90 |
| Plano jogável | Personagens, piso e colisão | 1,00 |
| Primeiro plano | Cabos, pilares, objetos de enquadramento | 1,05–1,15 |

Os coeficientes são propostas de composição. Adaptar à semântica da engine: um fator de scroll não é necessariamente calculado da mesma forma em todos os sistemas. Não aplicá-los duas vezes.

### 10.3 Continuidade de parallax

Calcular posições a partir de origem estável, não acumulando deslocamentos arredondados a cada frame. Na mudança de região, manter continuidade ou fazer uma transição deliberada. Quando Nero volta, camadas devem retornar ao mesmo estado espacial.

Se uma imagem é repetida, suas bordas precisam ser construídas para repetição. Não repetir um monumento único em intervalos regulares. Para mundos extensos, combinar módulos e landmarks, com descarregamento controlado de recursos.

### 10.4 Iluminação dirigida

Primeiro resolver valores e cor nos próprios assets. Depois acrescentar luzes locais, máscaras, emissivos ou normal maps quando o pipeline e a versão suportarem. Não tornar a produção dependente de um recurso de engine não auditado.

Luzes a gás podem tremular em baixa amplitude e frequência irregular controlada. Janelas comunicam presença humana. Fornalhas reforçam material e calor. Luz de fundo pode separar Nero, mas não deve contornar todos os personagens como um adesivo.

“Feixe em névoa” pode ser uma simulação 2D; não chamar isso de iluminação volumétrica física. Sombras pintadas e sombras dinâmicas não devem apontar em direções incompatíveis.

### 10.5 Reflexos e poças

Reflexos são uma camada de arte/efeito, não uma segunda cópia opaca do personagem. Limitar área, intensidade e deformação. O pé pode cruzar uma poça sem parecer afundar ou flutuar. Um reflexo não participa da física nem recebe hits.

Não refletir automaticamente toda a cena a custo alto. Priorizar poucos pontos de composição que sustentem a atmosfera.

### 10.6 Diagnóstico de texturas bugadas

| Sintoma | Investigar | Correção a validar |
|---|---|---|
| Linhas nas bordas dos tiles | Sampling, padding, extrusion, escala fracionária. | Atlas com bordas adequadas e política consistente de renderização. |
| Pixel tremendo | Arredondamento duplicado entre câmera, sprite e CSS. | Um único ponto de snapping visual; física permanece contínua. |
| Arte borrada | Filtro linear, canvas escalado de forma incompatível. | Sampling e escala final deliberados, testados em resoluções reais. |
| Partes cortadas | Frame bounds, trim, pivot, cell pequena. | Metadados e envelope do movimento corretos. |
| Cores alteradas | Pós-processamento, blend, perfil, alpha. | Comparação com asset original em fundo neutro. |
| Sprite errado | Índice de frame, chave duplicada, cache antigo. | IDs estáveis e manifest validado. |
| Halo branco/preto | Recorte e alpha contaminado. | Limpeza de borda e verificação em fundos claros/escuros. |

Padding não deve ser escolhido como número mágico universal. Verificar filtro, zoom e pipeline; avaliar 2–4 pixels de margem como experimento de atlas, sem extrapolar para toda a produção.

### 10.7 Ponto de vista

Fachadas do plano jogável seguem uma perspectiva lateral coerente. Um asset top-down não vira adequado apenas por reduzir sua altura. Escadas, portas, mesas e veículos precisam compartilhar o mesmo horizonte e convenção de visão.

### 10.8 Aprovação do cenário

Capturar a cena sem personagens, com Nero e com debug. Verificar o piso em ida/volta, o parallax com câmera lenta, a luz sem efeitos e o enquadramento em janelas menores. Um cenário não é aprovado apenas por uma composição panorâmica que nunca aparece no gameplay.

[Voltar ao índice](#indice)

---


<a id="sec-11"></a>

## 11 · Nero: ficha de personagem para produção artística

### 11.1 Identidade obrigatória

Homem adulto, ex-mercenário, 1,80 m, sobretudo marrom de couro, máscara steampunk de corvo, um braço mecânico a vapor e revólver antigo. A silhueta precisa distinguir cabeça com bico, ombros, massa do braço, abertura do sobretudo e botas.

Não adicionar uma segunda prótese, espada principal, asas, poderes mágicos ou armadura integral sem decisão do proprietário. Não transformar a máscara em um bico de ave biológico.

### 11.2 Anatomia e escala

A altura corporal é medida dos pés ao topo anatômico da cabeça, em postura neutra ereta, excluindo acessórios e arma. O bico aumenta a projeção horizontal, não a altura física.

Referência anterior: corpo de 144 pixels em arte-fonte para Nero e 184 para Winsth. Isso pode ser preservado no desenho enquanto o renderer usa outro fator de exibição. Não usar a caixa inteira do PNG como altura.

Proposta de trabalho: mundo lógico com 40 unidades por metro, Nero com 72 unidades e Winsth com 92. Arte-fonte a 80 pixels por metro seria mostrada a 0,5. O Codex deve adaptar ao padrão real, mantendo a razão corporal 23/18. Não reamostrar assets existentes antes de escolher a escala global.

### 11.3 Lado do braço mecânico

O usuário não fixou o lado anatômico. Antes de produzir todas as animações, conferir a referência aprovada e adotar uma decisão registrada. A primeira ficha de produção deve marcar “braço mecânico: esquerdo/direito” explicitamente.

Espelhar o sprite inteiro pode trocar o lado da prótese. Para uma assimetria importante, produzir vistas laterais coerentes ou uma solução de camadas que preserve anatomia. A ficha deve indicar quais elementos podem ser espelhados e quais precisam de correção.

### 11.4 Construção visual

**Cabeça:** máscara com ponte rígida, bico segmentado, lentes legíveis e tiras plausíveis. Evitar microdetalhes que desaparecem na escala de jogo.

**Torso:** sobretudo com peso, aberturas necessárias ao movimento e sinal de uso. Não ter uma cauda que atravesse pernas em todos os frames.

**Braço mecânico:** pistões e articulações onde há movimento; mangueiras protegidas; fonte de pressão visualmente compreensível; uma pequena assinatura de luz ou metal pode separar a mão do corpo.

**Revólver:** tambor, cano e empunhadura reconhecíveis. O disparo sai do cano, não do centro do personagem.

**Botas:** sola com contato claro; posição compatível com o collider e com a linha do piso.

### 11.5 Acting

No idle, o peso não muda de pé a cada frame sem motivo. Movimento respiratório pequeno, vibração mecânica localizada e vapor ocasional. Na caminhada, alternar contato, passagem e extensão; na corrida, inclinação e abertura de passada aumentam.

Nero não precisa parecer permanentemente agressivo no prólogo. Quando conversa, reduzir prontidão, orientar cabeça e corpo e permitir uma pequena mudança de postura. O braço mecânico continua pesado mesmo sem ataque.

### 11.6 Mapa de sockets

Definir no referencial do personagem: punho mecânico, cotovelo, ombro, boca do cano, coldre, emissor de vapor, mão livre, sola esquerda, sola direita, cabeça e ponto do indicador de interação.

Sockets podem variar por frame, mas suas coordenadas precisam ter origem documentada. Um disparo não deve surgir de posição fixa se a animação move o braço. Eventos de partículas herdam a direção correta.

### 11.7 Entregáveis artísticos

Ficha de frente, costas e laterais; pose neutra de medição; paleta; detalhe do braço; detalhe da máscara; tamanho relativo do revólver; marcação de pivô; animações do catálogo; exportação transparente; arquivo-fonte editável; lista de diferenças entre direita e esquerda.

As imagens anteriores são referências a revisar. Não declarar que cada vista existe sem inspecionar os arquivos. Quando uma vista faltar, registrar um pedido de arte específico, em vez de deduzir anatomia diferente em cada clip.

### 11.8 Critérios de aprovação

Reconhecível a tamanho de jogo; mesmo corpo entre clips; contato estável; arma não troca de mão inadvertidamente; sobretudo não cresce entre frames; máscara não muda de formato; braço mecânico tem mecânica visual consistente; efeitos não escondem mãos e pés; poses funcionam contra fundo claro e escuro.

[Voltar ao índice](#indice)

---


<a id="sec-12"></a>

## 12 · Winsth Chave Inglesa: massa, mecânica e escala do boss

### 12.1 Silhueta

Winsth é maior principalmente pela massa: tórax largo, cintura sólida, pernas que sustentam o peso, braços mecânicos enormes, pescoço e mandíbula de presença brutal. Não resolver sua imponência dobrando a altura de Nero.

A razão de altura corporal é `2,30 / 1,80 = 1,277777…`. Se Nero mede 144 pixels de corpo na referência, Winsth mede 184. A cartola e a marreta podem ultrapassar essa altura. A largura é uma decisão artística independente, não uma escala uniforme obrigatória.

### 12.2 Roupa e materiais

Colete social sem camisa; calça de fábrica; cartola preta. A combinação formal/industrial é parte da identidade. Não substituir por armadura medieval, avental integral ou paletó. A cor final do colete permanece proposta; manter preto/carvão como estudo neutro até aprovação.

Pele e músculos precisam permanecer legíveis entre o metal dos braços e o tecido. A mandíbula mecânica é um ponto focal, não um sorriso de dentes humanos simplesmente pintado de cinza.

### 12.3 Braços e marreta

Os dois braços têm articulações coerentes, mas não precisam ser cópias. Uma proposta é um braço de força com pistões mais evidentes e outro de controle da haste; qualquer assimetria precisa ser repetida em todos os clips.

A marreta tem cabeça pesada, haste, entrada de vapor, válvula e emissão que comunica carga. O centro de massa visual deve justificar preparação e recuperação. Não girar uma marreta gigantesca como se fosse um bastão leve.

### 12.4 Locomoção

Passos mais longos e menos frequentes que os de Nero, com transferência de peso. O corpo pode oscilar, mas os pés não deslizam no chão. O metal pode vibrar após a aterrissagem; a cartola não precisa balançar de forma cômica.

A sensação de 250 kg não é obtida aumentando a massa física real a ponto de quebrar colisões. Tratar a massa como direção de animação, som, reação e ataque. Os parâmetros do solver devem continuar estáveis.

### 12.5 Golpes como desenho de personagem

A preparação revela o tipo de ataque pela silhueta: haste recuada para varredura; cabeça elevada para impacto vertical; corpo comprimido para investida; válvulas e postura baixa para onda de pressão. A distinção precisa funcionar sem cor e sem som.

Após errar, o boss deve ter uma recuperação coerente com o peso. Não cortar imediatamente da marreta no chão para idle ereto. O jogador precisa reconhecer a oportunidade de contra-ataque.

### 12.6 Hurtbox e acessórios

Cartola, fumaça e grande parte da arma não são corpo vulnerável automaticamente. Hurtboxes devem representar regiões que o jogador entende como atingíveis. A marreta tem hitbox ofensiva separada. Braços não devem dar dano só por existirem perto de Nero, salvo ataque ativo claramente definido.

A largura física não deve aprisionar o jogador contra a parede sem saída. Na arena, prever espaço, empurrão controlado, escape e regras de sobreposição de esquiva.

### 12.7 Entregáveis

Turnaround; escala ao lado de Nero no mesmo piso; idle; caminhada; virada; quatro ataques fundamentais com preparação/execução/recuperação; dano leve; stagger; descarga; derrota técnica; sockets; mapa de hitboxes; direções; variações de vapor.

A derrota na arena não define morte canônica. Não escrever diálogo de execução ou ligação com o acidente. O boss pode terminar o teste em estado incapacitado, congelado ou concluído, conforme convenção técnica.

### 12.8 Aprovação

Altura correta sem contar cartola; braços e mandíbula presentes; roupa correta; arma legível; nenhum corte de sprite na extremidade do swing; todas as poses mantêm massa e anatomia; telegraphs distinguíveis; recuperação com peso; câmera mostra o espaço necessário para reagir.

[Voltar ao índice](#indice)

---


<a id="sec-13"></a>

## 13 · Filha de Nero e população: design, atuação e diversidade funcional

### 13.1 Filha de Nero

Produzir uma ficha própria antes da animação final. Nome, idade e altura exata permanecem pendentes. Não derivar automaticamente a criança reduzindo o sprite de um adulto: proporções, passada, gestos e ritmo são diferentes.

Entregáveis necessários para a abertura: idle na escola; reconhecer Nero; pequeno gesto de saudação; início da corrida; corrida; aproximação. Não há necessidade de sprite de colisão com o carro, dano ou morte visível. O evento termina em preto antes disso.

A roupa deve pertencer ao mesmo mundo, mas não parecer uma miniatura do mercenário. Um objeto escolar pode servir como detalhe de atuação, desde que tratado como proposta e consistente nos quadros.

### 13.2 Famílias de NPC

| Família | Silhueta e material | Atividade principal | Informação transmitida |
|---|---|---|---|
| Operário | Tecido grosso, botas, proteção parcial. | Voltar do turno, carregar material. | Trabalho e desgaste. |
| Mecânica | Ferramentas, avental curto ou roupa funcional. | Reparar uma válvula. | Competência e manutenção. |
| Comerciante | Camadas de roupa, bolso, avental. | Organizar banca e vender. | Economia cotidiana. |
| Guarda | Estrutura mais rígida e uniforme. | Patrulhar, observar, fiscalizar. | Controle institucional. |
| Morador idoso | Postura e ritmo próprios. | Sentar, conversar, observar. | Continuidade do bairro. |
| Responsável de aluno | Roupa comum, objeto pessoal. | Esperar perto da escola. | Rotina familiar. |
| Pessoa da elite | Corte mais limpo, tecido e acessórios cuidados. | Transitar pela avenida. | Desigualdade de recursos. |
| Crianças de fundo | Proporções próprias, atividade leve. | Brincar ou sair da escola. | Vida além da missão. |

Essas famílias são propostas de produção, não biografias fechadas. Variação não deve depender só de mudar a cor da camisa. Alterar altura dentro de limites, penteado, chapéu, postura, ferramentas e ritmo.

### 13.3 Animação por função

O comerciante precisa de uma ação de banca, não de um combo. O guarda precisa de patrulha, parada e orientação. A mecânica precisa de contato com a ferramenta e reação à máquina. Produzir o que aparece em cena, evitando listas enormes de clips nunca usados.

Uma mesma base pode ser reaproveitada com variações cuidadosas, mas não sincronizar todos os NPCs. Usar fases iniciais e pausas determinísticas diferentes para testes.

### 13.4 Atuação social

Criar pequenos grupos com relações espaciais: duas pessoas se olhando; um vendedor atrás da banca; alguém esperando uma porta; um guarda ocupando passagem. Distribuição aleatória uniforme parece povoamento automático.

Conversa de fundo pode ocorrer sem interface. Diálogo interativo deve ter foco e parada do interlocutor. Não fazer NPCs gritarem falas longas ao mesmo tempo.

### 13.5 Limites de simulação

NPCs fora da área ativa podem usar atualização reduzida ou estado resumido. Não precisam de pathfinding caro em toda a cidade. As rotas devem ser pequenas, seguras e compatíveis com o mapa.

Ao descarregar um trecho, persistir só o que importa: evento resolvido, diálogo único, posição relevante ou estado de uma interação. Não salvar cada partícula e cada passo de figurante.

### 13.6 Revisão de população

Verificar alinhamento ao chão, escala, direção de luz, perspectiva, contraste e densidade de pixels. Evitar NPC que parece pertencer a outro pacote de jogo. As principais pessoas do prólogo devem ter desenho autoral ou adaptação suficiente para se integrar à identidade.

[Voltar ao índice](#indice)

---


<a id="sec-14"></a>

## 14 · Pipeline de assets: do conceito ao recurso de produção

### 14.1 Estados de maturidade

| Estado | Significado | Pode ir ao build público? |
|---|---|---|
| CONCEPT | Exploração visual, sem compromisso técnico. | Não como arte final. |
| BLOCKOUT | Forma temporária para espaço e mecânica. | Apenas build técnico claramente identificado. |
| REVIEW | Integrável, mas exige revisão artística ou técnica. | Não como entrega artisticamente aprovada. |
| TECH_VALIDATED | Dimensões, alpha, pivô, carregamento e metadados conferidos. | Ainda depende da avaliação artística quando pertinente. |
| ART_APPROVED | Estilo e execução aprovados pelo responsável. | Sim, após validação de integração. |
| RELEASE_READY | Arte, licença, integração e orçamento verificados. | Sim. |

O agente pode comprovar validação técnica, mas não atribuir ao proprietário uma aprovação que não ocorreu. Material gerado anteriormente não herda aprovação por existir.

### 14.2 Estrutura lógica de produção

Manter originais, fontes editáveis, derivados e arquivos de runtime distinguíveis. Adaptar a estrutura às pastas existentes. Não copiar todo o acervo de referências para o diretório público.

Para cada asset, registrar ID estável, autor/origem, licença, uso pretendido, versão, dimensões, escala, transparência, pivô, variantes, dependências, status e responsável pela revisão.

### 14.3 Preparação de sprites

Limpar fundo sem apagar áreas claras legítimas. Não tratar branco como transparência universal. Conferir alpha em tabuleiro, fundo preto e fundo claro. Remover halos, textos de ficha e elementos gráficos externos.

Alinhar a mesma âncora física em todos os quadros. Preservar `sourceSize` e deslocamento do recorte se o atlas usa trim. Não recentralizar cada pose pela bounding box: isso cria saltos quando braço ou marreta se estendem.

### 14.4 Atlas e envelope

Calcular o envelope máximo da animação, incluindo arma e efeitos desenhados no sprite. Não escolher célula pequena apenas para economizar arquivo. Separar VFX em outra camada quando isso evitar células gigantes sem prejudicar sincronização.

O tamanho da célula não define o tamanho do personagem. Um frame com muito espaço vazio pode ter o corpo na escala correta. Se houver atlas empacotado, metadados devem manter posição original e pivot.

A exportação por CLI do Aseprite permite imagem e JSON; as opções e o formato devem ser compatíveis com o loader real. Usar ferramenta instalada legitimamente, não presumir licença ou disponibilidade. [[S12]](#fonte-s12)

### 14.5 Mapas editáveis

Quando o projeto usar Tiled, separar camadas visuais, objetos e colisão conforme o formato existente. Propriedades de objeto podem representar spawn, portal, interação, câmera e evento. Não usar o nome visual do NPC como única chave de persistência. [[S13]](#fonte-s13)

Não migrar todos os mapas para Tiled se já há um editor funcional. A exigência é conteúdo editável, dados validados e separação entre arte e comportamento.

### 14.6 Assets licenciados e autorais

O pipeline híbrido permanece: protagonistas, boss e marcos com identidade própria; componentes secundários licenciados e adaptados; efeitos programados onde isso faz sentido.

Um pacote gratuito não é automaticamente compatível em licença ou perspectiva. Um asset pago não é automaticamente bom para a cena. Verificar origem, permissões, exigências de crédito, redistribuição e modificações por item.

Não incorporar sprites extraídos de jogos comerciais, imagens promocionais ou músicas de referência. Não usar material protegido como base recortada para o build.

### 14.7 Ferramentas de revisão desejáveis

Visualizador de clips no projeto existente ou ferramenta leve: play/pause, frame a frame, velocidade, direção, fundo claro/escuro, pivô, sockets, collider, hurtbox e hitbox. Exibir estado real do asset.

Um exportador pode validar: arquivos presentes; chaves únicas; frames dentro da textura; duração positiva; links para sockets existentes; escala registrada; ausência de texto de ficha no atlas. Não chamar isso de aprovação artística automática.

### 14.8 Mudança de asset sem regressão

Antes de substituir textura, comparar nome, dimensões, recortes, orientação e eventos. Manter IDs de animação ou migrá-los explicitamente. Testar lado direito, esquerdo, chão, salto e ataque. Invalidar cache pelo processo de build, não pedir que o jogador limpe o navegador como solução permanente.

[Voltar ao índice](#indice)

---


<a id="sec-15"></a>

## 15 · Animação: regras de produção, sincronização e aprovação

### 15.1 Animação não é apenas quantidade de frames

Uma sequência boa combina poses claras, timing, espaçamento, contato, peso e continuidade. O número de quadros indicado nos catálogos é uma estimativa de produção. Não produzir frames quase idênticos para alcançar uma contagem.

Um tween que move uma imagem pode servir a um objeto rígido ou efeito, mas não substitui automaticamente uma corrida, soco ou recuperação de marreta. Uma ficha conceitual com poses variadas não é um ciclo de caminhada.

### 15.2 Três relógios

Distinguir tempo de simulação, tempo de apresentação e tempo de interface. Proposta: gameplay em passo estável equivalente a 60 Hz; animação artística com durações próprias; UI continua responsiva durante hitstop. Não adicionar um segundo loop fixo se a engine já possui um adequado.

Estados de ataque usam tempo de simulação e eventos definidos. A animação representa esse estado; não deixar o dano depender exclusivamente de um frame visual que pode ser pulado. O sistema precisa processar eventos cruzados entre o instante anterior e o atual, uma única vez.

### 15.3 Contrato de um clip

ID; personagem; direção; estado de uso; quadros; duração de cada quadro; loop; pivot; sockets; eventos; possibilidade de interrupção; relação com movimento físico; variante de qualidade; status de produção.

Um clip de ataque deve marcar preparação, contato, recuperação e saída. Clips de locomoção devem marcar contato dos pés. Clips de narrativa podem marcar olhar, gesto e ponto de sincronização, mas não escrever diretamente saves.

### 15.4 Eventos e prioridade

Eventos de apresentação: passo, vapor, tecido, brilho, rastro. Eventos de gameplay: abrir janela de dano, criar projétil, consumir munição, terminar invulnerabilidade. Ambos podem compartilhar uma timeline de ação, com handlers separados.

Não ter dois donos do mesmo evento — por exemplo, disparo gerado no input e novamente no frame da animação. Usar um ID de instância da ação e registro de eventos consumidos.

A documentação de notifies da Unreal mostra a ideia de eventos associados à animação; aqui a aplicação é conceitual, sem adotar Unreal nem depender de sua API. [[S14]](#fonte-s14)

### 15.5 Contato e deslocamento

Preferir movimento físico autoritativo. A animação acompanha velocidade e estado. Se um ataque desloca Nero, esse deslocamento deve passar por colisão. Não mover apenas o sprite para a frente e deixar a hurtbox atrás.

Pode haver offset visual de pequena amplitude para squash, recoil ou atuação, desde que documentado e sem mascarar o contato com o chão. Root motion desenhado precisa ser convertido de forma controlada, nunca somado duas vezes ao movimento.

### 15.6 Pé plantado e passada

Calibrar duração do ciclo à distância percorrida. Se o ciclo assume uma passada de 40 unidades e o personagem avança 80, haverá deslizamento. Ajustar playback de forma limitada ou produzir walk/run distintos; não acelerar um idle até virar corrida.

Na virada, preservar a posição dos pés ou incluir passo de ajuste. Trocar direção não pode deslocar o personagem por causa do recorte do PNG.

### 15.7 Impacto e recuperação

Nero responde rápido; a força é comunicada por compressão, extensão, som, reação e recuperação. Winsth pode antecipar mais porque o jogador precisa ler a ameaça. Não usar o mesmo timing para ambos.

Uma recuperação pode aceitar input em buffer sem interromper imediatamente a pose. Definir cancelamentos por ação, não permitir qualquer estado cortar qualquer outro.

### 15.8 Revisão de cada clip

Ver em velocidade normal e quadro a quadro; testar em ambos os sentidos; comparar silhueta; verificar arma/mão; medir altura neutra; observar pés; conferir eventos; testar transição de entrada e saída; executar com hitstop; pausar; trocar área; receber dano durante ação.

Não aprovar apenas em GIF isolado. A sequência precisa funcionar no fundo, na escala e no enquadramento reais. Animação que fica bonita ampliada mas ilegível a tamanho de jogo deve voltar para revisão.

[Voltar ao índice](#indice)

---


<a id="sec-16"></a>

## 16 · Catálogo de animações de Nero

As contagens abaixo são propostas de desenho por direção quando a assimetria exigir. “Frames” significa quadros visuais distintos planejados, não quadros já disponíveis. A duração mecânica dos ataques é definida em §22; distribuir os desenhos dentro dela sem alterar o comportamento acidentalmente.

### 16.1 Locomoção e atuação básica

| ID | Clip | Quadros iniciais | Direção de atuação e eventos |
|---|---|---:|---|
| N-01 | Idle neutro | 8–10 | Respiração discreta; peso estável; vapor raro em camada separada. |
| N-02 | Idle de conversa | 6–8 | Cabeça orientada; mão livre relaxa; sem repetição nervosa. |
| N-03 | Início de caminhada | 3–4 | Transferência de peso; resposta horizontal não espera o clip terminar. |
| N-04 | Caminhada | 10–12 | Contato, compressão, passagem e extensão; dois eventos de passo. |
| N-05 | Parada de caminhada | 3–5 | Pé de apoio coerente; roupa termina depois do corpo. |
| N-06 | Corrida | 10–12 | Inclinação moderada; braço pesado; sobretudo com atraso. |
| N-07 | Frenagem | 4–6 | Desaceleração visível; não deslizar como gelo em todo piso. |
| N-08 | Virada no solo | 3–5 | Giro com apoio; manter prótese no lado anatômico correto. |
| N-09 | Saída do chão | 3–4 | Impulso rápido; sem atrasar o pulo após input aceito. |
| N-10 | Subida | 3–5 | Pose compacta; roupa acompanha velocidade vertical. |
| N-11 | Ápice | 2–3 | Transição breve, sem flutuação artificial. |
| N-12 | Queda | 3–5 | Preparação para contato; arma permanece presa/coerente. |
| N-13 | Aterrissagem leve | 3–5 | Compressão pequena; controle recuperado conforme regra. |
| N-14 | Aterrissagem forte | 5–7 | Só em quedas adequadas; não usar toda vez. |
| N-15 | Esquiva terrestre | 6–8 | Silhueta clara; janela invulnerável definida no gameplay. |

### 16.2 Combate

| ID | Clip | Quadros iniciais | Direção de atuação e eventos |
|---|---|---:|---|
| N-16 | Soco 1 | 6–8 | Preparação curta, extensão, contato e recolhimento. |
| N-17 | Soco 2 | 7–9 | Mudar eixo/pose, não repetir o primeiro com cor diferente. |
| N-18 | Finalizador | 9–12 | Corpo participa; vapor no esforço; recuperação reconhecível. |
| N-19 | Preparar golpe pesado | 4–6 | Compressão do braço e pressão; não travar indefinidamente. |
| N-20 | Executar golpe pesado | 8–12 | Extensão forte, contato, contrapeso e retorno. |
| N-21 | Sacar revólver | 4–6 | Trajetória da mão ao coldre; socket acompanha. |
| N-22 | Mirar em pé | 3–5 | Leitura do cano; não oscilar a ponto de afetar direção. |
| N-23 | Disparar em pé | 4–6 | Flash no instante de emissão; recoil sem duplicar projétil. |
| N-24 | Disparar em movimento | 6–8 | Variante ou camada compatível; pernas continuam coerentes. |
| N-25 | Abrir tambor | 3–5 | Início da recarga; munição ainda não foi concedida. |
| N-26 | Inserir munição | 6–8 | Processo visual consistente com recarga atômica proposta. |
| N-27 | Fechar tambor/retornar | 3–5 | Commit de recarga no evento definido; entrada em pronto. |
| N-28 | Guardar revólver | 3–5 | Não desaparecer de uma mão sem transição. |
| N-29 | Dano leve | 3–5 | Direção do impacto, sem deslocar o collider arbitrariamente. |
| N-30 | Dano forte | 5–7 | Reação maior; evitar stun contínuo sem proteção. |
| N-31 | Derrota técnica | 8–12 | Arena de teste; sem função narrativa no prólogo. |

### 16.3 Interação e narrativa

| ID | Clip | Quadros iniciais | Uso |
|---|---|---:|---|
| N-32 | Acionar porta/alavanca | 6–8 | Mão em socket do objeto; acionar em evento, não no começo. |
| N-33 | Examinar | 5–7 | Leitura de objeto; não exigir animação longa para toda coleta. |
| N-34 | Ajustar braço | 6–8 | Pequena manutenção de idle/evento; sem valor de cura automático. |
| N-35 | Reconhecer a filha | 4–6 | Cabeça e torso mudam de atitude; abertura emocional. |
| N-36 | Gesto de acolhimento | 5–7 | Mão livre e postura; sem antecipar o acidente. |
| N-37 | Perceber perigo | 3–5 | Mudança rápida, cortada pelo preto antes do impacto. |

### 16.4 Pacotes de prioridade

**A — Controle e identidade:** N-01, 03–13, 16–18, 23, 29 e 32. Permite testar a qualidade principal.

**B — Abertura:** N-02, 05, 08, 34–37 e variantes necessárias de locomoção. Prioridade sobe quando a base estiver estável.

**C — Arena refinada:** esquiva, pesado, recarga completa, dano forte e derrota. O revólver não pode depender de uma recarga apenas textual para ser considerado artisticamente concluído.

Não produzir todos os clips de uma vez sem aprovar idle, caminhada e um ataque como padrão. Se esses três estiverem incoerentes, a inconsistência se multiplicará.

### 16.5 Cartão detalhado — caminhada

Objetivo: transmitir experiência e peso sem lentidão. Começar com contato esquerdo; compressão; passagem; contato direito; compressão; passagem. A prótese tem arco menor ou diferente do braço livre, conforme desenho. O sobretudo reage com atraso e não troca aleatoriamente de forma.

Critérios: ciclo fecha sem estalo; apoio compatível com chão; passo sincronizado; comprimento de passada compatível com velocidade; silhueta legível em ambos os sentidos. Reprovar se o corpo sobe e desce por recorte, se o bico muda de tamanho ou se a bota desliza persistentemente.

### 16.6 Cartão detalhado — soco 1

Preparação curta com retração do ombro; extensão do braço; punho atinge o envelope de ataque; reação do tecido e breve vapor; recolhimento. A hitbox acompanha a região atingida, não cobre um retângulo enorme durante a recuperação.

O soco precisa funcionar sem efeitos. Depois acrescentar faísca/impacto compatível com material, som e hitstop. Não usar um flash de tela para esconder que a mão nunca se moveu.

[Voltar ao índice](#indice)

---


<a id="sec-17"></a>

## 17 · Catálogo de animações de Winsth, NPCs e objetos

### 17.1 Winsth

| ID | Clip | Quadros iniciais | Direção e eventos |
|---|---|---:|---|
| W-01 | Idle pesado | 8–12 | Respiração, carga na perna, vibração mecânica localizada. |
| W-02 | Caminhada | 10–14 | Passos deliberados; marreta com inércia; som por contato. |
| W-03 | Virada | 5–7 | Reposicionar pés e arma; não espelhar instantaneamente em ataque. |
| W-04 | Observação/ameaça | 5–8 | Cabeça e mandíbula; uso com parcimônia. |
| W-05 | Preparar varredura | 6–8 | Haste recuada, linha horizontal legível. |
| W-06 | Varredura ativa | 4–6 | Arco amplo; hitbox varrida; movimento nítido. |
| W-07 | Recuperar varredura | 6–8 | Dissipar momento; abrir oportunidade. |
| W-08 | Erguer marreta | 8–12 | Trabalho de pernas, ombros e pistões. |
| W-09 | Impacto vertical | 4–6 | Contato no piso em evento único. |
| W-10 | Retirar marreta do chão | 7–10 | Recuperação pesada; sem dano residual invisível. |
| W-11 | Preparar investida | 5–7 | Comprimir corpo, anunciar direção. |
| W-12 | Investida | 6–8 em ciclo | Locomoção compatível com deslocamento físico. |
| W-13 | Frear investida | 6–8 | Parar antes/na parede conforme regra segura. |
| W-14 | Carregar pressão | 8–12 | Válvula e pose distinta; som crescente controlado. |
| W-15 | Liberar onda | 5–7 | Evento de emissão sincronizado; onda é entidade separada. |
| W-16 | Despressurizar | 6–10 | Recuperação, vapor sem ocultar Nero. |
| W-17 | Dano leve | 3–5 | Reação aditiva ou curta; não interromper qualquer ataque. |
| W-18 | Stagger | 7–10 | Desequilíbrio claro; cancelar hitbox ofensiva conforme regra. |
| W-19 | Recuperar stagger | 5–7 | Retorno com tempo de leitura. |
| W-20 | Derrota técnica | 12–18 | Encerrar dano/IA antes dos efeitos finais. |
| W-21 | Estado derrotado | 3–5 em loop opcional | Arena concluída; não define morte narrativa. |

A fase de enfurecimento é futura/experimental. Não produzir vinte ataques antes de aprovar quatro padrões básicos. A marreta não pode sair do atlas durante as poses W-06 ou W-09.

### 17.2 Cartão detalhado — impacto vertical

A preparação começa com flexão e levantamento. A cabeça da marreta deve ficar visível no enquadramento. O jogador recebe tempo para sair da área. No instante de contato, aplicar dano da área definida, som, poeira, partículas e câmera de forma coordenada.

Após o contato, não continuar causando o mesmo dano a cada frame. A marreta pode permanecer no chão como pose de recuperação sem hitbox ofensiva. Se uma onda secundária existir, é outro ataque identificado, com aviso e regra próprios.

### 17.3 Cartão detalhado — investida

Winsth anuncia direção e se compromete com ela por uma janela. Não rastrear Nero instantaneamente durante todo o deslocamento. O corpo e a marreta formam uma silhueta que indica a frente perigosa.

O deslocamento é resolvido pela física; atingir parede não o teletransporta. A frenagem oferece uma janela proporcional ao risco. Testar perto de cantos para garantir saída ao jogador.

### 17.4 NPCs

| Clip | Quadros iniciais | Observação |
|---|---:|---|
| Idle comum | 4–6 | Variar fase inicial; evitar todos respirando juntos. |
| Caminhada | 8–10 | Passo compatível com escala e velocidade. |
| Virada | 2–4 | Obrigatória quando a silhueta for assimétrica. |
| Conversa | 4–6 | Gestos discretos; não gesticular continuamente. |
| Trabalho com ferramenta | 6–10 | Contato real com máquina ou bancada. |
| Troca de mercadoria | 6–8 | Objeto mantém continuidade entre mãos. |
| Espera na escola | 4–6 | Postura calma, pequenos gestos. |
| Reação a evento | 4–6 | Olhar e pausa; não pânico genérico em todo efeito. |

### 17.5 Filha

Reconhecimento: 4–6 quadros; saudação: 4–6; início de corrida: 3–5; corrida: 8–12. Todas as contagens são propostas. O desenho deve ser revisto em contexto com Nero e a escola. Não produzir impacto corporal do acidente.

### 17.6 Objetos

Porta: fechada, destravando, abrindo, aberta e fechando quando aplicável; colisão sincronizada com passagem. Válvula: giro, alívio e estabilização. Máquina: operação, falha curta e repouso. Caixa quebrável: íntegra, impacto e fragmentos. Letreiro: movimento leve por vento, sem loop idêntico em todos os prédios.

Para elementos rígidos, animação por transformação pode ser adequada. A proibição é usar esse recurso para fingir articulação orgânica e peso que o asset não possui.

### 17.7 Pacote de entrega por sequência

Cada sequência deve vir com arquivo-fonte, exportação, metadados, prévia, escala, direção, eventos e status. Em revisão, registrar defeitos específicos: “pé direito deriva 3 pixels no contato” é útil; “melhorar animação” não é.

[Voltar ao índice](#indice)

---


<a id="sec-18"></a>

## 18 · Input, controles, modos e máquinas de estado

### 18.1 Ações, não teclas espalhadas

Criar ou aproveitar a camada de ações existente: mover, pular, interagir, atacar, disparar, recarregar, esquivar, pausar, confirmar, cancelar e avançar diálogo. Dispositivos produzem ações; gameplay não deve depender de dezenas de verificações diretas de uma tecla.

Proposta inicial, somente se não houver padrão funcional: A/D ou setas para andar; Espaço para pular; J para braço; K para revólver; R para recarregar; Shift para esquiva; E para interação; Esc para pausa. O layout precisa ser remapeável e apresentado conforme a configuração real.

### 18.2 Tipos de entrada

Distinguir pressionado neste instante, mantido, liberado e repetição de interface. Segurar J não deve gerar ataques infinitos se a regra é de pulsos; segurar confirmar não deve atravessar todos os diálogos. O revólver é semiautomático na proposta inicial.

Guardar buffers por ação, com instante, expiração e contexto. Ao abrir uma conversa, remover intenções de combate incompatíveis. Ao sair, exigir nova pressão para ações perigosas que estavam mantidas.

### 18.3 Estados ortogonais

Evitar uma única enumeração com combinações como “correndo_e_atirando_em_cutscene”. Organizar responsabilidades sem fragmentar a ordem de atualização:

| Eixo | Exemplos | Responsabilidade |
|---|---|---|
| Modo de controle | Exploração, diálogo, cutscene, pausa, menu, arena. | Quem recebe input e quais sistemas avançam. |
| Locomoção | Solo, subida, queda, aterrissagem, esquiva. | Movimento e contato. |
| Ação | Livre, melee, disparo, recarga, interação. | Timeline e compromisso da ação. |
| Condição | Normal, dano, invulnerável, stagger, derrotado. | Reação, bloqueios e vida. |
| Apresentação | Clip, direção, efeitos, offsets. | Representar estado sem tomar autoridade da física. |

Não é obrigatório criar uma classe por célula. É obrigatório tornar as precedências claras e testáveis.

### 18.4 Prioridades

Derrota e descarregamento cancelam ações e removem hitboxes. Pausa suspende a simulação sem perder contexto. Cutscene tem posse de controle até concluir ou abortar corretamente. Diálogo bloqueia combate e locomoção do interlocutor. Dano pode interromper ações conforme regra, nunca por um listener aleatório.

Uma ação não deve começar se outra a proíbe. O buffer pode preservar a intenção até a primeira janela válida, mas deve expirar. Não executar um soco dois segundos depois porque o jogador apertou durante uma fala.

### 18.5 Tokens de bloqueio

Quando houver mais de um sistema capaz de bloquear controles, usar posse identificável ou mecanismo equivalente: diálogo, pausa e cutscene não devem liberar o bloqueio um do outro. Evitar um único booleano global que qualquer componente redefine.

Ao fechar cena, destruir NPC ou cancelar cutscene, liberar apenas os recursos adquiridos por aquele sistema. Um `finally`/procedimento de limpeza deve restaurar câmera, input e áudio de forma idempotente.

### 18.6 Foco e dispositivos

Na perda de foco, zerar teclas mantidas e pausar conforme política. Na volta, não aplicar centenas de milissegundos de input acumulado. Desconexão do controle deve pausar ou oferecer fallback sem matar o jogador.

Menus precisam funcionar com teclado, mouse e controle quando suportado. Não depender de hover para confirmar. O mapeamento de botões deve aparecer correto para o dispositivo ativo e não piscar por ruído analógico.

### 18.7 Diagnóstico

Exibir no debug: modo, locomoção, ação, condição, input bruto, ações aceitas, buffers e bloqueadores ativos. Uma ação recusada deve ter motivo rastreável. Desativar esse painel no build normal.

### 18.8 Critério de aceite

Abrir e fechar diálogo repetidamente; manter direção ao conversar; pausar durante recarga; trocar foco durante salto; desconectar controle durante ataque; remapear tecla; iniciar cutscene com input mantido. Não pode haver ataque fantasma, movimento preso, avanço de texto em cascata ou controle perdido.

[Voltar ao índice](#indice)

---


<a id="sec-19"></a>

## 19 · Movimentação, chão, colisão e estabilidade física

### 19.1 Fonte única da posição

A física controla a posição de mundo do ator. O sprite é desenhado a partir dela e de offsets visuais explícitos. Não permitir que câmera, tween, animação e controller escrevam simultaneamente em `x/y` sem uma regra de autoridade.

Usar um referencial de pés: `(x, y)` representa o ponto no centro da base do corpo. Para o corpo em pé, o collider se estende para cima. A arte pode ultrapassar esse corpo por roupa, máscara, arma ou pose.

### 19.2 Convenção inicial de unidades

Proposta: 40 unidades lógicas por metro; Nero 72 unidades de altura corporal; Winsth 92. Arte-fonte anterior a 80 pixels por metro mantém 144/184 pixels, exibida a 0,5. Nenhum desses valores obriga alterar uma escala existente que já seja coerente.

Ao mudar a escala por fator `k`, converter posição, dimensões, velocidade e aceleração espacial por `k`; preservar tempos. Não apenas aumentar o PNG. Dano e duração não dependem de pixels.

### 19.3 Parâmetros iniciais — precisam de playtest

| Parâmetro | Proposta no referencial lógico | Intenção |
|---|---:|---|
| Caminhada | 140 unidades/s | Deslocamento confortável, sem espera artificial. |
| Corrida | 220 unidades/s | Diferenciar ritmo sem câmera brusca. |
| Aceleração no solo | 1.800 unidades/s² | Resposta rápida com pequeno peso. |
| Frenagem no solo | 2.200 unidades/s² | Parar previsivelmente. |
| Controle aéreo | 1.200 unidades/s² | Correção, não teletransporte lateral. |
| Gravidade | 1.500 unidades/s² | Arco compacto. |
| Impulso de salto | −510 unidades/s | Ápice aproximado de 0,34 s sem modificadores. |
| Queda terminal | 800 unidades/s | Limitar velocidades extremas. |
| Coyote time | 100 ms | Tolerância após sair da borda. |
| Buffer de salto | 120 ms | Aceitar pressão pouco antes do contato. |
| Corte de salto | Reduzir velocidade ascendente restante ao soltar | Pulo curto e longo distintos. |

Sem modificadores, `h = v²/(2g)` dá cerca de 86,7 unidades de altura máxima, aproximadamente 1,2 vezes a altura de Nero. Isso é uma previsão física simplificada, não resultado medido. O arco real depende do corte de salto e da implementação.

### 19.4 Coyote e buffer sem salto infinito

O coyote é renovado por contato válido, não por qualquer overlap próximo do chão. Após usar o salto, consumir o buffer e a tolerância. Não reabrir o coyote durante a subida porque os pés ainda tocam a plataforma por um frame.

O buffer de salto deve ser consumido uma vez. Apertar antes de aterrissar pode iniciar salto no primeiro instante elegível; segurar não deve produzir saltos repetidos sem regra explícita. A referência publicada de Celeste evidencia a separação entre intenção recente e elegibilidade de contato. [[S01]](#fonte-s01)

### 19.5 Chão e pés

Para cada frame neutro, medir ponto dos pés na imagem e transformação até o mundo. Conferir topo da superfície física e linha visual de apoio. O erro aceitável proposto é até um pixel lógico em posição estática, sem oscilação persistente; revisar a tolerância conforme a escala real.

Sombra de contato melhora leitura, mas não corrige pivô errado. Ground snap, se usado, deve operar apenas dentro de tolerância pequena e durante descida elegível. Não puxar o personagem para o chão no meio do salto.

### 19.6 Colisores

Proposta de partida para Nero: corpo de colisão menor que a silhueta, aproximadamente 26×66 unidades lógicas, ancorado nos pés. Isso não é uma medida definitiva do desenho. Hurtbox pode diferir, mas precisa ser justa.

Para Winsth, largura maior e altura coerente, sem incluir cartola e marreta. Não atualizar tamanho do collider a cada pose de braço. Mudanças de collider por esquiva ou agachamento exigem teste de expansão sob teto.

Arcade Physics trabalha com formas simples e tem limitações próprias. Não exigir polígonos articulados se o projeto usa Arcade; resolver o necessário com corpos e queries adequados. Não misturar corpos Arcade/Matter esperando interação automática. [[S09]](#fonte-s09)

### 19.7 Plataformas atravessáveis

Colidir apenas quando os pés estavam acima da superfície e o personagem desce. Permitir passagem por baixo. Se houver comando de descer, ignorar temporariamente somente a plataforma pertinente até sair de sua região, não todos os pisos do mundo.

Na abertura, usar poucas plataformas; não transformar a caminhada em curso de precisão. Testar quinas, encontro de tiles, bordas de colisão e tetos baixos.

### 19.8 Passo temporal

Aproveitar o loop da engine. Se houver integração customizada, definir passo, limite de substeps e tratamento de atraso. Não compensar uma aba oculta simulando minutos em um frame.

Movimento em 30, 60 e 120/144 Hz deve produzir trajetórias comparáveis dentro da tolerância definida. Isso não significa garantir determinismo bit a bit entre navegadores. Testar os invariantes que importam: alcance, contato, consumo de input e eventos.

### 19.9 Ordem recomendada

Amostra de input → resolução do modo → buffers → estado/ação → intenções de movimento → simulação/colisão → contatos → eventos de combate → atualização de apresentação → câmera → renderização. Adaptar à ordem da engine sem executar física duas vezes.

### 19.10 Aceite

Parado por 30 segundos sem afundar ou subir; caminhar sobre emendas sem prender; pular antes/depois da borda; aterrissar com buffer; inverter direção; bater no teto; trocar clip; receber knockback perto de parede; repetir em diferentes taxas. Registrar vídeo com debug e sem debug.

[Voltar ao índice](#indice)

---


<a id="sec-20"></a>

## 20 · Câmera contínua, enquadramento e pixel art estável

### 20.1 Um proprietário da câmera

Exploração, diálogo, arena e cutscene solicitam modos a um controlador, ou estrutura equivalente já existente. Não deixar cada trigger chamar pan/follow independentemente. O modo de maior prioridade controla o enquadramento e devolve a posse ao terminar.

Phaser oferece follow, deadzone e limites; a assinatura concreta deve ser conferida na versão instalada. A existência dessas APIs não garante boa configuração. [[S08]](#fonte-s08)

### 20.2 Exploração

Acompanhar Nero continuamente com pequena área de liberdade. O alvo é derivado da posição física, não do recorte do sprite. O horizonte deve permanecer estável durante pequenos movimentos de idle.

Proposta inicial em viewport lógico de 640×360: deadzone horizontal de 80–120 unidades; antecipação de 35–60; resposta horizontal de 0,12–0,20 s; resposta vertical mais contida. São valores de calibração, não constantes universais.

A antecipação deve mudar suavemente quando a direção se estabiliza; não saltar ao alternar A/D por um instante. Na borda do mapa, limitar a câmera sem empurrar o personagem.

### 20.3 Suavização independente da taxa de renderização

Se for necessário implementar interpolação temporal, usar um fator dependente de `dt`, por exemplo `alpha = 1 − exp(−dt/τ)`, em vez de aplicar uma porcentagem fixa sem relação com o tempo. Não empilhar essa suavização com outra da engine sem medir o atraso resultante.

Em teleporte ou troca de área, reinicializar o estado de suavização para o novo ponto quando apropriado. Caso contrário, a câmera pode atravessar regiões inexistentes.

### 20.4 Movimento vertical

Não seguir cada oscilação dos pés. Definir zonas de aterrissagem, diferença de nível e intenção de salto. A câmera não precisa acompanhar o ápice integralmente se isso esconder o destino.

Quando houver queda, mostrar o espaço para aterrissar sem movimentação agressiva. Na abertura, evitar plataformas que exijam enquadramentos complexos antes da base estar refinada.

### 20.5 Pixel snapping

A física pode usar valores fracionários. O renderer deve aplicar uma política consistente de quantização. Arredondar corpo, câmera, parallax e escala CSS separadamente pode produzir tremor relativo.

Testar uma linha vertical do cenário e o pé de Nero durante caminhada lenta. A decisão de arredondar a transformação final ou usar outra estratégia precisa ser coerente em todas as camadas. Não prometer perfeição apenas ativando `roundPixels`.

### 20.6 Arena

Enquadrar a relação entre Nero e Winsth, não obrigatoriamente o centro geométrico exato. Considerar a direção de ataque e espaço de fuga. Não usar zoom que faça sprites mudarem continuamente de densidade de pixel.

Proposta inicial: câmera com bounds da arena e follow moderado no jogador, garantindo telegraphs visíveis. Zoom dinâmico só se demonstrar benefício. Nenhum ataque importante pode começar fora da tela sem sinal claro e regra justa.

### 20.7 Diálogo e cutscene

Diálogo mantém enquadramento estável e pode recentralizar suavemente os interlocutores, sem ocultar o texto. Cutscene possui plano e tempo definidos. Ao terminar, devolver follow sem snap inesperado.

Tremer a câmera não deve mover UI, modificar colisão ou alterar hitboxes. Redução de movimento deve poder eliminar tremor e oscilações não essenciais.

### 20.8 Redimensionamento

Recalcular viewport, bounds e safe areas preservando a posição do jogador. Não usar a largura da janela como tamanho do mundo. Testar 16:9, 16:10 e janela estreita, com letterbox quando necessário para não distorcer o jogo.

### 20.9 Aceite

Caminhar nos dois sentidos por várias telas; parar; inverter direção; saltar; entrar/sair de diálogo; chegar aos limites; reiniciar; redimensionar; entrar na arena. Não haver troca de quadro, teletransporte visual, fundo vazio, tremor de um pixel constante ou retorno bloqueado.

[Voltar ao índice](#indice)

---


<a id="sec-21"></a>

## 21 · Combate: arquitetura, tempo, colisão e justiça

### 21.1 Entidades distintas

**Collider:** contato físico com o mundo.

**Hurtbox:** região que recebe dano.

**Hitbox:** região ofensiva ativa em uma ação.

**Ataque:** instância temporal com dono, equipe, direção, dano, regras e eventos.

**Efeito:** representação visual/sonora, sem autoridade independente para causar dano.

Não tornar o sprite inteiro uma hitbox. Não permitir que uma partícula de faísca cause dano por compartilhar um grupo de colisão incorreto.

### 21.2 Timeline

Cada ação tem preparação, janela ativa e recuperação. O input cria uma intenção; a máquina de ações decide quando começar; a instância progride; eventos são consumidos uma vez; a apresentação acompanha.

Representar janelas como intervalos bem definidos, preferencialmente `[início, fim)`. Se o passo temporal cruza uma janela inteira, ainda é preciso resolver o evento; não depender de igualdade exata com um timestamp.

### 21.3 Dano único e multi-hit

Uma instância comum mantém registro dos alvos atingidos. Enquanto houver overlap por vários frames, o alvo recebe um hit, não dezenas. Um ataque multi-hit deve declarar intervalos e número máximo explicitamente.

Usar identificador da instância, não somente nome do clip. Repetir o mesmo golpe depois deve permitir novo dano. No pooling, limpar registros antigos antes de reusar a entidade.

### 21.4 Alcance e orientação

Hitboxes são descritas em coordenadas locais relativas ao ator, com transformação por direção e posição. Para um retângulo local com `x` e largura `w`, o espelhamento horizontal precisa considerar ambas, não apenas negar `x`.

Ataques rápidos exigem considerar a área percorrida entre posições. Projéteis não podem atravessar alvos por avançar mais que sua largura em um tick. Usar sweep, raycast ou subpassos conforme a engine, sem duplicar resolução.

### 21.5 Política de acerto

Validar dono, equipe, alvo vivo, janela ativa, invulnerabilidade e registro de hit antes de aplicar dano. Um evento aceito produz alteração de vida, reação, efeitos e log de debug. Não calcular dano em dois callbacks independentes.

A invulnerabilidade após dano não é igual à esquiva. Tornar a diferença visível de forma discreta e acessível. Não criar invulnerabilidade permanente quando uma animação é interrompida.

### 21.6 Hitstop

Proposta: pausa local curta de 45–70 ms para golpes comuns e 70–95 ms para impactos fortes, calibrada em jogo. Não empilhar indefinidamente pausas de vários alvos.

Durante hitstop, UI e leitura de input continuam; o buffer de combate deve ter política explícita de expiração. Proposta: preservar a intenção pelo tempo de gameplay congelado, com limite total para evitar armazenamento indefinido. Física, animação de impacto e câmera precisam de domínios de tempo consistentes.

Hitstop não é queda de FPS. Não usar processamento pesado ou timeout bloqueante para simular impacto.

### 21.7 Reações e knockback

Aplicar impulso pela física, respeitando paredes e chão. O alvo pode ter resistência a stagger, mas não ignorar todo feedback. Winsth pode reagir visualmente sem interromper cada ataque.

Não empurrar Nero para dentro de geometria. Em cantos, limitar deslocamento e garantir recuperação. Após um dano, oferecer invulnerabilidade suficiente para não encadear hits involuntários da mesma ameaça.

### 21.8 Cancelamentos

Definir por ação: movimento permitido, mudança de direção, salto, esquiva, disparo e combo. Não permitir cancelamento universal que remove qualquer compromisso; não bloquear tudo a ponto de perder responsividade.

Preparações curtas de Nero respondem imediatamente; recuperação pode aceitar buffer. Ataques fortes possuem risco maior. A tabela em §22 é o ponto de partida, não um conjunto de verdades imutáveis.

### 21.9 Leitura e justiça

Um ataque precisa de intenção visual, som complementar, área coerente e janela de resposta. Cor não pode ser o único aviso. Efeitos de impacto aparecem após o contato, não obscurecem o telegraph.

Abertura sem combate obrigatório. O sistema de combate é produzido e testado em arena separada, com controles e contexto identificados. Não permitir que a existência do sistema destrua a narrativa cotidiana do prólogo.

### 21.10 Critérios de aceite

Um hit por alvo por instância; miss não causa dano; ataque à esquerda corresponde à arte; pausa e recarga não duplicam eventos; morte cancela ofensiva; projéteis não atravessam paredes; dano e pose coincidem; o jogador consegue explicar por que foi atingido.

[Voltar ao índice](#indice)

---


<a id="sec-22"></a>

## 22 · Nero: golpes, revólver, esquiva e parâmetros de balanceamento

Todos os números são propostas de calibração para a arena, não resultados de playtest. Centralizar no sistema de dados existente; não duplicar constantes entre animação, IA e interface.

### 22.1 Kit inicial

| Ação | Preparação | Ativo | Recuperação | Dano base | Papel |
|---|---:|---:|---:|---:|---|
| Soco 1 | 100 ms | 80 ms | 200 ms | 14 | Entrada rápida e segura a curta distância. |
| Soco 2 | 130 ms | 90 ms | 210 ms | 18 | Continuidade com deslocamento pequeno. |
| Finalizador | 230 ms | 100 ms | 350 ms | 28 | Compromisso maior e reação forte. |
| Golpe pesado | 450 ms | 100 ms | 450 ms | 42 | Punir recuperação longa. |
| Disparo | 60 ms até emissão | Evento único | 260 ms após emissão | 18 | Alcance, precisão e custo de munição. |
| Esquiva | Início imediato | Invulnerável entre 80–210 ms | Termina aos 300 ms | — | Reposicionamento com compromisso. |

O combo completo entrega 60 de dano base antes de resistências propostas. Vida inicial de Nero: 100. Vida inicial de Winsth: 720. Esses números servem a comparação e ajuste; não são compromisso de duração de combate.

### 22.2 Combo

Soco 1 pode aceitar intenção do Soco 2 durante a parte final da ação; Soco 2 pode aceitar finalizador. O próximo golpe só começa na janela de encadeamento definida. Uma pressão não deve consumir dois estágios.

Proposta de buffer: 120 ms, com pequeno ajuste durante hitstop conforme §21. Se não houver próximo input, voltar ao estado livre. Após o finalizador, não reiniciar automaticamente sem nova intenção válida.

### 22.3 Alcance e deslocamento

Medir alcance em relação à altura lógica de Nero. Proposta: Soco 1 aproximadamente 0,55–0,70 H além do centro; Soco 2 0,65–0,80 H; finalizador até 0,90 H, se a pose justificar. O alcance não pode exceder claramente a mão/efeito legível.

Avanço físico pequeno pode acompanhar o golpe, sempre com colisão. Não mover vários metros para compensar um sprite sem extensão. Em contato com parede, o soco continua sem empurrar Nero através dela.

### 22.4 Cancelamentos iniciais

| Estado | Movimento | Virada | Próximo melee | Disparo | Esquiva |
|---|---|---|---|---|---|
| Livre | Completo | Sim | Sim | Sim | Sim |
| Preparação leve | Reduzido | Só antes do compromisso | Buffer | Não | Janela inicial, se aprovada |
| Ativo melee | Limitado | Não | Buffer | Não | Não |
| Recuperação leve | Recupera gradualmente | Após janela | Janela de combo | Após recuperação mínima | Após recuperação mínima |
| Pesado ativo | Restrito | Não | Não | Não | Não |
| Disparo | Movimento reduzido ou variante | Antes da emissão | Após compromisso | Próxima pressão após término | Após emissão e pequena recuperação |
| Recarga | Movimento permitido, conforme clip | Sim | Cancela com regra explícita | Não até commit | Cancela com regra explícita |

Se o sistema atual já possui uma solução melhor, manter e documentar. O objetivo é consistência, não cumprir uma tabela contra o game feel.

### 22.5 Revólver

Proposta: tambor de seis tiros; reserva inicial de 24 na arena normal; modo de treino pode ter reserva infinita claramente identificada. Munição é consumida no evento de emissão, não ao apertar a tecla se a ação foi bloqueada.

Projétil de referência: 900 unidades/s, vida de 0,9 s, colisão varrida, dono e equipe definidos. O alcance resultante é aproximadamente 810 unidades antes de colisão. Pode-se optar por hitscan com traço visual se o jogo existente usa esse modelo e ele se mostrar melhor; não misturar os dois causando dano duplicado.

O projétil nasce no socket do cano. Testar junto a parede e com o cano do outro lado do collider: não permitir atirar através do obstáculo por spawn externo à superfície.

### 22.6 Recarga

Proposta inicial atômica de 1.300 ms, com transferência de munição aos 1.050 ms e fechamento visual até o término. Interrupção antes do commit não concede balas; depois do commit preserva a transferência já efetuada. Não duplicar a operação ao retomar.

A animação deve representar esse contrato. Recarga cartucho a cartucho é uma alternativa futura, não combinar as duas lógicas. Munição nunca fica negativa e reserva nunca aumenta por cancelar.

### 22.7 Esquiva

Proposta: deslocamento a 420 unidades/s durante parte dos 300 ms, ajustado para não atravessar paredes; cooldown de 650 ms desde o início. Invulnerabilidade apenas na janela indicada, não durante toda a ação.

Não conceder esquiva no prólogo se isso prejudicar a atuação cotidiana. Sua disponibilidade pode ser específica da arena. A acessibilidade pode ampliar tolerâncias sem mudar silenciosamente o modo padrão.

### 22.8 Braço a vapor

Vapor curto na extensão e na descarga, movimento dos pistões e som mecânico reforçam identidade. Não criar imediatamente um segundo recurso de calor/pressão que complique HUD e balanceamento.

Uma barra de pressão pode ser estudada depois, se produzir decisões interessantes. O kit inicial precisa ser divertido sem ela. Não adicionar superaquecimento que interrompe Nero aleatoriamente ou obriga esperar parado.

### 22.9 Feedback por material

Carne/tecido: impacto grave e reação, sem obrigatoriedade de gore. Metal: faísca curta, som mais agudo e vibração. Pedra: poeira e fragmentos localizados. Madeira: lascas e ruído seco. Ar: whoosh sem falsa faísca de contato.

O revólver precisa de flash, recoil, som e resposta no alvo. Não usar tremor forte em cada bala a ponto de atrapalhar a mira.

### 22.10 Critério de diversão

Testar alternância melee/tiro, combo interrompido, munição baixa, recarga sob pressão, pesado após erro do boss e esquiva junto à parede. Nenhuma ação deve ser sempre melhor em todas as distâncias. Ajustar pela experiência observada, não apenas por dano por segundo.

[Voltar ao índice](#indice)

---


<a id="sec-23"></a>

## 23 · Winsth: encontro, IA, telegraphs e arena

### 23.1 Escopo narrativo

O encontro existe como arena de desenvolvimento selecionável no modo técnico. Não inserir Winsth entre Nero e a escola nem criar um capítulo posterior para justificá-lo. O roteiro futuro decidirá quando a luta ocorre.

### 23.2 Objetivo do combate

Ensinar a ler massa e pressão: observar preparação, evitar área perigosa, aproveitar recuperação e alternar curta/longa distância. O boss deve ser ameaçador por espaço e compromisso, não por velocidade impossível de perceber.

### 23.3 Quatro ataques fundamentais

| Ataque | Preparação | Ação | Recuperação | Dano inicial | Resposta esperada |
|---|---:|---:|---:|---:|---|
| Varredura | 650 ms | 160 ms | 650 ms | 22 | Sair do alcance ou esquivar na janela correta. |
| Impacto vertical | 900 ms | 120 ms | 900 ms | 30 | Reposicionar antes do contato; punir retirada da marreta. |
| Investida | 700 ms | Até 650 ms | 700 ms | 24 | Ler direção, escapar e punir frenagem. |
| Onda de pressão | 1.000 ms | Emissão única | 900 ms | 18 | Ler válvula e saltar/evitar onda baixa conforme implementação. |

São valores iniciais. A janela ativa da onda pertence à entidade emitida, não à pose de Winsth. Proposta: onda de 24 unidades de altura, velocidade 250 unidades/s e vida de até 2 s, limitada por colisão e arena. Garantir que o salto disponível a supera de maneira confiável.

### 23.4 Estados

Observação → aproximação → decisão → preparação → execução → recuperação → decisão. Dano leve pode ocorrer sem trocar de estado. Stagger e derrota têm regras próprias. Não usar um timer solto que inicia outro ataque durante recuperação.

Na derrota: desativar hitboxes; parar decisões; cancelar emissões futuras; encerrar projéteis perigosos conforme política; tocar apresentação; marcar conclusão da arena uma vez. Não deixar uma onda matar Nero após a vitória por acidente de implementação.

### 23.5 Escolha de ataque

Filtrar por distância, espaço disponível, cooldown, último ataque e estado do jogador. Escolher entre opções válidas com pesos reproduzíveis em testes. Não usar aleatoriedade irrestrita que gere dez investidas seguidas.

Proposta: evitar repetição imediata quando houver outra ação válida; garantir uma pequena pausa global após recuperação; aproximar quando fora de alcance; não teleportar. Se não há espaço para investir com segurança, selecionar outro padrão.

### 23.6 Compromisso de direção

Durante a preparação inicial, Winsth pode orientar-se para Nero. Após um ponto de compromisso visível, fixa a direção. Não perseguir a posição do jogador a cada frame durante um swing já iniciado.

A versão assistida pode ampliar preparação; a versão padrão deve ser justa sem assistência. Velocidade adicional em dificuldade maior não pode eliminar o telegraph.

### 23.7 Resistência a stagger

Proposta: impactos leves produzem feedback, mas não cancelam todos os ataques. Golpes fortes em recuperação podem acumular postura até um stagger limitado. Implementar apenas depois dos quatro padrões funcionarem; não esconder imunidade total atrás de ausência de animação.

Se a postura for adicionada, documentar ganho, recuperação, limiar e cooldown. Não permitir stunlock infinito nem recuperação instantânea sem sinal.

### 23.8 Arena

Espaço lateral suficiente para reconhecer e evitar investida; piso legível; sem cenário na frente dos telegraphs; limites visuais; dois ou três marcos que ajudem distância; background industrial com baixo contraste durante ação.

Proposta de tema: área de manutenção com fornalha, passarela e tubulações. Isso é um estudo visual, não local narrativo definitivo. Hazards de cenário ficam desativados na primeira versão para isolar a qualidade do boss.

### 23.9 Reset e ferramentas

Reiniciar reposiciona ambos, restaura vida e munição, remove projéteis, hitboxes, efeitos e timers, reseta RNG quando solicitado e devolve câmera. Permitir selecionar um ataque para teste repetido, sem habilitar essas opções no fluxo normal.

Exibir debug de estado, cooldown, ataque escolhido e motivo de exclusão. Um ataque cancelado deve remover a região ofensiva imediatamente conforme o contrato.

### 23.10 Playtest

Testar cada padrão isoladamente; depois pares; depois seleção completa. Jogar perto das paredes, atrás do boss, em salto, recarregando e com pouca vida. Avaliar se existe ao menos uma resposta confiável para cada ataque com o kit disponível.

Duração sugerida da luta refinada: aproximadamente 60–150 segundos para jogador familiarizado, a medir. Não aumentar HP apenas para alongar um encontro repetitivo. Se a luta é tediosa, rever decisões, espaço, oportunidades e feedback.

[Voltar ao índice](#indice)

---


<a id="sec-24"></a>

## 24 · Inimigos de apoio, alvos de treino e dificuldade

### 24.1 Não avançar a história

Inimigos podem ser preparados para testar o combate sem serem colocados na caminhada até a escola. Usar arena de treino, galerias técnicas ou cenas já existentes. Não inventar emboscadas no prólogo para justificar sistemas.

### 24.2 Três arquétipos de teste propostos

**Alvo passivo:** corpo, hurtbox, material e reação. Serve para calibrar dano, impacto, alcance e arma. Pode ser um boneco industrial claramente técnico.

**Adversário de curto alcance:** aproxima, anuncia um golpe, executa e recupera. Valida leitura, esquiva e interrupção sem a complexidade do boss.

**Adversário de distância:** posiciona, prepara disparo, emite projétil e recarrega. Valida obstáculos, som, previsibilidade e prioridade de ameaças.

A aparência e a inserção narrativa desses adversários continuam abertas. Não desenhar soldados de uma facção definitiva sem aprovação.

### 24.3 Contrato de IA simples

Percepção → intenção → ação. Limitar decisões caras a frequência adequada, sem atualizar pathfinding de todos os atores em cada frame. Distância e linha de visão devem usar o mesmo mundo físico do jogador.

Ataques têm cooldown e não começam durante derrota ou transição. O inimigo não deve ler diretamente a tecla do jogador para reagir antes da ação visível. Uma IA injusta pode parecer “difícil”, mas reduz confiança.

### 24.4 Coordenação

Quando houver mais de um adversário, limitar ataques simultâneos perigosos. Não é necessário um grande diretor de combate para a arena inicial; uma regra simples de orçamento de ameaças pode bastar.

Evitar projéteis fora da tela sem aviso, empilhamento de corpos que prende Nero e múltiplos hits no mesmo instante sem chance de reação. A dificuldade deve surgir de decisões, não de ruído.

### 24.5 Dificuldade e assistência

Preservar um modo padrão calibrado. Assistências podem alterar dano recebido, duração de telegraph, velocidade do jogo em combate ou janela de esquiva, com descrição clara. Não esconder alterações e não invalidar a história por usar assistência.

Abertura narrativa não precisa de dificuldade. Não obrigar o jogador a vencer uma arena para terminar o prólogo.

### 24.6 Recompensas e progressão

Não inventar economia completa. Arena pode mostrar estatísticas técnicas e reinício. Futuramente, habilidades e recompensas devem ser desenhadas a partir de exploração, mas isso não faz parte do cânone implementável agora.

### 24.7 Critérios de qualidade

Todo inimigo precisa de motivo, leitura, resposta e papel. Se dois inimigos diferem só em HP e cor, não contam como variedade significativa. Melhor um arquétipo refinado do que cinco com animação quebrada.

[Voltar ao índice](#indice)

---


<a id="sec-25"></a>

## 25 · Interações, diálogos e rotinas que não quebram o controle

### 25.1 Seleção de interlocutor

Usar distância, direção, visibilidade e prioridade para escolher um alvo de interação. Exibir um único prompt por vez. Se dois NPCs estiverem próximos, a escolha precisa ser estável e previsível, não alternar a cada frame.

Não iniciar conversa através de parede. O raio de interação deve ser configurável e relacionado à escala. O prompt não pode sair da tela nem cobrir o rosto de Nero.

### 25.2 Início como operação consistente

Ao aceitar a interação: validar alvo; obter bloqueio de diálogo; encerrar intenções incompatíveis; zerar movimento horizontal de Nero; suspender a rotina do NPC; orientar os interlocutores; abrir a interface; registrar contexto de retorno.

Fazer isso de forma atômica ou com rollback equivalente. Se o NPC desaparecer entre a seleção e a abertura, cancelar sem deixar Nero preso. Não suspender a física de todo o mundo apenas para interromper uma conversa.

### 25.3 Enquanto conversam

Nero e interlocutor ficam estáveis, mas gravidade/contato podem continuar se necessários para manter o chão. Iniciar diálogo no ar deve ser recusado ou aguardar aterrissagem segundo regra explícita; nunca congelar o personagem flutuando.

NPCs distantes, vapor, máquinas e ambiente podem continuar. O interlocutor não continua sua rota sob uma animação de conversa. Seus timers de rotina precisam ser pausados ou retomados de forma controlada.

### 25.4 Avanço e encerramento

Uma pressão revela o restante da fala, se houver efeito de escrita; a próxima avança. Não consumir o mesmo evento que abriu a conversa para pular a primeira frase. Prever velocidade instantânea do texto.

Ao encerrar: fechar UI; liberar bloqueios próprios; limpar input residual; restaurar rotina do NPC em ponto seguro; devolver câmera; retornar ao modo correto. Sair de diálogo durante pausa não deve despausar o jogo indevidamente.

### 25.5 Interrupções

Descarregamento de área, reinício, perda do NPC, início de cutscene e erro de conteúdo devem possuir caminho de limpeza. Um diálogo sem próxima fala deve encerrar graciosamente com log de desenvolvimento, não causar tela presa.

Não guardar referências a entidades destruídas em um singleton global. Remover listeners e callbacks ao terminar. Reabrir a mesma conversa dez vezes não pode multiplicar sons ou avanços.

### 25.6 Rotinas leves

Uma rotina pode ser uma sequência de locais e ações: caminhar até banca → trabalhar → olhar rua → pausa → repetir. Interações suspendem a rotina; ao voltar, retomar ou escolher uma ação segura.

Usar rotas que não atravessem portas fechadas, mesas ou Nero de maneira grosseira. NPCs podem ter colisão simplificada ou passagem controlada, mas não devem empurrar o jogador para fora do chão.

### 25.7 Eventos de rua

Um guarda interrompe um vendedor; uma mecânica alivia pressão; um veículo passa ao fundo; uma porta se abre e uma pessoa sai. Cada evento tem trigger, estados, participantes, duração, condições de repetição e resultado.

Eventos espontâneos não podem bloquear toda a cidade se o jogador os ignorar. Ao voltar, distinguir evento único de rotina. Não repetir a mesma discussão a cada cinco metros.

### 25.8 Conteúdo de conversa proposto

| ID | Situação | Função | Limite editorial |
|---|---|---|---|
| DLG-OP-01 | Trabalhador no início | Introduzir rotina e cansaço. | Não narrar toda a política. |
| DLG-OP-02 | Mecânica e tubulação | Mostrar tecnologia funcional. | Não conceder habilidade nova. |
| DLG-ME-01 | Comerciante | Relação cotidiana e taxas. | Não criar missão obrigatória. |
| DLG-ME-02 | Conversa de fundo | Contraste social. | Não interromper o controle. |
| DLG-AV-01 | Morador observando avenida | Propaganda versus realidade. | Evitar slogan longo. |
| DLG-ES-01 | Responsável na escola | Normalidade e afeto. | Não anunciar a tragédia. |

Falas são localizáveis e possuem IDs estáveis. Nomes funcionais podem aparecer como “Comerciante” ou “Mecânica” até aprovação de personagens próprios.

### 25.9 Objetos

Porta: feedback de ação, animação, colisão sincronizada, estado persistente e passagem reversível. Alavanca: uso único ou alternável declarado. Objeto quebrável: vida ou hit único, material, fragmentos sem colisão cara e flag de destruição.

Um objeto de decoração não deve parecer interativo sem responder. Um objeto interativo precisa ser legível sem destacar tudo com contorno brilhante.

### 25.10 Aceite

Conversar segurando movimento; abrir com vários NPCs próximos; sair rapidamente; repetir; pausar; mudar foco; reiniciar; conversar perto de porta; destruir alvo em teste; voltar à área. Nero e NPC param, os controles voltam e nenhuma rotina se multiplica.

[Voltar ao índice](#indice)

---


<a id="sec-26"></a>

## 26 · Efeitos visuais, clima e interatividade ambiental

### 26.1 Direção de efeitos

Efeitos reforçam matéria, energia, espaço e impacto. Não são maquiagem para esconder arte fraca. A cena precisa continuar compreensível com partículas desligadas.

Separar efeitos de gameplay de efeitos decorativos. A onda de Winsth precisa permanecer visível em qualidade baixa; faíscas ambientais podem reduzir. Não permitir que “baixo” retire avisos de ataques.

### 26.2 Catálogo de VFX

| ID | Efeito | Forma e timing | Gatilho e restrição |
|---|---|---|---|
| FX-01 | Vapor do braço | Jato curto, expansão e dissipação. | Ataque forte/manutenção; não contínuo. |
| FX-02 | Vapor de tubulação | Emissão localizada com vento. | Ciclo regional; respeitar profundidade. |
| FX-03 | Fumaça de chaminé | Massas lentas, baixa frequência. | Fundo; sem competir com personagens. |
| FX-04 | Névoa de rua | Faixas/volumes 2D suaves ou pixelados coerentes. | Entre planos; limitar opacidade. |
| FX-05 | Faísca elétrica/mecânica | Trajetória curta, brilho rápido. | Máquina com função; não toda parede. |
| FX-06 | Poeira de passo | Pequeno contato com piso seco. | Evento do pé; variar por material. |
| FX-07 | Respingos | Baixos e curtos. | Poça; não em calçamento seco. |
| FX-08 | Impacto em metal | Faísca + fragmento breve. | Hit confirmado; uma emissão por evento. |
| FX-09 | Impacto em pedra | Poeira e lasca. | Contato real com superfície. |
| FX-10 | Impacto orgânico | Aceno visual contido + reação. | Sem obrigatoriedade de sangue. |
| FX-11 | Flash do revólver | Forma curta na boca do cano. | Evento de disparo; não luz de tela inteira. |
| FX-12 | Traço/projétil | Direção clara, duração controlada. | Alinhado ao dano real. |
| FX-13 | Ejeção/recarga | Peças pequenas quando o desenho justificar. | Não inventar funcionamento incoerente. |
| FX-14 | Marreta no chão | Poeira radial e fragmentos baixos. | Contato único, sem encobrir resposta. |
| FX-15 | Onda de pressão | Frente distinta e base legível. | Entidade ofensiva, preservada em todos os presets. |
| FX-16 | Despressurização do boss | Jatos laterais e queda de intensidade. | Recuperação; deixar Nero visível. |
| FX-17 | Chuva | Camadas e resposta em superfícies. | Estado climático, não pontos aleatórios uniformes. |
| FX-18 | Detritos de quebra | Fragmentos por material. | Pool e limite; não persistir cada fragmento. |
| FX-19 | Luz oscilante | Variação pequena, não estroboscópio. | Postes/máquinas; acessibilidade. |
| FX-20 | Rastro de ataque | Desenho que explica trajetória. | Opcional; não ampliar alcance fictício. |

### 26.3 Presets de região

Bairro operário: frio atmosférico, vapor próximo e fumaça distante. Mercado: poeira leve, ruído de máquinas e ar mais denso em pontos específicos. Avenida: menos fuligem no plano próximo, maior exposição de arquitetura e iluminação cuidada. Escola: menor densidade de efeitos e espaço visual para atuação.

São propostas de ritmo. Não simular uma estação do ano inteira em três minutos. A mudança de clima deve parecer transição espacial e narrativa, não sorteio a cada dez segundos.

### 26.4 Gerenciamento

Um gerenciador pode combinar perfil de região, estado narrativo e preset de qualidade. Esses fatores produzem parâmetros; não devem criar emitters novos sem destruir os antigos.

Usar seeds controladas em testes. No gameplay, variar com limites. Partículas fora da câmera podem ser descartadas ou não emitidas, mas a transição não pode produzir uma parede de vapor surgindo visivelmente na borda.

### 26.5 Orçamento inicial

Proposta para trecho de referência: 150–300 partículas decorativas simultâneas no preset alto, 60–120 no médio e 20–50 no baixo, além do pequeno orçamento reservado a sinais essenciais. Esses números não garantem performance: área na tela, blend, textura e overdraw importam.

Ajustar após medir no hardware de referência. Uma única camada translúcida enorme pode custar mais que muitas partículas pequenas. Não usar contagem como único indicador.

### 26.6 Portas, máquinas e destruição

Toda mudança ambiental precisa de estado e consequência visível. Porta abre com espaço físico correspondente. Máquina alterna som e animação. Objeto quebrado deixa resíduo ou espaço plausível. Não trocar sprite sem atualizar a interação.

Destruição do prólogo deve ser limitada e coerente. Não permitir demolir a escola ou destruir NPCs apenas porque há sistema de dano.

### 26.7 Acessibilidade

Reduzir shake, flashes, pós-processamento e partículas decorativas independentemente de gameplay. Avisos de perigo precisam de forma, posição e som complementar, não apenas cor. Referência de verificação: orientações de movimento e distrações visuais da Microsoft. [[S15]](#fonte-s15)

### 26.8 Aceite

Sem efeito órfão após reset; sem emitter duplicado ao voltar de região; sem dano atrelado a sprite de partícula; preset baixo continua jogável; o protagonista permanece legível na névoa; flashes não se acumulam; efeitos correspondem ao material e ao evento real.

[Voltar ao índice](#indice)

---


<a id="sec-27"></a>

## 27 · Direção cinematográfica e cutscene final

### 27.1 A cutscene é um sistema, não uma sequência de timeouts

Usar uma timeline ou sequência com estados, eventos identificados e caminhos de conclusão, interrupção e reinício. Timers soltos em diferentes cenas são propensos a executar depois que o contexto terminou.

A cutscene possui autoridade sobre input, câmera e atores específicos. Ela não deve corromper o estado de locomoção normal nem deixar o jogador bloqueado no retorno ao menu.

### 27.2 Entrada

Trigger exclusivo do jogador, em região segura próxima à escola. Validar que a sequência ainda não foi consumida nesta sessão. Encerrar diálogo ativo de forma limpa; remover intenções de ataque; levar Nero a uma marca de atuação sem teletransporte perceptível; estabilizar a câmera.

O jogador não deve conseguir iniciar a cena várias vezes pulando no limite do trigger. Após entrar, o trigger fica inativo até reinício apropriado.

### 27.3 Storyboard proposto

| Momento | Imagem e atuação | Áudio | Condição técnica |
|---|---|---|---|
| Preparação, 0–1,5 s | Nero chega à marca; escola legível. | Ambiente normal reduz levemente. | Controle cedido; câmera estabilizada. |
| Reconhecimento, 1,5–3 s | Filha vê Nero e muda de postura. | Pequeno gesto/voz opcional. | Nome e fala ainda editoriais. |
| Aproximação, 3–5,5 s | Ela começa a correr na direção dele. | Passos e ambiente cotidiano. | Pés e percurso coerentes. |
| Acolhimento, 4,5–6 s | Nero reage com familiaridade. | Sem crescendo obrigatório de tragédia. | Animações sincronizadas. |
| Ameaça, 5,5–6,5 s | Veículo entra em velocidade excessiva; reação breve. | Motor/rodas ganham presença. | Nenhum QTE ou janela de salvamento. |
| Corte | Tela fica totalmente preta antes de qualquer colisão mostrada. | Som do acidente após o preto estar apresentado. | Não existe frame gráfico de impacto a revelar. |
| Silêncio, cerca de 2–3 s | Preto permanece. | Ambiente desaparece; silêncio intencional. | UI e pausa continuam sob controle. |
| Encerramento | Título e opções de conclusão. | Entrada sonora discreta, se aprovada. | Estado do prólogo concluído uma vez. |

Os tempos são proposta de montagem. O evento canônico é a ordem, não a duração exata. Testar ritmo real e evitar manipulação melodramática excessiva.

### 27.4 Veículo

Produzir veículo steampunk coerente com a rua, perspectiva e escala. A entrada precisa ser percebida como rápida, mas o jogador não deve ter tempo mecânico para concluir que falhou em agir.

Não mostrar motorista com identidade definida, brasão de família ou número de placa que estabeleça cânone não aprovado. A responsabilidade política faz parte da premissa geral, mas sua apresentação detalhada pode ficar para depois.

### 27.5 Som do acidente

A imagem preta deve estar efetivamente apresentada antes do cue. Não depender de “setar alpha e tocar som” no mesmo callback sem verificar a ordem de renderização. Como proteção editorial, não produzir um frame de impacto corporal.

O som deve comunicar colisão de veículo e ruptura, sem descrição gráfica. Não usar um pico de volume agressivo para substituir direção. Prever volume reduzido e legenda de efeito sonora para quem precisa dela.

### 27.6 Skip, pausa e foco

Permitir pular a sequência em repetição ou por opção de acessibilidade, com comando explícito que não seja acionado por input residual. O skip leva ao mesmo estado final consistente, sem executar efeitos de impacto fora de contexto.

Pausa suspende a timeline e o áudio pertinente. Ao perder foco, não permitir que a cena inteira termine em segundo plano sem política clara. Na volta, retomar sem salto temporal.

### 27.7 Reinício e persistência

Reiniciar o prólogo deve reconstruir atores e limpar eventos consumidos da sessão. Configurações permanecem. Não carregar um save no meio do acidente sem suporte explícito à retomada de cutscene.

Proposta: checkpoint anterior à sequência, mais flag de conclusão após encerramento. Em falha de gravação, mostrar estado recuperável, sem exigir serviço externo.

### 27.8 Critérios de aprovação

Nenhum impacto visível; ordem narrativa correta; atuação afetiva legível; áudio não duplicado; skip seguro; pausa segura; foco seguro; uma execução por chegada válida; reinício funcional; título correto; ausência de capítulo novo inventado.

[Voltar ao índice](#indice)

---


<a id="sec-28"></a>

## 28 · Áudio, música e paisagem sonora

### 28.1 Direção sonora

O som deve materializar o mundo: couro, metal, vapor, pedra, multidões e distância. A cidade tem camadas, não um único loop de fábrica tocando em todo lugar.

O braço de Nero e os mecanismos de Winsth precisam de identidades diferentes. Nero: precisão, válvula curta, pistão controlado. Winsth: pressão maior, deslocamento de massa, metal sob esforço e descarga após compromisso.

### 28.2 Buses

Master; música; ambiente; efeitos de gameplay; interface; voz quando houver. Permitir controle separado e mute. Não usar um único volume para tudo se o projeto já dispõe de uma camada melhor.

O ducking deve ser limitado: diálogo pode reduzir ambiente, mas não apagar completamente a cidade. A cutscene tem mix específico. Não reiniciar a música inteira ao trocar um pequeno chunk.

### 28.3 Inventário inicial de cues

| Grupo | Cues necessários | Variação e regra |
|---|---|---|
| Nero / passos | Pedra seca, metal, poça, madeira quando usada. | 3–5 variações por material relevante; evitar repetição imediata. |
| Nero / roupa | Movimento de couro e equipamento. | Baixo volume; não a cada frame. |
| Nero / braço | Servo/pistão, preparo, soco, descarga. | Sincronizados à ação; peso sem ruído constante. |
| Nero / revólver | Saque, disparo, clique vazio, abrir, inserir, fechar. | Um evento por fase; ouvir recarga sem mascarar telegraph. |
| Nero / reação | Dano leve, esforço, aterrissagem. | Sem dublagem obrigatória; não repetir grito exagerado. |
| Winsth / movimento | Passo pesado, metal, haste. | Ritmo distinto de Nero. |
| Winsth / ataques | Varredura, levantamento, impacto, investida, pressão. | Avisos diferenciados; volume controlado. |
| Ambiente operário | Fábrica distante, tubulação próxima, vozes. | Camadas com distâncias. |
| Mercado | Multidão, banca, veículo ao fundo. | Eventos espaçados, não cacofonia constante. |
| Avenida | Trânsito, relógio, eco arquitetônico. | Contraste de espaço e manutenção. |
| Escola | Conversa calma, passos, sinal escolar opcional. | Não antecipar acidente por terror sonoro. |
| Interação | Porta, alavanca, máquina, quebra. | Material correto e estado correto. |
| Interface | Foco, confirmar, voltar, erro discreto. | Curtos; não estética de painel corporativo. |
| Cutscene | Veículo, acidente fora de quadro, silêncio. | Ordem controlada e sem clipping. |

Não declarar esses sons produzidos apenas porque seus IDs existem. Cada cue precisa de arquivo, licença, implementação, variações e validação.

### 28.4 Música

Proposta de linguagem: instrumentos acústicos, timbres mecânicos e textura industrial, com espaço para ambiência. Não é obrigatório produzir uma orquestra para parecer grande. Uma trilha pequena, coesa e bem mixada é preferível a loops desconexos.

A abertura pode ter tema discreto, transições de densidade e retirada intencional de música. A arena precisa sustentar repetição sem cansar. Evitar música comercial como placeholder distribuído no build.

### 28.5 Espacialização

Usar pan e atenuação compatíveis com a câmera lateral. Sons distantes têm menos presença e detalhamento, não só volume menor. Ao voltar pela rua, fontes mantêm posição de mundo.

Não mover uma fonte junto da câmera quando ela pertence a uma máquina fixa. Ambiente amplo pode ser um bus regional, enquanto eventos próximos são posicionais.

### 28.6 Orçamento e mix

Proposta: limitar vozes simultâneas por categoria; priorizar telegraph, impacto e diálogo sobre partículas decorativas. Sons repetidos do mesmo emissor podem ser agregados ou limitados. Evitar 50 passos simultâneos no mercado.

Manter headroom e verificar clipping. Não afirmar um padrão de loudness obrigatório sem especificação de plataforma. Comparar cenas com fone e alto-falante, em volume baixo, médio e com música desativada.

### 28.7 Navegador

Áudio pode depender de interação do usuário devido às políticas de autoplay. Inicializar/desbloquear no gesto de entrada e tratar falha ou suspensão do contexto. Não assumir que tocar no menu será permitido automaticamente. [[S16]](#fonte-s16)

Pausa, foco, reinício e mudança de cena precisam de política de áudio. Não deixar loop tocando após voltar ao menu. Retomada não deve disparar cues antigos acumulados.

### 28.8 Acessibilidade

Legendas para falas e cues essenciais; indicação visual complementar dos telegraphs; controles independentes; opção de reduzir picos quando viável. O acidente em preto precisa de uma alternativa textual discreta para quem não ouve, sem mostrar violência visual.

### 28.9 Aprovação

Cada som deve ter razão, posição, timing e licença. Testar combate sem música; explorar sem efeitos; assistir cutscene com legendas; reiniciar várias vezes. A mistura precisa continuar inteligível, e o silêncio final deve ser intencional, não ausência acidental de carregamento.

[Voltar ao índice](#indice)

---


<a id="sec-29"></a>

## 29 · Interface, acessibilidade, controles e localização

### 29.1 Jogo primeiro

A área jogável ocupa a janela disponível respeitando proporção. Remover cabeçalhos técnicos e molduras grandes que parecem uma aplicação administrativa. Nome da engine, versão e métricas ficam no debug ou tela técnica.

Menus pertencem ao universo, mas legibilidade vem antes de ornamentação. Bronze e couro podem aparecer como detalhe; não aplicar textura pesada atrás de todo texto.

### 29.2 Telas necessárias

Menu inicial; configurações; pausa; créditos/proveniência; conclusão do prólogo; derrota/reinício da arena; mensagem de erro recuperável; carregamento. “Continuar” somente quando existe save válido e caminho de retomada testado.

A arena técnica deve ser identificada como teste de combate e separada da campanha. Não aparentar que o prólogo terminou e a história avançou automaticamente.

### 29.3 HUD

No prólogo: objetivo discreto e prompt de interação. Evitar vida, munição e cinco barras se o combate não está ativo. Na arena: vida, munição, reserva e estado necessário; barra do boss legível; nenhuma informação duplicada.

O HUD não deve cobrir o telegraph da marreta nem o destino de um salto. Posicionar com safe areas e testar janelas menores.

### 29.4 Texto

Fonte com português completo; tamanho legível na apresentação final, não apenas em pixels internos. Proposta de corpo de interface: equivalente a pelo menos 18–20 CSS px em uma janela desktop típica, com escala ajustável. Medir a leitura real; não tratar essa proposta como norma universal.

Quebra de linha previsível; nomes longos; acentos; números; remapeamento de teclas; fala instantânea; nenhuma rolagem automática rápida. Texto de menu não pode ficar borrado pela mesma escala usada para o mundo sem avaliação.

### 29.5 Navegação

Foco visível; ordem estável; confirmar e cancelar coerentes; voltar sempre disponível; mouse e teclado não brigam pelo foco. Configurações devem ser acessíveis antes de iniciar o jogo.

No canvas, garantir ao menos menus operáveis e rótulos de interface quando viável. Não declarar compatibilidade completa com leitor de tela sem teste real. Um canvas visual não se torna acessível apenas por ter um `aria-label`.

### 29.6 Opções prioritárias

| Opção | Comportamento |
|---|---|
| Remapeamento | Ações reais atualizam prompts e não criam conflito silencioso. |
| Volume por categoria | Persiste e funciona em todas as cenas. |
| Movimento reduzido | Reduz/remove shake, oscilações e transições decorativas. |
| Intensidade de flashes | Controla efeitos não essenciais. |
| Escala de texto | Reflow sem cortar falas ou botões. |
| Velocidade de texto | Inclui instantâneo. |
| Legendas/captions | Cobrem falas e cues essenciais definidos. |
| Assistência de combate | Modificadores explícitos e reversíveis, sem punição narrativa. |
| Pausa em perda de foco | Política clara e testada. |
| Fullscreen | Solicitação por gesto, com saída previsível. |

As Xbox Accessibility Guidelines são referência de revisão de input, texto, áudio e movimento, não certificação automática do jogo. [[S17]](#fonte-s17)[[S18]](#fonte-s18)

### 29.7 Cor e aviso

Não depender apenas de vermelho/verde para perigo e sucesso. Combinar silhueta, movimento, posição, som e texto quando pertinente. Invulnerabilidade não precisa de piscadas fortes; pode usar efeito mais discreto.

Aviso de conteúdo pode ser genérico e opcionalmente acessível no menu, informando violência e perda sem revelar a cena. Não interromper a abertura com um spoiler literal do acidente.

### 29.8 Localização

Separar strings de código, com IDs e contexto. Não construir frases por concatenação que dificulta tradução. Português brasileiro é o conteúdo inicial; infraestrutura pode aceitar outros idiomas sem prometer traduções produzidas.

Testar expansão de texto, caracteres especiais, nomes próprios e glyphs. Não remover o acento de “Revolução” no título público. IDs técnicos continuam sem acento quando necessário.

### 29.9 Critério de aceite

Todas as telas navegáveis; configurações persistentes; nenhuma opção falsa; texto legível; nenhuma informação essencial apenas sonora ou cromática; foco não perdido; prompts correspondem às teclas; jogo continua compreensível com movimento reduzido e áudio baixo.

[Voltar ao índice](#indice)

---


<a id="sec-30"></a>

## 30 · Persistência, checkpoints e progressão sem expansão narrativa

### 30.1 O que salvar

Versão do schema; build compatível; progresso do prólogo; checkpoint seguro; flags de interações relevantes; estado de portas/objetos persistentes; configurações separadas. Arena pode ter preferências e estatísticas locais, sem se misturar ao save da abertura.

Não salvar referências de engine, objetos circulares, timers de partículas ou IDs temporários de memória. Usar identificadores estáveis de conteúdo.

### 30.2 Separação

Configurações não devem desaparecer ao iniciar novo jogo. Save narrativo não deve ser sobrescrito por teste de arena. Dados de debug não devem contaminar o progresso normal.

Uma flag “cutscene concluída” é diferente de “cutscene em execução”. Ao recarregar após interrupção, voltar a um ponto seguro e previsível, não a um estado sem câmera ou ator.

### 30.3 Armazenamento local

Se o projeto usa armazenamento local do navegador, tratar falhas de escrita, dados inválidos e ausência de permissão. Não presumir que o save acompanha outro navegador, dispositivo ou URL de origem. Não criar backend apenas para resolver sincronização que não foi pedida.

Uma exportação/importação local pode ser proposta depois, com validação de tamanho e schema. Não executar conteúdo de um arquivo de save.

### 30.4 Migração

Adicionar versão explícita. Migrações são funções determinísticas e testáveis; preservar backup local quando apropriado. Se um save é incompatível, informar e oferecer reinício sem apagar configurações silenciosamente.

Renomear “Neon Fall” para Black Bird não autoriza perder todo o progresso de teste. Auditar chaves legadas e criar migração quando necessário.

### 30.5 Checkpoints

Posição precisa estar em piso válido, com câmera e recursos carregados. Restaurar orientação, vida e munição conforme contexto, sem reaplicar recompensas ou eventos únicos.

No prólogo, não há necessidade de checkpoints de combate. Um checkpoint anterior à escola pode apoiar recuperação. Na arena, reset é uma operação completa e isolada.

### 30.6 Persistência de mundo

Portas abertas, objetos quebrados e eventos únicos possuem IDs. Descarregar/recarregar uma região não reinicia esses elementos indevidamente. Rotinas cosméticas podem reiniciar em estado plausível, desde que não contradigam a história.

Não persistir a posição exata de cada figurante sem necessidade. O objetivo é continuidade percebida e ausência de exploits/softlocks, não simulação ilimitada.

### 30.7 Critério de aceite

Salvar e recarregar em cada checkpoint; corromper um campo em teste; trocar versão; negar armazenamento; iniciar arena e voltar; reiniciar prólogo; restaurar após foco perdido; verificar que configurações permanecem. Nenhuma ação deve apagar dados sem intenção clara.

[Voltar ao índice](#indice)

---


<a id="sec-31"></a>

## 31 · Arquitetura orientadora: adaptar, não substituir o projeto

### 31.1 Princípio

A arquitetura é um conjunto de responsabilidades e contratos, não uma árvore de pastas obrigatória. Mapear cada responsabilidade aos arquivos existentes. Criar módulos novos somente quando reduzirem acoplamento ou permitirem teste útil.

Não adotar ECS, framework de estados, DI, mensageria ou outra abstração só por parecer “AAA”. Um loop claro, componentes adequados e dados validados podem ser melhores que uma infraestrutura sofisticada sem jogo refinado.

### 31.2 Responsabilidades

| Responsabilidade | Possui | Não deve possuir |
|---|---|---|
| Bootstrap/cena | Inicialização, carregamento e ciclo de vida. | Todas as regras de combate e diálogos. |
| Input | Estado dos dispositivos e ações. | Dano, narrativa e posição física direta. |
| Controller | Intenção, locomoção e regras de controle. | Carregamento remoto de assets. |
| Física | Movimento, contatos e queries. | Decidir política narrativa. |
| Action/combat | Timelines, ataques e dano. | Desenhar menus ou escrever save arbitrariamente. |
| Presentation | Clips, sockets, efeitos e poses. | Causar dano sem contrato de ação. |
| World | Regiões, entidades, conexões e flags. | Misturar configuração de HML ao gameplay. |
| Dialogue/cinematic | Foco, sequência e eventos narrativos. | Reescrever o controller inteiro. |
| Audio/VFX | Apresentação de eventos. | Autoridade sobre vida e progressão. |
| Persistence | Serialização, versão e recuperação. | Referências diretas a objetos transitórios da engine. |
| UI | Estado apresentado e navegação. | Regras duplicadas de munição ou cooldown. |

### 31.3 Adaptação incremental

Primeiro descobrir onde as responsabilidades já vivem. Se o player atual mistura input e animação, extrair dados e eventos antes de dividir toda a classe. Se a câmera está no mapa, introduzir um ponto único de controle sem reescrever os mapas.

Usar wrappers/adapters apenas quando houver uma fronteira real. Não criar uma engine própria em cima de Phaser para evitar aprender suas APIs. Manter os recursos nativos que já funcionam.

### 31.4 Dados e comportamento

Conteúdo variável — diálogos, ataques, clips, perfis de clima, salas — pode sair de condicionais repetidos e ir para dados validados. Regras de simulação continuam em código legível.

O schema deve conter unidades e versão. Uma propriedade `speed: 100` sem indicar unidades é fonte de bugs. Nomes como `startupMs`, `velocityUnitsPerSecond` e `anchorSpace` tornam intenções explícitas.

### 31.5 Eventos

Eventos de domínio podem incluir `interaction.started`, `dialogue.closed`, `attack.started`, `attack.hit`, `damage.applied`, `actor.defeated`, `door.opened`, `region.entered`, `prologue.completed`.

Cada evento tem payload mínimo e dono. Não usar um barramento global para tudo. Eventos locais e chamadas diretas são preferíveis quando a relação é simples. Evitar ciclos em que UI atualiza gameplay e gameplay atualiza UI recursivamente.

### 31.6 Ciclo de vida

Todo listener, timer, emitter, entidade poolada e recurso temporário tem momento de criação e destruição. Registrar quem libera. Em reset/scene shutdown, nenhum callback deve continuar escrevendo em objetos antigos.

Carregamento assíncrono precisa de cancelamento ou verificação de contexto. Se a área foi abandonada antes de um recurso terminar, não instanciar o NPC na cena errada.

### 31.7 Erros e fallback

Dado inválido em desenvolvimento deve produzir diagnóstico com ID e caminho. Em build normal, recursos essenciais ausentes levam a mensagem recuperável, não a tela preta. Recursos decorativos podem falhar com fallback explícito, sem mascarar o problema no relatório.

Não engolir exceções silenciosamente. Não apresentar um boneco de fallback como se fosse Nero finalizado. Registrar falta de asset como pendência artística/técnica.

### 31.8 Feature flags

Flags podem proteger uma implementação em revisão, comparar camera antiga/nova ou ativar arena técnica. Toda flag deve ter dono, padrão e plano de remoção. Não deixar dois sistemas parcialmente ativos.

O build de avaliação artística deve mostrar claramente quais partes estão em revisão. O build normal não pode depender de parâmetros secretos para ficar jogável.

### 31.9 Decisão de engine

A regra atual é evoluir o código existente. Uma migração de engine exige um bloqueio demonstrado e decisão separada; não é tarefa automática do agente. Arte ruim, textura bugada e câmera mal configurada não provam inadequação da engine.

### 31.10 Critério de arquitetura

Uma pessoa deve conseguir localizar o dono de movimento, ataque, câmera, diálogo e save; compreender a ordem de atualização; testar sem carregar a cidade inteira quando apropriado; e adicionar um clip sem editar cinco sistemas desconexos.

[Voltar ao índice](#indice)

---


<a id="sec-32"></a>

## 32 · Contratos de dados, exemplos e convenções de integração

Os exemplos desta seção são **especificações de apoio**, não arquivos prontos para copiar sobre a configuração existente. O Codex deve traduzir os campos ao formato real do projeto e validar unidades.

### 32.1 Personagem e escala

```json
{
  "schemaVersion": 1,
  "id": "nero",
  "bodyHeightMeters": 1.8,
  "worldUnitsPerMeter": 40,
  "bodyHeightWorld": 72,
  "referenceBodyPixels": 144,
  "anchorSpace": "feet-center",
  "artStatus": "REVIEW",
  "mechanicalArmSide": "TO_CONFIRM",
  "collider": {
    "widthWorld": 26,
    "heightWorld": 66,
    "bottomOffsetWorld": 0
  }
}
```

`TO_CONFIRM` é um marcador deliberado de decisão, não valor aceitável para exportar a arte final. A razão de Winsth deve vir da altura corporal, não de `texture.height`.

### 32.2 Frame de animação

Campos mínimos: ID do frame, retângulo no atlas, tamanho antes de trim, deslocamento do recorte, duração, âncora original, sockets e direção. Se o loader usa outro schema, manter a informação equivalente.

```json
{
  "id": "nero.walk.right.03",
  "durationMs": 83,
  "sourceSizePx": {"w": 256, "h": 256},
  "trimOffsetPx": {"x": 70, "y": 74},
  "anchorSourcePx": {"x": 128, "y": 226},
  "socketsSourcePx": {
    "footLeft": {"x": 116, "y": 226},
    "footRight": {"x": 139, "y": 224}
  },
  "status": "EXAMPLE_ONLY"
}
```

As coordenadas são ilustrativas. Não aplicá-las às imagens anteriores sem medir. A âncora deve ser transformada considerando trim e escala; centralizar a imagem recortada ignora essa informação.

### 32.3 Ataque

```json
{
  "schemaVersion": 1,
  "id": "nero.punch.01",
  "timeUnit": "ms",
  "space": "actor-foot-local",
  "startupMs": 100,
  "activeStartMs": 100,
  "activeEndMs": 180,
  "totalMs": 380,
  "baseDamage": 14,
  "maxHitsPerTarget": 1,
  "hitbox": {"x": 16, "y": -52, "w": 38, "h": 24},
  "events": [
    {"atMs": 100, "type": "hitbox.open", "id": "active.begin"},
    {"atMs": 180, "type": "hitbox.close", "id": "active.end"}
  ]
}
```

O eixo Y local cresce para baixo; valores negativos ficam acima dos pés. A hitbox precisa ser ajustada ao desenho. `maxHitsPerTarget` não dispensa um registro por instância de ataque. O evento precisa ser processado mesmo que o tempo avance de 95 para 112 ms.

### 32.4 Instância de ação

Estado mínimo: `instanceId`, `definitionId`, `ownerId`, `startedAt`, `elapsed`, `directionAtCommit`, `consumedEvents`, `hitTargets`, `cancelReason`. Na reutilização, todos os campos transitórios são reinicializados.

Não serializar essa estrutura inteira no save do prólogo. Se o jogador recarrega, retornar a checkpoint seguro em vez de retomar no meio de uma hitbox ativa.

### 32.5 Portal

ID; área de origem; área de destino; ID da entrada; volume; condição; ligação inversa; política de ativação; flags necessárias. Validar que destino e retorno existem. O spawn não pode estar dentro da parede nem no trigger que causa um loop.

### 32.6 Diálogo

ID; interlocutor; condições; falas; escolhas quando realmente necessárias; eventos permitidos; repetibilidade; fallback; chave de localização. Eventos narrativos devem vir de uma lista permitida, não de código arbitrário em texto.

### 32.7 Perfil ambiental

ID da região; paleta/iluminação; emitters; áudio; intensidade por preset; tempo de transição; eventos narrativos que sobrepõem o perfil. Evitar duplicar o mesmo emitter em dados e código.

### 32.8 Save

Versão; checkpoint; flags persistentes; estado mínimo de mundo; data opcional; build de origem; configurações em objeto separado. Validar limites de tamanho e tipos. Não confiar em dados locais como se nunca pudessem ser alterados.

### 32.9 Manifest de assets

ID; caminho relativo; hash quando disponível; tipo; dimensões; bytes; licença; fonte; status; grupo de carregamento; dependências. Reprovar IDs duplicados, caminhos quebrados, JSON inválido e referências a arquivos não empacotados.

### 32.10 Invariantes automatizáveis

`activeStart < activeEnd <= total`; duração positiva; alturas positivas; razão corporal 23/18 dentro da tolerância; nenhum frame fora da textura; nenhum evento repetido sem declaração; todo portal com destino válido; todas as strings usadas presentes; nenhuma licença desconhecida em asset marcado como release ready.

Um validador de dados não substitui teste visual. Ele evita erros objetivos para que a revisão artística se concentre no que importa.

[Voltar ao índice](#indice)

---


<a id="sec-33"></a>

## 33 · Renderização, performance e orçamentos mensuráveis

### 33.1 Medir no cliente

O jogo web é renderizado pelo navegador do jogador; servir os arquivos na VM não equivale a transmitir vídeo de uma GPU remota. Avaliar separadamente custo do build/servidor e custo de renderização/áudio no cliente. O fluxo estático previsto utiliza a infraestrutura para construir e entregar recursos, não para streaming de gameplay. [[S19]](#fonte-s19)[[S20]](#fonte-s20)

### 33.2 Hardware de referência

O Codex deve registrar CPU, GPU, memória, navegador, versão, resolução, escala de dispositivo e preset de cada medição. “Desktop comum” não é um benchmark reproduzível. Se só houver navegador headless ou renderer de software, declarar a limitação.

Definir uma máquina mínima de avaliação e uma principal quando disponíveis. Não inventar resultados em hardware não testado.

### 33.3 Metas iniciais propostas

| Métrica | Meta inicial de trabalho | Observação |
|---|---|---|
| Cadência principal | 60 FPS | Objetivo, não garantia. |
| Frame time p95 aquecido | Até 20 ms | Medir em percurso representativo, não menu vazio. |
| Frame time p99 aquecido | Até 33 ms | Investigar picos recorrentes. |
| Travamentos longos | Nenhum pico recorrente acima de 100 ms em gameplay estável | Carregamentos iniciais são medidos separadamente. |
| Download inicial | Preferência por até 10 MB comprimidos | Revisar com arte real; não degradar tudo cegamente. |
| Início em rede de teste de 10 Mbps | Objetivo de até 12 s | Inclui transferência e preparação; medir, não estimar como resultado. |
| Recursos órfãos | Sem crescimento persistente após ciclos de ida/volta | Contar entidades, listeners, texturas e áudio. |

Não usar a média de FPS para esconder stutter. Registrar percentis e situações que geram picos. Não comparar capturas de ambientes diferentes como se fossem equivalentes.

### 33.4 Texturas

Como estimativa de memória não comprimida, uma textura RGBA8 de 2048×2048 contém 16 MiB de dados de pixels, antes de possíveis mipmaps, cópias e detalhes do driver. Arquivo PNG pequeno não significa textura barata na GPU.

Escolher dimensões e agrupamentos por uso. Não carregar toda a cidade e todas as animações do boss no menu se o jogador começa no prólogo. Não criar um atlas tão grande que exceda limites do dispositivo. As boas práticas WebGL reforçam considerar limites e uso de recursos, não presumir capacidade infinita. [[S20]](#fonte-s20)

### 33.5 Culling e atualização

Não atualizar IA complexa fora da região ativa. Não emitir partículas decorativas invisíveis. Reutilizar projéteis e VFX quando a medição justificar, garantindo reset completo.

Culling visual não pode pausar uma entidade necessária à narrativa de forma incorreta. Diferenciar “não desenhar” de “não simular”. Portas e flags persistentes não desaparecem por sair da tela.

### 33.6 Overdraw e efeitos

Névoa translúcida, luzes amplas e múltiplos overlays podem dominar custo. Medir com cada camada desligada. Reduzir cobertura, resolução de efeitos ou quantidade antes de destruir a qualidade dos personagens.

Não aplicar blur global para simular profundidade se prejudica pixel art e performance. Usar composição, cor e detalhe como primeira ferramenta.

### 33.7 Presets

Alto: atmosfera mais rica e efeitos completos dentro do orçamento. Médio: menos partículas e emissões de fundo. Baixo: reduzir decoração, mantendo telegraphs, contatos, UI, som essencial e visibilidade.

Nenhum preset muda velocidade, colisão, dano ou duração de ataque. Qualidade gráfica não é dificuldade. Testes devem provar equivalência de gameplay.

### 33.8 Carregamento

Separar recursos essenciais, região seguinte e arena. Prefetch controlado quando houver espaço, sem baixar tudo simultaneamente. Mostrar progresso honesto baseado em tarefas/bytes conhecidos, não uma barra que fica em 99% indefinidamente.

Na falta de recurso essencial, mensagem recuperável e log. Não prosseguir invisivelmente com personagem sem textura.

### 33.9 Critério de aceite

Percurso completo; retorno; mercado denso; ataque de Winsth com efeitos; pausa; reset repetido; resize. Medir aquecimento e estabilidade. Sem crescimento contínuo de recursos, sem picos causados por criação massiva em cada frame, sem diferenças de física por preset.

[Voltar ao índice](#indice)

---


<a id="sec-34"></a>

## 34 · Ciclo de vida no navegador e resiliência

### 34.1 Foco e aba oculta

Navegadores podem limitar timers e callbacks em abas ocultas. Usar o ciclo de visibilidade para pausar/reconciliar o jogo, em vez de assumir atualização contínua. Na retomada, descartar atraso acumulado conforme política e limpar inputs mantidos. [[S21]](#fonte-s21)

Não permitir que Nero morra enquanto o usuário troca de aba involuntariamente na arena, salvo uma política explícita que não é recomendada para este escopo. Abertura e cutscene devem retomar de forma previsível.

### 34.2 Áudio suspenso

Tratar estados de áudio bloqueado, suspenso e ativo. O gesto de iniciar pode liberar o contexto, mas falhas ainda precisam de tratamento. Exibir controle de som e permitir nova tentativa sem reiniciar a página. [[S16]](#fonte-s16)

Não reproduzir uma fila inteira de efeitos que deveriam ter acontecido enquanto o áudio estava suspenso. Som ambiente pode retomar; impacto perdido não precisa tocar fora de contexto.

### 34.3 Redimensionamento e escala

Preservar proporção; não deformar sprites. Recalcular UI e câmera de forma coordenada. O mundo físico não muda de tamanho porque a janela foi redimensionada.

Distinguir resolução lógica, resolução do canvas, CSS e device pixel ratio. Uma decisão de aumentar resolução de UI não deve duplicar a escala dos personagens. Testar tela cheia e saída dela.

### 34.4 Perda de contexto gráfico

Prever detecção e recuperação ou mensagem de recarregamento segura. Contexto WebGL pode ser perdido; isso não deve resultar em uma tela preta sem instrução. Se a engine já trata a restauração, integrar com ela em vez de criar um caminho concorrente. [[S22]](#fonte-s22)

Salvar em ponto seguro quando possível, sem tentar serializar recursos gráficos. Não declarar suporte a restauração sem teste.

### 34.5 Falhas de rede e cache

Depois de carregado, o gameplay não deve fazer chamadas externas obrigatórias. Se uma nova área exige recurso ainda não disponível, segurar a transição com estado recuperável, não deixar Nero cair em mapa vazio.

Uma atualização de build não pode misturar manifest novo com atlas antigo. Usar versionamento e política de cache coerentes. Service worker só se já existir necessidade e estratégia de atualização testada; não adicionar por aparência de sofisticação.

### 34.6 Dispositivos e entrada

Tratar layout de teclado, repetição de teclas, gamepad conectado após início e perda de dispositivo. Não exigir que o jogador recarregue a página para o controle aparecer.

Evitar captura de teclas do navegador fora da área do jogo. Fullscreen e outras ações privilegiadas precisam partir de interação do usuário conforme o ambiente; testar, não presumir.

### 34.7 Erros visíveis

Mensagem de carregamento falho deve informar recurso/etapa de forma adequada ao usuário, oferecer tentar novamente ou voltar ao menu e fornecer detalhe técnico no log. Não expor caminhos privados ou credenciais.

### 34.8 Aceite

Trocar de aba em caminhada, ataque, diálogo e cutscene; suspender/retomar áudio; redimensionar durante menu e arena; simular asset ausente; testar contexto perdido quando suportado; reiniciar sem duplicar instâncias. O jogador não deve precisar conhecer a engine para recuperar o jogo.

[Voltar ao índice](#indice)

---


<a id="sec-35"></a>

## 35 · Build, empacotamento de assets e identidade da versão

### 35.1 Respeitar o projeto

Usar scripts e gerenciador existentes após auditoria. Não adicionar outro `package.json` de jogo nem instalar uma versão global diferente da engine. Se o projeto usa Vite, seu build estático deve ser validado; `vite preview` é uma ferramenta de prévia local, não o servidor de produção proposto. [[S19]](#fonte-s19)

### 35.2 Reprodutibilidade

Lockfile versionado; versões compatíveis; comandos documentados; variáveis necessárias identificadas; ausência de dependência em diretório pessoal. Não afirmar reprodutibilidade apenas porque uma instalação local funcionou uma vez.

Distinguir erro de dependência, erro de TypeScript, erro de asset e erro de servidor. Logs devem tornar a causa identificável.

### 35.3 Recursos incluídos

Todos os atlas, JSON, fontes licenciadas, sons, mapas e traduções usados precisam estar no artefato. Referências conceituais grandes e fontes editáveis podem ficar fora do runtime, mas preservadas no repositório ou armazenamento apropriado.

Verificar maiúsculas/minúsculas em caminhos, especialmente quando o desenvolvimento ocorre em sistema diferente do container Linux. Detectar arquivos LFS que sejam apenas ponteiros, quando aplicável, em vez de tratar o texto como imagem.

### 35.4 Paths

Preferir caminhos resolvidos pelo sistema de build. Testar hospedagem na raiz e no prefixo realmente usado pela HML, quando existir. Não inventar suporte a subpath sem validar atlas, áudio e mapas.

Recurso inexistente deve retornar erro apropriado, não `index.html` com status 200. Fallback de rota, se necessário, não pode mascarar PNG ou JSON ausente.

### 35.5 Identidade do build

Expor metadados não sensíveis em um arquivo ou tela técnica: versão, commit quando disponível, data de build e identificação do conteúdo. Essa informação ajuda a provar que a HML recebeu uma mudança.

Não colocar token, URL interna sensível, caminho do usuário ou variáveis privadas no bundle. Tudo que vai ao frontend pode ser inspecionado pelo cliente.

### 35.6 Cache e atualização

HTML e manifest de entrada devem permitir atualização controlada. Assets com hash podem ter cache longo. JSON de atlas e PNG correspondente precisam mudar de forma consistente. Uma publicação deve evitar janela em que o cliente recebe metade de uma versão.

Manter compatibilidade de clientes já abertos quando possível, ou oferecer reinício claro. Não usar “limpe o cache” como procedimento normal de release.

### 35.7 Teste do artefato

Executar a versão produzida, não apenas o dev server. Conferir menu, percurso, áudio, fontes, arena, reinício e paths. O bundler pode alterar resolução de recursos de modo que bugs só apareçam na produção.

### 35.8 Saída esperada

Comandos reais; artefato gerado; lista de recursos; checksums quando úteis; resultado de build; teste de servidor estático; diferenças conhecidas; versão identificável. Não criar um instalador desktop, streaming ou backend sem necessidade.

[Voltar ao índice](#indice)

---


<a id="sec-36"></a>

## 36 · Huddle Engineering: contrato de aplicação e validação em HML

### 36.1 Limite de responsabilidade

O jogo deve ser uma aplicação web bem empacotada para testar a plataforma. O Codex do jogo não deve corrigir silenciosamente IAM, Morpheus, GitHub OAuth, provisionamento ou publicação do Huddle. Esses são sistemas externos ao repositório do jogo.

A aplicação prepara build, container, porta, health, metadados e testes. A plataforma importa, provisiona, executa e publica conforme suas capacidades reais. Não afirmar que a automação funciona antes de exercitar o fluxo autorizado.

### 36.2 Fluxo pretendido

Repositório existente → seleção de branch autorizada → identificação da stack ou configuração explícita → build → execução em HML → URL HTTPS → teste no navegador → nova alteração → nova publicação → verificação da versão.

Não fixar nomes de branches nem fluxo de aprovação a partir de suposição. Respeitar as regras atuais do repositório e da equipe. Não criar um segundo repositório de jogo apenas para facilitar o teste.

### 36.3 Container

Se Docker/Nginx já são o padrão, manter. Um build multi-stage separa ferramentas de compilação dos arquivos necessários à execução; a documentação oficial descreve essa separação. Adaptar o Dockerfile existente em vez de adicionar outra cadeia desconectada. [[S23]](#fonte-s23)

Preferir execução sem privilégios excessivos, portas e volumes documentados e imagem com apenas o necessário. Não montar socket Docker, credenciais corporativas ou filesystem do host para servir um jogo estático.

### 36.4 Health em dois níveis

**Serviço:** responde na porta e no endpoint definido.

**Aplicação:** carrega recursos, inicializa cena e permite interação.

Um `200 OK` de Nginx não comprova que Nero aparece ou que o atlas carregou. O teste de HML precisa de ambos. Um health check pode existir em caminho estático simples, mas a validação funcional usa o navegador.

### 36.5 HTTPS e recursos

HTTPS é responsabilidade da publicação/reverse proxy conforme a infraestrutura. O jogo não precisa carregar certificado privado no frontend. Evitar conteúdo misto, chamadas externas obrigatórias e URLs hardcoded da máquina de desenvolvimento.

O navegador renderiza o jogo localmente; a VM serve arquivos e participa do processo de build/execução. Não prometer desempenho gráfico com base na CPU da VM apenas. [[S19]](#fonte-s19)[[S20]](#fonte-s20)

### 36.6 Teste de atualização

Escolher uma alteração pequena e inequívoca, como versão em tela técnica ou detalhe visual identificado. Publicar pelo fluxo autorizado. Verificar commit/build na HML e observar a alteração real. Confirmar que não foi apenas cache local ou execução do dev server.

Não usar um arquivo alterado manualmente dentro do container como prova de pipeline Git. O objetivo é testar a cadeia de entrega, não apenas mostrar uma página.

### 36.7 Matriz de evidências

| Etapa | Evidência |
|---|---|
| Origem | Repositório e commit autorizados. |
| Build | Comando, logs e artefato. |
| Container | Imagem/tag ou digest quando disponível e comando de execução. |
| Serviço | Porta, health e resposta. |
| Publicação | URL real e status HTTPS, sem expor segredo. |
| Aplicação | Captura/vídeo do jogo carregado e interação. |
| Atualização | Dois builds distinguíveis, com mudança verificada. |
| Recuperação | Procedimento de rollback conforme política da plataforma. |

### 36.8 Bloqueios externos

Se HML não provisiona por permissão, registrar erro e fronteira. Não desabilitar segurança, usar PRD, recriar grupos IAM ou alterar o Huddle para “passar o teste”. Continuar validando o artefato localmente e deixar o ponto de integração explicitamente bloqueado.

### 36.9 Aceite

O mesmo artefato funciona no servidor estático local e na HML autorizada; recursos carregam; URL abre; versão é identificável; atualização é demonstrada; não há dependência de serviço pessoal do desenvolvedor. Sem acesso real à HML, classificar essa etapa como não executada.

[Voltar ao índice](#indice)

---


<a id="sec-37"></a>

## 37 · Segurança operacional, licenças e proveniência

### 37.1 Autonomia com fronteiras

O agente pode editar o código do jogo, produzir dados, executar testes e refatorar localmente conforme as instruções do repositório. Isso não autoriza alterar produção, infraestrutura corporativa, permissões, segredos, repositórios remotos ou assumir custos.

Um jogo pode compartilhar a VM com serviços sensíveis. Descobrir o ambiente antes de iniciar processos, ocupar portas ou consumir todos os recursos. Não executar carga prolongada em máquina de produção por falta de uma VM dedicada.

### 37.2 Comandos e dependências

Usar ferramentas conhecidas, versões registradas e origem verificável. Não executar scripts remotos desconhecidos apenas porque um README recomenda. Revisar dependências novas e evitar pacotes desnecessários.

Não instalar componentes de engine ou plugins pagos sem autorização. Disponibilidade de tokens não equivale a autorização financeira.

### 37.3 Dados e credenciais

Não colocar tokens GitHub, chaves de nuvem, cookies, caminhos privados ou credenciais em documentação, screenshots, bundle ou logs públicos. Não copiar dados corporativos para o jogo.

Debug pode expor informações técnicas; revisar antes de publicar. Uma URL com parâmetro `debug=true` não é controle de acesso para recursos sensíveis.

### 37.4 Código de referência

A licença de cada arquivo/repositório deve ser verificada na versão utilizada. Por exemplo, o arquivo de câmera de SuperTux consultado declara GPL-3.0-or-later. Isso é uma observação de proveniência, não uma conclusão de compatibilidade com a distribuição do Black Bird. [[S03]](#fonte-s03)

Preferir compreender o padrão e implementar a solução adequada ao projeto. Se incorporar código, registrar origem, trecho, modificações e obrigações analisadas. Não remover avisos de autoria.

### 37.5 Arte e áudio

Registrar licença por asset, não só por site. Permissão para usar imagem em uma página não significa permissão para redistribuí-la dentro de um jogo. Assets de um jogo cuja engine é aberta continuam exigindo verificação separada.

Conceitos gerados e derivados devem ter histórico de produção e revisão. Não usar marcas, logos ou conteúdo de terceiros como se fossem autorais. Não prometer exclusividade jurídica de material gerado sem fundamento.

### 37.6 Registro mínimo

| Campo | Conteúdo |
|---|---|
| Asset/código | ID e caminho. |
| Origem | Autor, repositório/página e data. |
| Versão | Commit, versão ou hash do arquivo. |
| Licença declarada | Nome e arquivo/texto de referência. |
| Uso | Onde e como aparece no jogo. |
| Modificação | O que foi alterado. |
| Crédito | Texto e local, quando aplicável. |
| Status | Verificado, pendente ou não permitido para release. |

Licença desconhecida impede marcar como release ready. O agente não deve substituir silenciosamente um recurso central por outro de qualidade inferior; registrar o bloqueio e propor alternativa.

### 37.7 Limpeza e publicação

Remover temporários do runtime sem apagar fontes de produção. Não incluir caches, capturas privadas, grandes repositórios de pesquisa ou segredos no container. Conferir o que de fato é servido pelo Nginx.

### 37.8 Critério de aceite

Build sem segredos; proveniência rastreável; dependências necessárias; nenhum custo não autorizado; nenhum acesso à produção; nenhum arquivo do usuário perdido; pendências de licença claramente bloqueadas. Esta seção orienta o processo, não substitui revisão jurídica quando necessária.

[Voltar ao índice](#indice)

---


<a id="sec-38"></a>

## 38 · Estratégia de testes: lógica, navegador, visual e experiência

### 38.1 Quatro camadas

**Dados e lógica:** schemas, timers, consumo de input, dano único, munição, transições e saves. Testes rápidos de invariantes.

**Integração:** controller com física; ação com animação; diálogo com bloqueios; portal com persistência; cutscene com câmera/áudio.

**Navegador real:** carregamento, foco, resize, input, áudio, canvas e build de produção.

**Avaliação humana/visual:** beleza, peso, leitura, prazer de movimento, justiça e emoção. Automação não substitui essa camada.

Não congelar todo o comportamento do controller em testes tão específicos que impeçam calibração. Proteger invariantes e regressões relevantes, mantendo parâmetros de sensação ajustáveis.

### 38.2 Evidência mínima por teste

ID; requisito; build/commit; ambiente; configuração; passos; esperado; observado; status; evidência; limitação. Estados permitidos: não executado, passou, falhou, bloqueado, não aplicável com justificativa.

Este documento define testes; **não registra testes do jogo como executados**. O agente deve preencher resultados reais depois da implementação.

### 38.3 Determinismo de cenário

Criar seeds, pontos de spawn e perfis de clima previsíveis para captura. Congelar apenas a variabilidade necessária ao teste; não desligar o bug. Um cenário de screenshot estática pode pausar efeitos, mas outro teste precisa observar movimento.

Não exigir igualdade bit a bit de simulação entre todos os navegadores. Definir tolerâncias para posição, tempo e imagem conforme o objetivo.

### 38.4 Comparação visual

Playwright permite gerar e comparar screenshots, mas sua documentação ressalta que o ambiente de renderização influencia o resultado. Fixar navegador, viewport, escala, fontes e condições ao criar baseline. [[S24]](#fonte-s24)

Uma screenshot diferente pode ser melhoria, regressão ou ruído. Inspecionar antes de atualizar baseline. Não rodar atualização automática para “fazer os testes passarem”.

Capturas obrigatórias: Nero neutro sobre piso; Nero em ataque; Nero/Winsth lado a lado; cada região; diálogo; arena durante telegraph; menu; janela menor. Vídeos obrigatórios: caminhada ida/volta; salto e aterrissagem; combo; quatro padrões do boss; cutscene completa.

### 38.5 Automação com observabilidade

Quando possível, expor somente em desenvolvimento uma interface de teste para ler estado, reiniciar cenário e escolher seed. Não usar essa interface para teletransportar Nero e declarar que a travessia normal funciona.

Combinar inputs reais com leitura de estado. DOM visível não comprova que o canvas desenhou corretamente. Console sem erros não comprova animação boa.

### 38.6 Testes de assets

Verificar carregamento, dimensões, frames, alpha, pivô, escala, sockets e licenças. Comparar contatos entre clips e ambos os sentidos. Não aceitar sheet com texto de ficha ou fundo incorporado como sprite transparente.

Validar que todos os assets do manifest entram no build e que não há referências a caminhos locais. Recursos opcionais ausentes não podem esconder falta de personagem principal.

### 38.7 Performance

Warm-up e período de medição definidos; percurso representativo; ambiente registrado; métricas percentis; contagem de recursos antes/depois de ciclos. Headless com renderização por software não representa automaticamente o desktop do jogador.

### 38.8 Regressão por alteração

Correção de câmera exige retestar bounds, retorno, diálogo, arena e resize. Troca de atlas exige testar todos os clips referenciados. Mudança de dano exige vida, derrota, hitstop e reset. Migração de save exige dados antigos e falha de armazenamento.

Não executar toda a suíte pesada após cada mudança de texto. Usar testes focados durante trabalho e suíte completa nos checkpoints de integração. Repetição sem hipótese não é qualidade.

### 38.9 Severidade

P0: perda de dados, exposição de segredo, alteração indevida de produção, travamento total. P1: softlock, controle quebrado, recurso principal ausente, dano injusto recorrente. P2: falha visual/sonora importante sem bloqueio. P3: refinamento e inconsistência menor.

P0 e P1 impedem release. P2 na arte central também pode impedir aprovação artística. Não esconder defeitos em uma média de pontuação.

[Voltar ao índice](#indice)

---


<a id="sec-39"></a>

## 39 · Matriz de casos de teste e regressão

**Todos os casos abaixo são especificações, inicialmente NÃO EXECUTADOS.** O Codex deve registrar resultados e evidências no repositório. Automatizar o que for objetivo; manter revisão visual/humana onde necessária.

### Física e movimento

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| PHY-01 | Nero parado no piso de referência. | Observar por 30 s e alternar idle. | Pés permanecem no apoio, sem deriva vertical. |
| PHY-02 | Piso com emenda de tiles. | Caminhar nos dois sentidos. | Nenhuma trava, queda ou salto involuntário. |
| PHY-03 | Borda de plataforma. | Pular dentro e fora da janela de coyote. | Salto aceito apenas na tolerância definida. |
| PHY-04 | Queda próxima do chão. | Pressionar salto pouco antes do contato. | Buffer gera um salto, sem repetição infinita. |
| PHY-05 | Área livre. | Comparar toque curto e botão mantido. | Alturas distintas e arco previsível. |
| PHY-06 | Teto baixo. | Pular contra a parte inferior. | Sem atravessar teto ou ficar preso. |
| PHY-07 | Plataforma atravessável. | Subir por baixo e cair sobre ela. | Colisão só na descida elegível. |
| PHY-08 | Mesmo cenário em taxas diferentes. | Repetir sequência de input. | Trajetórias dentro da tolerância registrada. |
| PHY-09 | Contato com parede. | Aplicar knockback e tentar andar. | Sem atravessar geometria ou vibrar indefinidamente. |
| PHY-10 | Nero em vários clips. | Alternar idle, walk, ataque e recarga. | Mudança de arte não desloca arbitrariamente o corpo. |

### Câmera e mundo

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| CAM-01 | Rua maior que uma tela. | Andar à direita por várias larguras. | Rolagem contínua, sem troca de quadros. |
| CAM-02 | Mesmo percurso. | Voltar até a origem. | Retorno possível e cenário coerente. |
| CAM-03 | Limites esquerdo e direito. | Encostar nos extremos. | Nenhum vazio fora do mundo. |
| CAM-04 | Movimento lento. | Observar chão, pés e linhas verticais. | Sem tremor relativo persistente. |
| CAM-05 | Caminhando. | Alternar direção rapidamente. | Look-ahead não produz saltos bruscos. |
| CAM-06 | Em exploração e arena. | Redimensionar janela e entrar/sair de fullscreen. | Proporção, bounds e UI preservados. |
| CAM-07 | Conexão entre áreas. | Entrar e retornar imediatamente. | Spawn seguro, sem loop de portal. |
| CAM-08 | Porta aberta e objeto quebrado. | Sair da região e retornar. | Estado persistente correto. |
| CAM-09 | Cutscene concluída ou abortada. | Voltar ao controle permitido. | Câmera devolvida sem posse órfã. |
| CAM-10 | Foreground e parallax. | Percorrer ida/volta. | Camadas retornam à posição, sem drift acumulado. |

### Input e diálogo

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| INP-01 | Nero andando e NPC em rota. | Iniciar conversa mantendo direção. | Ambos param; ambiente restante pode continuar. |
| INP-02 | Primeira fala. | Manter E/confirmar pressionado. | Não pula toda a conversa. |
| INP-03 | Diálogo aberto. | Pressionar ataque e disparo. | Não há ação de combate nem input residual ao sair. |
| INP-04 | Conversa repetível. | Abrir e fechar dez vezes. | Listeners, sons e avanço não se multiplicam. |
| INP-05 | NPC perto de porta. | Conversar, encerrar e atravessar. | Controle e rotina restaurados corretamente. |
| INP-06 | Ação em andamento. | Perder e recuperar foco. | Sem tecla presa ou simulação de atraso acumulado. |
| INP-07 | Controles remapeados. | Executar ações e abrir prompts. | UI mostra bindings reais. |
| INP-08 | Controle conectado. | Desconectar durante arena. | Estado recuperável e fallback claro. |
| INP-09 | Pausa sobre diálogo. | Fechar pausa, depois diálogo. | Cada sistema libera apenas seu bloqueio. |
| INP-10 | Alvo removido em teste. | Cancelar/descarregar interlocutor. | Nero não fica permanentemente bloqueado. |

### Combate de Nero

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| COM-01 | Alvo dentro do alcance. | Executar um soco e manter overlap. | Um dano por instância e alvo. |
| COM-02 | Alvo fora do alcance. | Executar o mesmo soco. | Nenhum dano fantasma. |
| COM-03 | Alvos em ambos os lados. | Atacar para direita e esquerda. | Hitboxes correspondem à direção e à pose. |
| COM-04 | Durante combo. | Variar tempo de pressões. | Encadeamento só nas janelas; um input não duplica golpe. |
| COM-05 | Hitstop ativo. | Pressionar próximo golpe. | Buffer segue a política e não desaparece indevidamente. |
| COM-06 | Revólver com uma bala. | Disparar e repetir pressão. | Munição não fica negativa; clique vazio coerente. |
| COM-07 | Recarga antes do commit. | Interromper com ação permitida. | Nenhuma bala concedida indevidamente. |
| COM-08 | Recarga após commit. | Interromper e retomar. | Sem duplicação de munição. |
| COM-09 | Parede junto ao cano. | Disparar contra obstáculo. | Projétil não nasce atravessando a parede. |
| COM-10 | Alvo pequeno e projétil rápido. | Disparar em diferentes frame rates. | Sem tunneling dentro das condições suportadas. |
| COM-11 | Esquiva. | Receber hit antes, durante e após janela. | Invulnerabilidade apenas no intervalo definido. |
| COM-12 | Nero derrotado durante ação. | Continuar simulação e reiniciar. | Hitbox cancela, reset limpa timers e projéteis. |

### Winsth e arena

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| BOS-01 | Nero e Winsth neutros no mesmo chão. | Medir corpos, sem cartola/arma. | Razão corporal 23/18 dentro da tolerância. |
| BOS-02 | Varredura isolada. | Observar e evitar. | Preparação, contato e recuperação legíveis. |
| BOS-03 | Impacto vertical isolado. | Sair da área e voltar após impacto. | Sem dano residual invisível na recuperação. |
| BOS-04 | Investida próxima da parede. | Provocar e esquivar. | Não aprisiona sem resposta nem atravessa limite. |
| BOS-05 | Onda de pressão. | Saltar com o kit disponível. | Resposta confiável e aviso preservado no preset baixo. |
| BOS-06 | Boss em recuperação. | Tentar provocar novo ataque. | Não inicia antes da regra permitir. |
| BOS-07 | Vários ataques completos. | Registrar sequência de escolhas. | Sem spam injustificado ou aleatoriedade impossível. |
| BOS-08 | Boss recebe stagger. | Verificar golpe ativo e próximo estado. | Cancelamento e recuperação obedecem ao contrato. |
| BOS-09 | Último hit com projéteis ativos. | Derrotar Winsth. | Conclusão única; política de ameaças aplicada. |
| BOS-10 | Arena usada repetidamente. | Reiniciar dez vezes. | Vida, munição, câmera e recursos retornam ao baseline. |

### Arte e animação

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| ART-01 | Sprites em fundos claro/escuro. | Inspecionar bordas. | Sem halo, fundo de ficha ou recorte incorreto. |
| ART-02 | Idle, walk e ataque. | Comparar cabeça, corpo e prótese. | Anatomia, escala e lado do braço consistentes. |
| ART-03 | Caminhada em velocidade normal. | Observar contatos. | Passada compatível; sem deslizamento persistente. |
| ART-04 | Marreta no maior arco. | Reproduzir em ambos os sentidos. | Nenhuma extremidade cortada pelo frame. |
| ART-05 | Cenário sem VFX/pós-processamento. | Capturar composição. | Arte sustenta interesse sem esconder lacunas. |
| ART-06 | Plano jogável e fundo. | Ver em escala de cinza. | Nero e ameaças permanecem legíveis. |
| ART-07 | Atlas em produção. | Carregar todos os clips referenciados. | Chaves válidas; nenhum frame trocado ou ausente. |
| ART-08 | Pisos e fachadas repetidas. | Percorrer lentamente. | Sem costuras evidentes ou repetição grosseira. |
| ART-09 | NPCs lado a lado. | Comparar escala, luz e perspectiva. | Pertencem à mesma linguagem visual. |
| ART-10 | Preset baixo. | Jogar arena e atravessar névoa. | Sinais essenciais preservados. |

### Narrativa e cutscene

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| NAR-01 | Novo jogo. | Percorrer caminho principal em ritmo normal. | Pelo menos 180 s de deslocamento significativo medido. |
| NAR-02 | Percurso sem conversas opcionais. | Chegar à escola. | História continua compreensível e trajeto funcional. |
| NAR-03 | Antes do trigger final. | Voltar para regiões anteriores. | Exploração bidirecional permanece disponível. |
| NAR-04 | Chegada à escola. | Executar sequência completa. | Filha aproxima; veículo entra; preto antes do impacto. |
| NAR-05 | Cutscene em progresso. | Pausar e retomar. | Timeline e áudio coerentes. |
| NAR-06 | Cutscene em progresso. | Trocar foco e retornar. | Sem salto para o final ou cues acumulados. |
| NAR-07 | Repetição com skip. | Pular por comando explícito. | Mesmo estado final, sem acidente sonoro fora de contexto. |
| NAR-08 | Sequência concluída. | Reiniciar prólogo. | Flags de sessão limpas; configurações preservadas. |
| NAR-09 | Título final. | Observar opções. | Não inicia capítulo de vingança ou boss automaticamente. |
| NAR-10 | Modo sem áudio, com captions. | Assistir encerramento. | Informação essencial acessível sem imagem gráfica. |

### Áudio, UI e acessibilidade

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| UX-01 | Primeiro acesso com áudio bloqueado. | Iniciar por gesto. | Áudio ativa ou oferece recuperação clara. |
| UX-02 | Configurações. | Alterar volumes e reiniciar. | Valores persistem em todas as cenas. |
| UX-03 | Menu com teclado apenas. | Navegar e iniciar. | Foco visível e todas as ações acessíveis. |
| UX-04 | Texto ampliado. | Abrir falas e menus longos. | Sem corte, sobreposição ou botão inacessível. |
| UX-05 | Movimento reduzido. | Jogar e observar impactos. | Shake/efeitos decorativos reduzidos; gameplay intacto. |
| UX-06 | Música desligada. | Lutar contra Winsth. | Telegraphs e impactos ainda compreensíveis. |
| UX-07 | Troca repetida de região. | Ouvir ambiente. | Sem loops duplicados ou música reiniciada indevidamente. |
| UX-08 | Janela menor. | Ver HUD, diálogo e opções. | UI legível sem cobrir ameaças. |
| UX-09 | Ação de maior intensidade. | Verificar mix. | Sem clipping ou pico agressivo não controlado. |
| UX-10 | Save inexistente. | Abrir menu. | Continuar não aparece como opção falsa. |

### Save, build e navegador

| ID | Preparação | Ação | Resultado esperado |
|---|---|---|---|
| REL-01 | Checkpoint válido. | Salvar e recarregar. | Posição segura, flags corretas e controles ativos. |
| REL-02 | Save inválido em ambiente de teste. | Carregar. | Erro recuperável, sem apagar configurações silenciosamente. |
| REL-03 | Armazenamento indisponível. | Tentar gravar progresso. | Falha tratada sem travar jogo. |
| REL-04 | Build de produção. | Executar fora do dev server. | Assets, fontes, mapas e áudio funcionam. |
| REL-05 | Asset propositalmente ausente. | Solicitar recurso. | Erro real, não HTML com 200 mascarando falha. |
| REL-06 | Base path real da HML. | Abrir jogo e arena. | Caminhos relativos corretos. |
| REL-07 | Contexto gráfico perdido em teste suportado. | Recuperar ou recarregar. | Mensagem e estado seguros, sem tela preta silenciosa. |
| REL-08 | Vários ciclos de ida/volta/reset. | Medir recursos. | Sem crescimento persistente de listeners/entidades. |
| REL-09 | Dois builds publicados pelo fluxo autorizado. | Comparar versão e alteração. | Atualização real, sem mistura de cache. |
| REL-10 | Container/servidor ativo. | Comparar health e boot do jogo. | Ambos verificados; 200 isolado não basta. |


### Investigação quando um caso falha

Não aumentar tolerâncias imediatamente. Reproduzir, localizar a primeira divergência, verificar unidades e ordem de eventos, corrigir a causa e repetir os casos relacionados. Capturar antes/depois. Se o teste era incorreto, explicar por que e atualizar a especificação com evidência, sem redefinir o requisito do usuário.

### Casos adicionais por descoberta

A lista não limita a investigação. Todo bug real corrigido deve ganhar um caso de regressão proporcional ao risco. Evitar centenas de testes que apenas conferem se um arquivo existe enquanto os personagens continuam flutuando.

[Voltar ao índice](#indice)

---


<a id="sec-40"></a>

## 40 · Playtest, avaliação artística e métricas de experiência

### 40.1 Automação não joga por uma pessoa

Scripts podem comprovar que um salto aconteceu e que a câmera se moveu. Não comprovam prazer, tensão, peso ou conexão emocional. Quando não houver avaliador humano disponível, registrar avaliação do agente como tal e manter aprovação editorial pendente.

Não inventar depoimentos, percentuais de aprovação ou resultados de pesquisa com jogadores. Não transformar autoavaliação em estudo de usabilidade.

### 40.2 Sessões propostas

**Controle, 5–10 minutos:** andar, parar, inverter direção, saltar, atingir bordas, usar ataque e recarga. Pergunta: algo acontece diferente do que a mão espera?

**Quarteirão, 5–10 minutos:** observar sem instrução, descobrir interações e voltar. Pergunta: o jogador entende a cidade e lembra um marco?

**Boss, 10–15 minutos:** padrões isolados e encontro completo. Pergunta: o jogador consegue identificar o erro e melhorar?

**Prólogo completo:** jogar sem spoilers adicionais e observar o ritmo. Pergunta: a cidade e a relação com a filha foram percebidas antes do corte final?

Essas durações são propostas de sessão de avaliação, não estimativa de trabalho do agente nem cronograma prometido.

### 40.3 Perguntas úteis

O personagem respondeu tarde? O piso pareceu confiável? Houve algum local em que não soube onde andar? Qual objeto parecia interativo e não era? Qual ataque do boss pareceu injusto? O fundo competia com a ação? Algum som cansou? O diálogo parecia natural? A cena final pareceu consequência narrativa ou falha de controle?

Evitar perguntar apenas “ficou bonito?”. Solicitar exemplos e momentos.

### 40.4 Métricas

Tempo ativo até a escola; tempo em diálogos; número de retornos; locais de hesitação; interações descobertas; tentativas do boss; dano por tipo de ataque; uso de melee/tiro; recargas interrompidas; mortes em canto; duração de luta; falhas de input; frame times.

Esses números ajudam a formular hipóteses, não substituem observação. Poucos retornos podem significar rota clara ou desinteresse; mais mortes podem significar desafio ou injustiça.

### 40.5 Rubrica de arte

Avaliar identidade, composição, materiais, silhueta, profundidade, animação, contato e coerência. Registrar a captura correspondente. Reprovar defeitos centrais mesmo quando a média parece alta.

Uma boa comparação usa o mesmo enquadramento e a mesma condição. Não comparar o melhor frame novo com o pior frame antigo. Não usar imagens de referência em resolução diferente como prova de equivalência.

### 40.6 Iteração

Escolher um problema observável, propor alteração, manter outras variáveis estáveis quando possível, testar e decidir. Exemplo: reduzir atraso da câmera sem simultaneamente mudar velocidade, zoom e resolução. Se tudo muda, fica difícil saber o que ajudou.

Agrupar ajustes de arte por intenção: separar planos, melhorar piso, clarificar silhueta. Evitar centenas de mudanças aleatórias de cor.

### 40.7 Instrumentação e privacidade

No início, métricas locais de desenvolvimento bastam. Não adicionar analytics externo, identificação pessoal ou envio de sessões sem necessidade e autorização. Logs técnicos não devem incluir conteúdo sensível do ambiente.

### 40.8 Saída de uma rodada

Três problemas prioritários; evidências; hipótese; alteração escolhida; critério de sucesso; resultado. A próxima rodada começa pelo maior impacto na experiência, não pelo recurso mais divertido de programar.

[Voltar ao índice](#indice)

---


<a id="sec-41"></a>

## 41 · Plano de produção por marcos e dependências

### 41.1 Não organizar por quantidade de horas

O agente pode executar uma sessão longa, mas duração não garante resultado. Organizar por marcos verificáveis. Não prometer que um fim de semana produzirá toda a arte final. Não parar só porque um documento foi escrito; continuar implementando enquanto houver trabalho seguro, recursos e contexto.

### 41.2 M0 — Baseline e mapa do projeto

Saída: versões verificadas, fluxo de execução conhecido, bugs reproduzidos, arquivos do usuário preservados e plano de primeira correção. Dependência: acesso ao repositório real.

Não iniciar aquisição de assets e migração de engine antes de saber o que está quebrado.

### 41.3 M1 — Fundação jogável

Corrigir chão, pivôs, física, câmera, retorno, input e diálogo. Manter o cenário atual temporariamente quando necessário para isolar causas. Usar debug para medir, não para apresentar como jogo final.

Saída: casos PHY, CAM e INP prioritários passando; vídeo de ida/volta; contato estável; conversa correta. Só depois expandir mundo.

### 41.4 M2 — Padrão visual

Escolher um quarteirão; fechar escala; aprovar Nero neutro, caminhada e um golpe; criar chão, fachada, fundo, três NPCs, uma interação, áudio e atmosfera. Comparar cena sem efeitos e com efeitos.

Saída: trecho de referência consistente. Se a arte não pode ser produzida no ambiente, gerar pedidos precisos e avançar integração sem fingir conclusão artística.

### 41.5 M3 — Combate básico

Integrar combo, disparo, recarga, dano, hitstop e esquiva em arena existente ou cena técnica dentro do mesmo projeto. Testar um alvo simples antes de Winsth.

Saída: hitboxes sincronizadas, munição correta, feedback material, clips coerentes e reset. Não construir IA complexa sobre dano duplicado.

### 41.6 M4 — Winsth

Validar escala; implementar quatro padrões; produzir suas animações; calibrar telegraphs; integrar arena e efeitos. Adiar fase extra até a luta básica ser justa.

Saída: confronto completo de teste, sem inserir capítulo narrativo. Registrar falhas de arte separadas das falhas de lógica.

### 41.7 M5 — Prólogo completo

Expandir a linguagem aprovada para quatro regiões; medir caminhada ativa; implementar NPCs, acontecimentos, transições e cutscene. A narrativa continua limitada à abertura.

Saída: percurso completo, retorno, ritmo, cena final e reinício. Não declarar 180 segundos com base em estimativa de mapa.

### 41.8 M6 — Produto e publicação

Menu, configurações, acessibilidade, save, lifecycle, performance, build e container. Testar o artefato e a HML autorizada. Algumas dessas tarefas começam antes; o marco consolida o conjunto.

Saída: build identificável, relatório de testes, limitações, instruções reais e evidências de publicação quando executada.

### 41.9 Trabalho em paralelo

Arte, áudio e documentação de conteúdo podem avançar enquanto a física é corrigida, desde que escala e contratos estejam estabilizados. Dois agentes não devem editar o mesmo controller/câmera simultaneamente.

Definir dono por área e integração em checkpoints. Não somar branches divergentes no fim sem testes. Uma integração menor e constante evita que o jogo fique quebrado durante toda a sessão.

### 41.10 Regra de foco

Quando a dimensão mais fraca for controle, não adicionar cinco efeitos. Quando for arte, não responder com novos menus. Quando for leitura de boss, não aumentar HP. O backlog deve refletir a experiência atual, não a lista de possibilidades mais longa.

[Voltar ao índice](#indice)

---


<a id="sec-42"></a>

## 42 · Briefs de produção: pedidos de arte, animação e som

Cada brief deve ser adaptado ao padrão existente e preenchido com status real. Não solicitar “um cenário lindo” ou “animação AAA” sem dimensões, função e critérios.

### 42.1 BRF-01 — Nero, padrão visual

**Finalidade:** estabelecer a identidade e a escala de todo o jogo.

**Conteúdo:** pose neutra de medição; laterais coerentes; detalhe da máscara, prótese e revólver; paleta; marcação dos pés; primeira caminhada e soco.

**Restrições:** 1,80 m; um braço mecânico; sobretudo marrom; máscara de corvo; nenhuma anatomia nova. Lado da prótese precisa ser decidido e registrado.

**Entrega:** fonte editável, PNG transparente, metadados e prévia em escala real.

**Reprovação:** personagem legível apenas ampliado; mudança de braço entre direções; pés desalinhados; máscara inconsistente; textura sem linguagem de pixel art.

### 42.2 BRF-02 — Winsth, escala e marreta

**Finalidade:** definir massa, silhueta e envelope do ataque.

**Conteúdo:** pose ereta ao lado de Nero; detalhes de mandíbula e braços; colete sem camisa; calça industrial; cartola preta; marreta; idle; preparação e impacto vertical.

**Restrições:** 2,30 m de corpo; cartola e arma fora da medida; volume não depende de altura exagerada.

**Entrega:** mesmos padrões de metadados de Nero; sockets da marreta e pivôs documentados.

**Reprovação:** corpo com o dobro da altura de Nero; arma cortada; roupa errada; dois sprites de estilos incompatíveis.

### 42.3 BRF-03 — Filha e encontro

**Finalidade:** atuação afetiva da abertura.

**Conteúdo:** ficha proposta, idle, reconhecimento, saudação e corrida. Nome/idade final pendentes.

**Restrições:** não produzir atropelamento visível; não criar história adicional; manter perspectiva e escala do mundo.

**Entrega:** fontes, clips, trajetória de teste e integração no storyboard.

**Reprovação:** adulto reduzido; movimento mecânico; objeto escolar muda de mão sem continuidade; cena antecipa tragédia por exagero.

### 42.4 BRF-04 — Piso do bairro operário

**Finalidade:** contato confiável e materialidade.

**Conteúdo:** módulos de pedra, bordas, emendas, encontro com parede, trilhos, tampa, poça e decals.

**Restrições:** superfície física legível; variação sem ruído; grid consistente; não depender de um collider por pedra.

**Entrega:** tileset/atlas, mapa de teste e indicação de superfícies.

**Reprovação:** grade uniforme evidente; seam; pedra com escala incompatível com botas; sombra que faz o pé flutuar.

### 42.5 BRF-05 — Fachada autoral

**Finalidade:** primeira assinatura arquitetônica do Black Bird.

**Conteúdo:** massa principal, porta, janelas, materiais, tubulações funcionais, letreiro, desgaste e uma interação.

**Restrições:** visão lateral; sem assets top-down disfarçados; ornamento com função/composição; altura de porta coerente com Nero.

**Entrega:** camadas separáveis quando necessário, variantes de estado e integração com piso/fundo.

**Reprovação:** retângulo com textura repetida; detalhes ilegíveis; perspectiva conflitando com rua.

### 42.6 BRF-06 — Fábrica monumental ao fundo

**Finalidade:** marco visível que conecta regiões.

**Conteúdo:** silhueta única, volumes industriais, pontos de emissão, camadas de profundidade e iluminação.

**Restrições:** não repetir como papel de parede; contraste inferior ao plano jogável; motivo visual consistente.

**Entrega:** camadas de parallax, versão sem efeitos e enquadramentos de teste.

**Reprovação:** imagem genérica que não se conecta à cidade; monumento cortado sem intenção; excesso de detalhe competindo com o jogador.

### 42.7 BRF-07 — Mercado e população

**Finalidade:** vida cotidiana e contraste social.

**Conteúdo:** bancas, objetos, três ou mais NPCs funcionais no trecho, rotinas e uma pequena cena ambiental.

**Restrições:** personagens não são só recolors; passagem legível; conversa interrompe interlocutor; áudio não vira ruído contínuo.

**Entrega:** assets, rotas, diálogos propostos, animações de tarefa e estados de interação.

**Reprovação:** todos andando em sincronia; NPC atravessa banca; densidade esconde Nero.

### 42.8 BRF-08 — Escola

**Finalidade:** destino reconhecível e cenário da cutscene.

**Conteúdo:** fachada, portão, área de espera, plano da rua, pontos de atuação de Nero/filha e entrada do veículo.

**Restrições:** não parecer arena; enquadramento comporta a sequência; símbolos e nomes definitivos pendentes.

**Entrega:** mapa com marcas cinematográficas, layers e versão de teste da chegada.

**Reprovação:** carro surge sem espaço; criança atravessa cenário; câmera não mostra relação entre personagens.

### 42.9 BRF-09 — Arena de Winsth

**Finalidade:** leitura e espetáculo controlado.

**Conteúdo:** piso claro, limites, marcos, fundo industrial, luz, vapor e espaço de fuga.

**Restrições:** nenhum hazard adicional na primeira validação; telegraphs não cobertos; layout suporta investida e onda.

**Entrega:** cena integrada no projeto existente, reset e quatro pontos de captura.

**Reprovação:** beleza que esconde ataques; canto sem escape; foreground na frente da marreta.

### 42.10 BRF-10 — Pacote de impactos

**Finalidade:** distinguir materiais e ações.

**Conteúdo:** metal, pedra, madeira quando usada, corpo/tecido, flash do revólver, marreta e descarga.

**Restrições:** eventos reais; limites de emissão; sinais essenciais preservados em qualidade baixa.

**Entrega:** atlas/VFX data, sons correspondentes, teste de um evento por hit.

**Reprovação:** mesmo efeito para tudo; partículas sem direção; efeitos duplicados; câmera tremendo continuamente.

### 42.11 BRF-11 — Paisagem sonora

**Finalidade:** profundidade e identidade de região.

**Conteúdo:** loops sem emendas perceptíveis, eventos pontuais, fontes próximas/distantes, transições e mix da cutscene.

**Restrições:** recursos licenciados/autoria registrada; sem música comercial provisória distribuída; controle de volume e autoplay.

**Entrega:** arquivos, licenças, cue sheet, buses, variações e sessão de escuta.

**Reprovação:** loop reinicia em cada chunk; clipping; telegraphs mascarados; acidente depende de pico agressivo.

### 42.12 BRF-12 — Interface

**Finalidade:** acesso claro ao jogo sem aparência de dashboard.

**Conteúdo:** menu, pausa, configurações, diálogo, HUD de arena, conclusão e erros.

**Restrições:** português legível; teclado; remapeamento; escala de texto; mundo com área útil ampla.

**Entrega:** componentes/assets integrados, estados de foco e teste em resoluções.

**Reprovação:** botão sem função; continuar sem save; moldura consome tela; texto cortado; debug apresentado como HUD final.

### 42.13 Checklist de qualquer brief

Objetivo visível; contexto de uso; dimensões/unidades; referências permitidas; elementos obrigatórios; proibições; estados; direção; arquivos-fonte; exportação; integração; testes; licença; status. Um pedido de produção sem esses campos gera decisões inconsistentes entre assets.

[Voltar ao índice](#indice)

---


<a id="sec-43"></a>

## 43 · Backlog executável e rastreabilidade

Este backlog é uma ordem de trabalho proposta. Repriorizar pela evidência da auditoria, sem perder os requisitos do proprietário. P0/P1/P2 aqui indicam prioridade de produção; a severidade de bugs é avaliada separadamente em §38.

| ID | Trabalho | Dependências | Evidência de conclusão |
|---|---|---|---|
| P0-01 | Auditar root, instruções e alterações locais | Nenhuma | Mapa do projeto e trabalho do usuário preservados. |
| P0-02 | Confirmar versões e comandos | P0-01 | Execução inicial real, sem assumir Phaser 4. |
| P0-03 | Reproduzir defeitos relatados | P0-02 | Capturas e passos para chão, câmera, retorno e diálogo. |
| P0-04 | Definir referencial de pés e escala | P0-03 | Nero/Winsth medidos; art/body separados. |
| P0-05 | Corrigir colisão e chão | P0-04 | PHY-01/02/09/10 sem falha relevante. |
| P0-06 | Consolidar dono de câmera | P0-03 | CAM-01/02/03/05 passam. |
| P0-07 | Restaurar retorno entre regiões | P0-06 | CAM-07/08 e percurso reverso funcionam. |
| P0-08 | Corrigir diálogo e bloqueios | P0-05 | INP-01 a INP-05 e INP-09/10 funcionam. |
| P0-09 | Tratar foco e inputs residuais | P0-08 | INP-06, pausa e retomada confiáveis. |
| P0-10 | Validar build atual | P0-02 | Artefato executa fora do dev server. |
| P1-01 | Auditar assets e licenças | P0-01 | Manifest com status real, sem aprovação inventada. |
| P1-02 | Fixar escala/paleta/lateralidade | P0-04, P1-01 | BRF-01 e BRF-02 com decisões registradas. |
| P1-03 | Produzir/revisar idle e walk de Nero | P1-02 | ART-01/02/03 aprovados tecnicamente. |
| P1-04 | Reconstruir piso de referência | P0-05, P1-02 | BRF-04 e contato visual estável. |
| P1-05 | Produzir fachada e marco de fundo | P1-02 | BRF-05/06, sem VFX mascarando ausência de arte. |
| P1-06 | Integrar parallax e luz | P1-05, P0-06 | Profundidade sem drift ou ilegibilidade. |
| P1-07 | Integrar três NPCs e interação | P0-08, P1-03 | Rotinas e estilos coerentes. |
| P1-08 | Fechar quarteirão de referência | P1-03 a P1-07 | Vídeo e capturas, pendência editorial explícita. |
| P1-09 | Centralizar dados de ataques | P0-05 | Timelines e unidades validadas. |
| P1-10 | Implementar dano único e hitboxes | P1-09 | COM-01/02/03/10 passam. |
| P1-11 | Integrar combo de Nero | P1-10, P1-03 | COM-04/05 com animação coerente. |
| P1-12 | Integrar tiro e recarga | P1-10 | COM-06/07/08/09 passam. |
| P1-13 | Integrar esquiva e reação | P1-11 | COM-11/12 e cancelamentos verificados. |
| P1-14 | Produzir Winsth neutro e locomoção | P1-02 | BOS-01 e envelope de marreta corretos. |
| P1-15 | Integrar quatro ataques de Winsth | P1-14, P1-10 | BOS-02 a BOS-05 isoladamente justos. |
| P1-16 | Integrar decisão e recuperação do boss | P1-15 | BOS-06/07/08 passam. |
| P1-17 | Fechar arena e reset | P1-16, P1-12 | BOS-09/10 e BRF-09 verificados. |
| P1-18 | Expandir mapa do prólogo | P1-08, P0-07 | Regiões distintas e duração dimensionada. |
| P1-19 | Escrever/revisar diálogos da abertura | P0-08 | Texto proposto, sem cânone adicional indevido. |
| P1-20 | Produzir filha e escola | P1-02, P1-18 | BRF-03/08 prontos para montagem. |
| P1-21 | Integrar cutscene | P1-20, P0-09 | NAR-04 a NAR-10 passam. |
| P1-22 | Validar duração e retorno do prólogo | P1-18, P1-21 | NAR-01/02/03 medidos no jogo real. |
| P1-23 | Fechar menu, pausa e configurações | P0-09 | UX-02/03/04/08/10 passam. |
| P1-24 | Implementar save robusto | P1-21, P1-23 | REL-01/02/03 passam. |
| P1-25 | Integrar áudio por região e combate | P1-08, P1-17 | Cues, mix, autoplay e licenças verificados. |
| P2-01 | Refinar VFX e clima | P1-08, P1-25 | Presets e FX sem ocultar gameplay. |
| P2-02 | Completar animações secundárias | P1-03, P1-14 | Clips prioritários sem inconsistências. |
| P2-03 | Ampliar acessibilidade | P1-23 | Remapeamento, captions, movimento e texto testados. |
| P2-04 | Otimizar performance medida | P1-22, P1-17 | Perfil com percentis e limites declarados. |
| P2-05 | Validar ciclo de vida do navegador | P1-24, P1-25 | REL-07 e foco/resize/áudio seguros. |
| P2-06 | Consolidar build/container | P0-10, P2-04 | REL-04/05/06/10 no ambiente disponível. |
| P2-07 | Executar matriz de regressão | P1 e P2 pertinentes | Resultados reais e bloqueios identificados. |
| P2-08 | Validar HML autorizada | P2-06, acesso autorizado | URL, boot, versão e atualização comprovados. |
| P2-09 | Revisar licenças e conteúdo servido | P1-01, P2-06 | Sem assets/segredos indevidos no runtime. |
| P2-10 | Preparar handoff final | P2-07, P2-09 | Estado real, evidências, pendências e comandos. |

### Rastreabilidade do pedido original

| Requisito do proprietário | Seções de apoio | Evidência principal |
|---|---|---|
| Continuar no código existente | 00, 03, 31, 44 | Diff localizado no projeto real; nenhum segundo jogo. |
| Arte muito superior, referência Blasphemous | 02, 09–17, 42 | Quarteirão, sprites e revisão artística. |
| Chão e personagens sem flutuar | 10, 19 | PHY-01/02/10 e captura de contato. |
| Câmera contínua | 20 | CAM-01 a CAM-06. |
| Possibilidade de voltar | 08, 30 | CAM-02/07/08 e NAR-03. |
| NPC parar ao conversar | 18, 25 | INP-01 a INP-05. |
| Golpes e animações integrados | 15–17, 21–23 | COM e BOS com vídeo real. |
| Nero 1,80 m; Winsth 2,30 m | 11, 12, 19, 32 | BOS-01, sem contar acessórios. |
| Cidade viva e dinâmica | 08–10, 13, 25, 26, 28 | Percurso com eventos, rotinas e atmosfera. |
| História somente no começo | 01, 06, 07, 27 | Prólogo termina sem capítulo adicional. |
| Pelo menos três minutos caminhando | 07, 39 | NAR-01 com medição ativa. |
| Testar Huddle Engineering | 35–37 | Build e HML verificados separadamente. |

### Regra de encerramento de tarefa

Uma tarefa não fecha porque “o código foi escrito”. Fecha quando a integração existe, os critérios pertinentes foram exercitados e as limitações estão registradas. Arte pendente impede declarar conclusão artística; acesso externo ausente impede declarar HML validada.

[Voltar ao índice](#indice)

---


<a id="sec-44"></a>

## 44 · Protocolo de trabalho autônomo do Codex

### 44.1 Mandato

Trabalhar com autonomia nas decisões locais, reversíveis e compatíveis com o cânone. O proprietário quer avanço real, não uma série de perguntas sobre detalhes menores. Ao mesmo tempo, autonomia não autoriza inventar resultados, gastar dinheiro, apagar trabalho ou alterar infraestrutura.

### 44.2 Ciclo de execução

Escolher problema prioritário → ler seções relevantes → inspecionar código → formular hipótese → alterar → compilar/testar → executar no navegador → observar → corrigir → registrar evidência → escolher próximo problema.

Não pesquisar indefinidamente. Não implementar cegamente. Não fazer só screenshots de menus. Cada ciclo precisa mover a qualidade percebida ou remover um bloqueio concreto.

### 44.3 Continuidade

Manter um arquivo de progresso curto no local adequado do repositório: commit/base; alterações em curso; comandos reais; testes recentes; bugs abertos; decisões; próximos passos; recursos indisponíveis. Referenciar este documento por seção.

Não reescrever toda a bíblia para registrar cada microalteração. Manter especificação e status separados. Se a sessão terminar, o próximo agente deve saber exatamente onde retomar.

### 44.4 Checkpoints

Fazer checkpoints locais conforme política do projeto. Não criar commits contendo alterações alheias sem intenção. Não fazer push, merge ou deploy externo sem autorização correspondente.

Antes de um checkpoint, executar testes focados e verificar que o jogo abre. Nos marcos de integração, executar suíte ampla e revisão visual. Não acumular dezenas de sistemas sem compilar entre eles.

### 44.5 Trabalho paralelo

Dividir por fronteiras claras: arte/manifest, áudio, testes, nível, controller. Um único dono integra mudanças no núcleo. Compartilhar contratos de escala e eventos antes de produzir assets ou lógica dependente.

Não executar vários servidores, builds pesados ou geradores simultâneos sem observar recursos da VM. “Muitos tokens” não elimina limites de CPU, disco, rede e sessão.

### 44.6 Bloqueios artísticos

Se não há ferramenta ou habilidade para produzir quadros finais, especificar exatamente o que falta: personagem, clip, direção, número estimado, pivô, material, evento e critério visual. Continuar integrando e testando o que existe, mantendo status de revisão.

Não substituir uma animação ausente por escala/rotação de uma pose e chamar de final. Não transformar falta de arte em desculpa para não corrigir câmera e física.

### 44.7 Bloqueios técnicos

Se o navegador não está disponível, executar testes de lógica/build e registrar que a revisão visual não ocorreu. Se Docker não está disponível, não afirmar que a imagem foi construída. Se HML não está acessível, documentar o contrato e a etapa pendente.

Não fabricar logs, capturas ou resultados. Não reaproveitar evidência de outro build como se fosse atual.

### 44.8 Limites de decisão

Pode escolher implementação local, ajustar parâmetros, refatorar sistemas e propor conteúdo secundário da abertura. Deve interromper a ação específica diante de risco de perda de dados, custo, credencial, licença incerta, alteração de produção ou mudança de cânone. Continuar tarefas independentes seguras.

Não precisa parar todo o trabalho porque a cor do colete está pendente; pode usar variante de revisão. Precisa evitar produzir uma campanha inteira baseada em uma decisão narrativa não aprovada.

### 44.9 Encerramento de sessão

Entregar estado verificável, não promessa de continuar em segundo plano. Indicar o que foi feito, testado, não testado, bloqueado e próximo passo. A duração da ferramenta e seus limites reais podem interromper uma sessão longa; a continuidade deve estar nos arquivos, não em uma garantia de execução ininterrupta.

### 44.10 Regra central

O critério de sucesso é o jogo existente ficar melhor nas mãos e nos olhos do jogador. Não é zerar tokens, aumentar complexidade ou gerar a maior quantidade possível de arquivos.

[Voltar ao índice](#indice)

---


<a id="sec-45"></a>

## 45 · Definição de pronto, revisão final e handoff

### 45.1 Pronto técnico

O jogo inicia pelo fluxo real; recursos carregam; controles e câmera funcionam; chão é estável; retorno existe; diálogos não quebram estado; combate respeita suas timelines; save e reset são seguros; não há erro crítico conhecido oculto.

### 45.2 Pronto artístico

Nero e Winsth mantêm identidade e escala; clips prioritários são coerentes; chão e arquitetura têm materialidade; fundo possui composição; NPCs pertencem ao mundo; efeitos não escondem lacunas; áudio tem função; interface é legível.

A avaliação artística do proprietário não pode ser substituída por um checklist marcado pelo agente. Distinguir “preparado para revisão” de “aprovado”.

### 45.3 Pronto narrativo

A abertura respeita a premissa; caminhada significativa foi medida; cidade apresenta contexto; filha aproxima; veículo aparece; preto precede impacto; áudio comunica o acidente; encerramento não inventa capítulos posteriores.

### 45.4 Pronto de publicação

Artefato de produção testado; container/servidor conforme ambiente; assets e licenças registrados; build identificável; health e boot distintos; HML validada somente quando realmente acessada. Uma entrega local pode ser tecnicamente útil e ainda ter publicação bloqueada.

### 45.5 Checklist final

- O repositório original continua sendo o produto.
- O nome público está correto; aliases e migrações não quebram dados.
- Nenhuma engine foi trocada sem decisão justificada e autorizada.
- Os defeitos relatados possuem reprodução e evidência de correção.
- Arte de referência não foi rotulada como final sem revisão.
- A proporção 1,80/2,30 foi verificada pelos corpos.
- Os golpes têm preparação, dano e recuperação sincronizados.
- NPCs e Nero param durante diálogo e retomam corretamente.
- A câmera acompanha e o mundo permite voltar.
- O prólogo não contém combate ou capítulo adicional obrigatório.
- O tempo de caminhada foi medido, não inferido.
- Configurações, foco, pausa e reinício funcionam.
- Testes não executados estão explicitamente marcados.
- Nenhuma credencial ou arquivo privado entrou no build.
- O relatório distingue aplicação pronta de plataforma validada.

### 45.6 Modelo de relatório

```text
BUILD / COMMIT:
AMBIENTE:
OBJETIVO DO CHECKPOINT:

ALTERAÇÕES EFETIVAS:
- sistema, arquivos e efeito percebido

EVIDÊNCIAS:
- captura/vídeo/log, cenário e build correspondente

TESTES:
- IDs, resultado observado e limitações

ARTE:
- finalizada tecnicamente / em revisão / faltante

NARRATIVA:
- escopo implementado e confirmação de que não foi expandido

PUBLICAÇÃO:
- local / container / HML, cada um com status independente

RISCOS E BUGS ABERTOS:
- severidade, reprodução e próximo passo

COMANDOS REAIS:
- desenvolvimento, build, testes, preview e execução autorizada

PRÓXIMA PRIORIDADE:
- uma ação concreta com critério de sucesso
```

### 45.7 Não compensar pendência com adjetivos

Não escrever “AAA”, “cinematográfico” ou “profissional” como substituto de evidência. Descrever o que mudou: pés alinhados, camera contínua, quatro ataques legíveis, três regiões com parallax, áudio por material, etc.

Quando algo continuar ruim, dizer qual parte, por quê e o que falta. Uma entrega parcial honesta e útil é superior a um relatório de conclusão que o usuário desmente ao abrir o jogo.

[Voltar ao índice](#indice)

---


<a id="sec-46"></a>

## 46 · Glossário, unidades e registro de decisões

### 46.1 Glossário operacional

| Termo | Uso neste documento |
|---|---|
| Cânone | Decisão narrativa/visual estabelecida pelo proprietário. |
| Vertical slice | Trecho pequeno que integra qualidade representativa de várias disciplinas. |
| Blockout | Representação temporária para validar espaço e mecânica. |
| Game feel | Sensação produzida por resposta, movimento, animação, câmera, som e consequência. |
| Telegraph | Preparação que comunica um ataque antes do dano. |
| Startup | Tempo de preparação de uma ação. |
| Active | Intervalo em que o ataque pode atingir. |
| Recovery | Compromisso após o golpe antes da próxima ação permitida. |
| Hitstop | Pausa breve e controlada para enfatizar impacto. |
| Hitbox | Região ofensiva. |
| Hurtbox | Região que recebe dano. |
| Collider | Região física para contato com o mundo. |
| Pivot/âncora | Referência estável usada para posicionar arte. |
| Trim | Remoção de margens vazias no atlas, com metadados de reconstrução. |
| Socket | Ponto local para arma, efeito ou contato. |
| Coyote time | Tolerância curta de salto após deixar apoio. |
| Input buffer | Memória breve de uma intenção recente. |
| Deadzone | Região de liberdade do alvo antes de deslocar a câmera. |
| Look-ahead | Antecipação do enquadramento na direção relevante. |
| Parallax | Movimento relativo de planos para sugerir profundidade. |
| Frame time | Tempo por frame; complementa a leitura de FPS. |
| Softlock | Estado em que o jogo continua rodando, mas o progresso/controle fica inviável. |
| HML | Ambiente de homologação, separado de produção. |
| Release ready | Recurso com arte, integração, orçamento e proveniência verificados. |

### 46.2 Unidades

Tempo de design em milissegundos; integração física em segundos conforme a engine; posição e dimensões em unidades lógicas; arte em pixels-fonte; medidas de personagem em metros de referência; UI em unidades de apresentação adequadas ao navegador.

Nunca somar milissegundos e segundos implicitamente. Não misturar pixels de textura com coordenadas de mundo sem fator explícito. Não medir corpo pela caixa transparente do PNG.

### 46.3 Fontes de verdade dos parâmetros

Movimentação: §19. Combate de Nero: §22. Boss: §23. Escala visual: §§11–12 e decisão auditada do projeto. Orçamentos: §33. Contagens de animação: §§16–17. Todos os números propostos podem ser calibrados; registrar a mudança e atualizar a configuração real.

Se outro trecho trouxer um exemplo ilustrativo, não substituir automaticamente o parâmetro central. Exemplos JSON de §32 são demonstrativos e precisam de adaptação.

### 46.4 Registro de decisão

ID; data; problema; opções; evidência; decisão; status de aprovação; impacto; arquivos; testes; possibilidade de reversão. Decisões importantes: escala, lateralidade, resolução, modelo de projétil, esquema de recarga, arquitetura de mundo e política de save.

Não registrar dezenas de decisões irrelevantes. O registro deve ajudar o próximo desenvolvedor a entender por que algo foi feito.

### 46.5 Decisões abertas prioritárias

Confirmar engine/versão; escala existente; lado anatômico da prótese; assets utilizáveis; qualidade das referências; disponibilidade de ferramentas; regras Git; recursos da VM; caminho de publicação. Nome/idade da filha e outros detalhes narrativos podem permanecer provisórios enquanto a base técnica avança.

### 46.6 Critério de mudança de especificação

Uma proposta pode mudar por teste melhor, limitação real ou decisão artística. Um requisito do proprietário não pode ser enfraquecido silenciosamente. Reduzir o prólogo para 40 segundos ou remover retorno não é “otimização”; é mudança de escopo que precisa de decisão.

[Voltar ao índice](#indice)

---


<a id="sec-47"></a>

## 47 · Fontes, proveniência e limites da pesquisa

### 47.1 Origem do cânone

**C01 — Decisões do proprietário nesta conversa.** Base para título, gênero, steampunk, Nero, Winsth, alturas, premissa, abertura, problemas relatados e continuidade no código existente.

**C02 — Documento inicial “NEON FALL: PROTOCOL ZERO”, fornecido como contexto.** Referência histórica do objetivo web/GitHub/HML e da stack preferencial. Sua estética cyberpunk, nomes e narrativa provisória foram superados pelas decisões posteriores do proprietário.

O pacote de laboratório mencionado anteriormente não foi adotado como produto nem como prova do estado atual do jogo. Esta especificação não pressupõe que seus módulos, testes ou atlas estejam integrados ao repositório.

### 47.2 Fontes técnicas

Consulta para esta edição: **31 de outubro de 2026**. As páginas podem mudar; ao implementar, conferir versão, commit e licença. Os textos de projeto, parâmetros e propostas criativas são desta especificação. As fontes sustentam observações técnicas identificadas, não aprovam automaticamente as escolhas para Black Bird.


<a id="fonte-s01"></a>

**[S01] Celeste — Classic.cs**  
Código público inspecionado. Buffer de salto, tolerância de solo e advertência do próprio arquivo sobre seu caráter de tradução. Não é o código completo do jogo comercial.  
Fonte: [Celeste — Classic.cs](https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/PICO-8/Classic.cs)

<a id="fonte-s02"></a>

**[S02] Celeste — comentários sobre a classe do jogador**  
Comentário dos desenvolvedores consultado. Ordem de atualização, organização do controller e animação orientada a dados; aplicar com julgamento, não como receita universal.  
Fonte: [Celeste — comentários sobre a classe do jogador](https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Readme.md)

<a id="fonte-s03"></a>

**[S03] SuperTux — camera.cpp**  
Código público inspecionado. Responsabilidades de câmera e declaração de licença no arquivo. Não incorporar código sem análise de compatibilidade.  
Fonte: [SuperTux — camera.cpp](https://raw.githubusercontent.com/SuperTux/supertux/master/src/object/camera.cpp)

<a id="fonte-s04"></a>

**[S04] doukutsu-rs — player/mod.rs**  
Código público inspecionado. Separação de limites visuais/físicos, aparência e controle. Não implica autorização de uso dos assets de Cave Story.  
Fonte: [doukutsu-rs — player/mod.rs](https://raw.githubusercontent.com/doukutsu-rs/doukutsu-rs/master/src/game/player/mod.rs)

<a id="fonte-s05"></a>

**[S05] doukutsu-rs — boss/balfrog.rs**  
Código público inspecionado. Estados, contadores e eventos de boss. Referência de organização, não de padrões a copiar para Winsth.  
Fonte: [doukutsu-rs — boss/balfrog.rs](https://raw.githubusercontent.com/doukutsu-rs/doukutsu-rs/master/src/game/npc/boss/balfrog.rs)

<a id="fonte-s06"></a>

**[S06] KoBeWi — Metroidvania System**  
Apresentação do repositório consultada. Trilha adicional para estudo de framework de metroidvania em Godot; não auditado integralmente aqui.  
Fonte: [KoBeWi — Metroidvania System](https://github.com/KoBeWi/Metroidvania-System)

<a id="fonte-s07"></a>

**[S07] GDQuest — godot-platformer-2d**  
Apresentação do repositório consultada. Projeto educacional; distinguir demo de código de um grande jogo comercial.  
Fonte: [GDQuest — godot-platformer-2d](https://github.com/gdquest-demos/godot-platformer-2d)

<a id="fonte-s08"></a>

**[S08] Phaser — Cameras**  
Documentação oficial consultada. Follow, deadzone, bounds e modos de enquadramento; conferir a versão instalada.  
Fonte: [Phaser — Cameras](https://docs.phaser.io/phaser/concepts/cameras)

<a id="fonte-s09"></a>

**[S09] Phaser — Arcade Physics**  
Documentação oficial consultada. Formas e responsabilidades da física; Arcade e Matter são sistemas distintos.  
Fonte: [Phaser — Arcade Physics](https://docs.phaser.io/phaser/concepts/physics/arcade)

<a id="fonte-s10"></a>

**[S10] Phaser — Animations**  
Documentação oficial consultada. Clips por quadros e integração com sprites/texturas; verificar API da versão real.  
Fonte: [Phaser — Animations](https://docs.phaser.io/phaser/concepts/animations)

<a id="fonte-s11"></a>

**[S11] Thomas Vasseur — processo de animação de Dead Cells**  
Relato primário do artista consultado. Alternativa de produção 3D para apresentação 2D. Não representa pipeline implementado neste projeto.  
Fonte: [Thomas Vasseur — processo de animação de Dead Cells](https://www.gamedeveloper.com/production/art-design-deep-dive-using-a-3d-pipeline-for-2d-animation-in-i-dead-cells-i-)

<a id="fonte-s12"></a>

**[S12] Aseprite — Command Line Interface**  
Documentação oficial consultada. Exportação de imagem e JSON. Ferramenta, licença e instalação precisam existir no ambiente.  
Fonte: [Aseprite — Command Line Interface](https://www.aseprite.org/docs/cli/)

<a id="fonte-s13"></a>

**[S13] Tiled — Working with Layers**  
Documentação oficial consultada. Camadas visuais, objetos e propriedades para conteúdo editável.  
Fonte: [Tiled — Working with Layers](https://doc.mapeditor.org/en/stable/manual/layers/)

<a id="fonte-s14"></a>

**[S14] Epic Games — Animation Notifies**  
Documentação oficial consultada. Conceito de eventos sincronizados à animação; não é recomendação de migrar para Unreal.  
Fonte: [Epic Games — Animation Notifies](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine)

<a id="fonte-s15"></a>

**[S15] Microsoft — XAG 117, movimento e distrações visuais**  
Diretriz oficial consultada. Revisão de movimento, flashes e opções de apresentação; não certificação automática.  
Fonte: [Microsoft — XAG 117, movimento e distrações visuais](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/117)

<a id="fonte-s16"></a>

**[S16] MDN — Autoplay e Web Audio**  
Documentação técnica consultada. Políticas de reprodução automática e tratamento do áudio no navegador.  
Fonte: [MDN — Autoplay e Web Audio](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)

<a id="fonte-s17"></a>

**[S17] Microsoft — Xbox Accessibility Guidelines**  
Diretrizes oficiais consultadas. Referências de design e teste de acessibilidade, não checklist jurídico de conformidade.  
Fonte: [Microsoft — Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/xbox/accessibility/guidelines)

<a id="fonte-s18"></a>

**[S18] Microsoft — XAG 107, input**  
Diretriz oficial consultada. Alternativas de controle e redução de barreiras de entrada.  
Fonte: [Microsoft — XAG 107, input](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107)

<a id="fonte-s19"></a>

**[S19] Vite — Deploying a Static Site**  
Documentação oficial consultada. Build e publicação estática; preview local não é o servidor de produção proposto.  
Fonte: [Vite — Deploying a Static Site](https://vite.dev/guide/static-deploy)

<a id="fonte-s20"></a>

**[S20] MDN — WebGL best practices**  
Documentação técnica consultada. Limites de recursos, texturas e performance no cliente.  
Fonte: [MDN — WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

<a id="fonte-s21"></a>

**[S21] MDN — Page Visibility API**  
Documentação técnica consultada. Visibilidade da página e restrições de execução em segundo plano.  
Fonte: [MDN — Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)

<a id="fonte-s22"></a>

**[S22] MDN — WebGLRenderingContext.isContextLost**  
Documentação técnica consultada. Detecção de perda de contexto e necessidade de tratamento.  
Fonte: [MDN — WebGLRenderingContext.isContextLost](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/isContextLost)

<a id="fonte-s23"></a>

**[S23] Docker — Multi-stage builds**  
Documentação oficial consultada. Separação entre construção e artefatos necessários à execução.  
Fonte: [Docker — Multi-stage builds](https://docs.docker.com/build/building/multi-stage/)

<a id="fonte-s24"></a>

**[S24] Playwright — Visual comparisons**  
Documentação oficial consultada. Comparações de screenshots e influência do ambiente de renderização.  
Fonte: [Playwright — Visual comparisons](https://playwright.dev/docs/test-snapshots)


### 47.3 Limites da pesquisa

Não foi auditado o repositório completo do jogo do usuário. Não foram executados aqui o seu build, seus testes, sua versão do Phaser ou sua HML. Não foi reproduzido o código integral de nenhum jogo comercial.

A leitura de código externa foi focal nos arquivos indicados. Repositórios apenas apresentados como trilha adicional estão identificados dessa forma. A documentação técnica informa possibilidades; o Codex precisa conferir sua aplicação à versão e arquitetura locais.

### 47.4 Registro de pesquisa durante a execução

Ao consultar outra fonte, acrescentar URL, data, versão/commit, arquivo lido, observação, decisão e licença quando pertinente. Não transformar resultados de busca em afirmações de código estudado. Não adicionar dezenas de links sem explicar o problema que cada um resolve.

[Voltar ao índice](#indice)

---


<a id="sec-48"></a>

## 48 · Diretiva final para o Codex — início da execução

O texto abaixo consolida o mandato. Deve ser usado junto a este documento no **repositório existente**.

```text
Você está continuando o desenvolvimento do Black Bird: Revolução
a partir do código que já existe neste repositório.

Este documento é a especificação de apoio. Não é outro projeto,
não é um pacote para substituir o jogo e não autoriza começar do zero.

1. Leia as instruções do repositório e a seção 00.
   Preserve alterações locais do usuário e identifique a raiz real do jogo.

2. Leia o cânone e as decisões abertas nas seções 01 e 06.
   A história implementada permanece somente na abertura.
   Winsth fica em uma arena de desenvolvimento separada.

3. Audite o código conforme a seção 03.
   Confirme engine, versão, scripts, física, câmera, assets e build.
   Não assuma Phaser 4 nem migre de engine por conveniência.

4. Reproduza os defeitos relatados.
   Corrija primeiro chão/pés, câmera contínua, retorno entre áreas,
   input e diálogos. Os interlocutores devem parar ao conversar.

5. Adote os contratos pertinentes sem reescrever tudo.
   Use as seções de movimentação, animação, combate e dados para
   integrar soluções ao sistema real. Evite implementações concorrentes.

6. Construa um quarteirão de referência com identidade artística.
   Arte não pode ser substituída por retângulos e filtros apresentados
   como final. Referências e poses em revisão não são animações prontas.

7. Produza e integre Nero, Winsth, golpes, efeitos, áudio e cenários
   pelos catálogos e briefs. Preserve 1,80 m e 2,30 m de altura corporal,
   sem contar cartola, armas ou margens transparentes.

8. Trate parâmetros numéricos como propostas de calibração.
   Meça a experiência, ajuste com evidência e registre decisões.
   Não mude o cânone nem enfraqueça requisitos para fazer testes passarem.

9. Complete o prólogo: cidade viva, pelo menos três minutos de caminhada
   significativa, escola e cutscene com preto antes do impacto.
   Não invente capítulos posteriores, encontro com facção ou final.

10. Execute o jogo real no navegador e teste o artefato de produção.
    Use a matriz de regressão. Registre testes não executados e bloqueios.
    Não confunda compilação, screenshot ou health HTTP com jogo aprovado.

11. Prepare o contrato de build e publicação para o Huddle Engineering.
    Não altere produção, IAM, Morpheus, repositórios remotos ou credenciais.
    HML só pode ser declarada validada após teste real autorizado.

12. Trabalhe em ciclos de implementação, observação e refinamento.
    Não pare no planejamento. Não aumente escopo para esconder defeitos.
    Mantenha progresso e checkpoints conforme as regras do repositório.

Sua liberdade criativa deve melhorar a experiência do jogador dentro
da identidade definida. O objetivo é um jogo menor, coeso e refinado
antes de um jogo grande e inconsistente.

Comece pela auditoria e pela primeira correção verificável.
```

### Encerramento do documento

A especificação deve apoiar decisões e execução, não substituir observação do jogo. Preservar o que funciona, corrigir causas reais, produzir arte com consistência, validar no navegador e manter honestidade sobre o que ainda falta.

**Black Bird: Revolução é o produto. O repositório existente é a base. A experiência do jogador é o critério.**

[Voltar ao índice](#indice)

---
