# Changelog

Este arquivo documenta a evolução do software de forma clara para usuários e desenvolvedores.
Cada versão descreve **o que mudou**, **por que mudou**, **impacto**, e **como validar**.

## Como ler este changelog
- **Added**: novas funcionalidades
- **Changed**: mudanças de comportamento, melhorias ou refactors
- **Fixed**: correções de bugs
- **Deprecated**: recursos que serão removidos
- **Removed**: recursos removidos
- **Security**: correções de segurança

## Linha do tempo (exemplo)

2026-02-06  v0.1.0  ──────────•  Ajustes iniciais do produto
2026-02-01  v0.0.9  ───────•     Preparação para UI/UX
2026-01-25  v0.0.8  ───•         Estrutura base do projeto

Legenda: o ponto marca o release; a linha mostra evolução temporal.

## Estrutura recomendada de cada release

### vX.Y.Z — AAAA-MM-DD
**Resumo**
- Uma frase curta com o objetivo da release.

**Motivação**
- Por que a mudança foi necessária?
- Qual problema do usuário ou do time ela resolve?

**Impacto**
- Componentes afetados.
- Compatibilidade: `sim` / `não`.
- Risco: `baixo` / `médio` / `alto` com explicação.

**Mudanças**
- **Added**
  - ...
- **Changed**
  - ...
- **Fixed**
  - ...
- **Deprecated**
  - ...
- **Removed**
  - ...
- **Security**
  - ...

**Como testar**
1. Passo 1
2. Passo 2
3. Resultado esperado

**Diagrama (exemplo)**

Antes:
```
User -> Página A -> Componente X (largura fixa)
```

Depois:
```
User -> Página A -> Componente X (largura opcional)
```

## Releases

### v0.1.16 — 2026-02-18
**Resumo**
- Endurecimento de segurança no fluxo de cartões (armazenar apenas `last4`) e validações no backend.

**Motivação**
- Reduzir risco ao lidar com dados sensíveis e garantir consistência das regras no servidor.

**Impacto**
- Componentes afetados: `src/app/api/cards/*`, `src/lib/helpers/api/cardApi.js`, `src/components/componemts-conta-users/layout/layout-cart/sec-cartsII.jsx`, Prisma (schema + migration) e `docs/sec-cartsII.md`.
- Compatibilidade: não — exige nova migration e altera o formato dos dados retornados (agora `last4`).
- Risco: médio — mudança de schema e API.

**Mudanças**
- **Changed**
  - Backend agora valida expiração e Luhn, sanitiza número e salva apenas `last4`.
  - Front passa a consumir `last4` e usar `DELETE /api/cards/[id]`.

**Como testar**
1. Rodar migrations.
2. Criar cartão e confirmar que a API retorna `last4` (sem número completo).
3. Confirmar erro 400 para expiração inválida.
4. Excluir cartão com `DELETE /api/cards/[id]`.

### v0.1.15 — 2026-02-18
**Resumo**
- CRUD de cartões com API protegida, UI de carteira com validação/formatação e documentação.

**Motivação**
- Permitir que o usuário gerencie cartões com segurança e uma UX guiada (validação, máscara e bandeira).

**Impacto**
- Componentes afetados: `src/app/api/cards/*`, `src/hooks/cardHooks.js`, `src/lib/helpers/api/cardApi.js`, `src/lib/cardBrand.js`, `src/components/componemts-conta-users/layout/layout-cart/sec-cartsII.jsx`, Prisma (schema + migration) e `docs/sec-cartsII.md`.
- Compatibilidade: sim — adição de novas rotas e componentes.
- Risco: médio — envolve CRUD e persistência de dados sensíveis.

**Mudanças**
- **Added**
  - Rotas `GET/POST /api/cards` e `DELETE /api/cards/[id]`.
  - Hook `cardHooks` e helper `cardApi` para consumo das rotas.
  - Modelo `Card` e migration no Prisma.
  - Documentação `docs/sec-cartsII.md`.
- **Changed**
  - Seção de carteira com modal, validação do número, formatação ao digitar, bandeira auto-preenchida e máscara no display.
