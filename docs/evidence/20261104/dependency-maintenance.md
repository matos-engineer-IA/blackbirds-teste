Atualização local das ferramentas — 04/11/2026

Vite 6.3.5 → 6.4.5; Vitest 3.2.4 → 4.1.12, mantendo Phaser 4.2.1,
TypeScript 5.7.3 e as versões exatas das ferramentas de assets/navegador.
Advisories primários consultados:
https://github.com/vitejs/vite/security/advisories/GHSA-p9ff-h696-f583
https://github.com/vitest-dev/vitest/security/advisories/GHSA-5xrq-8626-4rwp

npm10/arborist falhou ao resolver a troca de major com `edgesOut` null.
Resolução feita em diretório temporário isolado com npm11.6.2, pacote oficial
verificado por SHA-512 do registry. Lockfile resultante aplicado e `npm ci`
executado no projeto; instalação/auditoria retornou zero vulnerabilidades.
Nenhum audit fix --force, mudança de engine ou instalação global executados.
A transição Vitest3→4 removeu as dependências antigas tinypool/mocker afetadas.
Testes e build registrados nas evidências da candidata final.
