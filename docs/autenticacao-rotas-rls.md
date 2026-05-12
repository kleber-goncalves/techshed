# Autenticacao, Rotas Protegidas e RLS

Ultima atualizacao: 2026-05-12

Este documento descreve, em alto nivel, como o projeto valida usuarios, protege rotas de API e aplica RLS/Policies no Supabase.

## Aviso de Seguranca

Este documento nao deve conter:

- tokens reais;
- chaves `anon`, `service_role` ou `DATABASE_URL`;
- URLs privadas de projeto Supabase;
- emails reais de administradores;
- exemplos com credenciais validas;
- detalhes de infraestrutura que nao sejam necessarios para desenvolvimento seguro.

Quando precisar exemplificar, use placeholders como:

```txt
<access_token>
<user_id>
<supabase_url>
```

## Visao Geral

O projeto usa uma combinacao de:

- Supabase Auth para autenticar email/senha e emitir sessao/token.
- APIs Next.js para validar token, aplicar regras de negocio e chamar Prisma.
- Prisma para ler/gravar dados no banco.
- Supabase RLS para proteger acesso direto via Supabase REST/client.

Fluxo principal:

```txt
Usuario -> Login no frontend
        -> Supabase Auth valida credenciais
        -> Frontend recebe access_token
        -> Frontend chama API Next.js com Authorization: Bearer <access_token>
        -> API valida token com Supabase Auth
        -> API usa user.id para consultar/gravar via Prisma
```

## Autenticacao do Usuario

Na pagina de login (`/auth`), o frontend chama o Supabase Auth para autenticar o usuario.

Depois do login, o projeto usa o `access_token` da sessao para sincronizar o usuario no banco da aplicacao.

Fluxo simplificado:

```txt
/auth
  -> supabase.auth.signInWithPassword(email, password)
  -> session.access_token
  -> POST /api/syncUser
  -> supabase.auth.getUser(access_token)
  -> prisma.user.upsert(...)
```

O token nao deve ser salvo manualmente pelo app em arquivos ou logs. A sessao do Supabase client pode ser persistida pelo proprio SDK no navegador.

## Padrao de Token nas APIs

As rotas privadas esperam:

```txt
Authorization: Bearer <access_token>
```

O backend extrai o token e valida:

```txt
supabase.auth.getUser(token)
```

Se o token for invalido, ausente ou expirado, a resposta esperada e `401`.

## Sincronizacao do Usuario

### `POST /api/syncUser`

Objetivo:

- validar o `access_token`;
- obter o usuario autenticado no Supabase;
- criar a linha correspondente na tabela `"User"` quando necessario.

Resumo seguro:

```txt
access_token -> Supabase Auth -> user.id/user.email -> Prisma upsert
```

Essa rota nao deve aceitar dados sensiveis do client alem do token de sessao necessario para validacao.

### `POST /api/admin`

Objetivo:

- sincronizar usuario;
- resolver o papel da conta com base em configuracao de ambiente;
- gravar `role` no banco da aplicacao.

Observacao:

- os emails administrativos reais nao devem aparecer em documentacao, logs ou exemplos;
- a lista de administradores deve permanecer em variaveis de ambiente seguras.

## Verificacao de Admin

O helper central fica em:

```txt
src/lib/helpers/server/auth/adminAuth.js
```

Fluxo:

```txt
Authorization header
  -> extrai Bearer token
  -> supabase.auth.getUser(token)
  -> busca usuario no Prisma por user.id
  -> verifica role
```

`requireAdmin(request)` permite continuar apenas se:

```txt
user.role === "ADMIN"
```

Quando o usuario nao e admin, o projeto retorna uma resposta que evita expor detalhes do painel.

## Mapa Seguro das Rotas de API

Esta tabela descreve o comportamento esperado sem expor payloads sensiveis.

