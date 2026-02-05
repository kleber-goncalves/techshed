"use client";

import { useState } from "react";

import ProductCard from "@/components/components-loja/ProductCard";
import { produtos } from "@/data/produtos";

import FiltersSidebar from "@/components/components-loja/filtro/FiltersSidebar";
import { applyFilters } from "@/lib/applyFilters";
import { applySort } from "@/lib/applySort";
import SortSelect from "@/components/components-loja/filtro/SortSelect";

export default function Loja() {
    const listaCompleta = Object.values(produtos).flat();
    const [filters, setFilters] = useState({
        search: "",
        category: "all",
        minPrice: 0,
        maxPrice: 1000000,
        onlyInStock: false,
        onlyNew: false,
        minRating: 0,
        features: [],
    });
    const [sort, setSort] = useState("az");
  
    const produtosFiltrados = applyFilters(listaCompleta, filters);

    const produtosOrdenados = applySort(produtosFiltrados, sort);

    return (
        <section className="py-25 flex flex-col items-center gap-14 dark:bg-black">
            <h1 className="text-5xl font-semibold dark:text-white">
                Todos os produtos
            </h1>
            <section className="flex flex-row w-full justify-center gap-10">
                <FiltersSidebar
                    filters={filters}
                    setFilters={setFilters}
                    className="md:w-64 p-4 border rounded-lg space-y-6  text-black"
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
                                Nenhum produto encontrado nessa categoria.
                            </p>
                        )}
                    </section>
                </section>
            </section>
        </section>
    );
}
