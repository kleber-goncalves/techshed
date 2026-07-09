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

2026-02-06 v0.1.0 ──────────• Ajustes iniciais do produto
2026-02-01 v0.0.9 ───────• Preparação para UI/UX
2026-01-25 v0.0.8 ───• Estrutura base do projeto

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

### v0.1.37 - 2026-07-09

**Resumo**

- Reorganizada a arquitetura de rotas e layouts em grupos distintos para publico, autenticacao, area privada e admin, com carrinho e favoritos migrados para o fluxo publico e footer controlado por contexto de rota.

**Motivacao**

- Separar responsabilidades por dominio de pagina, reduzir acoplamento do layout raiz e deixar a navegacao mais previsivel para telas publicas e internas.

**Impacto**

- Componentes afetados: `src/app/layout.js`, `src/app/(publico)/layout.js`, `src/app/(publico)/page.js`, `src/app/(publico)/carrinho/*`, `src/app/(publico)/favoritos/*`, `src/app/(login)/auth/*`, `src/app/(privado)/account/layout.jsx`, `src/app/(privado)/admin/deshboard/page.jsx`, `src/layout/footer.jsx`, `src/layout/header/HeaderUserSection.jsx`, `src/app/page.js`.
- Compatibilidade: sim, com as rotas publicas reorganizadas sob o grupo `(publico)` e a manutencao dos mesmos caminhos de uso para loja, produto, busca, carrinho e favoritos.
- Risco: medio, porque a alteracao mexe na estrutura global de layout e na forma como o header/footer sao renderizados por grupo de rota.

**Mudancas**

- **Added**
    - Layout dedicado em `src/app/(publico)/layout.js` para as paginas publicas, com header, nav e footer controlados pelo caminho atual.
    - Rota de home publica em `src/app/(publico)/page.js` com o conteudo principal da vitrine.
    - Rotas publicas dedicadas para carrinho e favoritos em `src/app/(publico)/carrinho/*` e `src/app/(publico)/favoritos/*`.
    - Layout dedicado para a area de autenticacao em `src/app/(login)/auth/layout.jsx`.
- **Changed**
    - `src/app/layout.js` passou a ser um root layout mais enxuto, deixando a composicao visual para os grupos de rota.
    - `src/app/(privado)/account/layout.jsx` e `src/app/(privado)/admin/deshboard/page.jsx` passaram a montar header e nav localmente.
    - `src/layout/footer.jsx` ganhou controle de abertura via estado e refinamentos de densidade visual.
    - `src/layout/header/HeaderUserSection.jsx` recebeu ajustes de cursor e consistencia de interacao.
    - As telas de login e cadastro perderam o cabeçalho duplicado interno e ficaram alinhadas ao novo fluxo de layout.
- **Removed**
    - Remocao da home antiga em `src/app/page.js` para evitar duplicidade com a nova estrutura publica.
    - Remocao das rotas antigas de carrinho e favoritos fora do grupo publico.

**Como testar**

1. Abrir a home em `/` e confirmar que o conteudo da vitrine carrega com header, nav e footer.
2. Abrir `/carrinho` e `/favoritos` e confirmar que o footer nao aparece nessas telas.
3. Abrir `/auth/login` e `/auth/signUp` e validar que o layout de autenticacao ficou sem cabeçalho duplicado.
4. Abrir `/account` e `/admin/deshboard` e validar que o header e o nav continuam aparecendo corretamente.
5. Verificar que o footer abre e fecha sem quebrar o conteudo de pagamento e contato.

### v0.1.36 - 2026-06-30

**Resumo**

- Separadas as telas de autenticacao em rotas dedicadas de login e cadastro, com fluxo compartilhado de formulario, sincronizacao do usuario e ajustes no header para apontar para as novas rotas.

**Motivacao**

- Reduzir acoplamento entre login e cadastro, melhorar a clareza da navegacao e deixar o fluxo de autenticacao mais facil de manter.

**Impacto**

- Componentes afetados: `src/app/(login)/auth/login/page.jsx`, `src/app/(login)/auth/signUp/page.jsx`, `src/hooks/useAuth.js`, `src/lib/helpers/authHelper.js`, `src/layout/header/HeaderUserSection.jsx`.
- Compatibilidade: sim, com a navegacao atual atualizada para `/auth/login` e `/auth/signUp`.
- Risco: baixo, porque a mudanca ficou concentrada em UI, roteamento e compartilhamento de logica.

**Mudancas**

- **Added**
    - Rota dedicada para login em `src/app/(login)/auth/login/page.jsx`.
    - Rota dedicada para cadastro em `src/app/(login)/auth/signUp/page.jsx`.
    - Hook compartilhado `src/hooks/useAuth.js` para email, senha, loading, mensagens e handlers.
    - Helper `src/lib/helpers/authHelper.js` para sincronizar a sessao do Supabase com a API interna.
- **Changed**
    - A tela de login ganhou feedback inline, loading e redirecionamento apos `syncUser`.
    - A tela de cadastro ganhou o mesmo padrao visual e de feedback do login.
    - `HeaderUserSection` agora aponta para `/auth/login` e `/auth/signUp` quando o usuario nao esta autenticado.
    - A antiga rota unica `/auth` foi removida.

**Como testar**

1. Abrir `/auth/login` e validar o formulario, mensagens inline e o redirecionamento apos login.
2. Abrir `/auth/signUp` e validar a criacao de conta com feedback de sucesso ou erro.
3. Verificar que o header nao autenticado mostra links separados para login e cadastro.
4. Confirmar que uma sessao existente continua sincronizando e redirecionando para `/account/minha_conta`.

### v0.1.35 - 2026-05-12

**Resumo**

- Endurecidas as rotas legadas de usuarios para remover acesso publico a listagem, criacao e exclusao.

**Motivação**

- Evitar vazamento de dados por `GET /api/users`, criacao indevida por `POST /api/users` e exclusao sem autorizacao por `DELETE /api/users/[id]`.

**Impacto**

- Componentes afetados: `src/app/api/users/route.js`, `src/app/api/users/[id]/route.js`, `src/lib/userApi.js` e `docs/autenticacao-rotas-rls.md`.
- Compatibilidade: `sim` para fluxos atuais de perfil, header e avatar; `GET/POST /api/users` e `DELETE /api/users/[id]` agora exigem usuario admin.
- Risco: `baixo`, porque as rotas protegidas nao eram usadas pela UI atual e os fluxos ativos continuam usando `GET/PUT /api/users/[id]` com token do proprio usuario.

