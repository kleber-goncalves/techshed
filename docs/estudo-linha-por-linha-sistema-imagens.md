# Estudo Aprofundado: Linha por Linha do Sistema de Imagens do Produto e das Variantes

## Objetivo deste arquivo

Este arquivo e uma segunda camada de documentacao.

Enquanto o arquivo `docs/estudo-sistema-imagens-produto-e-variantes.md` explica o sistema de forma conceitual, este aqui entra num nivel mais profundo:

- arquivo por arquivo
- bloco por bloco
- com referencia de linhas
- explicando a intencao de cada import, funcao, input e componente

Importante:

- eu nao vou comentar literalmente cada linha isolada quando varias linhas fazem parte da mesma ideia
- em vez disso, eu vou comentar por blocos pequenos de linhas
- isso fica muito mais didatico para uma pessoa iniciante

## Como estudar este material

Sugestao de uso:

1. Abra o arquivo original no editor.
2. Deixe este Markdown ao lado.
3. Leia um bloco de linhas.
4. Volte para o codigo.
5. Tente explicar com suas palavras o que aquele bloco faz.

Se voce estiver aprendendo mesmo do zero, siga esta ordem:

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

---

## 1. Banco de dados: `prisma/schema.prisma`

### Linhas 55-77: model `Produto`

Aqui mora a entidade principal do cadastro.

Campos mais importantes para o sistema de imagens:

- linha 60: `img`
  - capa principal do produto
- linha 61: `alt`
  - texto alternativo da capa
- linha 71: `variantes`
  - relacao com as variantes
- linha 72: `images`
  - relacao com a galeria do produto base

Ideia central:

- o produto tem uma capa simples
- e tambem pode ter uma galeria completa

### Linhas 79-90: model `ProdutoImagem`

Esse model guarda cada imagem da galeria do produto base.

Leitura dos campos:

- linha 80: `id`
  - identificador unico da imagem
- linha 81: `produtoId`
  - diz a qual produto a imagem pertence
- linha 82: `url`
  - link publico da imagem
- linha 83: `alt`
  - texto alternativo
- linha 84: `position`
  - ordem da imagem na galeria
- linha 85: `storagePath`
  - caminho interno no bucket

Aprendizado importante:

- `url` serve para exibir
- `storagePath` serve para apagar depois

### Linhas 92-107: model `ProdutoVariante`

Esse model representa cada variacao do produto.

Campos importantes:

- linha 95: `name`
- linha 96: `img`
- linha 97: `alt`
- linha 98: `priceCents`
- linha 99: `stock`
- linha 100: `hex`
- linha 101: `corName`
- linha 102: `images`

Aqui esta a grande evolucao do sistema:

- antes a variante tinha praticamente uma imagem so
- agora ela pode ter uma galeria propria

### Linhas 109-120: model `ProdutoVarianteImagem`

Essa tabela faz para a variante o mesmo que `ProdutoImagem` faz para o produto base.

Campos:

- `id`
- `varianteId`
- `url`
- `alt`
- `position`
- `storagePath`

Pensamento de modelagem:

- produto base tem galeria
- variante tambem pode ter galeria
- as duas galerias usam a mesma logica conceitual

---

## 2. Estado inicial do formulario: `constants.js`

Arquivo: `src/app/(privado)/admin/deshboard/_utils/constants.js`

### Linha 1: `LOW_STOCK_THRESHOLD`

Nao pertence ao sistema de imagens diretamente.

Esta aqui porque o arquivo guarda configuracoes pequenas do modulo de produtos.

### Linhas 9-24: `createEmptyProductForm`

Essa funcao e muito importante para o React.

Ela define como o estado inicial do formulario nasce:

- linha 11: `name`
- linha 12: `slug`
- linha 13: `description`
- linha 14: `images`
- linha 15: `variants`
- linha 16: `priceCents`
- linha 17: `stock`
- linha 18: `category`
- linha 19: `catalogKey`
- linha 20: `promocao`
- linha 21: `featuresText`
- linha 22: `isActive`

Licao para iniciante:

Se o estado nao nascer com `images: []` e `variants: []`, o componente pode quebrar quando tentar fazer `.map(...)`.

