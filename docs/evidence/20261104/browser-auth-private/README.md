# Autenticação de demonstração no navegador

Pedido do proprietário: acesso simples ao jogo antes da integração Engineering,
com login da aplicação e sem autenticação na máquina.

URL: http://10.100.62.4:4187/ (rede privada/VPN).
Imagem: black-bird-revolucao:browser-auth-20261104; build bb-9304faa4568d.

`report.json` e capturas são do Chromium real na VM usando seu IP privado.
Verificações: HTML/JSON/assets retornam 401 sem credenciais; senha incorreta
é recusada; health continua 200; login válido abre menu, assets e Nero em movimento.
O container atual é persistente e sua configuração não toca o proxy do portal.
Não há confirmação do Edge do computador do usuário neste relatório.

Testes adicionais executados: `nginx -t` sem auth passou; configuração parcial
(somente usuário) encerrou com código 1; 36 testes unitários passaram; Docker
build/typecheck passaram. Senha/hash não estão no repositório nem na imagem.
A configuração usa hash SHA-512 crypt fornecido por segredo de runtime.

Isso não comprova geração automática de HML pelo Engineering nem HTTPS externo.
O serviço anterior de 4186 permanece preservado. Nenhum segredo é registrado aqui.
