# Status técnico auditado

O registro atual é `PROGRESSO_CODEX.md`; resultados reproduzíveis ficam em
`evidence/container/` e `evidence/combat-final/`. O documento-mestre define
requisitos, não comprova implementação.

Responsáveis no código:

- `entities/Player.ts`, `mechanics/movement.ts`: input, locomoção e contato.
- `utils/footAnchor.ts`, `utils/scale.ts`: origem dos pés, escala visual e corpo físico.
- `systems/cameraRig.ts`: follow temporal e enquadramento cinematográfico.
- `scenes/GameScene.ts`: exploração, pausa real, diálogo, cutscene e métricas de caminhada.
- `entities/Npc.ts`, `systems/dialogue.ts`: rotina interrompível e falas.
- `mechanics/attackTimeline.ts`: preparação, janela ativa, recuperação e ledger por alvo.
- `mechanics/bossAttacks.ts`, `entities/Winsth.ts`: seleção, compromisso e fases do boss.
- `entities/Projectile.ts`, `entities/PressureWave.ts`: objetos configurados após inserção no grupo Arcade.
- `scripts/audit-assets.mjs`, `art/asset-audit.json`: auditoria técnica de arte.

A engine permaneceu Phaser 4.2.1. Os valores numéricos são propostas de ajuste.
A altura de referência não é a altura do PNG; Nero usa exibição 0,5 e o body
é especificado em unidades de mundo. A revisão artística e de anatomia permanece
pendente. Não declarar que os 37/21 clips dos catálogos já existem.