**Mudanças**

- **Changed**
    - `GET /api/users` e `POST /api/users` agora passam por `requireAdmin`.
    - `DELETE /api/users/[id]` agora passa por `requireAdmin`.
    - `src/lib/userApi.js` passou a enviar `Authorization: Bearer <token>` em chamadas para `/api/users`.
- **Security**
    - Removido acesso anonimo a operacoes globais de usuario.
    - Mantido o acesso de usuario comum apenas para leitura/atualizacao do proprio perfil.

**Como testar**

1. Chamar `GET /api/users` sem token e confirmar `401`.
2. Chamar `GET /api/users` com usuario sem `ADMIN` e confirmar bloqueio.
3. Chamar `GET /api/users/[id]` com token do proprio usuario e confirmar sucesso.
4. Chamar `PUT /api/users/[id]` pela tela de conta e confirmar que o perfil continua atualizando.

### v0.1.34 - 2026-05-12

**Resumo**

- Adicionadas migrations de RLS/Policies no Supabase para proteger dados privados do usuário e leitura pública controlada do catálogo.

**Motivação**

- Reduzir risco de acesso direto indevido via Supabase REST/client.
- Garantir que dados privados como perfil, endereços, cartões, carrinho e favoritos sejam acessíveis apenas pelo usuário autenticado dono da linha.
- Manter o catálogo público acessível, mas limitado a produtos ativos e seus relacionamentos.

**Impacto**

- Componentes afetados: migrations Supabase em `supabase/migrations/*_rls.sql`.
- Compatibilidade: `sim`, desde que as APIs Next.js continuem usando token Supabase e o acesso direto ao Supabase respeite as novas policies.
- Risco: `médio`, porque RLS pode bloquear consultas diretas se alguma tela ou integração depender de acesso Supabase sem token/policy adequada.

**Mudanças**

- **Added**
    - RLS e policies para `"Favorites"`, permitindo `select/insert/update/delete` apenas ao dono via `auth.uid()`.
    - RLS e policies para `"CartItems"`, permitindo acesso apenas ao próprio carrinho e exigindo `quantity >= 1`.
    - RLS e policies para `"Card"`, restringindo cartões ao usuário autenticado dono da linha.
    - RLS e policies para `"Address"`, restringindo endereços ao usuário autenticado dono da linha e validando campos obrigatórios não vazios.
    - RLS e policies para `"User"`, permitindo leitura/atualização do próprio perfil e impedindo promoção direta para `ADMIN`.
    - RLS e policies de leitura pública para `"Produtos"`, `"ProdutoImagens"`, `"ProdutoVariantes"` e `"ProdutoVarianteImagens"` quando o produto relacionado está ativo.
- **Security**
    - Dados privados passam a ter defesa adicional no banco contra acesso direto pelo Supabase client/REST.
    - Escrita de produtos permanece sem policy pública, preservando o fluxo seguro via API admin com `requireAdmin`.
    - Policies usam `auth.uid()::text` para comparar com os IDs armazenados como `text/String` no schema atual.

**Como testar**

1. Aplicar as migrations em ambiente de teste/staging.
2. No Postman, autenticar com Supabase Auth e salvar `access_token` e `user.id`.
3. Testar `/rest/v1/Favorites`, `/rest/v1/CartItems`, `/rest/v1/Card`, `/rest/v1/Address` e `/rest/v1/User` com `Authorization: Bearer <token>`.
4. Confirmar que o usuário autenticado acessa apenas seus próprios registros.
5. Tentar inserir/atualizar registros com `userId` de outro usuário e confirmar bloqueio por RLS.
6. Testar `/rest/v1/Produtos?select=*` sem token e confirmar que somente produtos ativos aparecem.
7. Validar que as APIs Next.js (`/api/cart`, `/api/favorites`, `/api/users/[id]`, `/api/admin/products`) continuam funcionando com token válido.

**Diagrama**

```
Supabase REST/client -> RLS -> somente dono da linha
Next.js API -> valida token -> Prisma -> regras de backend preservadas
```

### v0.1.33 - 2026-05-09

**Resumo**

- Atualizada a página de autenticação para um layout mais moderno usando shadcn/ui, com melhor UX (estados de loading, validação e mensagens inline).

**Motivação**

- Melhorar a percepção de qualidade no primeiro contato (login) e reduzir atrito no fluxo de acesso/cadastro.

**Impacto**

- Componentes afetados: página `/auth` (rota em `src/app/(login)/auth/page.js`).
- Compatibilidade: `sim`.
- Risco: `baixo`, por ser mudança predominantemente de UI, com ajustes no tratamento de estados.

**Mudanças**

- **Changed**
    - Página de login/cadastro migrou para componentes shadcn (`Card`, `Input`, `Button`) e ganhou layout inspirado em marketplace (header destacado + card central).
    - Substituído `alert()` por mensagens inline com estados `success/error/info`.
    - Adicionado estado de loading e validação básica do formulário antes de habilitar ações.
    - Quando já existe sessão Supabase, a página sincroniza com `/api/syncUser` e redireciona para `/account/minha_conta`.
- **Removed**
    - Removido o login via Google (OAuth) da UI.

**Como testar**

1. Abrir `/auth` e validar layout (desktop e mobile).
2. Tentar logar com credenciais inválidas e confirmar mensagem inline de erro.
3. Criar conta e confirmar mensagem inline de sucesso.
4. Logar com sucesso e confirmar chamada a `/api/syncUser` e redirect para `/account/minha_conta`.

### v0.1.32 - 2026-05-08

**Resumo**

- Implementado fluxo completo de foto de perfil com upload no Supabase Storage, persistência no Prisma e exibição no dropdown do header.

**Motivação**

- Permitir personalização da conta do usuário com avatar persistente em recarregamentos e reutilização da mesma imagem em diferentes áreas da interface.

**Impacto**

- Componentes afetados: conta do usuário (`/account`), API de usuários, API de avatar e header autenticado.
- Compatibilidade: `sim`.
- Risco: `médio`, por envolver integração entre autenticação, storage e banco de dados.

**Mudanças**

- **Added**
    - Campos `avatarUrl` e `avatarStoragePath` no model `User` (Prisma).
    - Migration para persistir os novos campos de avatar.
    - Endpoint `POST /api/users/avatar` para upload autenticado de foto de perfil.
    - Endpoint `DELETE /api/users/avatar` para remoção da foto antiga no bucket.
    - Endpoint `GET /api/users/[id]` autenticado para leitura do perfil no banco.
