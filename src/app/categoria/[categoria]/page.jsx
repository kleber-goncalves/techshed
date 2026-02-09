

import { produtos } from "@/data/produtos";
import { categorySlugMap, navCategories } from "@/data/categories";

import CategoryPageClient from "./CategoryPageClient";

export default async function Categoria({ params }) {
    const { categoria } = await params;
    const slug = String(categoria || "")
        .toLowerCase()
        .trim();
    const key = categorySlugMap[slug] ?? slug;
    const categoryLabel =
        navCategories.find(
            (categoria) => categoria.slug === key || categoria.slug === slug,
        )?.label ?? slug;

    const listaCompleta = Object.values(produtos).flat();
    const listaPorChave = produtos[key];

    const produtosCategoria = Array.isArray(listaPorChave)
        ? listaPorChave
        : listaCompleta.filter(
              (produto) =>
                  produto.category === slug || produto.category === key,
          );

    if (produtosCategoria.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-xl">Nenhum produto encontrado</h1>
            </div>
        );
    }

    const features = [
        ...new Set(
            produtosCategoria.flatMap((produto) => produto.features || []),
        ),
    ];

    const priceCentsList = produtosCategoria.map(
        (produto) => produto.priceCents ?? 0,
    );
    const minPriceCents = Math.min(...priceCentsList);
    const maxPriceCents = Math.max(...priceCentsList);
    const filtersData = {
        features,
        minLimit: Math.floor(minPriceCents / 100),
        maxLimit: Math.ceil(maxPriceCents / 100),
    };

    return (
        <CategoryPageClient
            produtos={produtosCategoria}
            filtersData={filtersData}
            title={categoryLabel}
        />
    );
}
