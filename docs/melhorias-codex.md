# Plano de Melhorias do Projeto (Codex + Kleber)

Este documento registra **as próximas melhorias planejadas** para o projeto.
Ele serve como checklist de execução e memória de decisões, para não esquecermos o que foi combinado.

Última atualização: 2026-05-09
Branch: `style/login`

## Visão Geral

Objetivo: evoluir a estrutura do projeto e a qualidade do UI/UX de forma organizada e rastreável.

### Animação Gráfica (linha do tempo)

```
Ideia ──> Planejamento ──> Implementação ──> Revisão ──> PR ──> Deploy
   •           •                 •                •         •       •
```

## Melhorias Prioritárias

### Sugestões Codex (auth/login: UX, segurança e manutenção)

1. Remover cores hardcoded e centralizar tokens de tema

- A página de login usa cores específicas (ex.: amarelo/azul). Centralizar em um arquivo de tema (Tailwind config ou tokens CSS) evita divergência entre telas e facilita ajustes futuros.

2. Adicionar fluxo de “Esqueci minha senha” (Supabase reset)

- Incluir ação para enviar email de recuperação e uma rota de redefinição melhora conversão e reduz suporte.

3. Evitar redirects apenas no client para rotas protegidas

- Para reduzir “flash” de UI, usar `middleware.js`/guards para redirecionar usuários autenticados para `/account/minha_conta` e bloquear acesso não autenticado às rotas privadas.

4. Padronizar mensagens de erro e mapear erros comuns do Supabase

- Criar um mapper para erros (ex.: credenciais inválidas, email não confirmado) melhora clareza e consistência no app.

### Sugestões Codex (avatar de perfil: robustez e manutenção)

1. Sincronizar avatar também no `user_metadata` do Supabase Auth

- Hoje o avatar principal já está no Prisma e no header.
- Sincronizar em `user_metadata.avatar_url` ajuda integrações futuras que consumam apenas Auth e reduz divergência entre fontes.

2. Adicionar rollback para upload de avatar quando update do banco falhar

- Fluxo atual faz upload e depois salva no Prisma; se a atualização do banco falhar, o arquivo novo pode ficar órfão.
- Sugestão: remover imediatamente o upload recém-criado quando `PUT /api/users/[id]` retornar erro.

3. Criar endpoint para remoção manual de avatar (reset para padrão)

- Permitir ao usuário voltar para o avatar padrão sem precisar subir nova foto.
- Isso melhora usabilidade e reduz suporte manual.

4. Cobrir fluxo com testes E2E de conta + header

- Cenários: upload válido, bloqueio por formato/tamanho, persistência após reload, e propagação da imagem no dropdown.
- Evita regressões em mudanças futuras de auth, storage e header.

### Sugestões Codex (editor settingsProduct: layout e manutencao)

1. Mover `ProductImagesField` e `ProductVariantsField` para `settingsProduct/_components`

- Hoje a branch ja separa boa parte do editor em `_components`, mas esses dois arquivos ainda estao em `_layout`.
- Padronizar tudo no mesmo dominio reduz duvida sobre onde criar ou procurar novos componentes do editor.

2. Criar um `index.js` de exports para `settingsProduct/_components`

- Os imports do editor ainda estao longos e espalhados.
- Um barrel local melhora legibilidade e facilita futuras mudancas de pasta.

3. Adicionar protecao de saida com alteracoes nao salvas

- O editor agora esta mais robusto e maior; por isso cresce o risco de perder trabalho ao navegar sem querer.
- Vale criar um guard de dirty state para confirmar saida antes de trocar de rota.

4. Cobrir o layout em duas colunas com testes E2E ou smoke visual

- O editor ganhou comportamento responsivo e nova hierarquia visual.
- Recomendo validar pelo menos desktop e mobile para evitar regressoes em futuras mudancas de layout.

### Sugestões Codex (galerias por variante e galeria pública)

1. Adicionar upload múltiplo com fila e progresso por imagem

- Hoje o fluxo funciona bem por imagem, mas o cadastro de variantes com muitas fotos pode ficar lento.
- Sugestão: permitir selecionar varias imagens de uma vez e exibir progresso individual por card.

2. Criar testes automatizados para o fallback da galeria pública

- Cenarios minimos: variante com galeria propria, variante sem galeria caindo para `produto.images`, e fallback final para `img`.
- Isso protege o comportamento mais importante da vitrine apos a mudanca de arquitetura.

3. Gerar miniaturas otimizadas para o admin e para a vitrine

- Hoje a mesma imagem pode servir tanto para preview quanto para exibicao maior.
- Sugestao: gerar thumbs menores ou usar estrategia de transformacao para reduzir custo de carregamento.

4. Melhorar acessibilidade e navegacao por teclado na galeria

- Permitir reorder e troca de foco sem depender apenas de mouse ou drag and drop.
- Isso ajuda acessibilidade e tambem reduz atrito operacional no painel.

5. Adicionar validacao de consistencia entre capa e galeria

- Criar uma verificacao visual ou automatica para mostrar quando `img/alt` divergir da primeira imagem da galeria.
- Isso facilita manutencao de produtos legados durante o periodo de transicao.

### Sugestões Codex (galeria híbrida de imagens de produto)

1. Criar limpeza de uploads órfãos no Supabase Storage

- Hoje o upload acontece antes do save final do produto; se o admin abandonar a edição, o arquivo pode ficar sem vínculo no banco.
- Sugestão: criar rotina de limpeza por `storagePath` órfão ou endpoint de rollback para uploads descartados.