- **Changed**
    - Formulário `Minha Conta` agora usa `next/image`, valida tipo/tamanho de arquivo e UI de seleção customizada.
    - Header autenticado passou a carregar avatar persistido no Prisma para o dropdown.
    - Hook de atualização de usuário passou a suportar upload e remoção de avatar.
- **Fixed**
    - Correção da perda de avatar após reload da página de conta.
    - Correção de chamada incorreta de `fetch` na remoção de imagem antiga.
- **Deprecated**
    - Nenhum.
- **Removed**
    - Nenhum.
- **Security**
    - Validação de sessão/token para operações de leitura e escrita de avatar.

**Como testar**

1. Autenticar usuário e acessar `/account/minha_conta`.
2. Selecionar uma imagem válida (`jpg/png/webp`, até 2MB) e clicar em `Atualizar`.
3. Recarregar a página e confirmar que o avatar permanece.
4. Abrir o dropdown do header e confirmar que a mesma foto é exibida.
5. Trocar novamente de foto e validar que a imagem anterior é removida do bucket.

**Diagrama**

Antes:

```
User -> Upload avatar -> Salva URL no banco -> Header usa apenas fallback (iniciais)
```

Depois:

```
User -> Upload avatar -> Remove avatar antigo -> Salva URL no banco -> Header busca /api/users/[id] -> Exibe AvatarImage
```

### v0.1.31 - 2026-05-07

**Resumo**

- Adicionado filtro por **categoria** no painel de produtos do admin, com Select dinâmico alimentado por categorias distintas do banco e suporte no backend via query param.

**Motivacao**

- Facilitar a operação do admin quando o catálogo cresce, permitindo reduzir rapidamente a lista para uma categoria específica.
- Evitar dependência de categorias hardcoded no front: as opções passam a refletir o que realmente existe no banco.

**Impacto**

- Componentes afetados: `src/app/(privado)/admin/deshboard/_layout/AdminProdutosClient.jsx`, `src/app/(privado)/admin/deshboard/_layout/ProductsSection.jsx`, `src/app/(privado)/admin/deshboard/_hooks/useInfiniteAdminProducts.js`, `src/lib/helpers/api/adminProductsApi.js`, `src/app/api/admin/products/route.js`.
- Compatibilidade: sim - mantém comportamento anterior quando `category=all` (default).
- Risco: baixo - mudança isolada no filtro da listagem e em parâmetros da API.

**Mudancas**

- **Added**
    - `GET /api/admin/products/categories` para retornar categorias distintas do banco (usado para preencher o Select).
    - Componente `ProductCategorySelect` para selecionar categoria no dashboard admin.
    - Hook `useAdminProductCategories` para carregar categorias no client e controlar loading/erro.
    - Documentação de estudo do componente em `docs/product-category-select.md`.
- **Changed**
    - `GET /api/admin/products` agora aceita o query param `category` (quando diferente de `"all"`).
    - `useInfiniteAdminProducts` passou a aceitar `category` e repassar para a API.
    - `ProductsSection` ganhou o Select de categoria ao lado do filtro de status.

**Como testar**

1. Abrir `/admin/deshboard` (painel de produtos).
2. Validar que existe um Select “Todas as categorias” e que ele carrega as categorias do banco.
3. Selecionar uma categoria e confirmar que a tabela lista apenas produtos daquela categoria.
4. Voltar para “Todas as categorias” e confirmar que a listagem retorna ao estado geral.
5. (Opcional) Verificar no Network/DevTools que a listagem chama `/api/admin/products?category=...` quando o filtro estiver ativo.

### v0.1.30 - 2026-04-20

**Resumo**

- Refatoracao visual e estrutural do editor admin de produtos, com layout em duas colunas, seções em cards independentes e componentizacao do formulario em arquivos menores.

**Motivacao**

- Melhorar a leitura e o foco do editor, separando o formulario em blocos visuais mais claros.
- Destacar `Dados avancados` em uma coluna lateral para reduzir ruido na coluna principal.
- Facilitar manutencao futura com componentes menores e responsabilidades mais bem definidas.

**Impacto**

- Componentes afetados: `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductEditorClient.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductFormSection.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductImagesField.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductVariantsField.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_components/SectionCard.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_components/ProductFormHeaderCard.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_components/ProductBasicInfoSection.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_components/ProductPricingSection.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_components/ProductAdvancedInfoSection.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_components/ProductStatusSection.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_components/ProductFormActions.jsx`.
- Compatibilidade: sim - sem alteracao de rotas ou contratos de API.
- Risco: baixo - mudancas concentradas na organizacao do editor e no layout do painel admin.

**Mudancas**

- **Added**
    - Nova pasta `settingsProduct/_components` com componentes dedicados para cabecalho, secoes do formulario, card base e acoes finais.
- **Changed**
    - `ProductEditorClient` ampliado para `max-w-7xl`, dando mais respiro ao editor.
    - `ProductFormSection` reorganizado em grid de duas colunas no desktop, com `Dados avancados` na direita e as demais secoes na esquerda.
    - Secoes do formulario agora aparecem como cards separados, com espacamento entre blocos para exibir o fundo da pagina.
    - `ProductVariantsField` e `ProductImagesField` ficaram mais reutilizaveis no editor, aceitando configuracoes visuais adicionais.
- **Fixed**
    - Padronizacao visual entre cards do editor, incluindo a galeria de imagens.
    - Limpeza de estrutura e formatação em arquivos do editor para reduzir ruido de manutencao.

**Como testar**

1. Abrir `/admin/deshboard/settingsProduct/new` e confirmar que o editor aparece em cards separados.
2. Abrir `/admin/deshboard/settingsProduct/[id]` em desktop e validar `Dados avancados` na coluna da direita.
3. Confirmar que `Dados basicos`, `Preco e estoque`, `Variantes`, `Midia e texto`, `Status` e acoes permanecem na coluna da esquerda.
4. Verificar que o espacamento entre cards deixa o fundo da pagina visivel.
5. Testar galeria do produto, variantes, salvar e desativar para garantir que os fluxos continuam funcionando.
6. Executar `npm run lint -- 'src/app/(privado)/admin/deshboard/settingsProduct'` e confirmar sucesso.

### v0.1.29 - 2026-03-20

