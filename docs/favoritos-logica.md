# Documentacao: Logica de Favoritos (TechShed)

## 1. Objetivo deste documento
Este guia explica como o sistema de favoritos foi implementado no projeto atual, com persistencia local e integracao com pagina de produto, header e carrinho.

Ao final, voce deve conseguir:
- entender onde a regra de favoritos vive;
- integrar o toggle de favoritos em qualquer componente;
- reutilizar o mesmo padrao em outro projeto React/Next.js.

## 2. Visao geral da arquitetura
O sistema de favoritos usa:
- `Context API` para estado global;
- `localStorage` para persistencia;
- resolucao de dados via catalogo (`produtos`) para renderizar UI consistente.

Arquivos principais:
- `src/contexts/favorit-context.jsx` -> nucleo da regra de favoritos;
- `src/contexts/providers.jsx` -> injecao global de `FavoriteProvider`;
- `src/components/componets-page-produto/iconFavorito.jsx` -> toggle de favorito na pagina de produto;
- `src/components/layout/Header.jsx` -> badge com total de favoritos;
- `src/app/favoritos/FavoritoClient.jsx` -> tela completa de favoritos.

## 3. Modelo de dados
Persistencia minima no navegador:
- `favoriteIds: string[]`

Regras:
- cada favorito e identificado por `productId` (nao por variante);
- IDs invalidos sao descartados;
- IDs duplicados sao removidos;
- produtos inexistentes no catalogo sao descartados na sanitizacao.

Chave de armazenamento:
- `techshed.favorites.v1`

## 4. Nucleo (`favorit-context.jsx`)
### 4.1 Indexacao do catalogo
`buildProductIndex()` cria um `Map<productId, product>` para busca O(1), evitando percorrer o catalogo inteiro em cada consulta.

### 4.2 Sanitizacao
`sanitizeFavoriteIds(rawFavoriteIds)` garante integridade:
- aceita apenas strings validas;
- deduplica mantendo ordem;
- remove IDs sem correspondencia no catalogo.

### 4.3 Persistencia
Fluxo:
1. no estado inicial (client), tenta ler `localStorage`;
2. converte JSON para array;
3. sanitiza;
4. persiste novamente a cada alteracao de `favoriteIds`.

### 4.4 API publica
`useFavorite()` expoe:
- `items`
- `favoriteIds`
- `totalFavorites`
- `isEmpty`
- `isFavorite(productId)`
- `addFavorite(productId)`
- `removeFavorite(productId)`
- `toggleFavorite(productId)`
- `clearFavorites()`

## 5. Integracoes de interface
### 5.1 Pagina de produto
`IconFavorit` recebe `productId` e chama `toggleFavorite`.

Comportamento:
- `aria-pressed` indica estado selecionado;
- `aria-label` alterna entre adicionar/remover;
- icone de coracao fica preenchido quando favoritado.

### 5.2 Header
O botao de favoritos continua navegando para `/favoritos`, agora com badge de quantidade:
- mostra total atual;
- limita exibicao visual em `99+`.

### 5.3 Pagina `/favoritos`
Estados:
- vazio: mensagem + CTA para `/loja`;
- com itens: lista com imagem, nome, preco e estoque.

Acoes por item:
- `Ver produto`;
- `Adicionar ao carrinho` (com `quantity: 1` e `variantId: null`);
- `Remover dos favoritos`.

Regra de estoque:
- item sem estoque continua visivel;
- botao de adicionar ao carrinho fica desabilitado.

## 6. Navegacao de retorno
No botao `Voltar` da tela de favoritos:
- se houver historico (`window.history.length > 1`), executa `router.back()`;
- sem historico valido, faz fallback para `/loja`.

## 7. Checklist de validacao manual
1. Favoritar um produto na tela de detalhe.
2. Recarregar a pagina e validar persistencia do favorito.
3. Validar badge de favoritos no header.
4. Abrir `/favoritos` e conferir listagem.
5. Remover um item e validar atualizacao imediata.
6. Adicionar item com estoque ao carrinho e validar badge do carrinho.
7. Validar item sem estoque com botao desabilitado.
8. Limpar favoritos e validar estado vazio.
9. Testar botao voltar com e sem historico valido.

## 8. Resumo rapido
Quatro pontos sustentam o sistema:
1. estado global com `FavoriteProvider`;
2. persistencia minima por `productId`;
3. sanitizacao centralizada para evitar dados invalidos;
4. UI desacoplada consumindo `useFavorite()` em qualquer componente cliente.
