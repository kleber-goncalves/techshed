"use client";


import { useState } from "react";

import ProductCard from "@/components/components-loja/ProductCard";
import { produtos } from "@/data/produtos";

import FiltersSidebar from "@/components/components-loja/filtro/FiltersSidebar";
import { applyFilters } from "@/lib/applyFilters";

export default function Loja() {
    const todosProdutos = Object.values(produtos).flat();
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

      const produtosFiltrados = applyFilters(
          Object.values(produtos).flat(),
          filters,
      );

    return (
        <section className="flex flex-col items-center gap-14">
            <h1 className="text-5xl text-black font-semibold">
                Todos os produtos
            </h1>
            <section className="flex flex-row">
                <FiltersSidebar filters={filters} setFilters={setFilters} className="w-full md:w-64 p-4 border rounded-lg space-y-6 bg-red-300 text-black"/>
                <section className="grid grid-cols-4 gap-6">
                    {todosProdutos.map((produto) => (
                        <ProductCard key={produto.id} produto={produto} />
                    ))}
                </section>
            </section>
        </section>
    );
}