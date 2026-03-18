import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDate } from "../../_utils/utils";

export default function ProductFormSection({
    selectedProduct,
    form,
    onFieldChange,
    onSubmit,
    saving,
    selectedId,
    archiveDialogOpen,
    onArchiveDialogOpenChange,
    onArchive,
}) {
    return (
        <Card className="gap-4">
            <CardHeader className="space-y-1 pb-0">
                <CardTitle className="text-lg">
                    {selectedProduct ? "Editar produto" : "Cadastrar produto"}
                </CardTitle>
                <CardDescription>
                    {selectedProduct
                        ? `Última atualização: ${formatDate(selectedProduct.updatedAt)}`
                        : "Preencha os campos para criar um novo produto."}
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
                <form onSubmit={onSubmit} className="space-y-5">
                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Dados básicos
                        </h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <label
                                    htmlFor="admin-prod-name"
                                    className="text-sm font-medium"
                                >
                                    Nome
                                </label>
                                <Input
                                    id="admin-prod-name"
                                    placeholder="Nome do produto"
                                    value={form.name}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "name",
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-slug"
                                    className="text-sm font-medium"
                                >
                                    Slug
                                </label>
                                <Input
                                    id="admin-prod-slug"
                                    placeholder="slug-opcional"
                                    value={form.slug}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "slug",
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-category"
                                    className="text-sm font-medium"
                                >
                                    Categoria
                                </label>
                                <Input
                                    id="admin-prod-category"
                                    placeholder="Categoria"
                                    value={form.category}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "category",
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label
                                    htmlFor="admin-prod-catalog-key"
                                    className="text-sm font-medium"
                                >
                                    Catalog key
                                </label>
                                <Input
                                    id="admin-prod-catalog-key"
                                    placeholder="Ex.: celulares"
                                    value={form.catalogKey}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "catalogKey",
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Preço e estoque
                        </h2>
                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-price"
                                    className="text-sm font-medium"
                                >
                                    Preço (centavos)
                                </label>
                                <Input
                                    id="admin-prod-price"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    value={form.priceCents}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "priceCents",
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-stock"
                                    className="text-sm font-medium"
                                >
                                    Estoque
                                </label>
                                <Input
                                    id="admin-prod-stock"
                                    type="number"
                                    placeholder="0"
                                    min={0}
                                    value={form.stock}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "stock",
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Mídia e texto
                        </h2>
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-img"
                                    className="text-sm font-medium"
                                >
                                    URL da imagem
                                </label>
                                <Input
                                    id="admin-prod-img"
                                    placeholder="https://..."
                                    value={form.img}
                                    onChange={(event) =>
                                        onFieldChange("img", event.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-alt"
                                    className="text-sm font-medium"
                                >
                                    Texto alternativo
                                </label>
                                <Input
                                    id="admin-prod-alt"
                                    placeholder="Descrição breve da imagem"
                                    value={form.alt}
                                    onChange={(event) =>
                                        onFieldChange("alt", event.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-promocao"
                                    className="text-sm font-medium"
                                >
                                    Promoção
                                </label>
                                <Input
                                    id="admin-prod-promocao"
                                    placeholder="Opcional"
                                    value={form.promocao}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "promocao",
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-description"
                                    className="text-sm font-medium"
                                >
                                    Descrição
                                </label>
                                <Textarea
                                    id="admin-prod-description"
                                    className="min-h-24"
                                    placeholder="Descrição do produto"
                                    value={form.description}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "description",
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="admin-prod-features"
                                    className="text-sm font-medium"
                                >
                                    Features (uma por linha)
                                </label>
                                <Textarea
                                    id="admin-prod-features"
                                    className="min-h-28"
                                    placeholder={
                                        "Ex.:\nTela OLED\n5G\nBateria 5000mAh"
                                    }
                                    value={form.featuresText}
                                    onChange={(event) =>
                                        onFieldChange(
                                            "featuresText",
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    <section className="space-y-3">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Status
                        </h2>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <p className="text-sm font-medium">
                                    Produto ativo
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    Quando desativado, o item sai do catálogo
                                    público.
                                </p>
                            </div>
                            <Switch
                                checked={Boolean(form.isActive)}
                                onCheckedChange={(checked) =>
                                    onFieldChange("isActive", checked)
                                }
                            />
                        </div>
                    </section>

                    <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                            type="submit"
                            disabled={saving}
                            className="min-w-40"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                "Salvar alterações"
                            )}
                        </Button>

                        {selectedId ? (
                            <AlertDialog
                                open={archiveDialogOpen}
                                onOpenChange={onArchiveDialogOpenChange}
                            >
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        disabled={saving}
                                    >
                                        Desativar produto
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Confirmar desativação
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esse produto ficará inativo e não
                                            será exibido no catálogo público.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel
                                            type="button"
                                            disabled={saving}
                                        >
                                            Cancelar
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            type="button"
                                            className="bg-destructive text-white hover:bg-destructive/90"
                                            disabled={saving}
                                            onClick={onArchive}
                                        >
                                            {saving
                                                ? "Desativando..."
                                                : "Confirmar desativação"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : null}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
