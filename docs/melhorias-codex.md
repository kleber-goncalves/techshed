# Plano de Melhorias do Projeto (Codex + Kleber)

Este documento registra **as próximas melhorias planejadas** para o projeto.
Ele serve como checklist de execução e memória de decisões, para não esquecermos o que foi combinado.

Última atualização: 2026-02-06
Branch: `plan/melhorias-projeto`

## Visão Geral
Objetivo: evoluir a estrutura do projeto e a qualidade do UI/UX de forma organizada e rastreável.

### Animação Gráfica (linha do tempo)
```
Ideia ──> Planejamento ──> Implementação ──> Revisão ──> PR ──> Deploy
   •           •                 •                •         •       •
```

## Melhorias Prioritárias

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

**Risco**
- Baixo: refatoração simples.

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
