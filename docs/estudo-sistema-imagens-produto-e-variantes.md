# Estudo Guiado: Sistema de Imagens do Produto e das Variantes no Painel

## Objetivo desta documentacao

Este arquivo foi escrito para estudo.

A ideia e explicar, de forma didatica, como funciona o sistema de:

- upload de imagens do produto base no painel administrativo
- upload de imagens das variantes no painel administrativo
- transformacao dos dados do formulario para a API
- persistencia no banco e no storage
- reaproveitamento da primeira imagem como capa (`img`/`alt`)

O foco aqui e ajudar uma pessoa iniciante em:

- front-end com React e Next.js
- back-end com rotas da pasta `app/api`
- modelagem de dados com Prisma
- integracao com Supabase Storage

## Visao geral do sistema

O sistema funciona em 5 camadas:

1. Camada de interface do painel.
2. Camada de estado do formulario.
3. Camada de upload.
4. Camada de persistencia.
5. Camada de banco.

Resumo mental:

> O painel monta um estado React com produto, variantes e galerias; faz upload de arquivos para o storage; guarda `url` e `storagePath`; e, ao salvar, a API sincroniza banco e bucket usando a primeira imagem como capa.

## Arquivos principais do sistema

- `prisma/schema.prisma`
- `src/app/api/admin/uploads/route.js`
- `src/app/api/admin/products/route.js`
- `src/app/api/admin/products/[id]/route.js`
- `src/app/(privado)/admin/deshboard/_utils/constants.js`
- `src/app/(privado)/admin/deshboard/_utils/utils.js`
- `src/lib/helpers/api/adminProductsApi.js`
- `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductEditorClient.jsx`
- `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductFormSection.jsx`
- `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductImagesField.jsx`
- `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductVariantsField.jsx`

## 1. Banco de dados: `prisma/schema.prisma`

Esse arquivo define a estrutura dos dados.

### Model `Produto`

Representa o produto principal.

Campos mais importantes para este sistema:

- `img`: capa do produto
- `alt`: texto alternativo da capa
- `images`: galeria do produto base
- `variantes`: lista de variantes

### Model `ProdutoImagem`

Representa cada imagem da galeria do produto base.

Campos:

- `id`
- `produtoId`
- `url`
- `alt`
- `position`
- `storagePath`

### Model `ProdutoVariante`

Representa uma variante do produto.

Campos importantes:

- `name`
- `img`
- `alt`
- `priceCents`
- `stock`
- `hex`
- `corName`
- `images`

### Model `ProdutoVarianteImagem`

Representa cada imagem da galeria de uma variante.

Campos:

- `id`
- `varianteId`
- `url`
- `alt`
- `position`
- `storagePath`

### Por que existem `img` e `images` ao mesmo tempo?

Porque:

- `images` guarda a galeria completa
- `img` guarda a capa principal

Na pratica, a primeira imagem da galeria vira a capa.

Isso ajuda muito em:

- listagens
- carrinho
- fallback
- consultas simples

## 2. Estado inicial do formulario: `constants.js`

Arquivo: `src/app/(privado)/admin/deshboard/_utils/constants.js`

### O que esse arquivo faz

Ele define o estado inicial do formulario do editor de produto.

### Constante `LOW_STOCK_THRESHOLD`

Nao faz upload de imagens diretamente, mas e usada em metricas do modulo.

### Funcao `createEmptyProductForm`

Retorna o objeto inicial do formulario:

- `name`
- `slug`
- `description`
- `images`
- `variants`
- `priceCents`
- `stock`
- `category`
- `catalogKey`
- `promocao`
- `featuresText`
- `isActive`

### Por que esse estado inicial e importante?

Porque o React precisa saber como o objeto `form` vai nascer.

Sem isso, chamadas como estas poderiam quebrar:

- `form.images.map(...)`
- `form.variants.map(...)`

## 3. Conversao entre API e formulario: `utils.js`

Arquivo: `src/app/(privado)/admin/deshboard/_utils/utils.js`

Esse arquivo e a ponte entre:

- o formato que vem da API
- o formato que o formulario React usa

### Import

- `LOW_STOCK_THRESHOLD`

### Funcao `normalizeImages(images, fallbackImage, legacyIdPrefix)`

Padroniza uma lista de imagens para o formato do formulario.

Formato final:

- `id`
- `url`
- `alt`
- `position`
- `storagePath`

