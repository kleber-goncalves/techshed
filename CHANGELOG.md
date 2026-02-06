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

2026-02-06  v0.1.0  ──────────•  Ajustes iniciais do produto
2026-02-01  v0.0.9  ───────•     Preparação para UI/UX
2026-01-25  v0.0.8  ───•         Estrutura base do projeto

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