2. Adicionar validação e compressão de imagem antes do upload

- Validar tipo MIME, tamanho máximo e dimensões mínimas antes de enviar para o bucket.
- Opcionalmente comprimir imagens grandes no client para reduzir tempo de upload e custo de storage.

3. Melhorar feedback visual do upload na galeria

- Exibir loading por card, erro por imagem e confirmação visual quando o upload terminar.
- Isso reduz ansiedade do usuário e facilita entender qual foto falhou.

4. Cobrir o fluxo híbrido com testes E2E

- Cenários mínimos: produto legado abre com fallback local, upload autenticado funciona, reorder persiste e remoção apaga vínculo corretamente.
- Isso protege a integração entre editor, API, Prisma e Supabase Storage.

### Sugestões Codex (editor dedicado `settingsProduct`)

1. Adicionar botão de “Voltar com contexto” para manter busca/filtro do painel

- Hoje o retorno vai para `/admin/deshboard` sem preservar estado anterior.
- Recomendo salvar `q` e `statusFilter` na URL (ou `sessionStorage`) e restaurar ao voltar.

2. Criar estado de carregamento visual no editor (`Skeleton`)

- A tela de edição já mostra texto de loading; evoluir para skeleton melhora percepção de desempenho.
- Reduz salto visual quando o produto é carregado por ID.

3. Proteger saída com alterações não salvas

- Detectar dirty state no formulário e confirmar navegação antes de sair da tela.
- Evita perda de edição acidental em fluxos longos.

4. Cobertura E2E do fluxo completo de edição por rota

- Cenários: listagem -> editar -> salvar -> voltar, listagem -> novo -> criar -> redirecionar para `[id]`, desativar produto.
- Garante estabilidade da nova arquitetura baseada em rota dedicada.

### Sugestões Codex (dashboard admin: evolução pós-componentização)

1. Extrair o estado de busca para a URL

- Persistir `q` e `statusFilter` em query params para facilitar compartilhamento e back/forward.
- Ajuda também a manter o contexto ao voltar do editor para a listagem.

1. Persistir filtro de categoria na URL

- Incluir `category` na querystring junto com `q` e `statusFilter`.
- Benefícios: refresh preserva estado, link compartilhável e “voltar do editor” recupera filtros.

2. Adicionar paginação ou scroll infinito opcional

- Para catálogos maiores, a listagem pode ficar pesada.
- Sugestão: `limit` + paginação simples no backend e UI opcional (ou “carregar mais”).

3. Padronizar densidade e espaçamento na tabela

- Consolidar tokens de espaçamento para reduzir variações entre linhas/headers.
- Facilita consistência visual em futuras tabelas do admin.

### Sugestões Codex (scroll infinito admin)

1. Adicionar fallback manual de "Carregar mais"

- Garante acessibilidade quando o `IntersectionObserver` falhar ou for desativado.
- Serve como alternativa para usuarios que preferem controle manual.

2. Persistir posicao de scroll e pagina ao voltar do editor

- Salvar `scrollY` e pagina atual em `sessionStorage` ao navegar para o editor.
- Ao voltar, restaurar a posicao para evitar perder o contexto.

3. Avaliar virtualizacao da lista

- Para listas muito grandes, `react-virtual` ou semelhante reduz custo de render.
- Mantem a UI fluida sem perder o scroll infinito.

4. UX do Select de categorias no admin

- Mostrar estado “Carregando categorias...” (item desabilitado) quando `loadingCategories` estiver `true`.
- Exibir labels amigáveis (ex.: “Celulares” em vez de `celulare`) usando um mapa central ou retornando `{ label, value }` no endpoint.
- Adicionar busca dentro do Select quando a lista crescer (se o componente de UI suportar).

### Sugestões Codex (refatoracao da estrutura do dashboard admin)

1. Documentar a nova convencao de pastas do painel

- Registrar o proposito de `_layout`, `_components`, `_hooks` e `_utils` para o admin.
- Facilita onboarding e reduz risco de imports fora do padrao.

2. Criar barreira contra imports legados

- Adicionar verificacao no CI (ou script local) para bloquear `/_components/admin-produtos/`.
- Garante que o caminho antigo nao volte em novos commits.

3. Centralizar exports do painel admin

- Criar barrels (ex.: `index.js`) para reduzir paths longos e facilitar futuros moves.
- Melhora legibilidade dos imports ao longo do painel.

4. Padronizar vocabulário de categorias (`category` vs `catalogKey`)

- Hoje o produto tem `category` (ex.: `celulare`) e `catalogKey` (ex.: `celulares`) e o site público agrupa por `catalogKey`.
- Sugestão: documentar/validar essa regra (ou criar um mapeamento) para reduzir inconsistência no cadastro e em filtros.

1. Mover edição de produto para página dedicada (`/admin/deshboard/settingsProduct/[id]`)

- Hoje a lista e o formulário convivem na mesma tela; com crescimento de campos isso reduz foco e escalabilidade.
- Recomendação: manter `/admin/deshboard` como index (lista/KPIs) e abrir editor em rota própria.

2. Criar fluxo de criação dedicado (`/admin/deshboard/settingsProduct/new`)

- Botão “Novo produto” passaria a abrir uma página de criação com o mesmo `ProductFormSection`.
- Benefício: reaproveitamento de componente com menor acoplamento e URL compartilhável.

3. Expor `GET /api/admin/products/[id]` para hidratação de editor

- O editor dedicado precisa carregar um produto por ID de forma direta.
- Isso simplifica cache, reload da página e futura instrumentação de auditoria.