- **Security**
  - Rotas de cartões exigem token Supabase.

**Como testar**
1. Estar autenticado (Supabase).
2. Abrir “Minha Carteira”, adicionar um cartão válido e confirmar que a lista mostra só os 4 últimos dígitos.
3. Tentar salvar com número inválido e confirmar bloqueio + mensagem de erro.
4. Excluir um cartão e validar remoção imediata.
5. Chamar `/api/cards` sem token e validar retorno 401.

### v0.1.14 — 2026-02-17
**Resumo**
- CRUD de endereços com API protegida, UI de modais e documentação técnica.

**Motivação**
- Permitir que o usuário gerencie endereços com segurança e persistência.
- Centralizar o fluxo de criação/edição/exclusão em uma UI simples.

**Impacto**
- Componentes afetados: `src/app/api/addresses/*`, `src/hooks/addressHooks.js`, `src/lib/helpers/api/addressApi.js`, modais e seção de endereços, Prisma (schema + migration), documentação.
- Compatibilidade: sim — adição de novas rotas e componentes.
- Risco: médio — envolve CRUD e autenticação.

**Mudanças**
- **Added**
  - Rotas `GET/POST /api/addresses` e `PUT/DELETE /api/addresses/[id]`.
  - Hook `addressHooks` e helper `addressApi` para consumo das rotas.
  - Modais de formulário e confirmação de exclusão de endereço.
  - Documentação `docs/section-end.md`.
  - Migration e modelo `Address` no Prisma.
- **Changed**
  - Seção de endereços para usar modais e fluxo de CRUD.
- **Security**
  - Rotas de endereço exigem token Supabase.

**Como testar**
1. Estar autenticado (Supabase).
2. Abrir a seção “Meus endereços” e adicionar um endereço.
3. Editar e excluir um endereço existente.
4. Testar chamadas para `/api/addresses` sem token e validar retorno 401.

### v0.1.13 — 2026-02-17
**Resumo**
- Autenticação com Supabase, sincronização de usuários no banco e edição de perfil.

**Motivação**
- Garantir login/cadastro simples no front e persistência do usuário no banco local.
- Permitir atualização de dados pessoais com segurança usando o token do Supabase.

**Impacto**
- Componentes afetados: rotas `src/app/api/users/*` e `src/app/api/syncUser`, tela `/auth`, hooks de usuário, componentes de conta, Prisma (schema + migration).
- Compatibilidade: sim — novas rotas e ajustes incrementais.
- Risco: médio — fluxo de autenticação e atualização de dados.

**Mudanças**
- **Added**
  - Rota `POST /api/syncUser` para sincronizar usuário do Supabase com o Prisma.
  - Página `/auth` para login e cadastro com Supabase.
  - Hook `updateUserProfile` para atualização de dados e senha.
  - Client do Supabase e client do Prisma com adapter PostgreSQL.
  - Migration com o campo `phone` na tabela `User`.
- **Changed**
  - `PUT /api/users/[id]` agora valida token e impede atualização de IDs diferentes.
  - Componentes de conta passaram a carregar dados do usuário autenticado.
- **Removed**
  - `src/lib/prisma.js` substituído por `src/lib/prisma/prisma.js`.
- **Security**
  - Validação de token Supabase e autorização por `id` na rota `PUT /api/users/[id]`.

**Como testar**
1. Abrir `/auth`, criar conta e confirmar o email (quando aplicável).
2. Fazer login e confirmar o redirecionamento para `/cnfgContaUsers/minha_conta`.
3. Validar que `/api/syncUser` retorna o usuário quando recebe `access_token` válido.
4. Atualizar `name/email/phone` no formulário e verificar persistência via `PUT /api/users/[id]`.
5. Tentar atualizar outro `id` e confirmar retorno 403.

### v0.1.12 — 2026-02-12
**Resumo**
- Sub-rotas de Configurações da Conta com layout persistente e navegação interna.

**Motivação**
- Permitir troca de seções sem perder o header do módulo.
- Organizar o conteúdo da conta do usuário em rotas claras e diretas.

