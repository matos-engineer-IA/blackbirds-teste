# Black Bird: Revolução

Metroidvania steampunk 2D para navegador. No prólogo **O Último Dia**, Nero atravessa a cidade industrial para buscar a filha Lina na escola.

## Jogar

```bash
npm ci
npm run art
npm run dev
```

Abre em `http://localhost:8080`.

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
