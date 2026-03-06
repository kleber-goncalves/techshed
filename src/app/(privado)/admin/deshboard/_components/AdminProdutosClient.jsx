"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    archiveAdminProduct,
    createAdminProduct,
    listAdminProducts,
    updateAdminProduct,
} from "@/lib/helpers/api/adminProductsApi";
import DashboardHeader from "./admin-produtos/DashboardHeader";
import KpiSection from "./admin-produtos/KpiSection";
import FeedbackBanners from "./admin-produtos/FeedbackBanners";
import ProductsSection from "./admin-produtos/ProductsSection";
import ProductFormSection from "./admin-produtos/ProductFormSection";
import { createEmptyProductForm } from "./admin-produtos/constants";
import {
    buildMetrics,
    filterProductsByStatus,
    toForm,
    toPayload,
} from "./admin-produtos/utils";

export default function AdminProdutosClient() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState(() => createEmptyProductForm());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedProduct = useMemo(
        () => products.find((product) => product.id === selectedId) ?? null,
        [products, selectedId],
    );

    const filteredProducts = useMemo(
        () => filterProductsByStatus(products, statusFilter),
        [products, statusFilter],
    );

    const metrics = useMemo(() => buildMetrics(products), [products]);

    const loadProducts = useCallback(
        async (currentSearch = "") => {
            setLoading(true);
            setError("");

            try {
                const data = await listAdminProducts(currentSearch);
                setProducts(Array.isArray(data.items) ? data.items : []);
            } catch (err) {
                if (err?.status === 404) {
                    router.replace("/404");
                    return;
                }
                setError(err.message || "Erro ao carregar produtos.");
            } finally {
                setLoading(false);
            }
        },
        [router],
    );

    useEffect(() => {
        loadProducts("");
    }, [loadProducts]);

    useEffect(() => {
        if (selectedId && !products.some((product) => product.id === selectedId)) {
            setSelectedId(null);
            setForm(createEmptyProductForm());
        }
    }, [products, selectedId]);

    const handleSelect = useCallback((product) => {
        setSelectedId(product.id);
        setForm(toForm(product));
        setSuccess("");
    }, []);

    const handleNew = useCallback(() => {
        setSelectedId(null);
        setForm(createEmptyProductForm());
        setSuccess("");
        setError("");
    }, []);

    const handleFieldChange = useCallback((field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (event) => {
            event.preventDefault();
            setSaving(true);
            setError("");
            setSuccess("");

            try {
                const payload = toPayload(form);

                if (selectedId) {
                    await updateAdminProduct(selectedId, payload);
                    setSuccess("Produto atualizado com sucesso.");
                } else {
                    const created = await createAdminProduct(payload);
                    setSelectedId(created.id);
                    setSuccess("Produto criado com sucesso.");
                }

                await loadProducts(search);
            } catch (err) {
                if (err?.status === 404) {
                    router.replace("/404");
                    return;
                }
                setError(err.message || "Erro ao salvar produto.");
            } finally {
                setSaving(false);
            }
        },
        [form, loadProducts, router, search, selectedId],
    );

    const handleArchive = useCallback(async () => {
        if (!selectedId) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await archiveAdminProduct(selectedId);
            setSuccess("Produto desativado com sucesso.");
            setSelectedId(null);
            setForm(createEmptyProductForm());
            setArchiveDialogOpen(false);
            await loadProducts(search);
        } catch (err) {
            if (err?.status === 404) {
                router.replace("/404");
                return;
            }
            setError(err.message || "Erro ao desativar produto.");
        } finally {
            setSaving(false);
        }
    }, [loadProducts, router, search, selectedId]);

    const handleSearch = useCallback(
        async (event) => {
            event.preventDefault();
            await loadProducts(search);
        },
        [loadProducts, search],
    );

    return (
        <section className="mx-auto w-full max-w-7xl space-y-6">
            <DashboardHeader onNewProduct={handleNew} />
            <KpiSection loading={loading} metrics={metrics} />
            <FeedbackBanners error={error} success={success} />

            <div className="grid gap-6 xl:grid-cols-[1.05fr_1.45fr]">
                <ProductsSection
                    search={search}
                    onSearchChange={(event) => setSearch(event.target.value)}
                    onSearchSubmit={handleSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    loading={loading}
                    products={filteredProducts}
                    selectedId={selectedId}
                    onSelectProduct={handleSelect}
                />

                <ProductFormSection
                    selectedProduct={selectedProduct}
                    form={form}
                    onFieldChange={handleFieldChange}
                    onSubmit={handleSubmit}
                    saving={saving}
                    selectedId={selectedId}
                    archiveDialogOpen={archiveDialogOpen}
                    onArchiveDialogOpenChange={setArchiveDialogOpen}
                    onArchive={handleArchive}
                />
            </div>
        </section>
    );
}