Ela tambem resolve casos legados, quando o registro antigo so tinha `img` e `alt`.

### Funcao `toForm(product)`

Transforma a resposta da API em estado do formulario.

Ela monta:

- `images` do produto base
- `variants`
- `images` de cada variante

### Funcao `toPayload(form)`

Transforma o estado do formulario no JSON que sera enviado para a API.

Ela garante:

- `priceCents` e `stock` como numeros
- `images` com `position`
- `variants[]` com `images[]`
- preservacao de `storagePath`

### Outras funcoes do arquivo

- `formatDate`
- `buildMetrics`
- `filterProductsByStatus`

Essas funcoes nao fazem upload, mas pertencem ao modulo de produtos.

## 4. Camada de requisicao no front: `adminProductsApi.js`

Arquivo: `src/lib/helpers/api/adminProductsApi.js`

Esse arquivo centraliza as chamadas HTTP do painel administrativo.

### Import

- `supabase`
  - usado para recuperar o token da sessao autenticada

### Funcao `getToken`

Busca o `access_token` da sessao atual.

Sem token, as rotas administrativas nao podem ser usadas.

### Funcao `authFetch(url, init)`

Funcao generica que:

- anexa o header `Authorization`
- define `Content-Type: application/json` quando existe body
- trata erros HTTP

### Funcoes exportadas

- `getAdminProduct(id)`
- `listAdminProducts(...)`
- `createAdminProduct(payload)`
- `updateAdminProduct(id, payload)`
- `archiveAdminProduct(id)`
- `verifyAdminAccess()`

### Funcoes mais importantes para o sistema de imagens

- `getAdminProduct`
  - carrega produto, variantes e galerias
- `createAdminProduct`
  - cria produto com galeria base e variantes
- `updateAdminProduct`
  - salva galeria do produto e das variantes

## 5. Orquestrador do editor: `ProductEditorClient.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductEditorClient.jsx`

Esse componente coordena o editor.

Ele nao sobe arquivo por conta propria.
Ele gerencia o estado geral do formulario e chama a API.

### Imports

- `useCallback`, `useEffect`, `useState`
- `useRouter`
- `ArrowLeft`
- `archiveAdminProduct`, `createAdminProduct`, `getAdminProduct`, `updateAdminProduct`
- `Button`
- `FeedbackBanners`
- `ProductFormSection`
- `createEmptyProductForm`
- `toForm`
- `toPayload`

### Props

- `productId`
  - se existir, o editor esta em modo edicao
  - se nao existir, o editor esta em modo criacao

### Estados principais

- `form`
- `selectedProduct`
- `loading`
- `saving`
- `archiveDialogOpen`
- `error`
- `success`

### Funcao `setField(field, value)`

Atualiza um campo do formulario.

Exemplos:

- `setField("images", novasImagens)`
- `setField("variants", novasVariantes)`

### Funcao `loadProduct`

Busca o produto na API, converte com `toForm` e coloca no estado React.

### `useEffect`

Executa `loadProduct()` quando a tela de edicao abre.

### Funcao `handleSubmit`

Fluxo:

1. impede o submit nativo do HTML
2. converte `form` para payload com `toPayload`
3. se for criacao, chama `createAdminProduct`
4. se for edicao, chama `updateAdminProduct`
5. atualiza mensagens de sucesso/erro

### Funcao `handleArchive`

Desativa o produto.

Nao e o centro do upload, mas faz parte do ciclo do editor.

## 6. Formulario principal: `ProductFormSection.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductFormSection.jsx`

Esse componente organiza visualmente o formulario.

Pense nele como o "montador" da tela.

### Imports

