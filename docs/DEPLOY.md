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
