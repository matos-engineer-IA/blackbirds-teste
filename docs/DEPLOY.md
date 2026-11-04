# Deploy

Aplicação web estática. Sem banco, sem secrets.

Checkpoint de 04/11/2026: código `401f4c3`, build `bb-5233fb49e865`, imagem
`black-bird-revolucao:401f4c3`. Container local persistente
`black-bird-codex-stable-20261104`, apenas `127.0.0.1:4186 → 8080`, com health
e restart `unless-stopped`. A versão anterior permanece ativa em 4185. Isso é
execução local de produção; **não é publicação em HML**.

Huddle está sem ambiente/URL do jogo, com import `connection_expired` /
`plan_blocked`, provider/gateway desabilitados e sem aprovação independente.
Evidência: `evidence/20261104/hml-readiness.json`. Não criar túnel ou alterar
produção/infraestrutura para contornar esse bloqueio.

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
- Identidade: `/build-info.json`, hash do conteúdo e commit/base do build.
  No executor, passar o SHA autorizado em `docker build --build-arg BUILD_COMMIT=<sha>`.
- HTML e assets revalidam cache; identidade/health usam `no-store`. Recursos
  ausentes retornam 404; não requer limpeza manual de cache para atualizar.
- O build de produção contém os PNGs derivados. Fontes de arte, testes e
  evidências ficam fora da imagem; não copiar arquivos manualmente para o container.

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
