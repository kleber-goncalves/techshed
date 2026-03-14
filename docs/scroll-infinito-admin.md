# Scroll infinito no painel admin (documentacao didatica)

Este documento explica, de forma detalhada e para iniciantes, como o scroll infinito funciona no painel de produtos do admin. O foco e estudo e reuso do mesmo padrao em outros projetos.

## 1. Visao geral

Scroll infinito e um padrao de navegacao em que novos itens sao carregados automaticamente conforme o usuario se aproxima do fim da lista. Ele evita paginacao manual e melhora a fluidez do uso quando ha muitos registros.

Objetivos principais neste projeto:

1. Carregar produtos em paginas menores, sem travar a interface.
2. Manter o estado da lista enquanto o usuario pesquisa e filtra.
3. Exibir indicadores claros de carregamento e fim da lista.
4. Evitar duplicidade de itens quando novas paginas chegam.

## 2. Arquitetura e fluxo de dados

Camadas:

1. API paginada no backend.
2. Hook de dados no frontend.
3. Trigger de scroll (IntersectionObserver).
4. UI de lista e indicador (sentinel).

Fluxo simplificado:

```
Usuario rola a pagina
-> Sentinel entra na viewport
-> useInfiniteTrigger dispara onLoadMore
-> useInfiniteAdminProducts busca a proxima pagina
-> Lista e KPIs atualizam na UI
```

## 3. Backend: contrato da API paginada

Rota utilizada:

`GET /api/admin/products`

Parametros de query:

1. `q`: texto para busca (nome, slug, categoria ou similares).
2. `status`: filtro de status (ex.: ativo, inativo, todos).
3. `page`: pagina atual, iniciando em 1.
4. `limit`: quantidade de itens por pagina.

Resposta esperada (formato base):

```json
{
  "items": [
    {
      "id": "prod_123",
      "name": "Produto Exemplo",
      "slug": "produto-exemplo",
      "status": "active",
      "price": 199.9,
      "stock": 10
    }
  ],
  "hasMore": true,
  "summary": {
    "total": 120,
    "active": 98,
    "inactive": 22,
    "lowStock": 7
  }
}
```

Regras importantes:

1. `items` sempre retorna somente a pagina solicitada.
2. `hasMore` indica se existe outra pagina apos a atual.
3. `summary` e usado para os KPIs do painel.

## 4. Frontend: componentes e hooks

A seguir, a explicacao do papel de cada arquivo no fluxo.

### 4.1 `useInfiniteAdminProducts.js`

Responsabilidade principal:

1. Buscar paginas de produtos.
2. Controlar estados de carregamento inicial e carregamento incremental.
3. Evitar duplicidade ao mesclar paginas.
4. Expor `hasMore` para a UI saber se pode continuar.

Estados principais expostos:

1. `items`: lista acumulada de produtos.
2. `summary`: metricas para o painel.
3. `page`: pagina atual carregada.
4. `hasMore`: indica se existem mais paginas.
5. `loadingInitial`: carregamento do primeiro bloco.
6. `loadingMore`: carregamento de paginas seguintes.
7. `error`: erro de rede ou de API.

Funcoes essenciais:

1. `fetchPage(pageNumber)`: busca uma pagina especifica e mescla resultados.
2. `reload()`: reinicia o fluxo ao trocar busca ou filtro.
3. `loadMore()`: busca a proxima pagina quando o sentinel dispara.

Detalhes importantes:

1. `mergeById` garante que o mesmo produto nao apareca duas vezes.
2. `requestIdRef` evita race conditions quando o usuario muda filtros rapidamente.

### 4.2 `useInfiniteTrigger.js`

Responsabilidade principal:

1. Criar um `IntersectionObserver`.
2. Disparar `onLoadMore` quando o sentinel entra na viewport.

Parametros tipicos:

1. `enabled`: liga ou desliga o observer.
2. `loading`: evita chamadas concorrentes.
3. `hasMore`: impede chamadas quando nao ha mais paginas.
4. `rootMargin`: antecipa o carregamento antes do fim real da lista.

Saida:

1. `sentinelRef`: ref que deve ser aplicada ao componente sentinel.

### 4.3 `InfiniteScrollSentinel.jsx`

