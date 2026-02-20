"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useCatalogo } from "@/contexts/catalog-context";

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
    const [favoriteIds, setFavoriteIds] = useState(() => {
        if (typeof window === "undefined") return [];
        return parsePersistedFavoriteIds(window.localStorage.getItem(STORAGE_KEY));
    });

    const sanitizedFavoriteIds = useMemo(() => {
        if (!isCatalogReady) return [];
        return sanitizeFavoriteIds(favoriteIds, productIndex);
    }, [favoriteIds, isCatalogReady, productIndex]);

    useEffect(() => {
        if (!isCatalogReady) return;
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(sanitizedFavoriteIds),
        );
    }, [sanitizedFavoriteIds, isCatalogReady]);

    const addFavorite = useCallback((productId) => {
        const normalizedId = normalizeProductId(productId);
        if (!normalizedId) return;

        setFavoriteIds((previousIds) => {
            if (previousIds.includes(normalizedId)) return previousIds;
            if (!isCatalogReady) return [normalizedId, ...previousIds];
            return productIndex.has(normalizedId)
                ? [normalizedId, ...previousIds]
                : previousIds;
        });
    }, [isCatalogReady, productIndex]);

    const removeFavorite = useCallback((productId) => {
        const normalizedId = normalizeProductId(productId);
        if (!normalizedId) return;

        setFavoriteIds((previousIds) =>
            previousIds.filter((id) => id !== normalizedId),
        );
    }, []);

    const toggleFavorite = useCallback((productId) => {
        const normalizedId = normalizeProductId(productId);
        if (!normalizedId) return;

        setFavoriteIds((previousIds) =>
            previousIds.includes(normalizedId)
                ? previousIds.filter((id) => id !== normalizedId)
                : !isCatalogReady || productIndex.has(normalizedId)
                  ? [normalizedId, ...previousIds]
                  : previousIds,
        );
    }, [isCatalogReady, productIndex]);

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

    const value = useMemo(
        () => ({
            items,
            favoriteIds,
            totalFavorites,
            isEmpty,
            isReady: isCatalogReady,
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
            isCatalogReady,
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
        throw new Error("useFavorite precisa ser usado dentro de FavoriteProvider");
    }

    return context;
}