**Resumo**

- Implementacao completa da galeria por variante no painel admin e na pagina publica do produto, com fallback entre imagens da variante e do produto base, alem de documentacao didatica aprofundada para estudo.

**Motivacao**

- Permitir o comportamento de ecommerce em que cada cor/variante mostra suas proprias fotos.
- Evoluir o editor admin para cadastrar galerias tanto no produto base quanto em cada variante.
- Manter compatibilidade com produtos legados que ainda dependem de `img/alt`.
- Registrar a arquitetura nova em documentacao voltada para estudo de front-end e back-end.

**Impacto**

- Componentes afetados: `prisma/schema.prisma`, `prisma/migrations/20260320163000_add_produto_variante_imagens/migration.sql`, `src/app/api/admin/products/route.js`, `src/app/api/admin/products/[id]/route.js`, `src/app/(privado)/admin/deshboard/_utils/constants.js`, `src/app/(privado)/admin/deshboard/_utils/utils.js`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductFormSection.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductImagesField.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductVariantsField.jsx`, `src/lib/catalogo-db.js`, `src/app/(publico)/produto/[slug]/page.js`, `src/app/(publico)/produto/[slug]/ProdutoClient.jsx`, `src/components/components-page-produto/variants-btn.jsx`, `src/components/components-page-produto/variants-img.jsx`, `src/app/(privado)/admin/deshboard/_components/AdminAccessGate.jsx`, `docs/estudo-sistema-imagens-produto-e-variantes.md`, `docs/estudo-linha-por-linha-sistema-imagens.md`, `docs/estudo-linha-por-linha-sistema-imagens-produto-e-variantes.md`.
- Compatibilidade: sim - produtos e variantes legados continuam funcionando por fallback para `img/alt` quando nao houver galeria completa.
- Risco: medio - envolve migration, writes aninhados no Prisma, sincronizacao entre banco e storage e mudanca de comportamento visual na pagina do produto.

**Mudancas**

- **Added**
    - Modelo `ProdutoVarianteImagem` no Prisma para persistir galerias especificas de cada variante.
    - Componente `ProductVariantsField` no painel admin para editar nome, cor, preco, estoque e galeria de cada variante.
    - Loader detalhado no catalogo para buscar produto por `slug` com galerias completas.
    - Documentacao didatica em `docs/estudo-sistema-imagens-produto-e-variantes.md`, `docs/estudo-linha-por-linha-sistema-imagens.md` e `docs/estudo-linha-por-linha-sistema-imagens-produto-e-variantes.md`.
- **Changed**
    - `ProductImagesField` ficou reutilizavel para produto base e variantes, com titulo e descricoes customizaveis.
    - `toForm` e `toPayload` passaram a suportar `variants[].images`, inclusive com fallback para dados antigos.
    - `POST /api/admin/products` e `PUT /api/admin/products/[id]` agora criam, atualizam e sincronizam galerias de variantes.
    - `ProdutoClient` passou a resolver a galeria ativa com base na variante selecionada e em fallbacks progressivos.
    - `variants-btn.jsx` e `variants-img.jsx` foram separados por responsabilidade: selecao de cor e selecao de miniatura.
    - `AdminAccessGate` agora diferencia melhor falhas de permissao, autenticacao e erros temporarios, evitando 404 falso em alguns cenarios.
- **Fixed**
    - A pagina publica passou a trocar a galeria inteira ao selecionar outra cor, em vez de apenas trocar uma imagem unica.
    - Variantes antigas com apenas `img` nao quebram o editor nem a vitrine publica.
    - Abertura do editor admin ficou mais resiliente a falhas transitórias de check de acesso.

**Como testar**

1. Abrir `/admin/deshboard/settingsProduct/[id]`, confirmar que o editor carrega e que o produto base mostra sua galeria.
2. Adicionar ao menos duas variantes, subir imagens diferentes para cada uma e salvar.
3. Recarregar o editor e validar persistencia de `variants[].images`.
4. Abrir `/produto/[slug]`, trocar de cor e confirmar que a galeria muda junto com a variante.
5. Validar fallback com produto ou variante legado que ainda tenha apenas `img/alt`.
6. Executar `npm run db:generate`, `npm run lint`, `npm run build` e `npx prisma migrate deploy`.

### v0.1.28 - 2026-03-20

**Resumo**

- Implementacao da galeria hibrida de imagens no editor de produtos: imagens legadas locais continuam funcionando e novas imagens do painel passam a subir para o Supabase Storage.

**Motivacao**

- Substituir o campo manual de URL por uma experiencia visual de edicao de imagens no painel admin.
- Permitir adicionar, trocar, remover e reordenar fotos sem migrar imediatamente todo o acervo legado em `public/`.
- Preparar o projeto para um fluxo mais profissional de upload mantendo compatibilidade com o catalogo atual.

**Impacto**

- Componentes afetados: `prisma/schema.prisma`, `prisma/migrations/20260318181845_add_produto_imagens/migration.sql`, `next.config.mjs`, `src/lib/supabase/supabaseAdmin.js`, `src/app/api/admin/uploads/route.js`, `src/app/api/admin/products/[id]/route.js`, `src/app/(privado)/admin/deshboard/_utils/constants.js`, `src/app/(privado)/admin/deshboard/_utils/utils.js`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductFormSection.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/ProductImagesField.jsx`.
- Compatibilidade: sim - produtos antigos com `img/alt` local continuam abrindo no editor via fallback.
- Risco: medio - envolve migration, autenticacao no upload, integracao com Supabase Storage e sincronizacao da capa do produto.

**Mudancas**

- **Added**
    - Modelo `ProdutoImagem` no Prisma para armazenar galeria, ordenacao e `storagePath`.
    - Rota `POST /api/admin/uploads` protegida por `requireAdmin` para upload de imagens no bucket `product-images`.
    - Client server-side `src/lib/supabase/supabaseAdmin.js` para operacoes administrativas no Supabase Storage.
    - Componente `ProductImagesField` com preview, upload, troca, remocao e reordenacao por drag and drop.
- **Changed**
    - `ProductFormSection` trocou os campos de URL/alt por uma galeria visual e bloqueia upload antes do produto existir.
    - `toForm` e `toPayload` passaram a trabalhar com `images[]`, preservando fallback para produtos legados com imagem local.
    - `PUT /api/admin/products/[id]` agora persiste galeria, sincroniza `img/alt` com a imagem principal e remove arquivos apagados do bucket.
    - `next.config.mjs` passou a permitir imagens remotas do domínio do Supabase no `next/image`.