| Grupo | Rotas | Protecao esperada |
| --- | --- | --- |
| Catalogo publico | `GET /api/catalogo`, `GET /api/catalogo/flat` | Publicas, somente leitura |
| Auth/sync | `POST /api/syncUser`, `POST /api/admin` | Validam token Supabase recebido do login |
| Favoritos | `GET /api/favorites`, `PUT /api/favorites` | Requer Bearer token; opera apenas com `user.id` autenticado |
| Carrinho | `GET /api/cart`, `PUT /api/cart` | Requer Bearer token; opera apenas com `user.id` autenticado |
| Enderecos | `GET/POST /api/addresses`, `PUT/DELETE /api/addresses/[id]` | Requer Bearer token; filtra por dono da linha |
| Cartoes | `GET/POST /api/cards`, `DELETE /api/cards/[id]` | Requer Bearer token; filtra por dono da linha |
| Usuario | `GET/PUT /api/users/[id]`, `POST/DELETE /api/users/avatar` | Requer Bearer token; usuario so pode acessar o proprio perfil/avatar |
| Admin usuarios | `GET/POST /api/users`, `DELETE /api/users/[id]` | Requer Bearer token e `role = ADMIN` |
| Admin check | `GET /api/admin/check` | Requer Bearer token e `role = ADMIN` |
| Admin produtos | `/api/admin/products`, `/api/admin/products/[id]`, `/api/admin/products/categories` | Requer Bearer token e `role = ADMIN` |
| Admin uploads | `POST /api/admin/uploads` | Requer Bearer token e `role = ADMIN` |

## Rotas de Usuario

As rotas de usuario seguem dois niveis de permissao:

- perfil proprio: `GET/PUT /api/users/[id]` exige Bearer token e bloqueia `id` diferente do usuario autenticado;
- avatar proprio: `POST/DELETE /api/users/avatar` exige Bearer token e usa o `user.id` autenticado;
- gestao de usuarios: `GET/POST /api/users` e `DELETE /api/users/[id]` exigem `role = ADMIN`.

Motivo da separacao:

- o usuario comum pode gerenciar apenas o proprio perfil;
- operacoes globais de listagem, criacao e exclusao de usuarios ficam restritas ao backend admin;
- helpers client-side devem enviar o Bearer token quando chamarem rotas de usuario.

## RLS e Policies no Supabase

As migrations de RLS criadas ficam em:

```txt
supabase/migrations/20260511183102_add_favorites_rls.sql
supabase/migrations/20260511184531_add_products_rls.sql
supabase/migrations/20260511185607_add_card_rls.sql
supabase/migrations/20260511190409_add_cartItems_rls.sql
supabase/migrations/20260511190912_add_Address_rls.sql
supabase/migrations/20260511191516_add_user_rls.sql
```

### Regra base para dados privados

As tabelas privadas usam o mesmo principio:

```sql
(select auth.uid())::text = "userId"
```

Ou, no caso da tabela `"User"`:

```sql
(select auth.uid())::text = id
```

Isso significa:

- o usuario autenticado so le os proprios dados;
- o usuario autenticado so cria/atualiza/remove linhas associadas ao proprio id;
- usuarios anonimos nao recebem acesso a dados privados.

### Tabelas privadas cobertas

| Tabela | Politica aplicada |
| --- | --- |
| `"Favorites"` | Usuario autenticado acessa apenas seus favoritos |
| `"CartItems"` | Usuario autenticado acessa apenas seu carrinho; `quantity >= 1` |
| `"Card"` | Usuario autenticado acessa apenas seus cartoes |
| `"Address"` | Usuario autenticado acessa apenas seus enderecos; campos obrigatorios nao vazios |
| `"User"` | Usuario autenticado acessa o proprio perfil; update direto nao promove para `ADMIN` |

### Catalogo publico

As tabelas de catalogo permitem leitura publica controlada:

