"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FiltersSidebar from "@/components/components-loja/filtro/FiltersSidebar";
import ProductCard from "@/components/components-loja/ProductCard";
import SortSelect from "@/components/components-loja/filtro/SortSelect";
import SearchInput from "@/components/Search/SearchInput";
import { applyFilters } from "@/lib/applyFilters";
import { applySort } from "@/lib/applySort";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

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

export default function SearchPageClient({
    produtos,
    filtersData,
    initialQuery = "",
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchParamsString = searchParams.toString();

    const [filters, setFilters] = useState(() => ({
        ...DEFAULT_FILTERS,
        search: initialQuery,
    }));
    const [sort, setSort] = useState("relevance");

    const debouncedSearch = useDebouncedValue(filters.search, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const currentQuery = params.get("q") ?? "";
        const nextQuery = debouncedSearch.trim();

        if (currentQuery === nextQuery) return;

        if (nextQuery) {
            params.set("q", nextQuery);
        } else {
            params.delete("q");
        }

        const nextParams = params.toString();
        router.replace(`/busca${nextParams ? `?${nextParams}` : ""}`, {
            scroll: false,
        });
    }, [debouncedSearch, router, searchParamsString]);

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
            <h1 className="text-5xl font-semibold dark:text-white">
                Resultados da busca
            </h1>

            <div className="w-full max-w-3xl px-6">
                <SearchInput
                    value={filters.search}
                    onChange={(value) =>
                        setFilters((prev) => ({ ...prev, search: value }))
                    }
                    placeholder="Buscar produtos..."
                />
            </div>

            <section className="flex flex-row w-full justify-center gap-10">
                <FiltersSidebar
                    filters={filters}
                    setFilters={setFilters}
                    enabled={["price", "rating", "stock", "features"]}
                    data={filtersData}
                    className="md:w-64 p-4 border rounded-lg space-y-6 text-black"
                />
                <section>
                    <SortSelect sort={sort} setSort={setSort} />
                    <section className="grid grid-cols-4 gap-6">
                        {produtosOrdenados.length > 0 ? (
                            produtosOrdenados.map((produto) => (
                                <ProductCard
                                    key={produto.id}
                                    produto={produto}
                                />
                            ))
                        ) : (
                            <p className="col-span-4 text-center p-10 font-bold">
                                Nenhum produto encontrado para essa busca.
                            </p>
                        )}
                    </section>
                </section>
            </section>
        </section>
    );
}
