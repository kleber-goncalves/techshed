"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
    archiveAdminProduct,
    createAdminProduct,
    getAdminProduct,
    updateAdminProduct,
} from "@/lib/helpers/api/adminProductsApi";
import { Button } from "@/components/ui/button";
import FeedbackBanners from "../../_components/FeedbackBanners";
import ProductFormSection from "./ProductFormSection";
import { createEmptyProductForm } from "../../_utils/constants";
import { toForm, toPayload } from "../../_utils/utils";

export default function ProductEditorClient({ productId }) {
    const router = useRouter();
    const isCreate = !productId;

    const [form, setForm] = useState(() => createEmptyProductForm());
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(!isCreate);
    const [saving, setSaving] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const setField = useCallback((field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const loadProduct = useCallback(async () => {
        if (isCreate) return;
        setLoading(true);
        setError("");
        try {
            const product = await getAdminProduct(productId);
            setSelectedProduct(product);
            setForm(toForm(product));
        } catch (err) {
            setError(err.message || "Erro ao carregar produto.");
        } finally {
            setLoading(false);
        }
    }, [isCreate, productId]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                const payload = toPayload(form);
                if (isCreate) {
                    const created = await createAdminProduct(payload);
                    router.replace(
                        `/admin/deshboard/settingsProduct/${created.id}`,
                    );
                    return;
                }
                await updateAdminProduct(productId, payload);
                setSuccess("Produto atualizado com sucesso.");
                await loadProduct();
            } catch (err) {
                setError(err.message || "Erro ao salvar produto.");
            } finally {
                setSaving(false);
            }
        },
        [form, isCreate, loadProduct, productId, router],
    );

    const handleArchive = useCallback(async () => {
        if (!productId) return;
        setSaving(true);
        setError("");
        try {
            await archiveAdminProduct(productId);
            router.push("/admin/deshboard");
        } catch (err) {
            setError(err.message || "Erro ao desativar produto.");
        } finally {
            setSaving(false);
        }
    }, [productId, router]);

    return (
        <section className="mx-auto w-full max-w-5xl space-y-4">
            <Button
                variant="outline"
                onClick={() => router.push("/admin/deshboard")}
                className="gap-2"
            >
                <ArrowLeft className="size-4" />
                Voltar para painel
            </Button>

            <FeedbackBanners error={error} success={success} />

            {!loading ? (
                <ProductFormSection
                    selectedProduct={selectedProduct}
                    form={form}
                    onFieldChange={setField}
                    onSubmit={handleSubmit}
                    saving={saving}
                    selectedId={isCreate ? null : productId}
                    archiveDialogOpen={archiveDialogOpen}
                    onArchiveDialogOpenChange={setArchiveDialogOpen}
                    onArchive={handleArchive}
                />
            ) : (
                <p className="text-sm text-muted-foreground">
                    Carregando produto...
                </p>
            )}
        </section>
    );
}
