## 🔎 O que foi feito
- Adicionado setup de migrations do Supabase e migrations de RLS/Policies para tabelas privadas (Favorites, CartItems, Card, Address, User).
- Adicionadas policies de leitura publica controlada para o catalogo (Produtos e tabelas relacionadas) limitado a produtos ativos.
- Endurecidas rotas legadas de usuarios: GET/POST /api/users e DELETE /api/users/[id] agora exigem admin; helpers agora enviam Bearer token.
- Documentado o fluxo de autenticacao/verificacao e RLS, e atualizado changelog.

## 💡 Por que foi feito
- As tabelas estavam sem RLS/policies e algumas rotas de usuarios estavam publicas, aumentando risco de vazamento e alteracoes indevidas.
- O projeto ja valida token nas APIs; RLS adiciona uma camada extra de defesa no banco para acesso direto via Supabase REST/client.

## 🧪 Como testar / passos para QA
1. Aplicar as migrations em um ambiente Supabase de teste/staging.
2. Logar com um usuario e testar /rest/v1/Favorites, /rest/v1/CartItems, /rest/v1/Card, /rest/v1/Address e /rest/v1/User com Authorization: Bearer <access_token>.
3. Confirmar que cada tabela retorna apenas dados do proprio usuario autenticado.
4. Tentar inserir/atualizar com userId de outro usuario e confirmar bloqueio por RLS.
5. Testar /rest/v1/Produtos?select=* sem token e confirmar que apenas produtos ativos e relacionamentos aparecem.
6. Testar GET /api/users sem token (esperado: 401) e com usuario nao-admin (esperado: bloqueio).
7. Rodado localmente: npm run lint (0 errors; warnings existentes de next/no-img-element).

## 🚨 Impacto
- Componentes afetados: supabase/migrations/*, src/app/api/users/*, src/lib/userApi.js, docs e changelog.
- Backwards compatibility? sim, para fluxos atuais de perfil/header/avatar; operacoes globais de usuarios agora sao admin.

## 🔒 Risco
- Medio — RLS pode bloquear integracoes que dependiam de acesso direto amplo. Mitigacao: aplicar primeiro em staging e validar os fluxos principais.

## ✅ Checklist
- [x] Segui o padrão de commits (Conventional Commits)
- [x] Testes locais rodaram
- [ ] Build passou (nao executado nesta rodada)
- [x] Adicionei docs (se aplicavel)
- [x] Atualizei changelog (se aplicavel)

## 📎 Issues relacionadas
- N/A

## 🖼️ Screenshots / GIFs (se aplicável)
- N/A
