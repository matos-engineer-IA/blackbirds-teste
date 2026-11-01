# Deploy

Aplicação web estática. Sem banco, sem secrets.

```bash
npm ci
npm run build
```

Saída: `dist/`.

```bash
docker build -t black-bird-revolucao .
docker run --rm -p 8080:8080 black-bird-revolucao
```

- Porta: 8080
- Health: `/health.html`
- Subpath: `VITE_BASE_PATH=/caminho/ npm run build`

O CLI Docker pode não existir na máquina de desenvolvimento. A imagem não deve ser marcada como testada sem `docker build`.

No checkpoint de 01/11/2026, o build Docker e a execução local com Nginx foram
exercitados. Consulte `PROGRESSO_CODEX.md` e `evidence/container/` para os resultados
finais e a identidade do artefato. Isso não comprova publicação na HML.

Para testar o container sem expô-lo externamente:

```bash
docker run --rm -p 127.0.0.1:4185:8080 black-bird-revolucao
GAME_URL=http://127.0.0.1:4185/ npm run test:browser
```

`/health.html` comprova serviço; o teste no navegador comprova carregamento e
interação. `/assets/arquivo-ausente.png` deve retornar 404. Não alterar IAM,
Morpheus ou produção para validar este jogo.
