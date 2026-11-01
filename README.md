# Black Bird: Revolução

Metroidvania steampunk 2D para navegador. No prólogo **O Último Dia**, Nero atravessa a cidade industrial para buscar a filha Lina na escola.

## Jogar

```bash
npm ci
npm run dev
```

Abre em `http://localhost:8080`.

Os PNGs necessários já estão versionados. Não é preciso regenerar a arte para jogar.
O documento-mestre é `docs/BLACK_BIRD_DOCUMENTO_MESTRE_CODEX.md`;
o estado auditado e o ponto de retomada estão em `docs/PROGRESSO_CODEX.md`.
O percurso atual ainda não atende aos três minutos exigidos. Arte e animações permanecem em revisão.

- **Novo jogo** — prólogo narrativo (sem combate obrigatório).
- **Campo de provas** — soco do braço mecânico e revólver, fora da história.

### Controles

| Ação | Teclas |
| --- | --- |
| Andar | A / D ou setas |
| Pular | Espaço / W |
| Falar / interagir | E |
| Pausar | Esc |
| Soco (arena) | Z |
| Revólver (arena) | X |
| Recarregar (arena) | R |

Na arena DEV de Winsth, **1–4** isolam os padrões, **0** restaura a seleção
automática e **F5** reinicia. O boss não integra a história da abertura.

## Verificar

```bash
npm test
npm run build
npm run assets:audit
npx playwright install chromium ffmpeg
npm run dev -- --port 4183 --strictPort
```

Em outro terminal:

```bash
GAME_URL=http://127.0.0.1:4183/ npm run test:browser
GAME_URL=http://127.0.0.1:4183/ npm run test:combat:browser
```

Use `CHROMIUM_PATH=/caminho/do/chromium` se quiser um navegador já instalado.
Os scripts gravam relatório, capturas e vídeo. O teste de travessia usa teclas reais;
fixtures de arena/cutscene são identificadas nos relatórios. Vídeos não contêm áudio.

`npm run art:ground` reproduz o piso em revisão usando sua fonte versionada.
O pipeline completo `npm run art` também precisa de Python 3 e Pillow; ele não é
pré-requisito de build e sua regeneração completa não foi executada neste checkpoint.

## Build e Docker

```bash
npm run build
npm run preview
docker build -t black-bird-revolucao .
docker run --rm -p 8080:8080 black-bird-revolucao
```

Porta interna: **8080**. Health: `GET /health.html`.

## Documentação

- `docs/GDD.md`
- `docs/ART_DIRECTION.md`
- `docs/ART_EXPANSION.md`
- `docs/PROLOGUE.md`
- `docs/ARCHITECTURE.md`
- `docs/ASSET_LICENSES.md`
- `docs/DEPLOY.md`
- `docs/IMPLEMENTATION_STATUS.md`
- `docs/HUDDLE-ENGINEERING-TEST.md`

## Stack

Phaser 4.2.1 · TypeScript · Vite · Nginx · sem backend.
