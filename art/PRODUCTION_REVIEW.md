# Produção artística — revisão do checkpoint

Nenhum item foi promovido a ART_APPROVED ou RELEASE_READY. Ver os catálogos
§§11–17 e briefs §42 do documento-mestre; esta lista aponta os defeitos reais
do acervo recebido. O manifest técnico está em `asset-audit.json`.

| Recurso | Estado real | Próxima entrega concreta |
|---|---|---|
| Nero N-01 idle | 2 quadros recebidos, REVIEW | 8–10 desenhos distintos, corpo 144 px sem acessórios, pés estáveis; máscara e prótese coerentes em ambas as vistas |
| Nero N-04 caminhada | 3 poses recebidas, REVIEW; vários recortes tocam as bordas | 10–12 quadros articulados por vista, contato/passagem/extensão; ciclo compatível com 140 unidades/s; sem incluir os saltos 5/6 |
| Nero N-16/17/18 melee | 2 poses reutilizadas; timeline mecânica integrada | Soco 1 6–8, soco 2 7–9, finalizador 9–12 como estimativas; preparação/contato/retorno e sockets de punho; sem recortar a mão |
| Nero disparo/recarga/dano | 2 poses de tiro e poses estáticas reutilizadas | N-23/25–27/29, cano/coldre com sockets; evento de emissão único e commit de recarga no fim do contrato atual |
| NPCs | Uma pose e sua translação; playback sem bob artificial | Idle 4–6 e walk 8–10 por personagem necessário; pausa/conversa 4–6; ferramenta/mãos com contato; não produzir clones apenas por recolor |
| Winsth | BLOCKOUT procedimental, 8 poses, arma cortada em várias | W-01/02 e preparação/ativo/recuperação dos quatro ataques; corpo 184 px, colete sem camisa, dois braços mecânicos, mandíbula/cartola/marreta preservados |
| Filha | BLOCKOUT legado `lina`, nome/idade/design abertos | Reconhecer 4–6, saudar 4–6, iniciar corrida 3–5, correr 8–12; sem sprite de atropelamento/dano |
| Piso v2 | REVIEW integrado | Avaliar pedra/escala com botas, seam espelhada e variação; não chamar material refinado sem revisão no jogo |
| Mercado/avenida/escola | Arte legada parcial, fachadas/tile proxies incoerentes | Fachadas autorais em camadas, portas na escala de Nero, marcos distintos e planos de profundidade; não esticar a rua atual para cumprir duração |

## Contrato para o próximo lote

Propostas reversíveis de células, a validar contra o envelope desenhado: Nero
256×224 com pés em (128,208); Winsth 320×320 com pés em (160,304). Esses tamanhos
não definem a altura corporal. Preservar 144/184 px de corpo na fonte e exibição
0,5 no mundo. Não reamostrar o acervo atual automaticamente para esses números.

Entregar fonte editável, PNG transparente, JSON com retângulos, pivôs, sockets,
duração/eventos e estado REVIEW. Cada direção precisa preservar anatomia.
O lado definitivo do braço mecânico de Nero permanece **TO_CONFIRM**; o espelhamento
integral atual não é solução final para essa assimetria.

Critérios para cada lote: fundo claro/escuro; corpo em escala de jogo; ambos os
sentidos; nenhum corte de arma; pés dentro de 1 unidade lógica do apoio estático;
mesma posição física entre clips; eventos não duplicados; licença/proveniência;
execução real no build. Depois solicitar avaliação artística do proprietário.

## Piso entregue nesta sessão

Ferramenta: **imagegen integrado**, sem CLI/API externa configurada.
Fonte: `source/cobble-review-v2-source.png`.
Prompt integral: `source/cobble-review-v2-prompt.txt`.
Pedido: seção lateral de calçamento industrial de pedra escura, paleta quente
discreta, sem textos/personagens, para reduzir e integrar ao piso do jogo.
Derivado: `../public/assets/tilesets/cobble-review-v2.png`, 768×42.
Regenerar derivado: `npm run art:ground`. O original antigo foi preservado.

Avaliação do agente, não aprovação humana: o piso novo tem material mais legível
que os retângulos sobrepostos anteriores; o apoio funciona nas capturas finais.
O cenário das outras regiões e os personagens ainda não atingem uma linguagem
artística consistente. Ver `../docs/evidence/container/start.png` e as capturas
das regiões, além de `../docs/evidence/combat-final/nero-winsth-scale.png`.