- `Loader2`
- `Button`
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Input`
- `Textarea`
- `Separator`
- `Switch`
- componentes de `AlertDialog`
- `formatDate`
- `ProductImagesField`
- `ProductVariantsField`

### Props

- `selectedProduct`
- `form`
- `onFieldChange`
- `onSubmit`
- `saving`
- `selectedId`
- `archiveDialogOpen`
- `onArchiveDialogOpenChange`
- `onArchive`

### Inputs importantes desse componente

#### Dados basicos

- nome
- slug
- categoria
- catalog key

#### Preco e estoque

- preco do produto base
- estoque do produto base

#### Midia e texto

- galeria base com `ProductImagesField`
- promocao
- descricao
- features

#### Variantes

- secao `ProductVariantsField`

#### Status

- `Switch` para ativar ou desativar o produto

### Como o formulario conversa com o estado?

Todo input chama:

- `onFieldChange("nomeDoCampo", novoValor)`

Isso deixa o componente simples e previsivel.

### Por que `selectedId` importa para o sistema de imagens?

Porque o upload depende do `productId`.

Sem id, o sistema nao consegue montar o caminho do arquivo no bucket.

## 7. Componente de galeria: `ProductImagesField.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductImagesField.jsx`

Esse e o componente mais importante do sistema de upload.

Ele e reutilizavel e serve para:

- galeria do produto base
- galeria de cada variante

### Todos os imports e para que servem

- `useRef`
  - guarda referencias para inputs de arquivo escondidos
- `useState`
  - controla estados locais como loading, erro e drag
- `Image`
  - renderiza preview da imagem
- `GripVertical`
  - icone visual de arraste
- `Loader2`
  - icone de carregamento
- `Pencil`
  - icone do botao de trocar imagem
- `Plus`
  - icone do botao de adicionar imagem
- `Trash2`
  - icone do botao de remover
- `Badge`
  - mostra contagem e tipo da imagem
- `Button`
  - botoes de acao
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
  - estrutura visual
- `Input`
  - campo de arquivo e campo de texto alternativo
- `cn`
  - combina classes CSS
- `supabase`
  - usado para pegar o token da sessao

### Funcao `getAccessToken`

Busca o token da sessao atual do usuario.

Sem token, o upload nao pode ser autorizado.

### Funcao `uploadImage(file, productId)`

Envia o arquivo para `/api/admin/uploads`.

Passos:

1. pega o token
2. cria `FormData`
3. envia `file`
4. envia `productId`
5. faz `fetch` autenticado
6. recebe `url` e `storagePath`

### Funcao `createImageItem(file, uploadResult, position)`

Cria o objeto de imagem usado no estado do formulario.

Campos:

- `id`
- `url`
- `alt`
- `storagePath`
- `position`

### Funcao `updateImageList(images, imageId, updater)`

Atualiza apenas uma imagem da lista.

Ela e usada, por exemplo, ao:

- trocar `alt`
- trocar `url`
- trocar `storagePath`

### Funcao `reorderImages(images, dragId, targetId)`

Muda a ordem da galeria quando o usuario arrasta uma imagem.

Ela tambem recalcula `position`.

### Componente `AddImageTile`

Renderiza o bloco visual de adicionar nova foto.

Props:

- `disabled`
- `isUploading`
- `onClick`

### Componente `ImageCard`

Renderiza uma imagem da galeria com:

- preview
- input de texto alternativo
- botao de trocar
- botao de remover
- suporte a arrastar e soltar

Props:

- `image`
- `index`
- `isCover`
- `isBusy`
- `onAltChange`
- `onRemove`
- `onReplaceClick`
- `onDragStart`
- `onDragEnd`
- `onDrop`

### Componente principal `ProductImagesField`

Props:

- `productId`
- `value = []`
- `onChange`
- `title`
- `description`
- `emptyTitle`
- `emptyDescription`

### Estados internos do componente

- `addInputRef`
- `replaceInputRefs`
- `dragId`
- `isAdding`
- `replacingId`
- `errorMessage`

### Variaveis derivadas

- `coverImage = value[0] ?? null`
- `galleryImages = value.slice(1)`

### Funcao `clearFileInput`

Limpa o valor do input de arquivo.

Isso evita um problema comum: escolher o mesmo arquivo duas vezes e o `onChange` nao disparar.

### Funcao `handleAltChange`

Atualiza o `alt` de uma imagem.

### Funcao `handleRemove`

Remove a imagem e recalcula `position`.

### Funcao `handleDragStart`

Guarda qual imagem comecou a ser arrastada.

### Funcao `handleDragEnd`

Limpa o estado de arraste.

### Funcao `handleDrop`

Recebe a imagem alvo e chama `reorderImages`.

### Funcao `handleAdd(files)`

Fluxo:

1. valida `files` e `productId`
2. limpa erro
3. ativa loading
4. faz upload dos arquivos com `Promise.all`
5. cria itens da galeria
6. concatena no array atual
7. trata erros
8. desliga loading

### Funcao `handleReplace(imageId, file)`

Substitui uma imagem existente.

Diferenca principal:

- `handleAdd` cria item novo
- `handleReplace` preserva o item e troca `url`/`storagePath`

### Funcao `openAddDialog`

Abre o seletor de arquivos para adicionar imagens.

### Funcao `openReplaceDialog`

Abre o seletor de arquivos para substituir uma imagem especifica.

### Inputs usados nesse componente

#### Input oculto de adicionar

Caracteristicas:

- `type="file"`
- `accept="image/*"`
- `multiple`
- `className="hidden"`

#### Inputs ocultos de substituir

Existe um input oculto para cada imagem da lista.

Isso permite trocar uma imagem especifica sem misturar o fluxo inteiro da galeria.

#### Input visivel de `alt`

Cada `ImageCard` tem um `Input` para texto alternativo.

Esse campo e importante para:

- acessibilidade
- SEO
- organizacao semantica

## 8. Componente de variantes: `ProductVariantsField.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductVariantsField.jsx`

Esse componente cuida do cadastro das variantes.

Ele nao faz upload diretamente.
Ele delega a galeria ao `ProductImagesField`.

### Todos os imports e para que servem

- `Plus`
  - icone do botao de adicionar variante
- `Trash2`
  - icone do botao de remover variante
- `Badge`
  - contador visual de variantes
- `Button`
  - botoes visuais
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
  - estrutura visual
- `Input`
  - campos da variante
- `ProductImagesField`
  - componente reutilizado de galeria

### Funcao `createEmptyVariant`

Cria uma variante vazia com:

- `id`
- `name`
- `corName`
- `hex`
- `priceCents`
- `stock`
- `images`

### Funcao `getVariantLabel(variant, index)`

Decide qual nome visual sera mostrado no card da variante.

Ordem de prioridade:

1. `corName`
2. `name`
3. `Variante X`

### Componente `ProductVariantsField`

Props:

- `productId`
- `value = []`
- `onChange`

### Funcao `updateVariant(variantId, updater)`

Atualiza uma variante especifica do array.

### Funcao `updateVariantField(variantId, field, nextValue)`

Atalho para atualizar um campo especifico da variante.

Exemplos:

- `name`
- `corName`
- `hex`
- `priceCents`
- `stock`
- `images`

### Funcao `addVariant`

Adiciona uma nova variante ao array do formulario.

### Funcao `removeVariant`

Remove uma variante do array do formulario.

### Inputs da variante

Cada variante tem os seguintes campos:

- nome da variante
- nome da cor
- hex da cor
- preco da variante
- estoque da variante

### O que cada input representa?

#### Nome da variante

Descricao mais comercial ou interna da variacao.

#### Nome da cor

Texto curto usado para exibir a cor para o usuario.

#### Hex da cor

Codigo hexadecimal como:

- `#000000`
- `#2563EB`