**Impacto**
- Componentes afetados: `src/app/cnfgContaUsers/*`, `TopHeader`, `Header`, remoção da rota `src/app/mhCont`.
- Compatibilidade: não — rota `/mhCont` removida.
- Risco: médio — mudanças em rotas e navegação interna.

**Mudanças**
- **Added**
  - `src/app/cnfgContaUsers/layout.jsx` para manter o header fixo e renderizar conteúdo variável.
  - Sub-rotas `/cnfgContaUsers/minha-conta`, `/cnfgContaUsers/enderecos`, `/cnfgContaUsers/carteira`.
  - Componente reutilizável `src/components/componemts-conta-users/layout/minha-conta.jsx`.
- **Changed**
  - `src/components/componemts-conta-users/layout/top.jsx` com navegação semântica e links para sub-rotas.
  - `src/app/cnfgContaUsers/page.jsx` agora renderiza a seção “Minha conta” como padrão.
  - `src/components/layout/Header.jsx` aponta “Configurações da Conta” para `/cnfgContaUsers`.
- **Removed**
  - Rota antiga `/mhCont` (arquivos em `src/app/mhCont/`).

**Como testar**
1. Abrir `/cnfgContaUsers` e confirmar que o header do módulo aparece.
2. Clicar em “Minha conta”, “Meus endereços” e “Meus carteira” e validar que só o conteúdo abaixo muda.
3. Acessar diretamente `/cnfgContaUsers/minha-conta`, `/enderecos`, `/carteira`.
4. Confirmar que `/mhCont` não existe mais.

### v0.1.11 — 2026-02-12
**Resumo**
- Refinamentos do fluxo de favoritos com retorno pelo ícone do header e ajustes de documentação técnica do carrinho.

**Motivação**
- Fechar o comportamento de navegação ao clicar no coração estando em `/favoritos`.
- Melhorar a legibilidade do código de carrinho para manutenção e estudo.

**Impacto**
- Componentes afetados: `Header`, helper de retorno dos favoritos, `ProdutoClient`, `providers`, contexto de favoritos, documentação de favoritos e `cart-context`.
- Compatibilidade: sim — mudanças incrementais sem quebrar rotas existentes.
- Risco: médio — alterações em navegação de header e estado global.

**Mudanças**
- **Added**
  - `src/lib/fvrtReturnPath.js` para salvar e recuperar rota de retorno dos favoritos em `sessionStorage`.
- **Changed**
  - `src/components/layout/Header.jsx` com fluxo dedicado de favoritos (abrir `/favoritos` e voltar para rota anterior quando já estiver em `/favoritos`), além de badge com contagem.
  - `src/app/produto/[slug]/ProdutoClient.jsx` com integração do botão de favoritar por `productId`.
  - `src/contexts/providers.jsx` agora injeta `FavoriteProvider` junto do `CartProvider`.
  - `src/contexts/cart-context.jsx` recebeu comentários explicativos para facilitar manutenção e onboarding.
  - `docs/melhorias-codex.md` atualizado com novas sugestões de evolução para favoritos.
- **Fixed**
  - Padronização do fallback em `getFvrtBackPath` para evitar retorno inválido quando não houver rota salva.

**Como testar**
1. Entrar em qualquer página de produto e favoritar um item.
2. Clicar no ícone de favoritos no header fora de `/favoritos` (deve abrir `/favoritos`).
3. Clicar novamente no ícone estando em `/favoritos` (deve voltar para a rota anterior salva).
4. Recarregar a página e validar persistência dos favoritos e da badge.
5. Validar carrinho e favoritos coexistindo sem regressões de contexto.

**Diagrama**
```
Header Heart -> saveFvrtReturnPath -> /favoritos
/favoritos + Heart -> getFvrtBackPath -> rota anterior (fallback /loja)
```

### v0.1.10 — 2026-02-11
**Resumo**
- Implementacao completa do sistema de favoritos com persistencia local, badge no header e pagina dedicada integrada ao carrinho.

**Motivação**
- Permitir que o usuario salve produtos para consultar depois sem perder estado ao recarregar a pagina.
- Conectar favoritos ao fluxo existente de compra com baixo atrito.

