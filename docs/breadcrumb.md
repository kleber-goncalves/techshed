# Breadcrumb

Este documento descreve o componente de trilha de navegacao criado em:
- `src/components/componets-page-produto/Breadcrumb.jsx`

## Objetivo
- Exibir o caminho de navegacao da pagina.
- Facilitar retorno para niveis anteriores (ex: Loja).

## Estrutura do componente
Arquivo principal:
- `src/components/componets-page-produto/Breadcrumb.jsx`

## Props disponiveis
- `items` (array obrigatorio)
  - Lista de itens do breadcrumb.
  - Cada item: `{ label, href }`.
  - O ultimo item e renderizado como texto (sem link).

## Exemplo de uso
```jsx
import Breadcrumb from "@/components/componets-page-produto/Breadcrumb";

<Breadcrumb
  items={[
    { label: "Inicio", href: "/" },
    { label: "Loja", href: "/loja" },
    { label: produto.name, href: `/produto/${produto.slug}` },
  ]}
/>
```

## Acessibilidade e UX
- Usa `nav` + `ol` para estrutura semantica.
- Separador `>` entre itens, exceto o ultimo.

## Observacoes
- `item.href` e usado como `key`, entao os `href` devem ser unicos.