- **Fixed**
    - Upload do editor agora envia o token de sessao no header `Authorization`, corrigindo o erro `401 Unauthorized`.
    - Guards adicionados no componente para evitar erro ao cancelar a selecao de arquivos.
    - Sincronizacao do `alt` principal ajustada para nao sobrescrever indevidamente o valor da imagem de capa.

**Como testar**

1. Abrir `/admin/deshboard/settingsProduct/[id]` com um produto legado e confirmar que a imagem local continua aparecendo.
2. Adicionar uma nova foto no editor e validar upload para o Supabase Storage sem erro `401`.
3. Reordenar, trocar e remover fotos; salvar o produto; recarregar a pagina e confirmar persistencia.
4. Verificar que a primeira foto da galeria vira a capa usada em `img/alt`.
5. Executar `npm run lint` e `npm run build` e confirmar sucesso.

### v0.1.27 - 2026-03-18

**Resumo**

- Refatoracao da estrutura do dashboard admin de produtos, reorganizando componentes, hooks, utilitarios e layouts.

**Motivacao**

- Simplificar a organizacao do painel e reduzir acoplamento entre listagem e editor.
- Facilitar manutencao futura separando responsabilidades por pastas.

**Impacto**

- Componentes afetados: `src/app/(privado)/admin/deshboard/_components/*`, `src/app/(privado)/admin/deshboard/_hooks/*`, `src/app/(privado)/admin/deshboard/_utils/*`, `src/app/(privado)/admin/deshboard/_layout/*`, `src/app/(privado)/admin/deshboard/settingsProduct/_layout/*`, paginas `src/app/(privado)/admin/deshboard/page.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/new/page.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/[id]/page.jsx`.
- Compatibilidade: sim - nao altera rotas nem contratos de API.
- Risco: baixo - mudanca estrutural de organizacao e imports.

**Mudancas**

- **Changed**
    - Componentes do painel admin reorganizados para `_components`, `_hooks`, `_utils` e `_layout`, substituindo a pasta `_components/admin-produtos`.
    - Editor de produto passa a ser importado via `settingsProduct/_layout` nas paginas de criacao/edicao.
    - Pagina principal do dashboard agora importa `AdminProdutosClient` do novo `_layout`.
- **Removed**
    - Estrutura antiga `src/app/(privado)/admin/deshboard/_components/admin-produtos/*`.

**Como testar**

1. Abrir `/admin/deshboard` e validar listagem/KPIs e interacao.
2. Abrir `/admin/deshboard/settingsProduct/new` e confirmar editor de criacao.
3. Abrir `/admin/deshboard/settingsProduct/[id]` e confirmar carregamento do editor com o produto.

### v0.1.26 - 2026-03-14

**Resumo**

- Implementacao de scroll infinito na listagem admin de produtos com nova documentacao didatica do fluxo.

**Motivacao**

- Melhorar a performance percebida e a usabilidade da listagem com grandes volumes.
- Registrar o fluxo completo (backend + frontend) para estudo e reuso em outros projetos.

**Impacto**

- Componentes afetados: `src/app/api/admin/products/route.js`, `src/lib/helpers/api/adminProductsApi.js`, `src/app/(privado)/admin/deshboard/_components/AdminProdutosClient.jsx`, `src/app/(privado)/admin/deshboard/_components/admin-produtos/ProductsSection.jsx`, `src/app/(privado)/admin/deshboard/_components/admin-produtos/hooks/useInfiniteAdminProducts.js`, `src/app/(privado)/admin/deshboard/_components/admin-produtos/hooks/useInfiniteTrigger.js`, `src/app/(privado)/admin/deshboard/_components/admin-produtos/components/InfiniteScrollSentinel.jsx`, `docs/scroll-infinito-admin.md`.
- Compatibilidade: sim - mantendo o endpoint e adicionando paginação.
- Risco: baixo - mudancas focadas na listagem e no fluxo de carregamento incremental.

**Mudancas**

- **Added**
    - Hook `useInfiniteAdminProducts` para paginação incremental e estado de carregamento.
    - Hook `useInfiniteTrigger` com `IntersectionObserver` para acionar carregamento.
    - Componente `InfiniteScrollSentinel` para estados "carregando mais" e "fim da lista".
    - Documentacao didatica do scroll infinito em `docs/scroll-infinito-admin.md`.
- **Changed**
    - `GET /api/admin/products` passou a aceitar `page` e `limit` e retornar `items`, `hasMore` e `summary`.
    - `AdminProdutosClient` e `ProductsSection` atualizados para consumir paginação e renderizar sentinel.
    - Helper `listAdminProducts` atualizado para suportar paginação no client.
- **Fixed**
    - Deduplicacao por `id` ao mesclar paginas na listagem do admin.

**Como testar**

1. Abrir `/admin/deshboard` e validar carregamento inicial com skeleton.
2. Rolar a lista e confirmar carregamento incremental sem duplicar itens.
3. Aplicar busca/filtro e validar reinicio correto da lista.
4. Validar exibição de "Fim da lista" quando `hasMore` for `false`.

### v0.1.25 - 2026-03-13

**Resumo**

- Refinos de layout e legibilidade na listagem de produtos do painel admin, com pequenos ajustes de UI no filtro e na tabela.

**Motivação**

- Melhorar a leitura e o espaçamento dos elementos da tabela e do filtro.
- Ajustar o comportamento visual do `Select` para evitar altura fixa desnecessária.

**Impacto**

- Componentes afetados: `src/app/(privado)/admin/deshboard/_components/AdminProdutosClient.jsx`, `src/app/(privado)/admin/deshboard/_components/admin-produtos/ProductsSection.jsx`, `src/components/ui/select.jsx`.
- Compatibilidade: sim - apenas ajustes visuais/estruturais no front.
- Risco: baixo - sem mudança de lógica.

**Mudanças**

- **Changed**
    - `ProductsSection` recebeu melhorias de legibilidade e estrutura (quebra de linhas, comentários e layout de células).
    - `AdminProdutosClient` ajustou a grid para `xl:grid-cols-1` na tela de listagem única.
    - `SelectTrigger` passou a usar `h-fit` no tamanho default para respeitar o conteúdo.

**Como testar**

