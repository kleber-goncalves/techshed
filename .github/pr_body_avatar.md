## 🔎 O que foi feito
- Implementado fluxo completo de avatar de perfil na área de conta com upload autenticado para Supabase Storage.
- Adicionada persistência de `avatarUrl` e `avatarStoragePath` no usuário (Prisma + migração já existente na branch).
- Ajustada leitura de perfil para carregar dados persistidos no banco após reload.
- Integrado avatar no dropdown do header para usar a mesma imagem cadastrada na conta.
- Adicionada remoção da imagem antiga do bucket no fluxo de troca de avatar.
- Melhorada UI de seleção de arquivo (botão customizado, preview, limpar seleção) e validação de tipo/tamanho no client.
- Atualizados `CHANGELOG.md` (release v0.1.32) e `docs/melhorias-codex.md`.

## 💡 Por que foi feito
- Corrigir inconsistência entre upload/salvamento e exibição do avatar após atualizar a página.
- Garantir experiência consistente: mesma foto na conta e no header.
- Reduzir acúmulo de arquivos antigos no bucket ao trocar foto.

## 🧪 Como testar / passos para QA
1. Fazer login e abrir `/account` > seção de informações pessoais.
2. Selecionar um arquivo válido (`jpg/png/webp`, até 2MB) e clicar em `Atualizar`.
3. Confirmar que o preview troca, recarregar a página e validar persistência da foto.
4. Abrir dropdown do header e confirmar que o avatar exibido é o mesmo da conta.
5. Trocar novamente de foto e validar remoção da imagem anterior no bucket `profile-images`.
6. Tentar arquivo inválido (ex.: gif ou >2MB) e validar mensagem de erro no formulário.

## 🚨 Impacto
- Componentes afetados:
  - `src/app/(privado)/account/*`
  - `src/layout/header/*`
  - `src/app/api/users/[id]/route.js`
  - `src/app/api/users/avatar/route.js`
  - `src/hooks/userUpdate.js`
  - `CHANGELOG.md`
  - `docs/melhorias-codex.md`
- Backwards compatibility? (sim)

## 🔒 Risco
- Médio — mudança cruza autenticação, storage e persistência de dados de perfil; risco mitigado com validação de token, fallback de avatar e testes manuais de fluxo.

## ✅ Checklist
- [x] Segui o padrão de commits (Conventional Commits)
- [ ] Testes locais rodaram
- [ ] Build passou (se aplicável)
- [x] Adicionei docs (se aplicável)
- [x] Atualizei changelog (se aplicável)

## 📎 Issues relacionadas
- Fecha #numero-da-issue (se aplicável)

## 🖼️ Screenshots / GIFs (se aplicável)
- Não anexado nesta PR.
