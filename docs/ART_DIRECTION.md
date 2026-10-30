# Direção de arte — Black Bird: Revolução

Referência de execução: Blasphemous / Blasphemous 2 (salas únicas pintadas, silhueta forte, luz quente contra pedra escura). Não copiamos sprites nem cenários desses jogos.

Influências de composição: Dishonored (indústria distópica), The Last Night (profundidade), Dead Cells (leitura em movimento).

Entrevista usada: Enrique Cabeza, The Game Kitchen — pixel art como escolha artística e técnica; identidade local; autocrítica.

## Resolução

- Canvas interno: 640×360, `pixelArt: true`
- Quarteirão operário pintado: 1944×360 (cerca de três telas)
- Nero: 80×120, origem nos pés
- NPCs adultos: 52×88
- Criança: 40×64
- Tiles 18×18 restam só nas regiões ainda não pintadas e nas colisões invisíveis

## Paleta

Couro, bronze envelhecido, cobre, carvão, bege sujo, amarelo de gás, névoa azul-acinzentada. Sem neon.

## Quarteirão-padrão

O Bairro Operário é o novo padrão visual: rua pintada única, não fachadas de retângulo.

- Calçamento irregular e reflexo úmido
- Cortiço com varal
- Padaria H. Baker & Son
- Máquina a vapor
- Oficina / fábrica
- Poste de gás
- Cartaz de greve
- Horizonte industrial em parallax
- Névoa no beco entre as casas

## Personagens

Nero precisa ser lido parado: máscara de corvo, sobretudo, braço a vapor, revólver. As animações atuais usam três poses pintadas (idle, walk, jump) e derivados. Não são um ciclo final de Aseprite.

NPCs do quarteirão são figuras distintas: Ilda, operário, criança, mecânico.

## Pipeline

1. Pintura-fonte em `art/source`
2. `python scripts/process-painted-art.py` recorta, remove fundo nas bordas, quantiza paleta e exporta PNG
3. Phaser carrega spritesheets e a rua como imagem, com colisão invisível

`npm run assets` gera apenas tileset/Lina/coche/corvo. Não sobrescreve a arte pintada.

## O que ainda não é arte final de estúdio

- Mercado, avenida e escola ainda usam o tileset antigo
- Ciclos de caminhada/ataque do Nero são limitados
- A quantização a partir de pintura digital não substitui um pixel artist dedicado no Aseprite
- Textos de placas na rua são parte da pintura e podem ser redesenhados à mão depois
