"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { listAdminProducts } from "@/lib/helpers/api/adminProductsApi";

function mergeById(prev, next) {
    const map = new Map();
    [...prev, ...next].forEach((item) => map.set(item.id, item));
    return Array.from(map.values());
}

export function useInfiniteAdminProducts({
    search,
    status,
    category,
    pageSize = 20,
}) {
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        lowStock: 0,
    });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState("");

    const requestIdRef = useRef(0);

    const fetchPage = useCallback(
        async ({ targetPage, append }) => {
            const requestId = ++requestIdRef.current;
            setError("");

            if (append) setLoadingMore(true);
            else setLoadingInitial(true);

            try {
                const data = await listAdminProducts({
                    search,
                    status,
                    category,
                    page: targetPage,
                    limit: pageSize,
                });

                if (requestId !== requestIdRef.current) return;

                setItems((prev) =>
                    append
                        ? mergeById(prev, data.items ?? [])
                        : (data.items ?? []),
                );
                setSummary(
                    data.summary ?? {
                        total: 0,
                        active: 0,
                        inactive: 0,
                        lowStock: 0,
                    },
                );
                setHasMore(Boolean(data.hasMore));
            } catch (err) {
                if (requestId !== requestIdRef.current) return;
                setError(err.message || "Erro ao carregar produtos");
            } finally {
                if (requestId === requestIdRef.current) {
                    setLoadingInitial(false);
                    setLoadingMore(false);
                }
            }
        },
        [category, pageSize, search, status],
    );

    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
        fetchPage({ targetPage: 1, append: false });
    }, [fetchPage]);

    const loadNext = useCallback(() => {
        if (!hasMore || loadingInitial || loadingMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPage({ targetPage: nextPage, append: true });
    }, [fetchPage, hasMore, loadingInitial, loadingMore, page]);

    return {
        items,
        summary,
        hasMore,
        loadingInitial,
        loadingMore,
        error,
        loadNext,
    };
}