Responsabilidade principal:

1. Mostrar um estado visual quando esta carregando mais itens.
2. Mostrar o fim da lista quando `hasMore` for falso.
3. Fornecer o elemento observado pelo `IntersectionObserver`.

Estados visuais comuns:

1. "Carregando mais..." quando `loading` esta ativo.
2. "Fim da lista" quando `hasMore` esta falso.

### 4.4 `ProductsSection.jsx`

Responsabilidade principal:

1. Renderizar filtros de busca e status.
2. Renderizar a tabela de produtos.
3. Mostrar skeleton quando `loadingInitial` esta ativo.
4. Renderizar o sentinel no final da tabela.

Entradas (props) mais importantes:

1. `search`: valor atual do input de busca.
2. `onSearchChange`: atualiza o input de busca.
3. `onSearchSubmit`: aplica a busca.
4. `statusFilter`: filtro atual de status.
5. `onStatusFilterChange`: muda o filtro.
6. `loadingInitial`: controla skeleton e estado inicial.
7. `loadingMore`: controla o sentinel.
8. `hasMore`: informa se existem mais paginas.
9. `sentinelRef`: ref que ativa o observer.
10. `products`: lista acumulada.
11. `onSelectProduct`: seleciona um item para edicao.

Importacoes tipicas e por que existem:

1. Componentes UI (Button, Input, Select, Table, Badge) para padronizar o design.
2. `InfiniteScrollSentinel` para o bloco final da lista.
3. Utilitarios de formato (ex.: formatacao de preco).

### 4.5 `AdminProdutosClient.jsx`

Responsabilidade principal:

1. Orquestrar o fluxo completo.
2. Manter estados de busca e filtros.
3. Coordenar `useInfiniteAdminProducts` e `useInfiniteTrigger`.
4. Renderizar KPIs e secoes principais.

Pontos de atencao:

1. `searchInput` e `appliedSearch` evitam disparar busca a cada tecla.
2. `useInfiniteTrigger` depende de `loadingMore` e `hasMore`.
3. `KpiSection` usa `summary` retornado pela API.

## 5. Glossario

1. Paginacao: dividir uma lista grande em paginas menores.
2. Sentinel: elemento invisivel (ou discreto) observado para disparar carregamento.
3. hasMore: booleano que indica se existe proxima pagina.
4. debounce: tecnica para evitar chamadas repetidas enquanto o usuario digita.
5. estado derivado: informacao calculada a partir de outros estados (ex.: KPIs).
6. IntersectionObserver: API do browser para observar elementos entrando na viewport.

## 6. Como aplicar em outro projeto

Passo a passo recomendado:

1. Defina uma rota paginada na API com `page` e `limit`.
2. Retorne `items` e `hasMore` no response.
3. Crie um hook de dados que:
4. Controle `loadingInitial` e `loadingMore`.
5. Mescle paginas sem duplicar (por id).
6. Crie um hook com `IntersectionObserver` para disparar `loadMore`.
7. Crie um sentinel simples e adicione no fim da lista.
8. Conecte tudo na pagina principal.

Estrutura de pastas sugerida:

```
src/
  hooks/
    useInfiniteTrigger.js
    useInfiniteProducts.js
  components/
    InfiniteScrollSentinel.jsx
    ProductsList.jsx
  pages/
    AdminProducts.jsx
```

Checklist de integracao:

1. O sentinel aparece somente quando existem itens.
2. `loadMore` nao dispara quando `loadingMore` e true.
3. A API retorna `hasMore` correto.

## 7. Checklist de testes manuais

1. Carregamento inicial mostra skeleton e depois itens.
2. Ao rolar, novas paginas aparecem sem duplicar itens.
3. Quando `hasMore` e falso, o sentinel mostra "Fim da lista".
4. Trocar filtro ou busca reinicia a lista.
5. Erros de API exibem mensagem clara.

## 8. Erros comuns e como evitar

1. Duplicidade de itens: sempre mescle por `id`.
2. Chamadas infinitas: respeite `hasMore` e `loadingMore`.
3. Observer disparando cedo demais: ajuste `rootMargin`.
4. UI travando: mantenha pagina menor (limit moderado).
