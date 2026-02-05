"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import VariantsButton from "@/components/componets-page-produto/variants-btn";
import VariantsImg from "@/components/componets-page-produto/variants-img";
import QuantitySelector from "@/components/componets-page-produto/QuantitySelector";
import { ProductAccordion } from "@/components/componets-page-produto/acordion";
import ProductSlider from "@/components/componets-page-produto/slide";
import Breadcrumb from "@/components/componets-page-produto/Breadcrumb";

export default function ProdutoClient({ produto }) {
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

    return (
        <section className="h-full flex flex-col gap-23">
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
                <section className="grid grid-cols-2 gap-2  ">
                    <section className="flex flex-col items-end  h-fit gap-4">
                        <div className=" bg-gray-400 border">
                            {imagemAtiva && (
                                <Image
                                    src={imagemAtiva}
                                    alt={produto.name}
                                    width={900}
                                    height={900}
                                />
                            )}
                        </div>
                        {/* Só renderiza a galeria de variantes se o produto tiver cores */}
                        {hasColors && (
                            <div className="flex flex-row w-full bg-green-400">
                                <VariantsImg
                                    produto={produto}
                                    imagemAtiva={imagemAtiva}
                                    setImagemAtiva={setImagemAtiva}
                                    corAtiva={corAtiva}
                                    setCorAtiva={setCorAtiva}
                                    ClassBase="bg-red-100"
                                />
                            </div>
                        )}

                        <div>
                            <p className="text-black">
                                Sou uma descrição do produto. Este é um ótimo
                                lugar para vender seu produto e chamar a atenção
                                dos visitantes. Descreva seu produto de forma
                                clara e concisa, use palavras-chave exclusivas e
                                mostre seu diferencial.
                            </p>
                        </div>
                    </section>

                    <section className="flex flex-col  gap-8 h-fit">
                        <h1 className="text-3xl font-semibold dark:text-white max-w-xs">
                            {produto.name}
                        </h1>
                        <section className="flex flex-col w-full justify-center gap-3">
                            <p className="text-xl text-green-600">
                                R$ {(produto.priceCents / 100).toFixed(2)}
                            </p>
                            {/* variação de cores */}
                            {/* Só renderiza botões de cor se houver cores */}
                            {hasColors && (
                                <div>
                                    <VariantsButton
                                        produto={produto}
                                        imagemAtiva={imagemAtiva}
                                        setImagemAtiva={setImagemAtiva}
                                        corAtiva={corAtiva}
                                        setCorAtiva={setCorAtiva}
                                        ClassBase="bg-red-100"
                                    />
                                </div>
                            )}
                            <p>Quantidade</p>
                            <div id="contador">
                                <QuantitySelector
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                    max={produto.stock}
                                />
                                {quantity >= produto.stock && (
                                    <p className="text-sm text-red-600">
                                        Limite máximo de estoque atingido
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col w-full gap-2">
                                <Button variant="default">
                                    Adicionar ao carrinho
                                </Button>
                                <Button variant="default">Comprar</Button>
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