Esse valor costuma ser usado para desenhar o circulo de cor na pagina publica.

#### Preco da variante

Permite que a variacao tenha preco proprio.

#### Estoque da variante

Permite controle separado por variacao.

### Reuso do `ProductImagesField`

Quando o produto ja existe, cada variante renderiza seu proprio `ProductImagesField`.

Isso e importante porque evita duplicar toda a logica de:

- upload
- preview
- remocao
- ordenacao
- troca de imagem

### Comportamento quando `productId` nao existe

Se o produto ainda nao foi salvo, o componente nao abre o uploader.

Ele mostra uma mensagem explicando que o produto precisa ser salvo primeiro.

Motivo:

- o upload precisa do `productId` para montar o `storagePath`

## 9. Rota de upload: `src/app/api/admin/uploads/route.js`

Essa rota recebe o arquivo enviado pelo front.

### Imports

- `crypto`
  - gera nome unico para o arquivo
- `requireAdmin`
  - garante que so admin autenticado possa enviar arquivos
- `supabaseAdmin`
  - cliente servidor usado para salvar arquivo no bucket

### Constante `BUCKET`

Bucket utilizado:

- `product-images`

### Metodo `POST(request)`

Fluxo:

1. valida acesso admin
2. le `FormData`
3. pega `file`
4. pega `productId`
5. valida se ambos existem
6. calcula extensao do arquivo
7. gera nome unico com UUID
8. monta `storagePath`
9. sobe para o Supabase Storage
10. gera `publicUrl`
11. devolve:
    - `url`
    - `storagePath`

### Formato do caminho salvo no storage

- `products/{productId}/{uuid}.{ext}`

### Por que guardar `storagePath`?

Porque no futuro a API vai precisar remover esse arquivo se o usuario apagar a imagem no painel.

