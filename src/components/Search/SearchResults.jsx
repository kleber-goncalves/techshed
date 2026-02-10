"use client";

import { useRouter } from "next/navigation";
import ProductCard from "@/components/components-loja/ProductCard";

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
                    />
                ))}
            </div>

            {hasMore ? (
                <button
                    onClick={handleMostrarMais}
                    className="text-sm text-blue-500 hover:underline self-end"
                >
                    Mostrar mais
                </button>
            ) : null}
        </div>
    );
}