4. Adicionar testes E2E do fluxo admin de produtos

- Cenários mínimos: listar, buscar, criar, editar, atualizar `features`, desativar e validar status na tabela.
- Objetivo: proteger a nova arquitetura modular contra regressões em deploy.

### Sugestões Codex (painel admin: segurança e experiência)

1. Migrar a checagem de admin para fluxo server-side completo

- Hoje a verificação principal acontece no client (`AdminAccessGate`) com endpoint de check.
- Evolução recomendada: usar `@supabase/ssr` + cookies no servidor para bloquear mais cedo (layout/page server) e reduzir flicker.

2. Criar guard reutilizável por papel de acesso (RBAC)

- Generalizar o gate para `AccessGate` com suporte a roles (`ADMIN`, `CUSTOMER`, futuras roles).
- Evitar duplicação ao proteger futuras áreas administrativas.

3. Padronizar a rota `/admin/deshboard` para `/admin/dashboard`

- Corrigir typo para melhorar legibilidade e consistência de URLs.
- Incluir redirect temporário para manter compatibilidade e evitar links quebrados.

4. Cobrir fluxo de autorização admin com testes E2E

- Cenários mínimos: admin entra, não-admin recebe 404, sessão expirada bloqueia acesso.
- Garantir que regressões de permissão sejam detectadas automaticamente no CI.

5. Observabilidade para falhas de autorização

- Adicionar logs estruturados no backend (`admin/check` e `requireAdmin`) com motivo de bloqueio.
- Facilitar diagnóstico de problemas de role/token em produção.

### Sugestões Codex (pós-refatoração de arquitetura)

1. Criar checklist automatizado para imports legados

- Adicionar verificação no CI com `rg` para bloquear caminhos antigos (`componemts`, `componets`, `components/layout`, `components-loja/filtro`, `cnfgContaUsers`).
- Evitar regressão após a migração de pastas e grupos de rotas.

2. Cobrir rotas principais com smoke test E2E

- Validar navegação mínima de `/`, `/loja`, `/produto/[slug]`, `/categoria/[categoria]`, `/busca`, `/carrinho`, `/favoritos` e `/account/minha_conta`.
- Garantir que a reorganização estrutural continue íntegra em mudanças futuras.

3. Padronizar convenção de nomes para rotas privadas

- Definir oficialmente no README se o padrão será `snake_case` ou `kebab-case` para subrotas de conta (`minha_conta`, `meus_enderecos`, etc.).
- Reduzir decisões ad-hoc ao criar novas páginas.

4. Adicionar aliases semânticos para domínios de UI

- Criar aliases como `@/layout`, `@/components/loja`, `@/components/produto`, `@/components/conta` em `jsconfig/tsconfig`.
- Facilitar leitura dos imports e futuras movimentações sem quebra ampla.

### Sugestões Codex (catálogo em banco)

1. Migrar leitura de catálogo para banco (remover dependência de `src/data/produtos.js` no runtime)

- Criar camada única de leitura (`src/lib/catalogo-db.js`) e APIs de catálogo (`/api/catalogo` e `/api/catalogo/flat`).
- Atualizar páginas/contexts que ainda importam `@/data/produtos`.
- Só remover `src/data/produtos.js` após `rg` sem referências.

2. Padronizar execução de seed no `package.json`

- Adicionar scripts: `"db:seed:produtos": "node scripts/seed-produtos.js"` e `"db:catalogo:refresh": "npx prisma generate && node scripts/seed-produtos.js"`.
- Facilitar onboarding e reprocessamento de catálogo.

3. Garantir qualidade do seed com validação automatizada

- Criar verificação pós-seed para contagens esperadas e produto com `promocao`.
- Falhar cedo em CI/local quando houver regressão estrutural nos dados de catálogo.

4. Hibrido carrinho/favoritos (localStorage + banco)

- Criar modelos e APIs para sincronizar carrinho e favoritos por usuario.
- Fazer merge no login e usar banco como fonte de verdade quando logado.
- Manter localStorage apenas para usuario deslogado.

### Sugestões Codex (header/auth e qualidade de código)

1. Consolidar sessão do cliente em um `AuthContext` global

- Evitar múltiplas assinaturas de `onAuthStateChange` em componentes distintos.
- Expor `user`, `isAuthReady` e `logout` via contexto para reduzir duplicação.

2. Cobertura de testes para `useHeaderAuth` e carrinho

- Adicionar testes unitários para `getDisplayName/getInitials` e para o hook de auth.
- Cobrir deduplicação e fluxo de sync do carrinho para evitar regressões silenciosas.

3. Melhorar UX durante carregamento de autenticação no header

- Exibir skeleton curto no bloco de usuário enquanto `isAuthReady` for `false`.
- Reduzir “salto” visual entre estado desconhecido e estado autenticado/deslogado.

4. Enrijecer menu de usuário para acessibilidade

- Garantir labels explícitos e foco visível no trigger/avatar.
- Revisar atalhos de teclado e navegação no dropdown para conformidade de UX.

## Prioridade e Esforço (Resumo)

