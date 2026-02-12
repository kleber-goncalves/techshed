"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import VariantsButton from "@/components/componets-page-produto/variants-btn";
import VariantsImg from "@/components/componets-page-produto/variants-img";
import QuantitySelector from "@/components/componets-page-produto/QuantitySelector";
import { ProductAccordion } from "@/components/componets-page-produto/acordion";
import ProductSlider from "@/components/componets-page-produto/slide";
import Breadcrumb from "@/components/componets-page-produto/Breadcrumb";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency } from "@/lib/formatCurrency";
import IconFavorit from "@/components/componets-page-produto/iconFavorito";

export default function ProdutoClient({ produto }) {
    const router = useRouter();
    const { addItem } = useCart();

    // Verificamos se existem cores definidas no produto
    const hasColors = produto.colors && produto.colors.length > 0;

    // Estado inicial seguro: Se tiver cores, usa a primeira. Se não, usa a imagem principal do produto.
    const [imagemAtiva, setImagemAtiva] = useState(
        hasColors ? produto.colors[0].img : produto.img,
    );

    // Estado da cor ativa (null se não houver cores)
    const [corAtiva, setCorAtiva] = useState(
        hasColors ? produto.colors[0].id : null,
    );
    const [quantity, setQuantity] = useState(1);

    const selectedVariant = useMemo(() => {
        if (!hasColors) return null;
        return (
            produto.colors.find((color) => color.id === corAtiva) ??
            produto.colors[0]
        );
    }, [corAtiva, hasColors, produto.colors]);

    const availableStock = useMemo(() => {
        const rawStock = selectedVariant?.stock ?? produto.stock ?? 0;
        const parsedStock = Number(rawStock);
        return Number.isFinite(parsedStock) ? Math.max(0, parsedStock) : 0;
    }, [produto.stock, selectedVariant?.stock]);

    const displayPriceCents =
        selectedVariant?.priceCents ?? produto.priceCents ?? 0;

    const clampedQuantity =
        availableStock > 0 ? Math.min(quantity, availableStock) : 1;

    function handleAddToCart() {
        if (availableStock <= 0) return;

        addItem({
            productId: produto.id,
            variantId: selectedVariant?.id ?? null,
            quantity: clampedQuantity,
        });
    }

    function handleBuyNow() {
        if (availableStock <= 0) return;

        addItem({
            productId: produto.id,
            variantId: selectedVariant?.id ?? null,
            quantity: clampedQuantity,
        });
        router.push("/carrinho");
    }

    return (
        <section className="py-25 h-full flex flex-col gap-23">
            <section className="px-73">
                <Breadcrumb
                    items={[
                        { label: "Início", href: "/" },
                        { label: "Loja", href: "/loja" },
                        {
                            label: produto.name,
                            href: `/produto/${produto.slug}`,
                        },
                    ]}
                />
                <section className="grid grid-cols-2 dark:bg-neutral-800 gap-6 dark:gap-0 rounded-2xl">
                    <section className="flex flex-col items-end  h-fit gap-4 dark:p-6">
                        <div className="gap-2 flex flex-col">
                            <div className=" bg-gray-400 border  border-black">
                                {imagemAtiva && (
                                    <Image
                                        src={imagemAtiva}
                                        alt={produto.name}
                                        width={900}
                                        height={900}
                                        className=" border border-black"
                                    />
                                )}
                            </div>
                            {/* Só renderiza a galeria de variantes se o produto tiver cores */}
                            {hasColors && (
                                <div className="flex flex-row w-full">
                                    <VariantsImg
                                        produto={produto}
                                        imagemAtiva={imagemAtiva}
                                        setImagemAtiva={setImagemAtiva}
                                        corAtiva={corAtiva}
                                        setCorAtiva={setCorAtiva}
                                        ClassBase=""
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-black dark:text-white">
                                Sou uma descrição do produto. Este é um ótimo
                                lugar para vender seu produto e chamar a atenção
                                dos visitantes. Descreva seu produto de forma
                                clara e concisa, use palavras-chave exclusivas e
                                mostre seu diferencial.
                            </p>
                        </div>
                    </section>

                    <section className="flex flex-col  gap-8 h-fit dark:p-6">
                        <div className="flex flex-row items-center justify-between">
   <h1 className="text-3xl font-semibold dark:text-white ">
                            {produto.name}
                        </h1>
                        <IconFavorit productId={produto.id} />
                        </div>
                     
                        <section className="flex flex-col w-full justify-center gap-10">
                            <p className="text-3xl text-green-600 dark:text-green-400">
                                {formatCurrency(displayPriceCents)}
                            </p>
                            {/* variação de cores */}
                            {/* Só renderiza botões de cor se houver cores */}

                            {hasColors && (
                                <div className="flex flex-col ">
                                    <VariantsButton
                                        produto={produto}
                                        imagemAtiva={imagemAtiva}
                                        setImagemAtiva={setImagemAtiva}
                                        corAtiva={corAtiva}
                                        setCorAtiva={setCorAtiva}
                                        ClassBase=""
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <p>Quantidade</p>
                                <div id="contador">
                                    <QuantitySelector
                                        quantity={clampedQuantity}
                                        setQuantity={setQuantity}
                                        max={Math.max(1, availableStock)}
                                    />
                                    {availableStock > 0 &&
                                        clampedQuantity >= availableStock && (
                                        <p className="text-sm text-red-600">
                                            Limite máximo de estoque atingido
                                        </p>
                                    )}
                                    {availableStock === 0 && (
                                        <p className="text-sm text-red-600">
                                            Produto indisponível no momento
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col w-full gap-2">
                                <Button
                                    variant="addCart"
                                    size="xl"
                                    onClick={handleAddToCart}
                                    disabled={availableStock <= 0}
                                >
                                    Adicionar ao carrinho
                                </Button>
                                <Button
                                    variant="buy"
                                    size="xxl"
                                    onClick={handleBuyNow}
                                    disabled={availableStock <= 0}
                                >
                                    Comprar
                                </Button>
                            </div>

                            <ProductAccordion product={produto} />
                        </section>
                    </section>
                </section>
            </section>

            <section className="px-50">
                <ProductSlider />
            </section>
        </section>
    );
}
