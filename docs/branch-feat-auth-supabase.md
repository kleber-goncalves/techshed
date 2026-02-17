# Documentação da Branch `feat/auth-supabase`

**Base de comparação**
`dev`

**Objetivo da branch**
Implementar autenticação com Supabase, sincronizar o usuário autenticado com o banco via Prisma, permitir atualização de dados do perfil e documentar o comportamento das rotas de API relacionadas.

**Resumo das mudanças (vs `dev`)**
- Novas rotas de API para criação, listagem, atualização e sincronização de usuários.
- Integração com Supabase (client) e Prisma (client + adapter PostgreSQL).
- Nova tela de autenticação (`/auth`) para login e cadastro.
- Fluxo de atualização de perfil (UI + hook + API).
- Alterações no modelo `User` no Prisma e nova migration para o campo `phone`.
- Ajustes em componentes de conta do usuário para exibir e editar dados.
- Remoção do antigo `src/lib/prisma.js` e substituição por `src/lib/prisma/prisma.js`.

**Arquivos e áreas impactadas**
- `src/app/api/syncUser/route.js`
- `src/app/api/users/route.js`
- `src/app/api/users/[id]/route.js`
- `src/lib/supabase/supabaseClient.js`
- `src/lib/prisma/prisma.js`
- `src/hooks/userUpdate.js`
- `src/app/(login)/auth/page.js`
- `src/components/componemts-conta-users/layout/layout-mhCont/sectionInfP.jsx`
- `src/components/componemts-conta-users/layout/layout-mhCont/inf-log.jsx`
- `prisma/schema.prisma`
- `prisma/migrations/20260216202553_add_user_fields/migration.sql`

**Variáveis de ambiente usadas**
- `DATABASE_URL` (Prisma)
- `NEXT_PUBLIC_SUPABASE_URL` (Supabase)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (Supabase)

---

## Rotas de API (detalhadas)

**`POST /api/syncUser`**
Arquivo: `src/app/api/syncUser/route.js`

**Objetivo**
Sincronizar o usuário autenticado no Supabase com o banco local (Prisma). Se o usuário ainda não existir no banco, ele é criado; se já existir, permanece como está.

**Body esperado**
`{ "access_token": "TOKEN_DO_SUPABASE" }`

**Fluxo interno**
1. Lê `access_token` do body.
2. Se o token não existir, retorna erro 400.
3. Usa `supabase.auth.getUser(access_token)` para validar o token e obter o usuário.
4. Se o usuário não for encontrado, retorna erro 401.
5. Faz `prisma.user.upsert` com o `id` e `email` do Supabase.
6. Retorna o usuário criado/atualizado em JSON.

**Respostas**
- `200`: usuário criado/recuperado.
- `400`: token não enviado.
- `401`: usuário inválido ou não encontrado.
- `500`: erro interno.

---

**`GET /api/users`**
Arquivo: `src/app/api/users/route.js`

**Objetivo**
Listar todos os usuários cadastrados no banco.

**Fluxo interno**
1. Executa `prisma.user.findMany()`.
2. Retorna a lista em JSON.

**Respostas**
- `200`: lista de usuários.

---

**`POST /api/users`**
Arquivo: `src/app/api/users/route.js`

**Objetivo**
Criar um usuário no banco via Prisma.

**Body esperado**
`{ "name": "Nome", "email": "email@exemplo.com" }`

**Fluxo interno**
1. Lê `name` e `email` do body.
2. Executa `prisma.user.create`.
3. Retorna o usuário criado em JSON.

**Respostas**
- `200`: usuário criado.

---

**`PUT /api/users/[id]`**
Arquivo: `src/app/api/users/[id]/route.js`

**Objetivo**
Atualizar dados de um usuário específico, garantindo que o usuário autenticado do Supabase seja o mesmo do `id` informado na URL.

**Headers esperados**
`Authorization: Bearer TOKEN_DO_SUPABASE`

**Body esperado**
`{ "name": "...", "email": "...", "phone": "..." }`

**Fluxo interno**
1. Lê `id` dos parâmetros da rota.
2. Extrai o token do header `Authorization`.
3. Se não existir token, retorna 401.
4. Usa `supabase.auth.getUser(token)` para validar o usuário.
5. Se o usuário não for válido, retorna 401.
6. Compara `user.id` (Supabase) com `id` da URL.
7. Se forem diferentes, retorna 403.
8. Faz `prisma.user.update` com `name`, `email` e `phone`.
9. Retorna o usuário atualizado.