---

## 3. Transformacao de dados: `utils.js`

Arquivo: `src/app/(privado)/admin/deshboard/_utils/utils.js`

Esse arquivo e a ponte entre:

- o formato vindo da API
- o formato usado pelo formulario

### Linha 1: import `LOW_STOCK_THRESHOLD`

Esse import e usado nas funcoes de metricas do dashboard.

Ele nao faz upload de imagens, mas faz parte do contexto do modulo.

### Linhas 3-25: `normalizeImages(images, fallbackImage, legacyIdPrefix)`

Essa funcao resolve um problema classico:

- nem todo registro antigo tem uma galeria completa
- alguns produtos ou variantes antigos tinham apenas `img` e `alt`

O que ela faz:

- linhas 4-14:
  - monta uma lista fallback com uma unica imagem quando `fallbackImage` existe
- linha 16:
  - escolhe a fonte final: galeria real ou fallback
- linhas 18-24:
  - padroniza o formato de cada imagem

Saida final:

- `id`
- `url`
- `alt`
- `position`
- `storagePath`

Aprendizado:

Essa funcao e um exemplo de normalizacao de dados no front.

### Linhas 27-72: `toForm(product)`

Essa funcao pega o produto vindo da API e transforma em estado do formulario.

#### Linhas 28-37

Montam `images` do produto base.

Se o produto ja tiver `product.images`, usa essa lista.

Se nao tiver, mas tiver `product.img`, ela cria uma imagem fallback.

#### Linhas 39-56

Montam o array `variants`.

Cada variante recebe:

- `id`
- `name`
- `corName`
- `hex`
- `priceCents`
- `stock`
- `images`

Cada `variant.images` tambem passa por `normalizeImages(...)`.

#### Linhas 58-71

Montam o objeto final do formulario.

Licao importante:

O estado do formulario nao precisa ter a mesma cara exata do banco.
Ele precisa ter a cara que e mais conveniente para a interface React.

### Linhas 74-109: `toPayload(form)`

Essa funcao faz o caminho inverso de `toForm`.

Ela pega o estado React e transforma em payload da API.

#### Linhas 79-85

Transformam `form.images` em estrutura pronta para o backend.

#### Linhas 86-100

Transformam `form.variants` em estrutura pronta para o backend.

Cada variante envia:

- `id`
- `name`
- `corName`
- `hex`
- `priceCents`
- `stock`
- `images`

#### Linhas 101-107

Normalizam os demais campos do produto.

Aprendizado importante:

- `toForm` prepara dados para a tela
- `toPayload` prepara dados para a API

### Linhas 111-119: `formatDate`

Formata datas do painel.

Nao faz upload, mas ajuda a UI do editor.

### Linhas 122-137

Funcoes auxiliares do dashboard:

- `buildMetrics`
- `filterProductsByStatus`

---

## 4. Camada de requisicao do painel: `adminProductsApi.js`

Arquivo: `src/lib/helpers/api/adminProductsApi.js`

### Linha 1: import `supabase`

Esse import existe para pegar a sessao do usuario autenticado.

Sem sessao, o painel admin nao consegue chamar as rotas protegidas.

### Linhas 3-8: `getToken()`

Essa funcao:

- pede a sessao ao Supabase
- devolve `session?.access_token`

### Linhas 10-12: `getAdminProduct(id)`

Wrapper simples para:

- `GET /api/admin/products/:id`

### Linhas 14-42: `authFetch(url, init)`

Essa funcao e muito importante.

Ela concentra a logica repetitiva das chamadas autenticadas:

- linha 15:
  - pega o token
- linhas 16-20:
  - se nao houver token, lanca erro 401
- linhas 22-26:
  - monta headers
- linhas 28-32:
  - faz a chamada `fetch`
- linhas 34-39:
  - trata respostas HTTP com erro
- linha 41:
  - devolve `res.json()`

Aprendizado:

Centralizar logica de rede em uma funcao assim reduz duplicacao no front.

### Linhas 44-57: `listAdminProducts`

Busca lista paginada de produtos do admin.

