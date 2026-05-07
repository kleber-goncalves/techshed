"use client";

import { useEffect, useState } from "react";
import { listAdminProductCategories } from "@/lib/helpers/api/adminProductsApi";

export function useAdminProductCategories() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function fetchCategories() {
            setLoading(true);
            setError("");

            try {
                const data = await listAdminProductCategories();
                if (cancelled) return;

                setItems(Array.isArray(data.items) ? data.items : []);
            } catch (err) {
                if (cancelled) return;
                setItems([]);
                setError(err?.message || "Erro ao carregar categorias");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    return { items, loading, error };
}