**Respostas**
- `200`: usuário atualizado.
- `401`: token ausente ou usuário não autenticado.
- `403`: tentativa de atualizar um `id` diferente do usuário logado.
- `500`: erro interno.

---

**`DELETE /api/users/[id]`**
Arquivo: `src/app/api/users/[id]/route.js`

**Objetivo**
Remover um usuário pelo `id`.

**Fluxo interno**
1. Executa `prisma.user.delete({ where: { id } })`.
2. Retorna `{ success: true }`.

**Respostas**
- `200`: usuário removido.

**Observação**
Essa rota não exige autenticação no estado atual.

---

## Modelo e banco (Prisma)

**Modelo `User`**
Arquivo: `prisma/schema.prisma`

Campos relevantes:
- `id`: `String` (chave primária)
- `name`: `String?`
- `email`: `String` (único)
- `phone`: `String?`
- `createdAt`: `DateTime` com `default(now())`

**Migration aplicada**
Arquivo: `prisma/migrations/20260216202553_add_user_fields/migration.sql`

Alteração:
- Adição do campo `phone` na tabela `User`.

---

## Fluxo de autenticação e sincronização

**Tela de autenticação**
Arquivo: `src/app/(login)/auth/page.js`

**Cadastro**
1. Usuário informa `email` e `password`.
2. `supabase.auth.signUp` é chamado.
3. Em caso de sucesso, o usuário recebe alerta para confirmar email.

**Login**
1. Usuário informa `email` e `password`.
2. `supabase.auth.signInWithPassword` é chamado.
3. Se houver sessão válida, o token é enviado para `/api/syncUser`.
4. Após sincronizar, a tela redireciona para `/cnfgContaUsers/minha_conta`.

---

## Atualização de perfil

**Hook de atualização**
Arquivo: `src/hooks/userUpdate.js`

**Fluxo**
1. Valida `userId` e se há algo para atualizar.
2. Busca sessão no Supabase e extrai `access_token`.
3. Faz `PUT /api/users/[id]` com `Authorization: Bearer <token>`.
4. Se `newPassword` existir, chama `supabase.auth.updateUser`.
5. Retorna sucesso ou erro.

**UI de edição**
Arquivo: `src/components/componemts-conta-users/layout/layout-mhCont/sectionInfP.jsx`

**Fluxo**
1. Carrega sessão do Supabase.
2. Se não houver sessão, redireciona para `/auth`.
3. Preenche formulário com dados do usuário.
4. Ao enviar, chama `updateUserProfile`.
5. Exibe mensagem de sucesso ou erro.

**UI de login**
Arquivo: `src/components/componemts-conta-users/layout/layout-mhCont/inf-log.jsx`

**Fluxo**
1. Busca o usuário com `supabase.auth.getUser()`.
2. Se não houver usuário, mostra “Você não está logado.”
3. Exibe email do usuário.

---

## Observações e pontos de atenção

- `GET /api/users`, `POST /api/users` e `DELETE /api/users/[id]` não exigem autenticação no estado atual.
- `PUT /api/users/[id]` exige token Supabase e bloqueia atualização de outro usuário.
- O `password` não é retornado pelo Supabase e não estará disponível para exibição.

---

## Casos de teste e cenários

1. `POST /api/syncUser` sem `access_token` retorna 400.
2. `POST /api/syncUser` com token inválido retorna 401.
3. `POST /api/syncUser` com token válido cria/atualiza usuário.
4. `GET /api/users` retorna lista de usuários.
5. `POST /api/users` cria usuário com `name` e `email`.
6. `PUT /api/users/[id]` sem `Authorization` retorna 401.
7. `PUT /api/users/[id]` com token válido, mas `id` diferente retorna 403.
8. `PUT /api/users/[id]` com token válido e `id` correto atualiza `name`, `email` e `phone`.
9. `DELETE /api/users/[id]` remove o usuário (rota sem auth).
10. Login via `/auth` chama `/api/syncUser` e redireciona para `/cnfgContaUsers/minha_conta`.