| Tabela | Leitura permitida |
| --- | --- |
| `"Produtos"` | Somente produtos com `"isActive" = true` |
| `"ProdutoImagens"` | Somente imagens relacionadas a produto ativo |
| `"ProdutoVariantes"` | Somente variantes relacionadas a produto ativo |
| `"ProdutoVarianteImagens"` | Somente imagens de variantes relacionadas a produto ativo |

Escrita direta em produto nao foi liberada por policy publica. O fluxo correto de escrita do catalogo continua sendo:

```txt
Frontend admin -> API Next.js admin -> requireAdmin -> Prisma
```

## Relacao entre Prisma e RLS

RLS protege acesso direto feito via Supabase REST/client.

As APIs Next.js continuam responsaveis por:

- validar token;
- verificar dono da linha;
- verificar permissao admin;
- sanitizar payload;
- aplicar regras de negocio.

Importante:

```txt
RLS nao substitui validacao no backend.
```

Dependendo do usuario de conexao usado pelo Prisma, o backend pode ter privilegios diferentes do client Supabase. Por isso, mantenha as validacoes nas rotas.

## Fluxos Principais

### Favoritos

```txt
Frontend
  -> supabase.auth.getSession()
  -> access_token
  -> GET/PUT /api/favorites
  -> API valida token
  -> Prisma opera com userId = user.id
  -> RLS protege acesso direto via Supabase REST/client
```

### Carrinho

```txt
Frontend
  -> localStorage para estado local inicial
  -> se autenticado, sincroniza com /api/cart
  -> API valida token
  -> Prisma salva linhas com userId = user.id
```

### Perfil

```txt
Frontend
  -> GET/PUT /api/users/[id]
  -> API valida token
  -> API bloqueia acesso a id diferente
  -> Prisma le/atualiza perfil
```

### Admin

```txt
Frontend admin
  -> envia Bearer token
  -> requireAdmin()
  -> valida token Supabase
  -> busca role no Prisma
  -> permite apenas role ADMIN
```

## Como Validar com Postman sem Vazar Segredos

Use um environment local com placeholders/variaveis:

```txt
BASE_URL=http://localhost:3000
SUPABASE_URL=<supabase_url>
SUPABASE_ANON_KEY=<anon_key>
ACCESS_TOKEN=<preenchido apos login>
USER_ID=<preenchido apos login>
```

Cuidados:

- nao use `service_role` no Postman;
- nao compartilhe exports do Postman contendo tokens;
- nao salve resposta de login em arquivo versionado;
- limpe `ACCESS_TOKEN` antes de enviar prints ou logs.

Testes minimos:

1. Sem token, rotas privadas devem retornar `401`.
2. Com token valido, usuario acessa apenas os proprios dados.
3. Com `userId` diferente em acesso direto ao Supabase REST, RLS deve bloquear.
4. Catalogo publico deve retornar apenas produtos ativos.
5. Rotas admin devem bloquear usuarios sem `role = ADMIN`.

## Checklist para Novas Rotas e Tabelas

Antes de criar nova rota:

- A rota e publica, autenticada ou admin?
- Ela valida `Authorization: Bearer <access_token>` quando necessario?
- Ela usa `user.id` vindo do token em vez de confiar no `userId` enviado pelo client?
- Ela retorna apenas campos necessarios?
- Ela evita logs com token, email sensivel ou payload confidencial?

Antes de criar nova tabela no schema `public`:

- A tabela tem RLS habilitado?
- Existe policy para cada operacao necessaria?
- Dados privados usam comparacao com `auth.uid()`?
- Dados publicos tem filtro claro de visibilidade?
- Escritas sensiveis passam por API backend/admin?

## Resumo

O modelo atual recomendado e:

```txt
Frontend usa Supabase Auth para sessao
APIs Next.js validam token e permissao
Prisma executa regras de negocio no banco
RLS protege acesso direto via Supabase REST/client
```

Essa combinacao cria defesa em camadas: uma falha no client nao deve permitir acesso indevido, e uma chamada direta ao Supabase tambem deve respeitar as policies.
