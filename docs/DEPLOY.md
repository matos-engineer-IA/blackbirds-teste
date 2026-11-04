# Deploy

Aplicação web estática, sem banco. Autenticação opcional por configuração de runtime.

## Acesso temporário pelo navegador — 04/11/2026

URL de demonstração na rede privada/VPN: **http://10.100.62.4:4187/**.
Container `black-bird-codex-browser-demo-20261104`, imagem
`black-bird-revolucao:browser-auth-20261104`, build `bb-9304faa4568d`.
Porta vinculada somente a `10.100.62.4` e `127.0.0.1`; não há exposição em
0.0.0.0, túnel público, alteração de DNS/firewall global ou proxy do portal.
O usuário autentica no navegador. Não precisa de conta ou login na VM.
Credenciais temporárias são fornecidas pelo proprietário; senha e hash não
devem entrar neste repositório. Teste do endereço feito da VM, não do Edge do cliente.
Esse acesso não comprova importação, criação de HML ou publicação pelo Engineering.

Autenticação HTTP Basic é aplicada pelo Nginx a HTML, assets e build-info.
`/health.html` continua sem autenticação para o health check. Configuração de runtime:

- `BLACKBIRD_AUTH_USER`: usuário da demonstração.
- `BLACKBIRD_AUTH_PASSWORD_HASH`: hash crypt/htpasswd, gerado pelo operador e
  injetado como segredo de runtime. A implantação atual usa SHA-512 crypt.
- O entrypoint não escreve senha no bundle ou na imagem; gera os arquivos com
  permissões restritas fora do webroot. Credenciais parciais/formatos inválidos
  impedem o início. Sem ambas as variáveis, a imagem mantém o comportamento
  anterior para ambientes cuja autenticação já é fornecida pelo gateway.

Contrato de implantação existente mantido: porta 8080, health, Dockerfile e
assets relativos. Na HML, o gateway autorizado deve entregar a URL HTTPS e
aplicar as regras de acesso do Engineering; login de aplicação não substitui IAM.
Referência: [Nginx HTTP Basic](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html).

Evidências: `evidence/20261104/browser-auth/` e `browser-auth-private/`.
Verificaram 401 sem autenticação/com senha incorreta, 200 com credenciais
válidas, proteção dos assets, health e jogo em movimento após autenticar.

O container estável anterior de 4186 permanece ativo para recuperação.

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