1. Remover Logs de Debug no Filtro — **Impacto:** médio, **Esforço:** baixo
2. Estado de Filtros Compartilhado — **Impacto:** médio, **Esforço:** baixo
3. Centralização de Dados do Footer — **Impacto:** médio, **Esforço:** baixo
4. Responsividade do Footer — **Impacto:** médio, **Esforço:** médio
5. Normalização de Categorias e Slugs — **Impacto:** alto, **Esforço:** médio
6. Padronização de Pastas e Nomes — **Impacto:** alto, **Esforço:** alto
7. Uso do Codex na Revisão de Código — **Impacto:** médio, **Esforço:** baixo
8. Busca: Relevância e Sincronização — **Impacto:** médio, **Esforço:** médio
9. Tailwind Content Paths — **Impacto:** médio, **Esforço:** baixo
10. Dev Server Lock (Windows) — **Impacto:** médio, **Esforço:** baixo
11. Carrinho: Cupom/Frete/Resumo Real — **Impacto:** alto, **Esforço:** médio
12. Carrinho: Testes Automatizados da Regra de Negócio — **Impacto:** alto, **Esforço:** médio
13. Favoritos: Toggle de Retorno no Header — **Impacto:** alto, **Esforço:** baixo
14. Favoritos: Testes E2E de Navegação e Persistência — **Impacto:** alto, **Esforço:** médio
15. Conta do usuário: Nav ativo e acessibilidade do formulário — **Impacto:** médio, **Esforço:** baixo
16. Conta do usuário: Padronizar rotas (kebab-case) e links do nav — **Impacto:** médio, **Esforço:** baixo
17. Rotas de usuário: Autenticação e autorização completa — **Impacto:** alto, **Esforço:** médio
18. Sincronização Supabase/Prisma de perfil — **Impacto:** médio, **Esforço:** médio
19. Conta do usuário: UX segura para senha — **Impacto:** médio, **Esforço:** baixo
20. Endereços: validação e mensagens de erro nas APIs — **Impacto:** médio, **Esforço:** baixo
21. Endereços: reset de formulário e edição segura — **Impacto:** médio, **Esforço:** baixo
22. Endereços: feedback de loading e estado vazio — **Impacto:** médio, **Esforço:** baixo
23. Carteira: segurança e validações completas — **Impacto:** alto, **Esforço:** médio

### 1) Padronização de Pastas e Nomes

**Descrição**

- Corrigir inconsistências e typos em nomes de pastas.
- Exemplo: `componets-page-produto` → `components-page-produto`.

**Benefícios**

- Melhor legibilidade e manutenção.
- Menos erros de import/caminhos.

**Checklist**

- [ ] Mapear pastas com nomes inconsistentes
- [ ] Definir padrão de nomenclatura (PT-BR ou EN)
- [ ] Renomear pastas e ajustar imports
- [ ] Validar build local

**Plano de execução da melhoria**

1. Levantar um inventário com `rg --files` e mapear inconsistências de nomes.
2. Definir o padrão oficial (PT-BR ou EN) e registrar no README.
3. Renomear as pastas com inconsistência e ajustar todos os imports.
4. Rodar `npm run lint` e `npm run build` para validar.

**Estimativa**

- Esforço: alto (renomes em múltiplos paths)
- Tempo: 1–2 dias

**Risco**

- Médio: mudanças em paths podem quebrar imports se não atualizados.

### 2) Responsividade do Footer

**Descrição**

- Ajustar layout do footer para mobile, evitando colunas espremidas.
- Empilhar colunas em telas menores e reduzir espaçamentos.

**Benefícios**

- Melhor experiência no mobile.
- Menos scroll lateral ou quebra visual.

**Checklist**

- [ ] Definir breakpoints para empilhamento
- [ ] Ajustar `gap` e `padding` em mobile
- [ ] Validar comportamento no accordion
- [ ] Verificar legibilidade dos textos

**Plano de execução da melhoria**

1. Inspecionar o footer em 360px, 768px e 1024px.
2. Definir os breakpoints e a direção do layout em cada faixa.
3. Ajustar `gap`, `padding` e alinhamento no componente do footer.
4. Validar abertura do accordion e legibilidade após os ajustes.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Baixo: mudanças apenas visuais.

### 3) Centralização de Dados do Footer

**Descrição**

- Extrair listas e textos fixos para um objeto/array em `data/`.
- Renderizar via map para reduzir repetição.

**Benefícios**

- Manutenção mais fácil.
- Menos repetição e risco de inconsistência.

**Checklist**

- [ ] Criar `src/data/footer.js`
- [ ] Migrar listas de links e textos
- [ ] Ajustar renderização no componente
- [ ] Validar se nada quebrou

**Plano de execução da melhoria**

1. Criar `src/data/footer.js` com o schema de links e textos.
2. Substituir hardcode no componente do footer por map do data.
3. Validar o render em desktop e mobile.
4. Rodar lint e garantir que nenhum link foi perdido.

**Estimativa**

- Esforço: baixo
- Tempo: 2–4 horas

**Risco**

- Baixo: refatoração simples.

### 4) Normalização de Categorias e Slugs

**Descrição**

- Padronizar os valores de `category` nos produtos e alinhar com `categorySlugMap`.
- Corrigir typos (ex.: `headse`, `smartst`, `celulare`) e garantir consistência entre dados e filtros.

**Benefícios**

- Filtros de categoria mais confiáveis.
- Menos condicionais e correções pontuais por slug.

**Checklist**

- [ ] Mapear categorias atuais em `produtos.js`
- [ ] Definir tabela de normalização (slug → value e value → label)
- [ ] Atualizar dados e ajustar filtros
- [ ] Validar rotas `/categoria/[categoria]` e filtros

**Plano de execução da melhoria**

1. Levantar todas as categorias em `produtos.js` e `CategoryFilter`.
2. Criar uma tabela única de mapeamento e labels canônicas.
3. Normalizar os valores nos dados e ajustar filtros/rotas.
4. Testar `/categoria/[categoria]` e a lista de filtros.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Médio: alteração em dados pode afetar rotas e filtros se não for bem mapeada.