1. Abrir `/admin/deshboard` e validar alinhamento do filtro, tabela e estado vazio.
2. Verificar o `Select` de status com altura adequada em diferentes tamanhos.
3. Confirmar que a listagem continua navegável e sem regressões.

### v0.1.24 - 2026-03-07

**Resumo**

- Migração do fluxo admin para editor dedicado por rota (`settingsProduct`) com limpeza da listagem principal e suporte backend/frontend para carregamento por ID.

**Motivação**

- Separar responsabilidades entre tela de listagem e tela de edição para melhorar manutenção e escalar o painel.
- Evitar acoplamento de estados de formulário dentro do `AdminProdutosClient`.
- Permitir deep-link de edição de produto por URL.

**Impacto**

- Componentes afetados: `src/app/(privado)/admin/deshboard/_components/AdminProdutosClient.jsx`, `src/app/(privado)/admin/deshboard/_components/admin-produtos/ProductEditorClient.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/new/page.jsx`, `src/app/(privado)/admin/deshboard/settingsProduct/[id]/page.jsx`, `src/lib/helpers/api/adminProductsApi.js`, `src/app/api/admin/products/[id]/route.js`.
- Compatibilidade: sim - fluxo antigo de listagem continua, edição foi movida para rota dedicada.
- Risco: médio - mudança de navegação no painel admin e inclusão de nova superfície de rota.

**Mudanças**

- **Added**
    - Rotas de edição/criação: `/admin/deshboard/settingsProduct/new` e `/admin/deshboard/settingsProduct/[id]`.
    - Componente `ProductEditorClient` para centralizar o ciclo de create/update/archive fora da tela de listagem.
    - Helper `getAdminProduct(id)` no client API admin.
    - Handler `GET /api/admin/products/[id]` para carregar produto individual no editor.
- **Changed**
    - `AdminProdutosClient` passou a atuar como tela de listagem + navegação para o editor dedicado.
    - Limpeza de estados mortos de formulário na listagem (`selectedId`, `form`, handlers de submit/archive locais).
- **Fixed**
    - Correção do fluxo de `saving` no editor para submit/archive.
    - Correção da importação de router para App Router (`next/navigation`) no editor.

**Como testar**

1. Abrir `/admin/deshboard` e validar listagem, busca e navegação para edição ao clicar no produto.
2. Clicar em “Novo produto” e validar abertura de `/admin/deshboard/settingsProduct/new`.
3. Editar um produto em `/admin/deshboard/settingsProduct/[id]` e validar persistência.
4. Desativar produto no editor e validar retorno para o painel.
5. Executar `npm run lint` e `npm run build` e confirmar sucesso sem erros.

### v0.1.23 - 2026-03-06

**Resumo**

- Redesign profissional do painel admin de produtos com `shadcn/ui`, componentização por seções reutilizáveis e correção de persistência de `features` no update.

**Motivação**

- Elevar a qualidade visual e a legibilidade do painel admin para uso real em operação.
- Reduzir acoplamento no `AdminProdutosClient` com separação clara de responsabilidades.
- Corrigir inconsistência funcional onde `features` era enviado pelo front mas não persistia no `PUT`.

**Impacto**

- Componentes afetados: `src/app/(privado)/admin/deshboard/_components/AdminProdutosClient.jsx`, `src/app/(privado)/admin/deshboard/_components/AdminAccessGate.jsx`, `src/app/(privado)/admin/deshboard/loading.jsx`, `src/app/(privado)/admin/deshboard/page.jsx`, `src/app/(privado)/admin/deshboard/_components/admin-produtos/*`, `src/components/ui/{badge,card,input,separator,skeleton,switch,table,textarea}.jsx`, `src/app/api/admin/products/[id]/route.js`.
- Compatibilidade: sim - sem quebra de endpoints/rotas existentes no fluxo atual.
- Risco: médio - mudança ampla de UI no painel e nova composição de componentes.

**Mudanças**

- **Added**
    - Novos componentes de UI baseados em `shadcn/ui`: `card`, `input`, `textarea`, `badge`, `table`, `skeleton`, `separator`, `switch`.
    - Nova pasta modular `admin-produtos` com seções reutilizáveis (`DashboardHeader`, `KpiSection`, `FeedbackBanners`, `ProductsSection`, `ProductFormSection`, `ProductStatusBadge`) e utilitários (`constants`, `utils`).
- **Changed**
    - `AdminProdutosClient` refatorado para papel de orquestrador (estado, regras e fluxo), delegando renderização para componentes reutilizáveis.
    - UX do dashboard modernizada com KPIs, tabela com filtro de status, skeleton, estado vazio e formulário organizado por seções.
    - `AdminAccessGate` e `loading.jsx` alinhados visualmente com o novo padrão de painel.
- **Fixed**
    - `PUT /api/admin/products/[id]` agora aceita e persiste o campo `features`.

**Como testar**

1. Abrir `/admin/deshboard` como admin e validar renderização do novo layout com KPIs, busca/filtro e tabela.
2. Selecionar produto, editar campos e salvar; confirmar persistência no refresh.
3. Editar `features` (multilinha), salvar e validar atualização no banco.
4. Desativar produto via diálogo de confirmação e confirmar status inativo na listagem.
5. Executar `npm run lint` e `npm run build` e confirmar sucesso.

### v0.1.22 - 2026-03-06

**Resumo**

- Protecao completa do painel admin com verificacao previa de permissao, fallback de 404 para nao-admin e loading customizado no App Router.

**Motivacao**

- Evitar que usuarios sem role admin visualizem o painel ou mensagens de permissao desnecessarias.
- Melhorar UX durante a verificacao de acesso com feedback de carregamento.
- Organizar a autorizacao em fluxo claro: check rapido -> gate -> render do painel.

**Impacto**

- Componentes afetados: `src/lib/helpers/server/auth/adminAuth.js`, `src/app/api/admin/check/route.js`, `src/lib/helpers/api/adminProductsApi.js`, `src/app/(privado)/admin/deshboard/_components/AdminAccessGate.jsx`, `src/app/(privado)/admin/deshboard/loading.jsx`, `src/app/(privado)/admin/deshboard/page.jsx`, `src/app/(privado)/admin/deshboard/_components/AdminProdutosClient.jsx`, `docs/admin-dashboard-branch.md`.
- Compatibilidade: sim - sem quebra de rotas publicas; endurecimento de acesso no painel admin.
- Risco: medio - alteracao de comportamento de autorizacao (403 textual -> 404 + redirecionamento).

