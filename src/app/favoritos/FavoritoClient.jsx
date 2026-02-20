"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useFavorite } from "@/contexts/favorit-context";
import { formatCurrency } from "@/lib/formatCurrency";

export default function FavoritoClient() {
    const router = useRouter();
    const { addItem } = useCart();
    const { items, isEmpty, isReady, removeFavorite, clearFavorites } =
        useFavorite();

    function handleBack() {
        if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
        }

        router.push("/loja");
    }

    function handleAddToCart(productId) {
        addItem({ productId, variantId: null, quantity: 1 });
    }

    // Loading
    if (!isReady) {
        return <p>Carregando favoritos...</p>;
    }

    // se não tiver favoritos
    if (isEmpty) {
        return (
            <section className="py-25 px-6 md:px-20 min-h-[60vh] dark:bg-black flex flex-col items-center justify-center gap-6">
                <Button
                    variant="ghost"
                    className="self-start flex items-center gap-2"
                    onClick={handleBack}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Button>
                <h1 className="text-4xl font-semibold dark:text-white">
                    Você ainda não tem favoritos
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-xl">
                    Favorite produtos para encontrá-los rapidamente depois.
                </p>
                <Link href="/loja">
                    <Button size="lg">Explorar produtos</Button>
                </Link>
            </section>
        );
    }

    return (
        <section className="py-25 px-6 md:px-20 dark:bg-black min-h-[60vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Button>
                    <h1 className="text-4xl font-semibold dark:text-white">
                        Meus favoritos
                    </h1>
                </div>
                <Button variant="outline" onClick={clearFavorites}>
                    Limpar favoritos
                </Button>
            </div>

            <section className="flex flex-col gap-4">
                {items.map((item) => {
                    const isOutOfStock = item.stock <= 0;

                    return (
                        <article
                            key={item.id}
                            className="border rounded-2xl p-4 bg-white dark:bg-neutral-900 dark:border-neutral-700 flex flex-col md:flex-row gap-4"
                        >
                            <div className="shrink-0 w-28 h-28 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                                <Image
                                    src={item.img}
                                    alt={item.alt || item.name}
                                    width={112}
                                    height={112}
                                    className="object-contain"
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-semibold dark:text-white">
                                        {item.name}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {formatCurrency(item.priceCents)}
                                    </p>
                                    <p
                                        className={`text-sm ${
                                            isOutOfStock
                                                ? "text-red-600"
                                                : "text-gray-600 dark:text-gray-300"
                                        }`}
                                    >
                                        {isOutOfStock
                                            ? "Sem estoque no momento"
                                            : `Em estoque: ${item.stock}`}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Link href={`/produto/${item.slug}`}>
                                        <Button variant="outline">
                                            Ver produto
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleAddToCart(item.id)}
                                        disabled={isOutOfStock}
                                    >
                                        Adicionar ao carrinho
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        onClick={() => removeFavorite(item.id)}
                                    >
                                        Remover dos favoritos
                                    </Button>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </section>
        </section>
    );
}
