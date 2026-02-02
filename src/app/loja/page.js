"use client";

import { useState } from "react";

import ProductCard from "@/components/components-loja/ProductCard";
import { produtos } from "@/data/produtos";

import FiltersSidebar from "@/components/components-loja/filtro/FiltersSidebar";
import { applyFilters } from "@/lib/applyFilters";

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

    // Aqui o filtro é aplicado corretamente
    const produtosFiltrados = applyFilters(listaCompleta, filters);

    return (
        <section className="flex flex-col items-center gap-14 dark:bg-black">
            <h1 className="text-5xl font-semibold dark:text-white">
                Todos os produtos
            </h1>
            <section className="flex flex-row w-full justify-center bg-red-300 gap-10">
                <FiltersSidebar
                    filters={filters}
                    setFilters={setFilters}
                    className="md:w-64 p-4 border rounded-lg space-y-6 bg-red-300 text-black"
                />
                <section className="grid grid-cols-4 gap-6 bg-green-400">
                    {/* ERRO ESTAVA AQUI: Você estava usando 'todosProdutos'. Mudei para 'produtosFiltrados' */}
                    {produtosFiltrados.length > 0 ? (
                        produtosFiltrados.map((produto) => (
                            <ProductCard key={produto.id} produto={produto} />
                        ))
                    ) : (
                        <p className="col-span-4 text-center p-10 font-bold">
                            Nenhum produto encontrado nessa categoria.
                        </p>
                    )}
                </section>
            </section>
        </section>
    );
}
