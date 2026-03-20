"use client";

import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductImagesField from "./ProductImagesField";

function createEmptyVariant() {
    return {
        id: crypto.randomUUID(),
        name: "",
        corName: "",
        hex: "",
        priceCents: 0,
        stock: 0,
        images: [],
    };
}

function getVariantLabel(variant, index) {
    return variant.corName?.trim() || variant.name?.trim() || `Variante ${index + 1}`;
}

export default function ProductVariantsField({
    productId,
    value = [],
    onChange,
}) {
    function updateVariant(variantId, updater) {
        onChange(
            value.map((variant) =>
                variant.id === variantId ? updater(variant) : variant,
            ),
        );
    }

    function updateVariantField(variantId, field, nextValue) {
        updateVariant(variantId, (variant) => ({
            ...variant,
            [field]: nextValue,
        }));
    }

    function addVariant() {
        onChange([...value, createEmptyVariant()]);
    }

    function removeVariant(variantId) {
        onChange(value.filter((variant) => variant.id !== variantId));
    }

    return (
        <Card className="border-dashed">
            <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>Variantes do produto</CardTitle>
                    <Badge variant="outline">
                        {value.length}{" "}
                        {value.length === 1 ? "variante" : "variantes"}
                    </Badge>
                </div>
                <CardDescription>
                    Cadastre cores e outras variações com preço, estoque e
                    galeria própria. Quando uma variante tiver imagens, elas
                    passam a ser exibidas na página pública.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {value.length ? (
                    value.map((variant, index) => {
                        const label = getVariantLabel(variant, index);

                        return (
                            <div
                                key={variant.id}
                                className="space-y-4 rounded-2xl border bg-card p-4"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {label}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Configure os dados e as fotos desta
                                            variante.
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeVariant(variant.id)}
                                    >
                                        <Trash2 className="size-4" />
                                        Remover variante
                                    </Button>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Nome da variante
                                        </label>
                                        <Input
                                            placeholder="Ex.: Fone Bluetooth Preto"
                                            value={variant.name}
                                            onChange={(event) =>
                                                updateVariantField(
                                                    variant.id,
                                                    "name",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Nome da cor
                                        </label>
                                        <Input
                                            placeholder="Ex.: Preto"
                                            value={variant.corName}
                                            onChange={(event) =>
                                                updateVariantField(
                                                    variant.id,
                                                    "corName",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Hex da cor
                                        </label>
                                        <Input
                                            placeholder="#000000"
                                            value={variant.hex}
                                            onChange={(event) =>
                                                updateVariantField(
                                                    variant.id,
                                                    "hex",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Preço da variante (centavos)
                                        </label>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={variant.priceCents}
                                            onChange={(event) =>
                                                updateVariantField(
                                                    variant.id,
                                                    "priceCents",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Estoque da variante
                                        </label>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="0"
                                            value={variant.stock}
                                            onChange={(event) =>
                                                updateVariantField(
                                                    variant.id,
                                                    "stock",
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                {productId ? (
                                    <ProductImagesField
                                        productId={productId}
                                        value={variant.images}
                                        title={`Galeria da variante ${label}`}
                                        description="Essas fotos aparecem quando esta variante for selecionada na vitrine."
                                        emptyTitle="Adicione a primeira imagem da variante"
                                        emptyDescription="A primeira foto enviada vira a capa visual desta variante."
                                        onChange={(images) =>
                                            updateVariantField(
                                                variant.id,
                                                "images",
                                                images,
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                                        Salve o produto primeiro para enviar as
                                        fotos desta variante.
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
                        Nenhuma variante cadastrada ainda. Adicione uma
                        variante para configurar cor, preço, estoque e galeria
                        específica.
                    </div>
                )}

                <Button type="button" variant="outline" onClick={addVariant}>
                    <Plus className="size-4" />
                    Adicionar variante
                </Button>
            </CardContent>
        </Card>
    );
}
