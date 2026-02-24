# Arquitetura Backend -> Front (Excalidraw)

## Arquivos
- `docs/arquitetura-backend.excalidraw`

## Escopo Coberto
- Login + sincronizacao de usuario: `/api/syncUser`
- Cartoes: `/api/cards` e `/api/cards/[id]`
- Enderecos: `/api/addresses` e `/api/addresses/[id]`
- Atualizacao de perfil: `/api/users/[id]` via `updateUserProfile`

## Fora de Escopo
- Hooks CRUD genericos de usuario em `src/hooks/useAPIs.js`
- Fluxos que nao estao conectados ao front atual

## Legenda de Cores
- Auth: amarelo claro
- Cards: azul claro
- Addresses: verde claro
- User Profile: vermelho claro

## Estrutura do Diagrama
- Quadro 1: visao geral em camadas (Frontend, Helpers/Hooks, API Routes, Supabase Auth, Prisma, PostgreSQL)
- Quadro 2: sequencia de autenticacao e sincronizacao de usuario
- Quadro 3: sequencias de cartoes (listagem, criacao, exclusao)
- Quadro 4: sequencias de enderecos (listagem, criacao, edicao, exclusao)
- Quadro 5: sequencia de atualizacao de perfil

## Versao PNG
- `docs/arquitetura-backend-quadro-1-visao-geral.png`
- `docs/arquitetura-backend-quadro-2-auth-syncuser.png`
- `docs/arquitetura-backend-quadro-3-cards.png`
- `docs/arquitetura-backend-quadro-4-addresses.png`
- `docs/arquitetura-backend-quadro-5-update-perfil.png`
- Cada PNG representa exatamente um quadro do arquivo `docs/arquitetura-backend.excalidraw`.

## Validacao Recomendada
- Abrir o arquivo `.excalidraw` no Excalidraw e confirmar parsing
- Conferir que os passos estao numerados em cada quadro
- Confirmar que validacoes de token no Supabase aparecem antes de acessos Prisma