**Impacto**
- Componentes afetados: `favorit-context`, `providers`, `Header`, `ProdutoClient`, `IconFavorit`, pagina `/favoritos`, documentacao tecnica.
- Compatibilidade: sim — fluxo de carrinho permanece inalterado.
- Risco: medio — adicao de novo estado global e persistencia no browser.

**Mudanças**
- **Added**
  - `src/contexts/favorit-context.jsx` com API `useFavorite()` (`isFavorite`, `addFavorite`, `removeFavorite`, `toggleFavorite`, `clearFavorites`, `items`, `favoriteIds`, `totalFavorites`, `isEmpty`).
  - `docs/favoritos-logica.md` com explicacao completa da arquitetura e validacoes manuais.
- **Changed**
  - `src/contexts/providers.jsx` agora injeta `FavoriteProvider` globalmente.
  - `src/components/componets-page-produto/iconFavorito.jsx` virou toggle funcional com acessibilidade (`aria-pressed`, `aria-label`) e estado visual ativo/inativo.
  - `src/app/produto/[slug]/ProdutoClient.jsx` passa `productId` para o botao de favoritos.
  - `src/components/layout/Header.jsx` agora exibe badge de favoritos com limite visual `99+`.
  - `src/app/favoritos/FavoritoClient.jsx` foi implementado com estado vazio, listagem, remocao, limpeza global, voltar com fallback e acao de adicionar ao carrinho.
  - `src/app/favoritos/page.jsx` simplificado para renderizar apenas o client component.

**Como testar**
1. Abrir um produto em `/produto/[slug]` e clicar no coracao.
2. Recarregar a pagina e validar que o favorito persiste.
3. Conferir badge de favoritos no header.
4. Acessar `/favoritos` e validar listagem com links de produto.
5. Remover um favorito e validar atualizacao imediata.
6. Adicionar ao carrinho via `/favoritos` e validar badge/carrinho.
7. Validar item sem estoque com botao de carrinho desabilitado.
8. Clicar em `Limpar favoritos` e validar estado vazio.
9. Clicar em `Voltar` em `/favoritos` com e sem historico, validando fallback para `/loja`.

**Diagrama**
```
Produto -> toggleFavorite -> FavoriteContext(localStorage) -> Header badge
/favoritos -> listar/remover/clear -> addItem(useCart) sem redirecionar
```

### v0.1.9 — 2026-02-11
**Resumo**
- Implementacao completa do carrinho com estado global, persistencia local, pagina dedicada e navegacao inteligente de retorno.

**Motivação**
- Conectar o fluxo real de compra entre pagina de produto, icone do header e tela de carrinho.
- Garantir experiencia consistente ao adicionar itens, alterar quantidade e voltar para a pagina anterior.

**Impacto**
- Componentes afetados: `ProdutoClient`, `Header`, `Providers`, nova rota `/carrinho`, `cart-context`, helpers de moeda e retorno de rota, documentacao tecnica.
- Compatibilidade: sim — nao quebra rotas existentes e adiciona funcionalidade.
- Risco: medio — fluxo novo com estado global e persistencia.

**Mudanças**
- **Added**
  - `src/contexts/cart-context.jsx` com API `useCart()` (`addItem`, `setItemQuantity`, `removeItem`, `clearCart`, `items`, `totalItems`, `subtotalCents`).
  - `src/app/carrinho/page.jsx` e `src/app/carrinho/CarrinhoClient.jsx` (MVP completo de carrinho).
  - `src/lib/formatCurrency.js` para padronizacao de `BRL`.
  - `src/lib/cartReturnPath.js` para salvar/recuperar rota de retorno do carrinho.
  - `docs/carrinho-logica.md` com documentacao detalhada para estudo e reaproveitamento da logica em outros projetos.
- **Changed**
  - `src/contexts/providers.jsx` agora injeta `CartProvider` globalmente.
  - `src/app/produto/[slug]/ProdutoClient.jsx` conecta botoes "Adicionar ao carrinho" e "Comprar" ao estado do carrinho, com clamp por estoque/variacao.
  - `src/components/layout/Header.jsx` exibe badge com total de itens e implementa toggle do icone (abrir `/carrinho` e, se ja estiver nele, voltar para a ultima rota).