### 5) Estado de Filtros Compartilhado

**Descrição**

- Centralizar o estado padrão de filtros em um helper (ex.: `src/lib/filtersDefault.js`)
- Usar esse default em `/loja` e `/categoria/[categoria]` para evitar divergência.

**Benefícios**

- Evita inconsistências entre páginas.
- Facilita evolução do filtro sem duplicação.

**Checklist**

- [ ] Criar constante `DEFAULT_FILTERS`
- [ ] Usar em `src/app/loja/page.js`
- [ ] Usar em `src/app/categoria/[categoria]/CategoryPageClient.jsx`
- [ ] Garantir compatibilidade com `applyFilters`

**Plano de execução da melhoria**

1. Criar `src/lib/filtersDefault.js` exportando `DEFAULT_FILTERS`.
2. Substituir objetos inline por imports nas páginas.
3. Garantir que `applyFilters` continua usando o mesmo shape.
4. Verificar fluxo de filtros em `/loja` e `/categoria/[categoria]`.

**Estimativa**

- Esforço: baixo
- Tempo: 1–2 horas

**Risco**

- Baixo: mudança de manutenção.

### 6) Remover Logs de Debug no Filtro

**Descrição**

- Remover ou proteger `console.log` em `applyFilters` para evitar poluição no console.

**Benefícios**

- Menos ruído em produção.
- Melhor performance e UX para debug real.

**Checklist**

- [ ] Remover logs ou condicionar por `NODE_ENV`
- [ ] Validar que o filtro continua funcionando

**Plano de execução da melhoria**

1. Identificar os `console.log` em `applyFilters`.
2. Remover ou condicionar por `process.env.NODE_ENV !== "production"`.
3. Validar que filtros continuam respondendo corretamente.

**Estimativa**

- Esforço: baixo
- Tempo: 30–60 min

**Risco**

- Baixo: não altera comportamento funcional.

### 7) Uso do Codex na Revisão de Código

**Descrição**

- Incluir uma etapa padrão de revisão com Codex antes de abrir PR.

**Quando usar**

- Antes de cada commit relevante.
- Antes de abrir PR.
- Após alterações em rotas, filtros, dados e UI crítica.

**Checklist**

- [ ] Rodar `npm run lint`
- [ ] Pedir para o Codex revisar arquivos alterados com foco em regressões e edge cases
- [ ] Verificar consistência de imports, dados e rotas
- [ ] Atualizar `CHANGELOG.md` quando aplicável

**Plano de execução da melhoria**

1. Adicionar ao fluxo interno: “Revisão Codex” antes de `git commit`.
2. Padronizar o formato do pedido ao Codex (contexto + arquivos).
3. Registrar achados e ações no PR/descrição do commit.

**Estimativa**

- Esforço: baixo
- Tempo: 15–30 min por ciclo

**Risco**

- Baixo: melhoria de processo sem impacto no runtime.

### 8) Busca: Relevância e Sincronização

**Descrição**

- Melhorar a relevância das sugestões iniciais do modal e garantir sincronização do input com o histórico do navegador sem warnings de render.

**Benefícios**

- Sugestões mais úteis e alinhadas ao comportamento do usuario.
- Experiencia mais consistente ao usar back/forward.

**Checklist**

- [ ] Definir criterio de relevancia (promocao, estoque, popularidade).
- [ ] Ajustar o modal para usar criterio de relevancia.
- [ ] Implementar sincronizacao segura do input com a URL.
- [ ] Validar comportamento de back/forward.

**Plano de execução da melhoria**

1. Definir o ranking (ex.: promocao > maior estoque > nome).
2. Criar helper em `src/lib/searchRanking.js` e aplicar no modal.
3. Refatorar o input da pagina `/busca` para sincronizar via `key` ou `useMemo` sem setState em effect.
4. Testar com historico do navegador e validar ausencia de warnings.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Baixo: mudanca isolada no fluxo de busca.

### 9) Tailwind Content Paths

**Descrição**

- Garantir que o `tailwind.config.js` inclua todos os diretórios reais do projeto (`src/`, `app/`, `components/`) para evitar classes ausentes no build.

**Benefícios**

- Evita falhas de hover/cores por classes nao geradas.
- Reduz bugs visuais difíceis de rastrear.

**Checklist**

- [ ] Validar paths reais do projeto e manter `content` atualizado.
- [ ] Rodar `npm run dev` e inspecionar classes criticas (hover/dark).
- [ ] Documentar a regra no README ou docs de UI.

**Plano de execução da melhoria**

1. Conferir a estrutura das pastas e revisar `tailwind.config.js`.
2. Incluir paths faltantes (ex.: `./src/**/*`).
3. Reiniciar o dev server e validar classes importantes.

**Estimativa**

- Esforço: baixo
- Tempo: 30–60 min

**Risco**

- Baixo: configuracao simples e controlada.

### 10) Dev Server Lock (Windows)

**Descrição**

- Criar automacao para liberar lock do Next.js no Windows e reduzir erros `EPERM`/`Unable to acquire lock`.

**Benefícios**

- Menos interrupcoes no `npm run dev`.
- Diagnostico mais rapido quando houver lock em `.next/dev/lock`.

**Checklist**

- [ ] Criar script `scripts/dev-clean.ps1` para encerrar Node e limpar `.next`.
- [ ] Documentar uso no README ou docs operacionais.
- [ ] Validar que o `next dev` inicia sem lock.