## 10. Rota de criacao: `src/app/api/admin/products/route.js`

Essa rota cria um produto novo.

### Imports

- `randomUUID`
  - gera ids para variantes quando necessario
- `prisma`
  - acessa o banco
- `requireAdmin`
  - protege a rota

### Funcoes auxiliares do arquivo

- `toPositiveInt`
- `toText`
- `toInt`
- `toStringArray`
- `toImageArray`
- `buildPrimaryImage`
- `toVariantArray`
- `slugify`
- `ensureUniqueSlug`

### O papel das funcoes ligadas ao sistema de imagens

#### `toImageArray`

Transforma `images[]` do front em objetos prontos para o Prisma.

#### `buildPrimaryImage`

Escolhe a capa principal.

Regra:

1. primeira imagem da galeria
2. fallback informado
3. placeholder

#### `toVariantArray`

Transforma `variants[]` do front em estrutura pronta para salvar no banco.

Ela tambem calcula:

- `img`
- `alt`
- `images`

### Metodo `POST`

Cria:

- produto base
- galeria base
- variantes
- galerias das variantes

Ponto importante:

Mesmo com galeria completa, o produto e a variante continuam armazenando:

- `img`
- `alt`

Esses campos sao derivados da primeira imagem da galeria.

## 11. Rota de edicao: `src/app/api/admin/products/[id]/route.js`

Esse arquivo e o coracao do back-end desse sistema.

### Imports

- `randomUUID`
  - gera id de variante quando necessario
- `prisma`
  - acessa o banco
- `requireAdmin`
  - protege a rota
- `supabaseAdmin`
  - remove imagens antigas do storage

### Funcao `toImageArray`

Normaliza a galeria recebida do front.

### Funcao `buildPrimaryImage`

Escolhe a capa final com base nas imagens recebidas.

### Funcao `toText`

Normaliza strings.

### Funcao `toInt`

Normaliza inteiros nao negativos.

### Funcao `toStringArray`

Normaliza arrays de texto.

### Funcao `slugify`

Normaliza o slug.

### Metodo `GET`

Carrega o produto por `id` com:

- `images`
- `variantes`
- `variantes.images`

Esse carregamento completo e necessario para popular o editor.

### Metodo `PUT`

Esse e o trecho mais importante para estudar.

#### Variaveis de trabalho

- `data`
  - objeto acumulador do Prisma update
- `currentProduct`
  - cache local do produto atual
- `removedPaths`
  - caminhos de imagens que devem ser apagadas do bucket

### Funcao interna `loadCurrentProduct`

Carrega o produto atual com imagens e variantes.

Ela evita repetir a mesma consulta ao banco varias vezes.

### Bloco `if ("images" in body)`

Atualiza a galeria do produto base.

Ele:

1. carrega o produto atual
2. normaliza as imagens novas
3. escolhe a nova capa
4. encontra imagens antigas removidas
5. monta o nested write:
   - `deleteMany`
   - `create`
6. atualiza `img`, `alt` e `images`

### Bloco `if ("variants" in body)`

Atualiza as variantes.

Ele:

1. carrega o produto atual
2. calcula o fallback visual do produto
3. cria mapa das variantes atuais
4. percorre `body.variants`
5. normaliza `variant.images`
6. escolhe `variant.img` e `variant.alt`
7. descobre imagens antigas removidas
8. monta o nested write com:
   - `deleteMany`
   - `upsert`

### O que `upsert` resolve?

`upsert` significa:

- se existir, atualiza
- se nao existir, cria

Isso e perfeito para arrays dinamicos de variantes.

### Remocao de imagens no storage

Depois que o banco salva, a rota remove do bucket todos os caminhos reunidos em `removedPaths`.

Isso e importante porque:

- salvar no banco nao apaga arquivo automaticamente
- bucket e banco sao camadas diferentes

### Metodo `DELETE`

Desativa o produto.

Nao faz parte do upload em si, mas faz parte do ciclo do editor.

## 12. Fluxo completo do upload de uma imagem do produto base

1. O usuario clica em "Adicionar foto".
2. `AddImageTile` chama `openAddDialog`.
3. O input oculto de arquivo e aberto.
4. O usuario escolhe um ou mais arquivos.
5. `handleAdd(files)` comeca o processo.
6. `uploadImage(file, productId)` envia cada arquivo para `/api/admin/uploads`.
7. A rota devolve `url` e `storagePath`.
8. `createImageItem(...)` cria os objetos da galeria.
9. `onChange([...value, ...uploadedImages])` atualiza o estado do formulario.
10. Ao salvar, `toPayload(form)` envia a galeria para a rota de produto.
11. A rota salva tudo em `ProdutoImagem`.
12. A primeira imagem vira `produto.img`.

