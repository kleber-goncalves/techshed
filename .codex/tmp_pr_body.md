## 🔎 O que foi feito
- Adiciona CRUD de endereços com rotas protegidas `/api/addresses` e `/api/addresses/[id]`.
- Implementa hooks e helper de API com token Supabase.
- Cria modais de formulário e confirmação de exclusão.
- Adiciona modelo `Address` e migration no Prisma.
- Documenta o componente `section-end.jsx` e atualiza changelog/melhorias.

## 💡 Por que foi feito
- Permitir que o usuário gerencie endereços com segurança e persistência.
- Centralizar o fluxo de criação/edição/exclusão em uma UI simples.

## 🧪 Como testar / passos para QA
1. Estar autenticado no Supabase.
2. Abrir a seção “Meus endereços” e adicionar um endereço.
3. Editar e excluir um endereço existente.
4. Chamar `/api/addresses` sem token e validar retorno 401.

## 🚨 Impacto
- Componentes afetados: `src/app/api/addresses/*`, `src/hooks/addressHooks.js`, `src/lib/helpers/api/addressApi.js`, modais e seção de endereços, Prisma (schema + migration), documentação.
- Backwards compatibility? **sim**

## 🔒 Risco
- **Médio** — envolve CRUD e autenticação.

## ✅ Checklist
- [x] Segui o padrão de commits (Conventional Commits)
- [ ] Testes locais rodaram
- [ ] Build passou (se aplicável)
- [x] Adicionei docs (se aplicável)
- [x] Atualizei changelog (se aplicável)

## 📎 Issues relacionadas
- N/A

## 🖼️ Screenshots / GIFs (se aplicável)
- N/A
