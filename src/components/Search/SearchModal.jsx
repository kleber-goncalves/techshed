"use client";

import { useMemo, useState } from "react";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import { produtos } from "@/data/produtos";

export default function SearchModal({ onClose }) {
    const [search, setSearch] = useState("");

    const listaCompleta = useMemo(() => Object.values(produtos).flat(), []);
    const normalizedSearch = search.trim().toLowerCase();
    const showSuggestions = !normalizedSearch;
    const resultados = useMemo(() => {
        if (showSuggestions) {
            return listaCompleta.slice(0, 3);
        }
        return listaCompleta.filter((produto) =>
            produto.name.toLowerCase().includes(normalizedSearch),
        );
    }, [listaCompleta, normalizedSearch, showSuggestions]);

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center ">
            <div className="bg-white dark:bg-black w-full px-40 rounded-lg py-13">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Buscar produtos</h2>
                    <button
                        className="cursor-pointer text-2xl"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <div className="flex flex-col gap-12">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Buscar produtos..."
                        className="hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-lg dark:hover:shadow-neutral-800 dark:hover:border dark:hover:border-white/70  transition-all ease-in-out duration-500"
                    />

                    <SearchResults
                        results={resultados}
                        query={search}
                        onClose={onClose}
                        allowEmptyQuery={showSuggestions}
                    />
                </div>
            </div>
        </div>
    );
}