Nao e o centro do upload, mas ajuda a abrir o editor.

### Linhas 59-64: `createAdminProduct`

Wrapper do `POST /api/admin/products`.

### Linhas 66-71: `updateAdminProduct`

Wrapper do `PUT /api/admin/products/:id`.

Essa e a chamada mais importante para salvar:

- galeria do produto
- variantes
- galerias das variantes

### Linhas 73-76: `archiveAdminProduct`

Wrapper do `DELETE /api/admin/products/:id`.

### Linhas 79-80: `verifyAdminAccess`

Chama `/api/admin/check`.

Serve para confirmar permissao administrativa.

---

## 5. Componente raiz do editor: `ProductEditorClient.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductEditorClient.jsx`

Esse componente organiza a logica principal do editor.

### Linha 1: `"use client"`

Indica que esse componente roda no lado do cliente.

Isso e necessario porque ele usa:

- hooks do React
- navegacao
- estado
- eventos de formulario

### Linhas 3-16: imports

#### Linhas 3-5

Imports de React, roteamento e icone:

- `useCallback`
- `useEffect`
- `useState`
- `useRouter`
- `ArrowLeft`

#### Linhas 6-11

Funcoes da camada de API:

- `archiveAdminProduct`
- `createAdminProduct`
- `getAdminProduct`
- `updateAdminProduct`

#### Linhas 12-16

Imports de interface e transformacao:

- `Button`
- `FeedbackBanners`
- `ProductFormSection`
- `createEmptyProductForm`
- `toForm`
- `toPayload`

### Linhas 18-20

O componente recebe `productId`.

Daqui nasce a logica:

- se existe `productId`, e edicao
- se nao existe, e criacao

### Linhas 22-28: estados

Estados principais:

- `form`
- `selectedProduct`
- `loading`
- `saving`
- `archiveDialogOpen`
- `error`
- `success`

### Linhas 30-32: `setField`

Funcao generica para atualizar um campo do formulario.

Exemplo de uso:

- `setField("images", imagens)`
- `setField("variants", variantes)`

### Linhas 34-47: `loadProduct`

Essa funcao carrega o produto para editar.

Passos:

- linha 35:
  - se for criacao, nao faz nada
- linhas 36-37:
  - ativa loading e limpa erro
- linha 39:
  - busca o produto na API
- linha 40:
  - guarda o produto original
- linha 41:
  - converte para estado do formulario com `toForm`
- linhas 42-45:
  - tratam erro e finalizacao

### Linhas 49-51: `useEffect`

Executa `loadProduct()` quando o componente entra em tela.

### Linhas 53-79: `handleSubmit`

Essa funcao salva o formulario.

Leitura passo a passo:

- linha 55:
  - impede submit padrao do navegador
- linhas 56-58:
  - ativa loading de salvamento e limpa feedback antigo
- linha 61:
  - transforma o estado em payload usando `toPayload`
- linhas 62-67:
  - se for criacao, chama `createAdminProduct` e redireciona
- linha 69:
  - se for edicao, chama `updateAdminProduct`
- linha 70:
  - mostra mensagem de sucesso
- linha 71:
  - recarrega o produto salvo
- linhas 72-76:
  - tratam erro e encerram o loading

Licao importante:

O `ProductImagesField` faz upload de arquivo.
Mas quem salva a estrutura inteira do produto continua sendo `handleSubmit`.

### Linhas 81-93: `handleArchive`

Desativa o produto e volta para o dashboard.

### Linhas 95-127: JSX principal

#### Linhas 97-104

Botao de voltar ao painel.

#### Linha 106

Banner de feedback de erro/sucesso.

#### Linhas 108-124

Se nao estiver carregando, renderiza `ProductFormSection`.

Props importantes repassadas:

- `form`
- `onFieldChange={setField}`
- `onSubmit={handleSubmit}`
- `selectedId`

Esse `selectedId` e crucial para o sistema de imagens, porque o upload depende do id do produto.

---

## 6. Formulario visual do painel: `ProductFormSection.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductFormSection.jsx`

Esse componente organiza a interface do editor.

### Linhas 1-28: imports