**Plano de execução da melhoria**

1. Implementar script PowerShell com `taskkill` e limpeza seletiva da `.next`.
2. Atualizar documentacao com exemplos de uso.
3. Testar em Windows com instancia travada.

**Estimativa**

- Esforço: baixo
- Tempo: 30–60 min

**Risco**

- Baixo: acao local, sem impacto em producao.

### 11) Carrinho: Cupom/Frete/Resumo Real

**Descrição**

- Evoluir o resumo do carrinho para calculo real de frete, desconto e total final.
- Preparar o contrato para integracao futura com checkout.

**Benefícios**

- Aproxima o comportamento de um e-commerce real.
- Reduz retrabalho quando o checkout for implementado.

**Checklist**

- [ ] Definir modelo de valores: `subtotal`, `frete`, `desconto`, `total`.
- [ ] Criar helper de calculo centralizado em `src/lib/cartTotals.js`.
- [ ] Atualizar `CarrinhoClient` para exibir breakdown completo.
- [ ] Garantir fallback quando frete/cupom nao estiverem disponiveis.

**Plano de execução da melhoria**

1. Definir schema de totais no contexto do carrinho.
2. Criar funcoes puras de calculo (com testes unitarios).
3. Integrar no resumo visual do carrinho.
4. Validar cenarios com e sem cupom/frete.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Médio: mudanças no dominio de preco exigem validacao cuidadosa.

### 12) Carrinho: Testes Automatizados da Regra de Negócio

**Descrição**

- Criar testes para garantir estabilidade da logica do carrinho (`merge`, `clamp`, persistencia e retorno de rota).

**Benefícios**

- Evita regressao em alteracoes futuras.
- Garante confiabilidade dos fluxos criticos de compra.

**Checklist**

- [ ] Adicionar ambiente de testes (Vitest/Jest + RTL).
- [ ] Testar `sanitizeLines` e regras de merge por `productId + variantId`.
- [ ] Testar limites de estoque (`1..stock`) nas operacoes de quantidade.
- [ ] Testar persistencia (`localStorage`) e retorno (`sessionStorage`).

**Plano de execução da melhoria**

1. Configurar base de testes e scripts no `package.json`.
2. Extrair utilitarios puros quando necessario para facilitar teste.
3. Criar suite para `cart-context` e `cartReturnPath`.
4. Cobrir cenarios de edge cases (produto removido do catalogo, estoque zerado, chave invalida).

**Estimativa**

- Esforço: médio
- Tempo: 1 dia

**Risco**

- Baixo: adiciona seguranca sem mudar comportamento final.

### 13) Favoritos: Toggle de Retorno no Header

**Descrição**

- Consolidar o comportamento do ícone de favoritos para funcionar como toggle:
- fora de `/favoritos` abre a página;
- dentro de `/favoritos` retorna para a rota anterior salva.

**Benefícios**

- Navegação mais fluida e previsível para o usuário.
- Consistência com o padrão já usado no carrinho.

**Checklist**

- [ ] Garantir que o clique do ícone não conflite com `Link` pai.
- [ ] Validar gravação de rota com `saveFvrtReturnPath`.
- [ ] Validar retorno com `getFvrtBackPath` e fallback seguro.
- [ ] Cobrir cenários de navegação direta por URL.

**Plano de execução da melhoria**

1. Centralizar o clique de favoritos em um único handler no `Header`.
2. Remover qualquer navegação duplicada que force `/favoritos` após o retorno.
3. Padronizar fallback para `/loja` quando não houver histórico válido.
4. Validar fluxo manual em `/`, `/loja`, `/produto/[slug]` e `/favoritos`.

**Estimativa**

- Esforço: baixo
- Tempo: 1–2 horas

**Risco**

- Médio: evento de clique duplicado pode mascarar o retorno e gerar falsa regressão.

### 14) Favoritos: Testes E2E de Navegação e Persistência

**Descrição**

- Criar cenários E2E para o fluxo de favoritos cobrindo persistência, toggle de header e integração com carrinho.

**Benefícios**

- Evita regressão no principal fluxo novo de UX.
- Dá segurança para evoluir header e contextos globais.

**Checklist**

- [ ] Configurar suite E2E (Playwright) para fluxo de favoritos.
- [ ] Cobrir favoritar/desfavoritar no produto.
- [ ] Cobrir navegação via ícone no header (abrir e voltar).
- [ ] Cobrir persistência após reload e ação "Adicionar ao carrinho" em `/favoritos`.

**Plano de execução da melhoria**

1. Criar dados determinísticos para cenários de favoritos.
2. Implementar spec de navegação e persistência no header.
3. Implementar spec de integração favoritos -> carrinho.
4. Rodar em CI e publicar relatório simples no PR.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Baixo: adiciona proteção sem alterar lógica de produção.

### 15) Conta do Usuário: Nav ativo e acessibilidade do formulário

**Descrição**

- Aplicar estado ativo no menu de configurações da conta.
- Corrigir acessibilidade do formulário (labels com `htmlFor` + `id`, `type="tel"`, botões dentro do form).

**Benefícios**

- Usuário entende em qual seção está.
- Formulário mais acessível e semântico.

**Checklist**

- [ ] Aplicar classe ativa baseada na rota atual.
- [ ] Ajustar `label` e `input` para IDs únicos.
- [ ] Corrigir tipos de input e posição dos botões.
- [ ] Validar navegação por teclado.

**Plano de execução da melhoria**

