# Documentação: Categorias, Nav e Produtos

Este documento explica, de forma detalhada e profissional, como **a navegação por categorias** funciona, como os **produtos são estruturados** e como a **rota dinâmica** `/categoria/[categoria]` resolve e exibe os itens.

Arquivos cobertos:
- `src/app/categoria/[categoria]/page.jsx`
- `src/components/nav.jsx`
- `src/data/produtos.js`
- `src/data/categories.js`

Última atualização: 2026-02-06

## 1) Visão Geral do Fluxo
A navegação parte do `nav`, passa pela rota dinâmica e chega ao filtro de produtos:

```
Usuário -> Nav -> /categoria/{slug} -> slugMap -> produtos -> renderização
```

## 2) Responsabilidade de Cada Arquivo

### `src/components/nav.jsx`
Função:
- Exibe os links das categorias.
- Cada link aponta para `/categoria/{slug}`.
- As categorias vêm de `navCategories` (arquivo centralizado).

O que ele garante:
- Usuário sempre entra por um slug conhecido.
- A URL carrega a categoria como parte da rota.

### `src/app/categoria/[categoria]/page.jsx`
Função:
- Recebe o parâmetro da URL (`params.categoria`).
- Normaliza o slug (lowercase e trim).
- Mapeia variações de slug para a chave correta dos produtos usando `categorySlugMap`.
- Busca produtos e renderiza `ProductCard`.

Tratamento importante:
- `params` é uma Promise no Next, então usa `await params`.

### `src/data/produtos.js`
Função:
- Fonte única de dados.
- Exporta um objeto com **chaves de categorias**.
- Cada chave contém uma **lista de produtos**.

### `src/data/categories.js`
Função:
- Centraliza regras de categorias.
- Exporta:
  - `categorySlugMap`: normalização de slugs para a chave do catálogo.
  - `navCategories`: lista para renderizar o menu de categorias.

## 3) Resolução de Categoria (Como o slug vira lista)

Processo atual:
1. Recebe o slug da URL.
2. Normaliza o texto.
3. Converte variações para uma chave canônica (`categorySlugMap`).
4. Busca direto por chave (`produtos[key]`).
5. Se não existir, faz fallback por `category`.

Trecho principal (resumo):
```
slug -> slugMap -> key
produtos[key] -> lista final
```

## 4) Mapeamento de Slugs (categorySlugMap)

Tabela de exemplos:

| Slug na URL | Chave em `produtos` |
| --- | --- |
| `desktop` | `desktops` |
| `desktops` | `desktops` |
| `tablet` | `tablets` |
| `tablets` | `tablets` |
| `camera` | `cameras` |
| `cameras` | `cameras` |
| `drone` | `quadcopters` |
| `drones` | `quadcopters` |
| `quadcopter` | `quadcopters` |
| `quadcopters` | `quadcopters` |
| `audio` | `autofalantes` |
| `autofalante` | `autofalantes` |
| `autofalantes` | `autofalantes` |
| `mobile` | `celulares` |
| `celular` | `celulares` |
| `celulares` | `celulares` |
| `smartstv` | `smartstv` |
| `tv` | `smartstv` |
| `tv-e-home-theater` | `smartstv` |
| `smartwatch` | `smartwatch` |
| `tecnologias-vestiveis` | `smartwatch` |

## 5) Estrutura dos Produtos (Schema)

Cada produto segue este modelo:
```
{
  id: string,
  slug: string,
  name: string,
  img: string,
  alt: string,
  priceCents: number,
  stock: number,
  category: string,
  features: array,
  promocao?: string,
  colors?: array
}
```

Observação:
- O arquivo contém **chaves por categoria** e também o campo `category` dentro de cada item.
- Alguns valores de `category` são abreviados ou no singular (ex.: `celulare`, `headse`, `smartst`).
- Por isso o fallback do filtro por `category` é essencial.

## 6) Casos de Erro e Comportamento

Se nenhuma categoria é encontrada:
- A página exibe: “Nenhum produto encontrado”.

Se o slug não existe no `slugMap`:
- O sistema tenta filtrar por `category`.

Se ainda assim não houver produtos:
- Exibe a mensagem de vazio.

## 7) Animações Gráficas (Fluxo Visual)

### Animação 1: Caminho da Categoria
```
Frame 1: Usuário clica no Nav
Frame 2: URL /categoria/{slug}
Frame 3: slugMap resolve a chave
Frame 4: Produtos renderizados
```

### Animação 2: Caminho de Fallback
```
Frame 1: slug não está no mapa
Frame 2: filtro por category
Frame 3: lista final aparece (ou vazio)
```

### Animação 3: Pipeline Completo
```
Nav -> Rota -> slug -> slugMap -> produtos[key] -> ProductCard
```

## 7.1) Diagrama Extra: Categorias Atuais do `produtos.js`

```
produtos.js
├─ celulares
├─ tablets
├─ cameras
├─ autofalantes
├─ desktops
├─ headset
├─ laptops
├─ monitores
├─ oculosvr
├─ projetores
├─ quadcopters
├─ smartstv
└─ smartwatch
```

## 8) Recomendações Técnicas (Sem mudança obrigatória)

Recomendação 1:
- Unificar valores de `category` e chaves de `produtos` para reduzir o uso de fallback.

Recomendação 2:
- Centralizar `categorySlugMap` em um arquivo de config, para reuso e consistência. (Implementado)

Recomendação 3:
- Criar uma página de erro 404 customizada para slugs inválidos.