#### Linhas 1-24

Imports visuais:

- icones
- `Button`
- `Card`
- `Input`
- `Textarea`
- `Separator`
- `Switch`
- `AlertDialog`

#### Linha 25

- `formatDate`

#### Linhas 27-28

Componentes centrais do sistema:

- `ProductImagesField`
- `ProductVariantsField`

### Linhas 30-40: props

Props recebidas:

- `selectedProduct`
- `form`
- `onFieldChange`
- `onSubmit`
- `saving`
- `selectedId`
- `archiveDialogOpen`
- `onArchiveDialogOpenChange`
- `onArchive`

### Linhas 42-52: cabecalho

Mostra:

- se o usuario esta criando ou editando
- a data da ultima atualizacao

### Linhas 54-140: secao "Dados basicos"

Inputs:

- nome
- slug
- categoria
- catalog key

Padrao importante:

Todo input usa:

- `value={form.campo}`
- `onChange={() => onFieldChange("campo", valor)}`

Isso e a definicao pratica de formulario controlado.

### Linhas 144-192: secao "Preco e estoque"

Inputs:

- `priceCents`
- `stock`

Repare que os valores continuam em formato simples no estado.
A conversao final e feita em `toPayload`.

### Linhas 196-207: secao "Variantes"

Aqui o componente conecta a UI de variantes ao estado geral:

- linha 200:
  - renderiza `ProductVariantsField`
- linha 201:
  - repassa `productId`
- linha 202:
  - repassa `form.variants`
- linhas 203-205:
  - conecta o `onChange` das variantes ao estado principal

### Linhas 211-295: secao "Midia e texto"

#### Linhas 216-231

Galeria do produto base.

Se `selectedId` existe:

- renderiza `ProductImagesField`

Se nao existe:

- mostra mensagem pedindo para salvar primeiro

Isso ensina uma regra de negocio importante:

- o produto precisa existir antes do upload

#### Linhas 233-250

Input de promocao.

#### Linhas 252-270

Textarea de descricao.

#### Linhas 272-293

Textarea de features.

### Linhas 299-320: secao "Status"

Switch para ativar ou desativar o produto.

### Linhas 322-382: acoes finais

#### Linhas 323-336

Botao de salvar.

#### Linhas 338-382

Dialogo de confirmacao para desativar produto.

---

## 7. Variantes no painel: `ProductVariantsField.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductVariantsField.jsx`

Esse componente cuida da edicao das variantes.

### Linha 1: `"use client"`

Necessario porque o componente usa:

- eventos de clique
- estado vindo do pai
- interacao com formulario

### Linhas 3-14: imports

- `Plus`
  - icone de adicionar variante
- `Trash2`
  - icone de remover variante
- `Badge`
  - contador visual
- `Button`
  - botoes de acao
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
  - estrutura visual
- `Input`
  - campos de formulario
- `ProductImagesField`
  - componente reutilizado de galeria

### Linhas 16-26: `createEmptyVariant`

Cria uma nova variante vazia.

Campos criados:

- `id`
- `name`
- `corName`
- `hex`
- `priceCents`
- `stock`
- `images`

Aprendizado:

Array dinamico de formulario quase sempre precisa de uma funcao assim.

### Linhas 28-30: `getVariantLabel`

Escolhe o melhor texto para exibir no card da variante.

Prioridade:

1. `corName`
2. `name`
3. `Variante X`

### Linhas 32-36: props do componente

- `productId`
- `value = []`
- `onChange`

`value` representa todo o array de variantes.

### Linhas 37-43: `updateVariant`

Atualiza apenas uma variante do array.

Pensamento:

- nao muda o array inteiro na mao
- localiza a variante certa
- aplica um `updater`

### Linhas 45-50: `updateVariantField`

Atalho para atualizar um campo simples de uma variante.

Exemplo:

- nome
- cor
- hex
- preco
- estoque
- imagens

### Linhas 52-54: `addVariant`

Adiciona uma nova variante ao array.

### Linhas 56-58: `removeVariant`

Remove a variante do array.

### Linhas 60-75: cabecalho da secao

Mostra:

