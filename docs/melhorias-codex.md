# Plano de Melhorias do Projeto (Codex + Kleber)

Este documento registra **as próximas melhorias planejadas** para o projeto.
Ele serve como checklist de execução e memória de decisões, para não esquecermos o que foi combinado.

Última atualização: 2026-02-11
Branch: `fix/next-erro`

## Visão Geral
Objetivo: evoluir a estrutura do projeto e a qualidade do UI/UX de forma organizada e rastreável.

### Animação Gráfica (linha do tempo)
```
Ideia ──> Planejamento ──> Implementação ──> Revisão ──> PR ──> Deploy
   •           •                 •                •         •       •
```

## Melhorias Prioritárias

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
