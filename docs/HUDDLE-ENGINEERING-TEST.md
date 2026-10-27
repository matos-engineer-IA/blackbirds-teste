# Roteiro de teste — Huddle Engineering

Este documento é o roteiro oficial para importar **NEON FALL: PROTOCOL ZERO** no Huddle Engineering e publicar na HML. Não marque etapas como aprovadas só porque o jogo rodou localmente.

## Dados do piloto

- Repositório sugerido: `neon-fall-protocol-zero`
- Branch: `main`
- Stack detectável: TypeScript, Phaser, Vite, Node.js, Nginx, aplicação web estática
- Build: `npm ci` + `npm run build`
- Saída: `dist/`
- Porta interna: `8080`
- Health check: `GET /health.html` → HTTP 200 / corpo `ok`
- Sem banco, sem backend, sem secrets, sem APIs pagas

## Fase A — GitHub

1. Conectar a conta GitHub autorizada no Engineering.
2. Selecionar o repositório do jogo (não o repositório do Engineering).
3. Selecionar a branch `main`.
4. Confirmar o SHA do commit importado.
5. Importar o projeto.

## Fase B — Análise

Verificar se o analisador identificou:

- [ ] Phaser
- [ ] TypeScript
- [ ] Node.js
- [ ] Vite
- [ ] Docker
- [ ] comando de build
- [ ] porta 8080
- [ ] ausência de banco de dados
- [ ] ausência de secrets obrigatórios

Arquivos que devem ajudar a detecção:

- `package.json` / `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `Dockerfile`
- `nginx.conf`
- `public/health.html`
- `src/game/createGame.ts`

## Fase C — HML

Verificar:

1. Criação do ambiente autorizado.
2. Build (`npm ci` + `npm run build`).
3. Construção da imagem Docker.
4. Inicialização do container.
5. Health check em `/health.html`.
6. Publicação da URL.

Se o Engineering publicar em subpath, rebuild com:

```bash
VITE_BASE_PATH=/seu-subpath/ npm run build
```

A configuração padrão (`./`) assume a raiz do hostname do projeto.

## Fase D — Navegador

1. Abrir a URL da HML.
2. Confirmar o menu **NEON FALL / PROTOCOL ZERO**.
3. Iniciar o jogo.
4. Mover o personagem (A/D ou setas).
5. Pular (Espaço / W).
6. Atacar (Z / J).
7. Verificar tiles, fundos e HUD.
8. Abrir o console e confirmar ausência de erros relevantes.

## Fase E — Atualização

1. Fazer uma alteração visual simples (por exemplo a cor de `palette.cyan`).
2. Criar um novo commit na branch configurada.
3. Enviar para o remoto.
4. Solicitar ou acompanhar a atualização conforme a política do Engineering.
5. Confirmar o novo SHA.
6. Recarregar a HML e confirmar a nova versão.

## Fase F — Resultado

Registrar depois da execução real no Engineering:

- o que funcionou
- o que falhou
- erro exibido
- etapa do pipeline
- logs relevantes sem segredos
- SHA da versão
- operação/provisionamento
- tempo aproximado, se medido

Status atual deste repositório: **não testado na HML**. A validação local cobre `npm ci`, typecheck, testes, build e execução no navegador de desenvolvimento.