- titulo
- quantidade de variantes
- explicacao da funcionalidade

### Linhas 78-231: renderizacao das variantes

Se `value.length > 0`, o componente percorre o array com `.map(...)`.

#### Linhas 79-80

Calculam o label visual de cada variante.

#### Linhas 83-107

Cabecalho do card individual da variante:

- nome exibido
- descricao curta
- botao de remover

#### Linhas 109-198

Inputs da variante.

Cada um atualiza um campo especifico:

- linhas 114-124:
  - nome da variante
- linhas 131-141:
  - nome da cor
- linhas 148-158:
  - hex da cor
- linhas 165-177:
  - preco da variante
- linhas 184-196:
  - estoque da variante

Esses inputs sao controlados.

### Linhas 200-221: galeria da variante

Esse e o ponto mais importante do componente.

Se `productId` existe:

- renderiza `ProductImagesField`
- passa `variant.images`
- personaliza os textos do componente
- atualiza `variant.images` quando a galeria muda

Se `productId` nao existe:

- mostra aviso para salvar o produto primeiro

### Linhas 225-230

Estado vazio do componente quando ainda nao existe nenhuma variante.

### Linhas 233-236

Botao de adicionar variante.

Ele chama `addVariant`.

---

## 8. Galeria reutilizavel: `ProductImagesField.jsx`

Arquivo: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductImagesField.jsx`

Esse componente e o centro do sistema de imagens do painel.

### Linha 1: `"use client"`

Necessario por causa de:

- estado local
- refs
- eventos de upload
- drag and drop

### Linhas 3-23: imports

#### Linhas 3-4

- `useRef`
- `useState`
- `Image`

#### Linhas 5-11

Icones da interface:

- `GripVertical`
- `Loader2`
- `Pencil`
- `Plus`
- `Trash2`

#### Linhas 12-21

Componentes visuais:

- `Badge`
- `Button`
- `Card`
- `Input`

#### Linha 22

- `cn`
  - utilitario para combinar classes

#### Linha 23

- `supabase`
  - usado para ler a sessao atual

### Linhas 25-31: `getAccessToken`

Pede ao Supabase a sessao atual e devolve o token.

Esse token vai no header `Authorization`.

### Linhas 33-59: `uploadImage(file, productId)`

Essa funcao faz o upload de fato.

Leitura detalhada:

- linha 34:
  - pega o token
- linhas 36-38:
  - se nao houver token, lanca erro
- linhas 40-42:
  - monta `FormData`
- linhas 44-50:
  - faz `fetch("/api/admin/uploads")`
- linha 52:
  - tenta ler o JSON de resposta
- linhas 54-56:
  - se a resposta nao for OK, lanca erro
- linha 58:
  - devolve o payload

### Linhas 61-69: `createImageItem`

Cria o objeto de imagem no formato do formulario.

Campos:

- `id`
- `url`
- `alt`
- `storagePath`
- `position`

### Linhas 71-75: `updateImageList`

Atualiza uma imagem especifica da lista.

### Linhas 77-94: `reorderImages`

Resolve a troca de ordem da galeria.

Etapas:

- encontra origem
- encontra destino
- move a imagem no array
- recalcula `position`

### Linhas 96-125: componente `AddImageTile`

Renderiza o botao visual de adicionar foto.

Props:

- `disabled`
- `isUploading`
- `onClick`

### Linhas 127-233: componente `ImageCard`

Esse componente desenha cada item da galeria.

Ele tem tres grandes blocos internos:

- preview da imagem
- badge e icone visual
- controles de `alt`, trocar e remover

Props recebidas:

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

#### Linhas 140-149

Configuram o arraste e as classes do card.

#### Linhas 152-188

Renderizam a imagem em si e o bloco visual de capa.

#### Linhas 190-228

Renderizam:

- input de `alt`
- botao de trocar
- botao de remover

### Linhas 235-243: assinatura do componente principal

Props:

- `productId`
- `value`
- `onChange`
- `title`
- `description`
- `emptyTitle`
- `emptyDescription`

Essa flexibilidade permite reutilizar o componente tanto no produto base quanto nas variantes.