**Mudancas**

- **Added**
    - Endpoint `GET /api/admin/check` para validar permissao admin antes de montar a tela.
    - Componente `AdminAccessGate` para bloquear renderizacao ate finalizar verificacao de acesso.
    - `loading.jsx` no segmento de rota admin com UI de carregamento customizada.
    - Documentacao didatica da branch em `docs/admin-dashboard-branch.md`.
- **Changed**
    - `requireAdmin` passou a retornar `404` para usuarios nao-admin.
    - `authFetch` no client admin agora propaga `error.status` para tratamento de fluxo.
    - `page.jsx` do dashboard passou a envolver o painel com `AdminAccessGate`.
- **Fixed**
    - Ajuste de URL em `createAdminProduct` para caminho absoluto (`/api/admin/products`).
    - Fallback no `AdminProdutosClient` para redirecionar `/404` em respostas de autorizacao.

**Como testar**

1. Logar com usuario admin e abrir `/admin/deshboard` (deve exibir loading e depois abrir painel).
2. Logar com usuario nao-admin e abrir `/admin/deshboard` (deve redirecionar para `/404`).
3. Forcar sessao expirada e validar bloqueio de acesso nas chamadas do painel.
4. Executar acoes de CRUD de produtos com admin e confirmar funcionamento normal.

### v0.1.21 - 2026-02-26

**Resumo**

- Refatoracao da arquitetura de pastas com grupos de rotas no App Router, padronizacao de nomes de diretorios e consolidacao de imports.

**Motivacao**

- Reduzir inconsistencias de nomenclatura (typos e variacoes de pastas) que aumentavam risco de erro em imports.
- Organizar melhor as responsabilidades entre rotas publicas, privadas e de vendas para facilitar manutencao.
- Melhorar legibilidade geral da base e preparar crescimento de novas features por dominio.

**Impacto**

- Componentes afetados: `src/app/(publico)/**`, `src/app/(privado)/**`, `src/app/(vendas)/**`, `src/layout/**`, `src/components/components-conta-users/**`, `src/components/components-loja/filter/**`, `src/components/components-page-produto/**`, `src/app/layout.js`, `src/app/page.js`, `src/app/(login)/auth/page.js`, `docs/estrutura-pasta-extenção.md`.
- Compatibilidade: nao - rotas de conta foram padronizadas de `/cnfgContaUsers/*` para `/account/*`.
- Risco: medio - por envolver movimentacao ampla de arquivos e ajuste de caminhos/imports.

**Mudancas**

- **Added**
    - Novos grupos de rotas no App Router: `(publico)`, `(privado)` e `(vendas)`.
    - Estrutura de layout compartilhado em `src/layout/*`.
    - Estruturas padronizadas `components-conta-users`, `components-loja/filter` e `components-page-produto`.
- **Changed**
    - Migracao de paginas publicas para `src/app/(publico)` (busca, categoria, loja e produto).
    - Migracao de paginas privadas para `src/app/(privado)/account` e favoritos.
    - Migracao da pagina de vendas para `src/app/(vendas)/carrinho`.
    - Atualizacao de imports em `src/app/layout.js` e `src/app/page.js` para usar `@/layout/*`.
    - Fluxo de login em `src/app/(login)/auth/page.js` redirecionando para `/account/minha_conta`.
- **Removed**
    - Estruturas antigas com nomenclatura inconsistente: `cnfgContaUsers`, `componemts-*`, `componets-*`, `components-loja/filtro` e `components/layout`.

**Como testar**

1. Acessar rotas publicas (`/`, `/loja`, `/produto/<slug>`, `/categoria/<categoria>`, `/busca`) e validar renderizacao normal.
2. Fazer login em `/auth` e confirmar redirecionamento para `/account/minha_conta`.
3. Validar rotas privadas em `/account/*`, `/favoritos` e `/carrinho`.
4. Verificar que nao existem imports apontando para caminhos antigos com typo (`componemts`, `componets`, `components/layout`, `components-loja/filtro`).

### v0.1.20 - 2026-02-24

**Resumo**

- Refatoracao modular do Header com auth/logout no Supabase, exibicao de nome do usuario e correcoes de sincronizacao/deduplicacao do carrinho.

**Motivacao**

- Reduzir complexidade do `Header` (responsabilidades separadas) e melhorar manutencao.
- Corrigir inconsistencias no carrinho quando havia itens duplicados ou falha de persistencia.
- Registrar arquitetura backend atual em formato visual e textual.

**Impacto**

- Componentes afetados: `src/components/layout/Header.jsx`, `src/components/layout/header/*`, `src/lib/helpers/userDisplay.js`, `src/contexts/cart-context.jsx`, `src/app/api/cart/route.js`, `src/lib/helpers/api/cartApi.js`, `docs/arquitetura-backend.*`, `docs/estrutura-pasta-extenção.md`.
- Compatibilidade: sim - sem quebra de rotas publicas; alteracao estrutural interna no Header.
- Risco: medio - mudancas em fluxo de auth no client e sincronizacao de carrinho.

**Mudancas**

- **Added**
    - `HeaderBrandSearch`, `HeaderUserSection` e `HeaderQuickActions` para dividir responsabilidades do Header.
    - Hook `useHeaderAuth` para centralizar sessao/auth/logout do Header.
    - Helper `src/lib/helpers/userDisplay.js` para nome exibido e iniciais do avatar.
    - Documentacao visual da arquitetura backend (`docs/arquitetura-backend.excalidraw` + PNGs + `docs/arquitetura-backend.md`).
    - Snapshot de estrutura de pastas em `docs/estrutura-pasta-extenção.md`.
- **Changed**
    - `Header.jsx` virou orquestrador enxuto, consumindo subcomponentes.
    - Menu de usuario passou a exibir nome do usuario logado e opcoes de login para visitante.
    - Fluxo de logout no Header agora usa `supabase.auth.signOut()`, limpa carrinho/favoritos locais e evita redirecionamento forcado.
    - Sync do carrinho no contexto prioriza estado do servidor quando existir.
- **Fixed**
    - `PUT /api/cart` agora deduplica itens por `productId + variantId` antes de gravar e usa `skipDuplicates`.
    - `saveCartItems` agora trata `res.ok` e retorna erro explicito em falhas HTTP.

**Como testar**

