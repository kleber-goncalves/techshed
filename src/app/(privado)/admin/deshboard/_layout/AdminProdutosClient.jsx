"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "./DashboardHeader";
import KpiSection from "../_components/KpiSection";
import FeedbackBanners from "../_components/FeedbackBanners";
import ProductsSection from "./ProductsSection";
import { useInfiniteAdminProducts } from "../_hooks/useInfiniteAdminProducts";
import { useInfiniteTrigger } from "../_hooks/useInfiniteTrigger";

export default function AdminProdutosClient() {
    const router = useRouter();

    const [statusFilter, setStatusFilter] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const success = "";

    const {
        items: products,
        summary,
        hasMore,
        loadingInitial,
        loadingMore,
        error,
        loadNext,
    } = useInfiniteAdminProducts({
        search: appliedSearch,
        status: statusFilter,
        pageSize: 20,
    });

    const sentinelRef = useInfiniteTrigger({
        enabled: hasMore && !loadingInitial && !loadingMore,
        onLoadMore: loadNext,
    });

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
        (event) => {
            event.preventDefault();
            setAppliedSearch(searchInput);
        },
        [searchInput],
    );

    return (
        <section className="mx-auto w-full max-w-7xl space-y-6">
            <DashboardHeader onNewProduct={handleNew} />
            <KpiSection loading={loadingInitial} metrics={summary} />
            <FeedbackBanners error={error} success={success} />

            <div className="grid gap-6 xl:grid-cols-1">
                <ProductsSection
                    search={searchInput}
                    onSearchChange={(event) =>
                        setSearchInput(event.target.value)
                    }
                    onSearchSubmit={handleSearch}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                    loadingInitial={loadingInitial}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    sentinelRef={sentinelRef}
                    products={products}
                    onSelectProduct={handleSelect}
                />
            </div>
        </section>
    );
}
