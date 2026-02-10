"use client";

import { useRouter } from "next/navigation";
import ProductCard from "@/components/components-loja/ProductCard";
import { Button } from "@/components/ui/button";

export default function SearchResults({
    results,
    query,
    onClose,
    allowEmptyQuery = false,
}) {
    const router = useRouter(); // ✅ TOPO

    const safeResults = Array.isArray(results) ? results : [];
    const trimmedQuery = query?.trim() ?? "";
    const hasMore = trimmedQuery && safeResults.length > 3;

    if ((!trimmedQuery && !allowEmptyQuery) || safeResults.length === 0) {
        return null;
    }

    function handleMostrarMais() {
        router.push(`/busca?q=${encodeURIComponent(trimmedQuery)}`);
        onClose?.();
    }

    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
                {safeResults.slice(0, 3).map((produto) => (
                    <ProductCard
                        key={produto.id}
                        produto={produto}
                        onClick={onClose} // fecha ao clicar no card
                        noMaxWidth
                    />
                ))}
            </div>

            {hasMore ? (
                <Button
                    type="button"
                    onClick={handleMostrarMais}
                    variant="meu2"
                    className="cursor-pointer transition-all ease-in-out duration-300 self-end rounded-2xl px-12 py-2 text-lg font-semibold bg-white text-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:hover:bg-white! dark:hover:text-black!"
                >
                    Mostrar mais
                </Button>
            ) : null}
        </div>
    );
}