1. Fazer login e validar nome do usuario no Header (trigger + menu).
2. Clicar em `Sair` e confirmar limpeza de carrinho/favoritos sem redirecionamento.
3. Validar que visitante ve `Criar a sua conta` e `Entre` no Header.
4. Adicionar itens repetidos no carrinho e confirmar que a API persiste sem duplicidade.
5. Recarregar com usuario logado e validar sincronizacao do carrinho priorizando servidor.

### v0.1.19 - 2026-02-24

**Resumo**

- Hibrido de carrinho e favoritos com sync no Supabase e fallback no localStorage.

**Motivacao**

- Manter persistencia para usuario logado sem perder a experiencia de visitante.

**Impacto**

- Componentes afetados: prisma/schema.prisma, src/app/api/cart, src/app/api/favorites, src/lib/helpers/api/cartApi.js, src/lib/helpers/api/favoriteApi.js, src/contexts/cart-context.jsx, src/contexts/favorit-context.jsx, src/contexts/catalog-context.jsx.
- Compatibilidade: nao - exige migracao das tabelas CartItems e Favorites e API ativa.
- Risco: medio - mudanca de persistencia e sincronizacao em login.

**Mudancas**

- **Added**
    - Modelos CartItem e Favorite no Prisma.
    - Rotas /api/cart e /api/favorites.
    - Helpers de API para sync do carrinho e favoritos.
- **Changed**
    - Carrinho e favoritos agora sincronizam com o banco quando o usuario esta logado.
    - CatalogoProvider limpa erro antes do fetch para evitar isReady travado.

**Como testar**

1. Rodar migracao do Prisma para CartItems/Favorites.
2. Rodar npm run dev.
3. Logar, favoritar produtos e adicionar ao carrinho.
4. Recarregar a pagina e validar persistencia.
5. Deslogar e validar fallback no localStorage.

### v0.1.18 - 2026-02-20

**Resumo**

- Catalogo passou a ser carregado via API/Contexto a partir do Supabase para paginas e componentes client.

**Motivacao**

- Remover dependencia do arquivo src/data/produtos.js no runtime e centralizar catalogo via banco.

**Impacto**

- Componentes afetados: src/app/api/catalogo/\*, src/lib/catalogo-db.js, src/contexts/catalog-context.jsx, src/provider/providers.jsx, paginas /loja, /busca, /categoria/[categoria], /produto/[slug], SearchModal, ProductSlider, CartContext, FavoriteContext.
- Compatibilidade: nao - exige catalogo seedado no banco e API ativa.
- Risco: medio - mudanca de origem de dados e estados de loading.

**Mudancas**

- **Added**
    - Rotas GET /api/catalogo e GET /api/catalogo/flat.
    - CatalogoProvider com cache client-side e indice de produtos.
- **Changed**
    - Paginas e componentes client passaram a consumir catalogo via contexto/API.
    - Carrinho e favoritos agora dependem do catalogo carregado para resolver itens.
    - Provider global migrou para src/provider/providers.jsx.

**Como testar**

1. Rodar npm run dev.
2. Abrir /api/catalogo e /api/catalogo/flat.
3. Abrir /loja, /busca, /categoria/... e /produto/... e validar carregamento.
4. Abrir /favoritos e /carrinho e validar estados de loading e itens.

### v0.1.17 — 2026-02-19

**Resumo**

- Persistência do catálogo de produtos no Supabase com Prisma (`Produtos` + `ProdutoVariantes`) e seed idempotente a partir de `src/data/produtos.js`.

**Motivação**

- Tirar o catálogo da dependência exclusiva de arquivo estático e preparar o projeto para leitura centralizada de produtos via banco.
- Garantir carga inicial reproduzível dos dados de catálogo em qualquer ambiente.

**Impacto**

- Componentes afetados: `prisma/schema.prisma`, migração `prisma/migrations/20260219175036_add_produtos_catalogo/migration.sql` e `scripts/seed-produtos.js`.
- Compatibilidade: sim — nenhuma rota/página foi migrada para leitura no banco neste passo.
- Risco: médio — alteração de schema e processo de seed.

**Mudanças**

- **Added**
    - Modelo `Produto` mapeado para tabela `"Produtos"`.
    - Modelo `ProdutoVariante` mapeado para `"ProdutoVariantes"` com relação `onDelete: Cascade`.
    - Campos de catálogo para compatibilidade com dados atuais (`category`, `catalogKey`, `features`, `promocao`).
    - Script `scripts/seed-produtos.js` com parsing de `src/data/produtos.js`.
    - Seed idempotente com `upsert` e limpeza de variantes órfãs por produto.
- **Changed**
    - Banco Supabase atualizado com nova migration de catálogo.
    - Prisma Client regenerado para incluir os novos modelos.

**Como testar**

1. Rodar `npx prisma migrate dev --name add_produtos_catalogo`.
2. Rodar `npx prisma generate`.
3. Rodar `node scripts/seed-produtos.js`.
4. Validar contagens: `Produtos = 64` e `ProdutoVariantes = 3`.
5. Rodar seed novamente e confirmar que as contagens permanecem iguais (idempotência).

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
    - Front adiciona validação client-side de expiração (mês/ano).

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
2. Fazer login e confirmar o redirecionamento para `/account/minha_conta`.
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

- Componentes afetados: `src/app/account/*`, `TopHeader`, `Header`, remoção da rota `src/app/mhCont`.
- Compatibilidade: não — rota `/mhCont` removida.
- Risco: médio — mudanças em rotas e navegação interna.

**Mudanças**

- **Added**
    - `src/app/account/layout.jsx` para manter o header fixo e renderizar conteúdo variável.
    - Sub-rotas `/account/minha-conta`, `/account/enderecos`, `/account/carteira`.
    - Componente reutilizável `src/components/componemts-conta-users/layout/minha-conta.jsx`.
- **Changed**
    - `src/components/componemts-conta-users/layout/top.jsx` com navegação semântica e links para sub-rotas.
    - `src/app/account/page.jsx` agora renderiza a seção “Minha conta” como padrão.
    - `src/components/layout/Header.jsx` aponta “Configurações da Conta” para `/account`.
- **Removed**
    - Rota antiga `/mhCont` (arquivos em `src/app/mhCont/`).

**Como testar**

1. Abrir `/account` e confirmar que o header do módulo aparece.
2. Clicar em “Minha conta”, “Meus endereços” e “Meus carteira” e validar que só o conteúdo abaixo muda.
3. Acessar diretamente `/account/minha-conta`, `/enderecos`, `/carteira`.
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



