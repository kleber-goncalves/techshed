# Documentacao: Logica do Carrinho (TechShed)

## 1. Objetivo deste documento
Este guia explica, de forma didatica, como a logica do carrinho funciona no projeto atual e como reaproveitar a mesma abordagem em outro projeto/componente.

Ao final, voce deve conseguir:
- entender a arquitetura inteira do carrinho;
- saber em quais arquivos cada parte da logica vive;
- replicar o fluxo em outro projeto Next.js (ou React com pequenas adaptacoes);
- evitar erros comuns de estoque, persistencia e navegacao.

## 2. Visao geral da arquitetura
No projeto atual, o carrinho e baseado em:
- `Context API` para estado global;
- `localStorage` para persistencia;
- `sessionStorage` para lembrar de onde o usuario veio antes de abrir o carrinho;
- componentes clientes (`"use client"`) para interacao.

Arquivos principais:
- `src/contexts/cart-context.jsx` -> nucleo da logica do carrinho;
- `src/contexts/providers.jsx` -> injeta o `CartProvider` no app inteiro;
- `src/app/produto/[slug]/ProdutoClient.jsx` -> adiciona item ao carrinho;
- `src/components/layout/Header.jsx` -> icone do carrinho com badge e toggle abrir/fechar carrinho;
- `src/app/carrinho/CarrinhoClient.jsx` -> tela do carrinho (listar, editar, remover, limpar);
- `src/lib/cartReturnPath.js` -> utilitario de "voltar para onde estava";
- `src/lib/formatCurrency.js` -> formatacao de preco.

## 3. Modelo de dados usado no carrinho
O carrinho separa dois conceitos:

1. **Linha minima persistida**
- `productId`
- `variantId` (`null` quando nao existe variacao)
- `quantity`

2. **Linha resolvida para UI**
- tudo acima, mais dados derivados do catalogo:
- `name`, `img`, `alt`, `stock`, `unitPriceCents`, `colorName`, `colorHex`, `slug`
- `lineKey` (chave unica visual/logica)
- `lineSubtotalCents`

Chave unica da linha:
- formato: ``${productId}::${variantId ?? "base"}``
- isso permite mesclar corretamente:
  - mesmo produto + mesma cor => soma quantidade;
  - mesmo produto + cor diferente => linhas separadas.

## 4. Nucleo do carrinho (`cart-context.jsx`)
### 4.1 Indexacao do catalogo
A funcao `buildProductIndex()` cria um `Map` de produtos para busca rapida por `productId`.

Por que isso e importante:
- evita percorrer `Object.values(produtos).flat()` toda vez;
- simplifica resolucao de preco/estoque/imagem.

### 4.2 Sanitizacao e seguranca de dados
A funcao `sanitizeLines(rawLines)` protege o carrinho contra dados invalidos:
- remove produto inexistente;
- remove variacao inexistente;
- remove item sem estoque;
- corrige quantidade para intervalo valido (`1..stock`);
- mescla linhas iguais automaticamente.

Isso acontece tanto:
- ao carregar do `localStorage`;
- quanto ao adicionar/editar quantidades.

### 4.3 Persistencia
Chave no navegador:
- `techshed.cart.v1` (`localStorage`)

Fluxo:
1. estado inicial tenta ler do `localStorage`;
2. converte JSON para array;
3. sanitiza tudo;
4. salva novamente no `localStorage` sempre que `lines` muda.

### 4.4 API publica do hook
`useCart()` entrega:
- `items`
- `totalItems`
- `subtotalCents`
- `isEmpty`
- `addItem({ productId, variantId, quantity })`
- `setItemQuantity({ lineKey, quantity })`
- `removeItem(lineKey)`
- `clearCart()`

Regra importante:
- `useCart()` fora de `CartProvider` gera erro (protege contra uso incorreto).

## 5. Registro global do provider (`providers.jsx`)
`CartProvider` envolve toda a aplicacao dentro de `ThemeProvider`.

Resultado:
- qualquer componente cliente pode chamar `useCart()`;
- Header, pagina de produto e pagina de carrinho compartilham o mesmo estado.

## 6. Fluxo da pagina de produto (`ProdutoClient.jsx`)
### 6.1 Selecao de variacao e estoque
`selectedVariant` e derivado por `corAtiva`.
`availableStock` usa:
- estoque da variacao, quando existe;
- senao estoque do produto base.

### 6.2 Quantidade segura
`clampedQuantity` garante que a quantidade nunca passa de `availableStock`.

### 6.3 Adicionar ao carrinho
No botao "Adicionar ao carrinho":
- valida se tem estoque;
- chama `addItem({ productId, variantId, quantity })`.

