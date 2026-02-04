# Slider de Produtos (Swiper)

Este documento descreve o componente reutilizavel de carrossel de produtos criado em:
- `src/components/componets-page-produto/slide.jsx`

Ele usa Swiper para exibir cards de produtos com navegacao e paginacao.

## Objetivo
- Exibir produtos em formato de carrossel.
- Mostrar ate 3 produtos por vez no desktop (responsivo: 1/2/3).
- Permitir reuso em qualquer pagina da loja.

## Estrutura do componente
Arquivo principal:
- `src/components/componets-page-produto/slide.jsx`

Estilos escopados:
- `src/components/componets-page-produto/slide.module.css`

Componentes e dados reutilizados:
- `src/components/components-loja/ProductCard.jsx`
- `src/data/produtos.js`

## Props disponiveis
- `items` (array opcional)
  - Lista de produtos a exibir.
  - Se nao for passada, usa `Object.values(produtos).flat()` para pegar todos os produtos.
- `title` (string opcional)
  - Titulo exibido acima do slider.
- `maxPerView` (number opcional, default: `3`)
  - Limite maximo de itens visiveis por vez.

## Exemplo de uso
```jsx
import ProductSlider from "@/components/componets-page-produto/slide";

export default function Home() {
    return (
        <section className="px-6">
            <ProductSlider title="Produtos em destaque" />
        </section>
    );
}
```

Com lista customizada:
```jsx
import ProductSlider from "@/components/componets-page-produto/slide";
import { produtos } from "@/data/produtos";

const apenasTablets = produtos.tablets;

export default function Home() {
    return <ProductSlider title="Tablets" items={apenasTablets} />;
}
```

## Fluxo de dados
```
produtos.js
   |
   v
ProductSlider -> ProductCard -> Next Image / Link
```

## Acessibilidade e UX
- Navegacao por teclado habilitada (Keyboard).
- Paginacao clicavel.
- O cursor muda para "grab" no carrossel.
- Os botoes de navegacao ficam nas laterais do carrossel, fora da area dos cards.

## Estilos
O Swiper recebe estilos escopados via CSS Module em:
- `src/components/componets-page-produto/slide.module.css`

O estilo cobre:
- Botoes de navegacao laterais com visual inspirado no Mercado Livre (amarelo + azul), gradiente, sombra e estados de hover/disabled.
- Pontos de paginacao (cor e estado ativo).

## Observacoes
- Este componente nao esta integrado em nenhuma pagina por padrao.
- Reutiliza o `ProductCard` para manter consistencia visual.
- Depende do pacote `swiper` instalado no projeto.