1. Usar `usePathname` no `TopHeader` e aplicar classe ativa no `Link` da rota atual.
2. Ajustar `SectionInfP` para IDs únicos e `type="tel"`.
3. Mover botões para dentro do `<form>` e definir `type="submit"`/`type="button"`.
4. Testar navegação por teclado e foco visível.

**Estimativa**

- Esforço: baixo
- Tempo: 1–2 horas

**Risco**

- Baixo: mudanças pontuais e isoladas.

### 16) Conta do Usuário: Padronizar rotas (kebab-case) e links do nav

**Descrição**

- Definir padrão único para rotas de conta (kebab-case recomendado).
- Atualizar links e imports para evitar mistura com `snake_case`.

**Benefícios**

- URLs mais legíveis e consistentes.
- Menos chance de erro ao digitar rotas.

**Checklist**

- [ ] Definir padrão (kebab-case).
- [ ] Renomear pastas de rotas e ajustar links do nav.
- [ ] Atualizar imports dos componentes ligados às rotas.
- [ ] Validar navegação direta nas rotas.

**Plano de execução da melhoria**

1. Mapear rotas atuais em `/account/*`.
2. Renomear para kebab-case e ajustar `TopHeader`.
3. Revisar imports e links em `Header` e páginas relacionadas.
4. Testar navegação manual nas rotas.

**Estimativa**

- Esforço: baixo
- Tempo: 1–2 horas

**Risco**

- Baixo: mudanças apenas em paths e links.

### 17) Rotas de usuário: Autenticação e autorização completa

**Descrição**

- Proteger `GET /api/users`, `POST /api/users` e `DELETE /api/users/[id]`.
- Evitar que usuários autenticados manipulem dados de terceiros.

**Benefícios**

- Reduz risco de exposição/alteração indevida de dados.
- Fluxo de API coerente com o `PUT /api/users/[id]` já protegido.

**Checklist**

- [ ] Exigir `Authorization: Bearer` nas rotas de usuário.
- [ ] Validar token com Supabase em todas as rotas.
- [ ] Restringir o escopo ao `user.id` autenticado.
- [ ] Adicionar mensagens de erro padronizadas (401/403).

**Plano de execução da melhoria**

1. Criar helper de validação do token para reutilizar nas rotas.
2. Aplicar validação em `GET`, `POST` e `DELETE`.
3. Garantir que o `id` da URL pertença ao usuário autenticado.
4. Ajustar documentação e testes manuais.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Médio: pode exigir ajustes em fluxos que hoje assumem API aberta.

### 18) Sincronização Supabase/Prisma de perfil

**Descrição**

- Manter `name`, `email` e `phone` consistentes entre Supabase e Prisma.
- Ao logar, sincronizar `user_metadata` do Supabase com o banco local.

**Benefícios**

- Evita divergência de dados entre autenticação e perfil.
- Facilita manutenção do perfil no front.

**Checklist**

- [ ] Ao `syncUser`, copiar `user_metadata.full_name` e `phone` para o Prisma.
- [ ] Ao atualizar perfil, atualizar Supabase `user_metadata` junto do Prisma.
- [ ] Definir regra para atualização de `email` (Supabase primeiro).
- [ ] Garantir fallback quando `user_metadata` não existir.

**Plano de execução da melhoria**

1. Ajustar `POST /api/syncUser` para persistir `name` e `phone` quando existir.
2. Atualizar `updateUserProfile` para escrever também em `supabase.auth.updateUser`.
3. Tratar atualização de email com fluxo seguro (ex.: confirmação por email).
4. Atualizar documentação e validar cenário de login + edição.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Médio: mudança em dados sensíveis (email) exige cautela.

### 19) Conta do usuário: UX segura para senha

**Descrição**

- Remover exibição direta de senha na UI.
- Substituir por texto informativo e ação clara de troca de senha.

**Benefícios**

- Evita confusão do usuário e exposição indevida.
- Melhora alinhamento com boas práticas de segurança.

**Checklist**

- [ ] Remover `user.password` da UI.
- [ ] Exibir máscara ou texto (“Senha protegida”).
- [ ] Garantir ação de troca de senha no formulário.

**Plano de execução da melhoria**

1. Ajustar `inf-log.jsx` para não renderizar `user.password`.
2. Inserir texto informativo e CTA para “Alterar senha”.
3. Validar fluxo no formulário de perfil.

**Estimativa**

- Esforço: baixo
- Tempo: 30–60 min

**Risco**

- Baixo: mudança apenas visual e de UX.

### 20) Endereços: validação e mensagens de erro nas APIs

**Descrição**

- Validar `label`, `street`, `city`, `state`, `zipCode` no backend.
- Retornar erros claros (400) quando faltar dados obrigatórios.

**Benefícios**

- Evita salvar dados incompletos.
- Facilita debug e melhora a UX.

**Checklist**

- [ ] Validar payload no `POST /api/addresses`.
- [ ] Validar payload no `PUT /api/addresses/[id]`.
- [ ] Retornar mensagens padronizadas por campo.

**Plano de execução da melhoria**

1. Criar função de validação (schema simples ou manual).
2. Reutilizar no `POST` e `PUT`.
3. Ajustar front para exibir erros no modal.

**Estimativa**

- Esforço: baixo
- Tempo: 1–2 horas

**Risco**

- Baixo: ajustes simples de validação.

### 21) Endereços: reset de formulário e edição segura

**Descrição**

- Garantir que o formulário seja resetado ao abrir modal.
- Evitar reutilizar estado de endereço anterior quando cria um novo.