## 13. Fluxo completo do upload de uma imagem da variante

1. O usuario abre um card de variante.
2. A variante renderiza um `ProductImagesField`.
3. O usuario adiciona imagens.
4. O fluxo de upload para `/api/admin/uploads` e o mesmo.
5. A diferenca e o destino no estado React:
   - `variant.images`
6. No submit, `toPayload` inclui:
   - `variants[].images`
7. A rota `PUT /api/admin/products/[id]` salva isso em `ProdutoVarianteImagem`.
8. A primeira imagem da variante vira:
   - `variant.img`
   - `variant.alt`

## 14. Explicacao importante sobre `img`, `images`, `url`, `alt` e `storagePath`

### `images`

E a galeria completa.

### `img`

E a capa principal.

### `url`

E o endereco publico usado no navegador.

### `alt`

E o texto alternativo da imagem.

### `storagePath`

E o caminho interno do arquivo no bucket.

### Por que guardar `url` e `storagePath`?

Porque eles resolvem problemas diferentes:

- `url`: exibir
- `storagePath`: remover do storage

## 15. Inputs do sistema, resumidos para estudo

### Inputs do produto base

- nome
- slug
- categoria
- catalog key
- preco
- estoque
- promocao
- descricao
- features
- switch de status
- input oculto de adicionar imagem
- inputs ocultos de substituir imagem
- inputs de `alt` em cada imagem

### Inputs de cada variante

- nome da variante
- nome da cor
- hex da cor
- preco da variante
- estoque da variante
- input oculto de adicionar imagem da variante
- inputs ocultos de substituir imagem da variante
- inputs de `alt` da galeria da variante

## 16. Conceitos de React presentes nesse sistema

### Estado controlado

Os inputs usam:

- `value`
- `onChange`

Isso quer dizer que o React controla o formulario.

### Composicao

`ProductVariantsField` reutiliza `ProductImagesField`.

Isso e composicao de componentes.

### Fonte da verdade

O estado principal mora em `ProductEditorClient`.

Os componentes filhos ajudam a editar esse estado, mas nao salvam sozinhos no banco.

## 17. Conceitos de back-end presentes nesse sistema

### Validacao

As rotas validam:

- autenticacao admin
- campos obrigatorios
- tipos de dado

### Normalizacao

As rotas usam funcoes pequenas como:

- `toText`
- `toInt`
- `toImageArray`

Isso reduz a chance de salvar dados baguncados.

### Nested writes do Prisma

O Prisma permite atualizar relacoes dentro de uma operacao maior.

Exemplo:

- atualizar produto
- recriar galeria do produto
- atualizar variantes
- recriar galerias das variantes

### Sincronizacao entre banco e storage

Banco e bucket nao sao a mesma coisa.

Por isso o sistema precisa controlar:

- o que salva no banco
- o que remove do storage

## 18. Perguntas de estudo

1. Por que `ProductImagesField` usa `useRef` para inputs escondidos?
2. Por que o sistema guarda `url` e `storagePath`?
3. Por que existe `position` nas imagens?
4. Por que a primeira imagem vira `img`?
5. Qual a diferenca entre `toForm` e `toPayload`?
6. O que `upsert` resolve no caso das variantes?
7. Por que o upload so acontece depois que o produto ja existe?

## 19. Ordem recomendada para estudar o codigo

1. `constants.js`
2. `utils.js`
3. `adminProductsApi.js`
4. `ProductEditorClient.jsx`
5. `ProductFormSection.jsx`
6. `ProductVariantsField.jsx`
7. `ProductImagesField.jsx`
8. `api/admin/uploads/route.js`
9. `api/admin/products/route.js`
10. `api/admin/products/[id]/route.js`
11. `prisma/schema.prisma`

## 20. Conclusao

Esse sistema e um excelente estudo full stack porque ele junta:

- React com formulario controlado
- reutilizacao de componentes
- upload autenticado
- transformacao de dados no front
- validacao e persistencia no back
- modelagem relacional no banco
- limpeza de arquivos no storage

Se voce entender bem esses arquivos, vai aprender varios fundamentos importantes de um painel administrativo real.
