# Evidências — checkpoint de 01/11/2026

Requisitos e limitações: [progresso](../PROGRESSO_CODEX.md).

- `baseline/`: checkout faeb5d5, antes das alterações; o JSON mostra a física
  avançando mesmo com o modo PAUSED.
- `container/`: jogo final em Nginx local. `report.json` registra o bundle e os
  cenários; `service.json` registra imagem, health, 404 real de asset ausente,
  hash do JS comparado ao build local e amostra de frame intervals.
- `combat-final/`: arena técnica no dev server, testes com inputs reais e fixtures
  de posicionamento declaradas. `report.json` descreve asserções concretas.
- `container/regression.webm`: ida/volta, saltos, diálogo, pausa, reinícios e
  cutscene. `combat-final/combat.webm`: armas e quatro padrões de Winsth.

Capturas relevantes: `container/start.png`, `container/returned.png`,
`container/dialogue.png`, `container/small-window.png`, as três
`container/region-*.png`, `container/black-before-end.png`,
`combat-final/nero-melee-left.png` e `combat-final/telegraph-*.png`.

Os vídeos não contêm áudio. Renderização headless por software não comprova
desempenho em outro desktop nem prazer/beleza do gameplay. Os IDs agrupados nos
scripts não equivalem à aprovação integral da matriz de casos do documento-mestre.
NAR-01 permanece **falhou**: ~55 s de ida, requisito mínimo 180 s. Revisão artística
humana, áudio/mix, física em múltiplas taxas e HML não foram aprovados/executados.

Os intermediários desta sessão foram arquivados fora do projeto em
`/tmp/blackbird-evidence-intermediate-20261101`; não são evidência da versão final.
