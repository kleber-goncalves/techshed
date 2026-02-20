"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/formatCurrency";
import { getCartBackPath } from "@/lib/cartReturnPath";

export default function CarrinhoClient() {
    const router = useRouter();
    const {
        items,
        isEmpty,
        isReady,
        subtotalCents,
        setItemQuantity,
        removeItem,
        clearCart,
    } = useCart();

    function handleBack() {
        router.push(getCartBackPath());
    }

    if (!isReady) {
        return (
            <section className="py-25 px-6 md:px-20 min-h-[60vh] dark:bg-black flex items-center justify-center">
                <p>Carregando carrinho...</p>
            </section>
        );
    }

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
                    Seu carrinho está vazio
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-xl">
                    Adicione produtos para continuar com sua compra.
                </p>
                <Link href="/loja">
                    <Button size="lg">Continuar comprando</Button>
                </Link>
            </section>
        );
    }

    return (
        <section className="py-25 px-6 md:px-20 dark:bg-black min-h-[60vh]">
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
                        Meu carrinho
                    </h1>
                </div>
                <Button variant="outline" onClick={clearCart}>
                    Limpar carrinho
                </Button>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                <div className="flex flex-col gap-4">
                    {items.map((item) => (
                        <article
                            key={item.lineKey}
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
                                    {item.colorName && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                            <span
                                                className="w-3 h-3 rounded-full border border-black/20"
                                                style={
                                                    item.colorHex
                                                        ? {
                                                              backgroundColor:
                                                                  item.colorHex,
                                                          }
                                                        : undefined
                                                }
                                            />
                                            Cor: {item.colorName}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Preço unitário:{" "}
                                        {formatCurrency(item.unitPriceCents)}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center border rounded-md overflow-hidden dark:border-neutral-600">
                                        <button
                                            type="button"
                                            className="w-9 h-9 disabled:opacity-40 cursor-pointer"
                                            disabled={item.quantity <= 1}
                                            onClick={() =>
                                                setItemQuantity({
                                                    lineKey: item.lineKey,
                                                    quantity: item.quantity - 1,
                                                })
                                            }
                                        >
                                            −
                                        </button>
                                        <span className="min-w-10 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            className="w-9 h-9 disabled:opacity-40 cursor-pointer"
                                            disabled={item.quantity >= item.stock}
                                            onClick={() =>
                                                setItemQuantity({
                                                    lineKey: item.lineKey,
                                                    quantity: item.quantity + 1,
                                                })
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Máximo em estoque: {item.stock}
                                    </p>

                                    <Button
                                        variant="ghost"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                        onClick={() => removeItem(item.lineKey)}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            </div>

                            <div className="md:ml-auto flex flex-col justify-between items-start md:items-end">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Subtotal
                                </p>
                                <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                                    {formatCurrency(item.lineSubtotalCents)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <aside className="h-fit border rounded-2xl p-5 bg-white dark:bg-neutral-900 dark:border-neutral-700 flex flex-col gap-4">
                    <h2 className="text-xl font-semibold dark:text-white">
                        Resumo do pedido
                    </h2>

                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-300">
                            Subtotal
                        </span>
                        <span className="font-medium dark:text-white">
                            {formatCurrency(subtotalCents)}
                        </span>
                    </div>

                    <div className="h-px bg-gray-200 dark:bg-neutral-700" />

                    <div className="flex items-center justify-between text-lg">
                        <span className="font-semibold dark:text-white">Total</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(subtotalCents)}
                        </span>
                    </div>

                    <Button className="w-full" disabled>
                        Finalizar compra (em breve)
                    </Button>

                    <Link href="/loja" className="w-full">
                        <Button variant="outline" className="w-full">
                            Continuar comprando
                        </Button>
                    </Link>
                </aside>
            </section>
        </section>
    );
}
