"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useRef,
} from "react";

import { useCatalogo } from "@/contexts/catalog-context";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getFavorites, saveFavorites } from "@/lib/helpers/api/favoriteApi";

const STORAGE_KEY = "techshed.favorites.v1";

const FavoriteContext = createContext(null);

function normalizeProductId(productId) {
    return typeof productId === "string" && productId.trim()
        ? productId.trim()
        : null;
}

function toSafeInteger(value, fallback = 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue)
        ? Math.max(0, Math.trunc(parsedValue))
        : fallback;
}

function sanitizeFavoriteIds(rawFavoriteIds, productIndex) {
    if (
        !Array.isArray(rawFavoriteIds) ||
        !productIndex ||
        productIndex.size === 0
    ) {
        return [];
    }

    const seen = new Set();
    const sanitizedIds = [];

    rawFavoriteIds.forEach((rawId) => {
        const productId = normalizeProductId(rawId);

        if (!productId) return;
        if (seen.has(productId)) return;
        if (!productIndex.has(productId)) return;

        seen.add(productId);
        sanitizedIds.push(productId);
    });

    return sanitizedIds;
}

function parsePersistedFavoriteIds(rawValue) {
    if (!rawValue) return [];

    try {
        const parsed = JSON.parse(rawValue);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function FavoriteProvider({ children }) {
    const { productIndex, isReady: isCatalogReady } = useCatalogo();

    const [authUserId, setAuthUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [hasSynced, setHasSynced] = useState(false);
    const syncRef = useRef(false);

    const [favoriteIds, setFavoriteIds] = useState(() => {
        if (typeof window === "undefined") return [];
        return parsePersistedFavoriteIds(
            window.localStorage.getItem(STORAGE_KEY),
        );
    });

    // (useEffect de autenticação) Sincroniza os favoritos com o banco de dados de favoritos do supabase se o usuario estiver autenticado e o catalogo estiver pronto
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (!alive) return;
                setAuthUserId(data.session?.user?.id ?? null);
            } catch (error) {
                if (!alive) return;
                setAuthUserId(null);
            } finally {
                if (alive) setIsAuthReady(true);
            }
        })();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const nextUserId = session?.user?.id ?? null;

                setAuthUserId((prev) => {
                    if (prev !== nextUserId) {
                        setHasSynced(false);
                    }
                    return nextUserId;
                });

                setIsAuthReady(true);
            },
        );

        return () => {
            alive = false;
            listener?.subscription?.unsubscribe?.();
        };
    }, []);

    const sanitizedFavoriteIds = useMemo(() => {
        if (!isCatalogReady) return [];
        return sanitizeFavoriteIds(favoriteIds, productIndex);
    }, [favoriteIds, isCatalogReady, productIndex]);

    // Persiste os favoritos no localStorage se o catalogo estiver pronto e o usuario estiver autenticado e sincronizado com o banco de dados de favoritos do supabase
    useEffect(() => {
        if (!isCatalogReady) return;
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(sanitizedFavoriteIds),
            );
        } catch (error) {
            console.error("Erro ao salvar no localStorage", error);
        }
    }, [sanitizedFavoriteIds, isCatalogReady]);

    // (useEffect de sicronização com o banco) Sincroniza os favoritos com o banco de dados de favoritos do supabase se o usuario estiver autenticado e o catalogo estiver pronto
    useEffect(() => {
    if (!isAuthReady || !isCatalogReady) return;
    if (!authUserId) return;
    if (hasSynced || syncRef.current) return;

    syncRef.current = true;
    let canceled = false;

    (async () => {
        try {
            const serverIds = await getFavorites();
            const merged = sanitizeFavoriteIds(
                [...serverIds, ...favoriteIds],
                productIndex,
            );

            if (canceled) return;

            // Libera a UI antes de qualquer await
            setHasSynced(true);
            setFavoriteIds(merged);

            await saveFavorites(merged);
        } catch (error) {
            console.error("Erro ao sincronizar favoritos", error);
            if (!canceled) setHasSynced(true);
        } finally {
            syncRef.current = false;
        }
    })();

    return () => {
        canceled = true;
    };
}, [
    authUserId,
    hasSynced,
    isAuthReady,
    isCatalogReady,
    favoriteIds,
    productIndex,
]);


    //
    useEffect(() => {
        if (!isAuthReady || !isCatalogReady) return;
        if (!authUserId) return;
        if (!hasSynced) return;

        saveFavorites(sanitizedFavoriteIds);
    }, [
        sanitizedFavoriteIds,
        authUserId,
        hasSynced,
        isAuthReady,
        isCatalogReady,
    ]);

    const addFavorite = useCallback(
        (productId) => {
            const normalizedId = normalizeProductId(productId);
            if (!normalizedId) return;

            setFavoriteIds((previousIds) => {
                if (previousIds.includes(normalizedId)) return previousIds;
                if (!isCatalogReady) return [normalizedId, ...previousIds];
                return productIndex.has(normalizedId)
                    ? [normalizedId, ...previousIds]
                    : previousIds;
            });
        },
        [isCatalogReady, productIndex],
    );

    const removeFavorite = useCallback((productId) => {
        const normalizedId = normalizeProductId(productId);
        if (!normalizedId) return;

        setFavoriteIds((previousIds) =>
            previousIds.filter((id) => id !== normalizedId),
        );
    }, []);

    const toggleFavorite = useCallback(
        (productId) => {
            const normalizedId = normalizeProductId(productId);
            if (!normalizedId) return;

            setFavoriteIds((previousIds) =>
                previousIds.includes(normalizedId)
                    ? previousIds.filter((id) => id !== normalizedId)
                    : !isCatalogReady || productIndex.has(normalizedId)
                      ? [normalizedId, ...previousIds]
                      : previousIds,
            );
        },
        [isCatalogReady, productIndex],
    );

    const clearFavorites = useCallback(() => {
        setFavoriteIds([]);
    }, []);

    const isFavorite = useCallback(
        (productId) => {
            const normalizedId = normalizeProductId(productId);
            if (!normalizedId) return false;

            return sanitizedFavoriteIds.includes(normalizedId);
        },
        [sanitizedFavoriteIds],
    );

    const items = useMemo(
        () =>
            sanitizedFavoriteIds
                .map((productId) => {
                    const product = productIndex.get(productId);
                    if (!product) return null;

                    return {
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        img: product.img,
                        alt: product.alt ?? product.name,
                        priceCents: toSafeInteger(product.priceCents, 0),
                        stock: toSafeInteger(product.stock, 0),
                    };
                })
                .filter(Boolean),
        [sanitizedFavoriteIds, productIndex],
    );

    const totalFavorites = sanitizedFavoriteIds.length;
    const isEmpty = items.length === 0;
    const isReady = isCatalogReady && isAuthReady && (!authUserId || hasSynced);

    const value = useMemo(
        () => ({
            items,
            favoriteIds,
            totalFavorites,
            isEmpty,
            isReady,
            isFavorite,
            addFavorite,
            removeFavorite,
            toggleFavorite,
            clearFavorites,
        }),
        [
            addFavorite,
            clearFavorites,
            favoriteIds,
            isReady,
            isEmpty,
            isFavorite,
            items,
            removeFavorite,
            toggleFavorite,
            totalFavorites,
        ],
    );

    return (
        <FavoriteContext.Provider value={value}>
            {children}
        </FavoriteContext.Provider>
    );
}

export function useFavorite() {
    const context = useContext(FavoriteContext);

    if (!context) {
        throw new Error(
            "useFavorite precisa ser usado dentro de FavoriteProvider",
        );
    }

    return context;
}
