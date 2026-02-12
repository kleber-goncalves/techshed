"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { produtos } from "@/data/produtos";

const STORAGE_KEY = "techshed.favorites.v1";

const FavoriteContext = createContext(null);

const productIndex = buildProductIndex();

function buildProductIndex() {
    const index = new Map();

    Object.values(produtos)
        .flat()
        .forEach((product) => {
            index.set(product.id, product);
        });

    return index;
}

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

function sanitizeFavoriteIds(rawFavoriteIds) {
    if (!Array.isArray(rawFavoriteIds)) return [];

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
        return sanitizeFavoriteIds(JSON.parse(rawValue));
    } catch {
        return [];
    }
}

export function FavoriteProvider({ children }) {
    const [favoriteIds, setFavoriteIds] = useState(() => {
        if (typeof window === "undefined") return [];
        return parsePersistedFavoriteIds(window.localStorage.getItem(STORAGE_KEY));
    });

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    const addFavorite = useCallback((productId) => {
        const normalizedId = normalizeProductId(productId);
        if (!normalizedId || !productIndex.has(normalizedId)) return;

        setFavoriteIds((previousIds) => {
            if (previousIds.includes(normalizedId)) return previousIds;
            return [normalizedId, ...previousIds];
        });
    }, []);

    const removeFavorite = useCallback((productId) => {
        const normalizedId = normalizeProductId(productId);
        if (!normalizedId) return;

        setFavoriteIds((previousIds) =>
            previousIds.filter((id) => id !== normalizedId),
        );
    }, []);

    const toggleFavorite = useCallback((productId) => {
        const normalizedId = normalizeProductId(productId);
        if (!normalizedId || !productIndex.has(normalizedId)) return;

        setFavoriteIds((previousIds) =>
            previousIds.includes(normalizedId)
                ? previousIds.filter((id) => id !== normalizedId)
                : [normalizedId, ...previousIds],
        );
    }, []);

    const clearFavorites = useCallback(() => {
        setFavoriteIds([]);
    }, []);

    const isFavorite = useCallback(
        (productId) => {
            const normalizedId = normalizeProductId(productId);
            if (!normalizedId) return false;

            return favoriteIds.includes(normalizedId);
        },
        [favoriteIds],
    );

    const items = useMemo(
        () =>
            favoriteIds
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
        [favoriteIds],
    );

    const totalFavorites = favoriteIds.length;
    const isEmpty = items.length === 0;

    const value = useMemo(
        () => ({
            items,
            favoriteIds,
            totalFavorites,
            isEmpty,
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