### 6.4 Comprar
No botao "Comprar":
- adiciona item com a mesma logica;
- navega para `/carrinho`.

## 7. Fluxo do header (`Header.jsx`)
### 7.1 Badge
`totalItems` vem de `useCart()`.
O badge mostra:
- quantidade total de unidades (nao apenas itens unicos);
- limite visual em `99+`.

### 7.2 Toggle do icone do carrinho
Comportamento implementado:
- se usuario NAO esta em `/carrinho`: abre `/carrinho`;
- se usuario JA esta em `/carrinho`: volta para a rota anterior salva.

Isso usa `cartReturnPath.js`:
- `saveCartReturnPath(path)` grava o ultimo caminho valido;
- `getCartBackPath("/loja")` recupera caminho para voltar.

## 8. Fluxo da tela de carrinho (`CarrinhoClient.jsx`)
### 8.1 Estado vazio
Mostra mensagem e CTA para continuar comprando.

### 8.2 Estado com itens
Para cada item:
- imagem, nome, cor (quando houver), preco unitario, subtotal;
- botoes `-` e `+` com limite de `1..stock`;
- botao remover.

Acoes globais:
- `Limpar carrinho`;
- `Voltar` (usa rota salva);
- botao de checkout placeholder.

Resumo:
- subtotal e total usando `formatCurrency`.

## 9. Como copiar essa logica para outro projeto
### Passo 1: criar os arquivos base
Crie:
- `src/contexts/cart-context.jsx`
- `src/lib/cartReturnPath.js` (se quiser comportamento de toggle/volta)
- `src/lib/formatCurrency.js`
- `src/app/carrinho/page.jsx`
- `src/app/carrinho/CarrinhoClient.jsx`

### Passo 2: conectar provider global
No provider raiz do app:
- envolva a arvore com `<CartProvider>`.

### Passo 3: conectar ponto de entrada de compra
No componente do produto:
- tenha `productId`, `variantId` (opcional), `quantity`;
- chame `addItem`.

### Passo 4: conectar header
No icone do carrinho:
- leia `totalItems`;
- renderize badge;
- aplique toggle:
  - fora do carrinho -> abrir carrinho;
  - dentro do carrinho -> voltar.

### Passo 5: montar tela de carrinho
Use `items` para renderizar lista;
use `setItemQuantity`, `removeItem`, `clearCart` para interacao.

## 10. Adaptando para "outro componente" com mesma logica
Se voce quiser a mesma logica em mini-cart, drawer ou modal:
- mantenha `cart-context` igual;
- troque apenas a camada visual;
- continue usando as mesmas funcoes do hook (`useCart`).

Exemplo:
- em vez de pagina `/carrinho`, voce pode abrir um painel lateral;
- as regras de merge, estoque e persistencia continuam iguais.

## 11. Erros comuns e como evitar
1. **Nao envolver com provider**
- Sintoma: erro "useCart precisa ser usado dentro de CartProvider".
- Correcao: verificar `providers.jsx`/layout raiz.

2. **Persistir objeto completo do produto no carrinho**
- Problema: dados ficam desatualizados quando o catalogo muda.
- Melhor pratica usada aqui: persistir somente `productId`, `variantId`, `quantity`.

3. **Nao validar estoque ao editar quantidade**
- Problema: quantidade invalida na UI.
- Correcao: sempre passar por `sanitizeLines`/clamp.

4. **Misturar variacoes no mesmo item**
- Problema: cor A e cor B somam juntas sem querer.
- Correcao: incluir `variantId` na `lineKey`.

## 12. Checklist de validacao manual
1. Adicionar produto sem variacao duas vezes e validar merge.
2. Adicionar produto com cores diferentes e validar linhas separadas.
3. Tentar ultrapassar estoque no produto e no carrinho.
4. Recarregar pagina e validar persistencia.
5. Clicar no icone do carrinho fora de `/carrinho` (abrir).
6. Clicar no icone do carrinho dentro de `/carrinho` (voltar).
7. Testar botao `Voltar` dentro do carrinho.

## 13. Resumo final para estudante
Se voce lembrar de 4 ideias, voce consegue replicar:
1. Estado global do carrinho via Context API.
2. Persistencia minima (`productId`, `variantId`, `quantity`) no `localStorage`.
3. Sanitizacao centralizada para merge e estoque.
4. UI desacoplada da regra: qualquer componente pode consumir `useCart()`.

Com isso, voce pode implementar a mesma logica em outro projeto e trocar apenas o layout (pagina, modal, drawer, dropdown) sem reescrever as regras de negocio.