- **Fixed**
  - Correcoes de renderizacao e navegacao para suportar prerender/build com a logica de toggle do carrinho.

**Como testar**
1. Abrir um produto sem variacao, adicionar quantidade e validar badge no header.
2. Abrir um produto com variacao, adicionar duas cores e validar linhas separadas no carrinho.
3. Em `/carrinho`, alterar quantidade, remover item e limpar carrinho.
4. Clicar no icone do carrinho no header fora de `/carrinho` (deve abrir carrinho).
5. Clicar no icone do carrinho estando em `/carrinho` (deve voltar para rota anterior).
6. Recarregar a pagina e validar persistencia do carrinho.

**Diagrama**
```
Produto -> addItem -> CartContext(localStorage) -> Header badge
Header cart icon -> /carrinho -> CarrinhoClient -> voltar (sessionStorage returnPath)
```

### v0.1.8 — 2026-02-11
**Resumo**
- Correcoes de runtime no `next dev` e documentacao operacional sobre EPERM/lock no Windows.

**Motivação**
- Eliminar warnings e falhas de lock/rename durante o desenvolvimento local.

**Impacto**
- Componentes afetados: `layout.js`, `src/app/busca/page.jsx`, `Header`.
- Compatibilidade: sim — ajustes locais e documentacao.
- Risco: baixo — mudancas pontuais.

**Mudanças**
- **Added**
  - `docs/operacional-eperm-windows.md` com guia de diagnostico e solucao.
- **Changed**
  - `layout.js` usa `crossOrigin` correto no preconnect do Google Fonts.
- **Fixed**
  - `searchParams` em `/busca` agora e resolvido de forma assincrona.
  - Header nao tenta mais carregar `avatar.png` inexistente.

**Como testar**
1. Rodar `npm run dev` e confirmar ausencia do warning `crossorigin`.
2. Abrir `/busca?q=tv` e confirmar ausencia do erro de `searchParams` Promise.
3. Verificar o header sem request `GET /avatar.png` com erro.

**Diagrama**
```
Dev server -> sem lock -> build ok -> /busca renderiza sem erro
```

### v0.1.7 — 2026-02-10
**Resumo**
- Correção de geração de classes Tailwind para `src/` e ajuste visual do botão "Mostrar mais" no modal de busca.

**Motivação**
- Garantir que classes como `dark:hover:bg-white` sejam compiladas e o hover funcione no modo dark.

**Impacto**
- Componentes afetados: `SearchResults`, `tailwind.config.js`.
- Compatibilidade: sim — apenas correções de estilo e build de CSS.
- Risco: baixo — mudança de configuração e estilo local.

**Mudanças**
- **Changed**
  - `tailwind.config.js` agora inclui `./src/**/*` no `content`.
  - Botão "Mostrar mais" usa estilos de fundo/hover consistentes no modal.

**Como testar**
1. Reiniciar o `npm run dev`.
2. Abrir o modal e verificar o hover no modo dark.
3. Confirmar que o botão alterna `bg`/`text` no hover.

**Diagrama**
```
Tailwind content -> CSS gerado -> classes dark:hover funcionando
```

### v0.1.6 — 2026-02-10
**Resumo**
- Busca completa com modal, pagina `/busca` e filtros reutilizados do layout de categoria, com documentacao detalhada.

**Motivação**
- Melhorar a descoberta de produtos com resultados rapidos no modal e refinamento completo em pagina dedicada.

**Impacto**
- Componentes afetados: `Header`, `SearchModal`, `SearchInput`, `SearchResults`, `ProductCard`, `SearchPageClient`, `useDebouncedValue`, `docs/search.md`.
- Compatibilidade: sim — funcionalidades adicionadas sem quebrar rotas existentes.
- Risco: baixo — mudancas concentradas em busca e nova rota.

