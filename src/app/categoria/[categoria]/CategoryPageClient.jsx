"use client";

import { useMemo, useState } from "react";

import ProductCard from "@/components/components-loja/ProductCard";
import FiltersSidebar from "@/components/components-loja/filtro/FiltersSidebar";
import { applyFilters } from "@/lib/applyFilters";
import { applySort } from "@/lib/applySort";
import SortSelect from "@/components/components-loja/filtro/SortSelect";

const DEFAULT_FILTERS = {
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: 1000000,
    onlyInStock: false,
    onlyNew: false,
    minRating: 0,
    features: [],
};

export default function CategoryPageClient({ produtos, filtersData, title }) {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [sort, setSort] = useState("relevance");

    const produtosFiltrados = useMemo(
        () => applyFilters(produtos, filters),
        [produtos, filters],
    );
    const produtosOrdenados = useMemo(
        () => applySort(produtosFiltrados, sort),
        [produtosFiltrados, sort],
    );

    return (
        <section className="py-25 flex flex-col items-center gap-14 dark:bg-black">
            <h1 className="text-5xl font-semibold dark:text-white">{title}</h1>

            <section className="flex flex-row w-full justify-center gap-10">
                <FiltersSidebar
                    filters={filters}
                    setFilters={setFilters}
                    enabled={["price", "rating", "stock", "features"]}
                    data={filtersData}
                    className="md:w-64 p-4 border rounded-lg space-y-6 text-black"
                />
                <section className="">
                    <SortSelect sort={sort} setSort={setSort} />
                    <section className="grid grid-cols-4 gap-6">
                        {produtosOrdenados.map((produto) => (
                            <ProductCard key={produto.id} produto={produto} />
                        ))}
                    </section>
                </section>
            </section>
        </section>
    );
}