**Benefícios**

- Evita campos com valores antigos.
- Deixa o fluxo de criação/edição mais claro para o usuário.

**Checklist**

- [ ] Resetar state do formulário quando `initialData` mudar.
- [ ] Usar `useEffect` no modal para sincronizar dados.
- [ ] Validar criação após edição.

**Plano de execução da melhoria**

1. Adicionar `useEffect` no `AddressFormModal` para resetar o form.
2. Testar editar → cancelar → criar novo.
3. Ajustar se necessário.

**Estimativa**

- Esforço: baixo
- Tempo: 30–60 min

**Risco**

- Baixo: mudança local no modal.

### 22) Endereços: feedback de loading e estado vazio

**Descrição**

- Exibir loading enquanto endereços carregam.
- Mostrar mensagem amigável quando não houver endereços.

**Benefícios**

- UX mais clara para o usuário.
- Evita “tela vazia” sem contexto.

**Checklist**

- [ ] Adicionar estado `loading` no `useAddresses`.
- [ ] Renderizar placeholder de carregamento.
- [ ] Mostrar empty state quando `addresses.length === 0`.

**Plano de execução da melhoria**

1. Adicionar estado `loading` no hook.
2. Ajustar `section-end.jsx` para mostrar loading/empty.
3. Revisar layout da lista.

**Estimativa**

- Esforço: baixo
- Tempo: 1–2 horas

**Risco**

- Baixo: mudanças simples de UI/estado.

### 23) Carteira: segurança e validações completas

**Descrição**

- Evitar armazenar número completo do cartão no banco.
- Validar `expMonth` e `expYear` no backend.
- Padronizar o endpoint de exclusão com `/api/cards/[id]`.

**Benefícios**

- Reduz risco de exposição de dados sensíveis.
- Melhora consistência entre front e API.
- Evita salvar cartões expirados ou inválidos.

**Checklist**

- [ ] Armazenar apenas `last4`, `brand` e dados de expiração no banco.
- [ ] Sanitizar `number` (remover espaços) antes de processar.
- [ ] Validar `expMonth` (1–12) e `expYear` (>= ano atual).
- [ ] Ajustar `deleteCard` para usar `DELETE /api/cards/[id]`.
- [ ] Revisar mensagens de erro e status 400/401.

**Plano de execução da melhoria**

1. Criar helper de sanitização e extrair `last4` no backend.
2. Atualizar o modelo Prisma para armazenar `last4` (se necessário) e remover o número completo.
3. Ajustar API de criação para validar expiração e persistir dados mínimos.
4. Atualizar o front para consumir `last4` e atualizar o fluxo de exclusão.

**Estimativa**

- Esforço: médio
- Tempo: 0,5–1 dia

**Risco**

- Médio: envolve mudança em schema e ajustes de API/front.

## Roadmap Visual (ASCII)

```
[Arquitetura] ---> [Footer Responsivo] ---> [Dados Centralizados]
        |                   |                      |
        v                   v                      v
   padroniza         melhora UX mobile       reduz repetição
```

## Critérios de Aceite (geral)

- A estrutura de pastas segue um padrão único.
- Footer se adapta bem a telas pequenas.
- Dados do footer estão centralizados em `data/`.

## Observações

- Cada item deve gerar PR separado para facilitar revisão.
- Sempre atualizar o `CHANGELOG.md` ao final.

## Histórico

- 2026-02-06: Documento criado.
- 2026-02-07: Adicionadas sugestões de normalização de categorias, default de filtros e limpeza de logs.
- 2026-02-11: Incluida melhoria de automacao para lock do dev server no Windows.
- 2026-02-11: Incluidas melhorias de evolucao do carrinho (totais reais e testes automatizados).
- 2026-02-12: Incluidas melhorias de favoritos (toggle de retorno no header e testes E2E).
- 2026-02-12: Incluida melhoria de conta do usuario (nav ativo e acessibilidade do formulario).
- 2026-02-13: Incluida melhoria de padronizacao das rotas de conta (kebab-case).
- 2026-02-17: Incluidas melhorias de seguranca das rotas de usuario, sincronizacao Supabase/Prisma e UX segura para senha.
- 2026-02-17: Incluidas melhorias para validacao, reset e UX do fluxo de enderecos.
- 2026-02-18: Incluida melhoria de seguranca e validacoes completas para o fluxo de carteira.
- 2026-02-24: Incluidas sugestoes de evolucao para arquitetura de auth global, testes de header/carrinho e UX de carregamento no header.
- 2026-03-06: Incluidas sugestoes de evolucao do dashboard admin apos componentizacao (edicao em rota dedicada, GET por id e E2E).
- 2026-03-07: Incluidas sugestoes de evolucao para o editor dedicado settingsProduct (contexto de retorno, skeleton, dirty state e E2E).
- 2026-03-13: Atualizadas sugestoes para listagem admin (URL com filtros, paginacao/scroll e padronizacao visual).
- 2026-03-14: Incluidas sugestoes de evolucao para scroll infinito (fallback manual, persistencia de scroll e virtualizacao).
- 2026-03-18: Incluidas sugestoes para consolidacao e documentacao da nova estrutura do dashboard admin.
- 2026-03-20: Incluidas sugestoes de evolucao para a galeria hibrida de imagens de produto.
- 2026-03-20: Incluidas sugestoes de evolucao para galerias por variante e fallback da pagina publica do produto.
- 2026-04-20: Incluidas sugestoes de evolucao para o novo layout e a manutencao do editor `settingsProduct`.