**Mudanças**
- **Added**
  - Pagina `/busca` com layout de categoria (`src/app/busca/page.jsx` e `SearchPageClient.jsx`).
  - Componentes de busca: `SearchModal`, `SearchResults`, `SearchInput`.
  - Hook `useDebouncedValue` para sincronizar `?q=` com debounce.
  - Documentacao profissional em `docs/search.md`.
- **Changed**
  - Header abre o modal de busca via icone.
  - `ProductCard` agora aceita `onClick` para fechar modal ao navegar.
  - Modal exibe 3 sugestoes iniciais e mostra "Mostrar mais" apenas quando necessario.
- **Fixed**
  - Evitado warning de render cascata removendo setState em effect na pagina `/busca`.
  - Query de busca agora e codificada via `encodeURIComponent`.

**Como testar**
1. Abrir o modal pelo header e ver 3 produtos iniciais.
2. Digitar um termo com mais de 3 resultados e verificar o botao "Mostrar mais".
3. Clicar em "Mostrar mais" e confirmar redirecionamento para `/busca?q=...`.
4. Na pagina `/busca`, testar filtros e ordenacao.
5. Digitar na barra superior e confirmar atualizacao da URL com debounce.

**Diagrama**
```
Header -> SearchModal -> SearchResults -> /busca -> FiltersSidebar + SortSelect
```

### v0.1.4 — 2026-02-07
**Resumo**
- Filtros reutilizáveis por página e refinamento dinâmico por categoria, com ordenação na página de categoria.

**Motivação**
- Permitir que cada página escolha quais filtros exibir e que a categoria da rota ajuste automaticamente as opções e limites do filtro.

**Impacto**
- Componentes afetados: `FiltersSidebar`, `CategoryFilter`, `FeatureFilter`, `PriceFilter`, `Categoria`, `CategoryPageClient`, `SortSelect`, `docs/filters-reutilizaveis.md`.
- Compatibilidade: sim — defaults preservam comportamento anterior.
- Risco: baixo — mudanças localizadas e com fallback.

**Mudanças**
- **Added**
  - `src/app/categoria/[categoria]/CategoryPageClient.jsx` para estado e filtragem no cliente.
  - `docs/filters-reutilizaveis.md` com documentação detalhada e diagramas.
- **Changed**
  - `FiltersSidebar` agora aceita `enabled` e `data` para seleção/ordem de filtros e dados dinâmicos.
  - `CategoryFilter` e `FeatureFilter` aceitam dados via props com fallback interno.
  - `PriceFilter` aceita placeholders e limites opcionais.
  - Página de categoria separada em Server/Client com dados dinâmicos de filtros.
  - Ordenação (`SortSelect`) integrada na página de categoria.
  - Página `/loja` configurada para usar `enabled`/`data`.

**Como testar**
1. Abrir `/loja` e verificar filtros e ordenação funcionando.
2. Abrir `/categoria/tablets` e verificar que só tablets aparecem.
3. Validar que o filtro mostra apenas features e limites daquela categoria.
4. Alterar ordenação e conferir a lista ordenada.
5. Trocar de categoria no nav e confirmar que filtros e título atualizam.

**Diagrama**
```
Rota /categoria/[categoria] -> page.jsx (Server) -> CategoryPageClient (Client)
-> FiltersSidebar (enabled/data) -> applyFilters/applySort -> ProductCard
```

### v0.1.5 — 2026-02-07
**Resumo**
- Processo de revisão com Codex formalizado e documentação de melhorias expandida.

**Motivação**
- Padronizar o pedido de revisão antes de commits/PRs e registrar planos de execução detalhados.

**Impacto**
- Componentes afetados: `docs/melhorias-codex.md`, `.codex/skills/nextjs-superreview/SKILL.md`.
- Compatibilidade: sim.
- Risco: baixo — mudanças apenas de processo/documentação.

**Mudanças**
- **Added**
  - Template de revisão Codex na skill `nextjs-superreview`.
- **Changed**
  - `docs/melhorias-codex.md` com estimativas, priorização e planos de execução por melhoria.

**Como testar**
1. Abrir `docs/melhorias-codex.md` e validar a nova estrutura.
2. Abrir `.codex/skills/nextjs-superreview/SKILL.md` e verificar o template de revisão.

