"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    listAdminProducts,
} from "@/lib/helpers/api/adminProductsApi";
import DashboardHeader from "./admin-produtos/DashboardHeader";
import KpiSection from "./admin-produtos/KpiSection";
import FeedbackBanners from "./admin-produtos/FeedbackBanners";
import ProductsSection from "./admin-produtos/ProductsSection";
import {
    buildMetrics,
    filterProductsByStatus,

} from "./admin-produtos/utils";

export default function AdminProdutosClient() {
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");



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

    const handleSelect = useCallback(
        (product) => {
            router.push(`/admin/deshboard/settingsProduct/${product.id}`);
        },
        [router],
    );

    const handleNew = useCallback(() => {
        router.push("/admin/deshboard/settingsProduct/new");
    }, [router]);


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
                    onSelectProduct={handleSelect}
                />
            </div>
        </section>
    );
}