**Diagrama**
```
Antes: revisão ad-hoc -> commit
Depois: template Codex -> revisão estruturada -> commit/PR
```

### v0.1.3 — 2026-02-06
**Resumo**
- Categorias dinâmicas por URL com navegação e mapeamento centralizado.

**Motivação**
- Permitir que o usuário escolha a categoria pelo menu e ver apenas os produtos correspondentes.

**Impacto**
- Componentes afetados: `Nav`, `Categoria`, `categories.js`, `docs/categorias-nav-produtos.md`.
- Compatibilidade: sim.
- Risco: baixo — mudanças localizadas na rota e no menu.

**Mudanças**
- **Added**
  - `src/data/categories.js` com `categorySlugMap` e `navCategories`.
  - Documentação detalhada em `docs/categorias-nav-produtos.md`.
- **Changed**
  - Página de categoria agora resolve slugs por mapa centralizado.
  - Menu de categorias passou a consumir `navCategories`.

**Como testar**
1. Abrir `/categoria/desktops` e verificar listagem.
2. Clicar em categorias no menu e validar a troca.
3. Verificar a documentação em `docs/categorias-nav-produtos.md`.

**Diagrama**
```
Nav -> /categoria/{slug} -> categorySlugMap -> produtos -> ProductCard
```

### v0.1.2 — 2026-02-06
**Resumo**
- Documentação de melhorias planejadas e atualização da skill de revisão.

**Motivação**
- Registrar sugestões de melhorias com checklist e orientar o fluxo de planejamento.

**Impacto**
- Componentes afetados: `docs/melhorias-codex.md`, `.codex/skills/nextjs-superreview/SKILL.md`.
- Compatibilidade: sim.
- Risco: baixo — mudanças documentais e de processo.

**Mudanças**
- **Added**
  - Documento `docs/melhorias-codex.md` com plano de melhorias.
- **Changed**
  - Skill `nextjs-superreview` atualizada para exigir registro das sugestões.

**Como testar**
1. Abrir `docs/melhorias-codex.md`.
2. Validar estrutura, checklists e diagramas.
3. Conferir a regra adicionada na skill.

**Diagrama**
```
Antes:
Sugestões -> conversa

Depois:
Sugestões -> branch + docs/melhorias-codex.md
```

### v0.1.1 — 2026-02-06
**Resumo**
- Footer ganhou um accordion mais profissional usando shadcn/ui.

**Motivação**
- Melhorar a apresentação das “Mais Informações” e alinhar ao padrão de UI.

**Impacto**
- Componentes afetados: `Footer`, estilos globais.
- Compatibilidade: sim.
- Risco: baixo — alteração visual e estrutural localizada no footer.

**Mudanças**
- **Changed**
  - Accordion do footer agora usa `shadcn/ui` com ícone alinhado e animação.

**Como testar**
1. Abrir qualquer página que exiba o footer.
2. Clicar em “Mais Informações”.
3. Verificar abertura/fechamento do accordion e alinhamento do ícone.

**Diagrama**
```
Antes:
Footer -> details/summary (custom)

Depois:
Footer -> Accordion (shadcn/ui)
```

### v0.1.0 — 2026-02-06
**Resumo**
- Ajustes no `ProductCard` para permitir largura opcional no slider.

**Motivação**
- Evitar limitar a largura do card dentro do slider mantendo o padrão na loja.

**Impacto**
- Componentes afetados: `ProductCard`, `ProductSlider`.
- Compatibilidade: sim.
- Risco: baixo — mudança localizada e comportamento padrão preservado.

**Mudanças**
- **Changed**
  - `ProductCard` agora aceita `noMaxWidth`.
  - Slider usa `noMaxWidth` para não restringir largura.

**Como testar**
1. Abrir `/loja` e verificar largura do card.
2. Abrir a página de produto com slider e verificar que não há limite de largura.

**Diagrama**
```
Antes:
Slider -> ProductCard -> max-w-xs (fixo)

Depois:
Slider -> ProductCard -> max-w-xs (opcional)
```
