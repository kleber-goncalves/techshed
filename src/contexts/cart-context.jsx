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

const STORAGE_KEY = "techshed.cart.v1";
const BASE_VARIANT_ID = "base";

const CartContext = createContext(null);

const productIndex = buildProductIndex();

function buildProductIndex() {
    const allProducts = Object.values(produtos).flat();
    const index = new Map();

    allProducts.forEach((product) => {
        index.set(product.id, product);
    });

    return index;
}

function toInteger(value, fallback = 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? Math.trunc(parsedValue) : fallback;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function normalizeRequestedQuantity(quantity, maxStock) {
    if (maxStock <= 0) return 0;
    return clamp(toInteger(quantity, 1), 1, maxStock);
}

function getLineKey(productId, variantId) {
    return `${productId}::${variantId ?? BASE_VARIANT_ID}`;
}

function parseLineKey(lineKey) {
    if (typeof lineKey !== "string") return null;

    const separatorIndex = lineKey.indexOf("::");
    if (separatorIndex <= 0) return null;

    const productId = lineKey.slice(0, separatorIndex);
    const rawVariantId = lineKey.slice(separatorIndex + 2);
    const variantId =
        rawVariantId === BASE_VARIANT_ID || !rawVariantId ? null : rawVariantId;

    return { productId, variantId };
}

function resolveCatalogLine(productId, variantId) {
    const product = productIndex.get(productId);
    if (!product) return null;

    if (variantId) {
        const variant = product.colors?.find((color) => color.id === variantId);
        if (!variant) return null;

        return {
            productId: product.id,
            variantId,
            slug: product.slug,
            name: variant.name ?? product.name,
            img: variant.img ?? product.img,
            alt: variant.alt ?? product.alt ?? product.name,
            colorName: variant.corName ?? null,
            colorHex: variant.hex ?? null,
            stock: Math.max(0, toInteger(variant.stock ?? product.stock, 0)),
            unitPriceCents: Math.max(
                0,
                toInteger(variant.priceCents ?? product.priceCents, 0),
            ),
        };
    }

    return {
        productId: product.id,
        variantId: null,
        slug: product.slug,
        name: product.name,
        img: product.img,
        alt: product.alt ?? product.name,
        colorName: null,
        colorHex: null,
        stock: Math.max(0, toInteger(product.stock, 0)),
        unitPriceCents: Math.max(0, toInteger(product.priceCents, 0)),
    };
}

function normalizeVariantId(variantId) {
    return typeof variantId === "string" && variantId.trim()
        ? variantId
        : null;
}

function sanitizeLines(rawLines) {
    if (!Array.isArray(rawLines)) return [];

    const mergedLines = new Map();

    rawLines.forEach((line) => {
        const productId =
            typeof line?.productId === "string" ? line.productId : null;
        if (!productId) return;

        const variantId = normalizeVariantId(line.variantId);
        const catalogLine = resolveCatalogLine(productId, variantId);

        if (!catalogLine || catalogLine.stock <= 0) return;

        const quantity = normalizeRequestedQuantity(
            line.quantity,
            catalogLine.stock,
        );
        if (quantity <= 0) return;

        const lineKey = getLineKey(productId, variantId);
        const previousLine = mergedLines.get(lineKey);
        const mergedQuantity = previousLine
            ? clamp(previousLine.quantity + quantity, 1, catalogLine.stock)
            : quantity;

        mergedLines.set(lineKey, {
            productId,
            variantId,
            quantity: mergedQuantity,
        });
    });

    return Array.from(mergedLines.values());
}

function parsePersistedLines(rawValue) {
    if (!rawValue) return [];

    try {
        return sanitizeLines(JSON.parse(rawValue));
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [lines, setLines] = useState(() => {
        if (typeof window === "undefined") return [];
        return parsePersistedLines(window.localStorage.getItem(STORAGE_KEY));
    });

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }, [lines]);

    const addItem = useCallback(({ productId, variantId = null, quantity = 1 }) => {
        if (!productId) return;

        setLines((previousLines) =>
            sanitizeLines([
                ...previousLines,
                {
                    productId,
                    variantId: normalizeVariantId(variantId),
                    quantity,
                },
            ]),
        );
    }, []);

    const setItemQuantity = useCallback(({ lineKey, quantity }) => {
        const parsedLine = parseLineKey(lineKey);
        if (!parsedLine) return;

        setLines((previousLines) => {
            let found = false;
            const nextLines = previousLines.map((line) => {
                const currentLineKey = getLineKey(line.productId, line.variantId);
                if (currentLineKey !== lineKey) return line;

                found = true;
                return { ...line, quantity };
            });

            return found ? sanitizeLines(nextLines) : previousLines;
        });
    }, []);

    const removeItem = useCallback((lineKey) => {
        setLines((previousLines) =>
            previousLines.filter(
                (line) => getLineKey(line.productId, line.variantId) !== lineKey,
            ),
        );
    }, []);

    const clearCart = useCallback(() => {
        setLines([]);
    }, []);

    const items = useMemo(
        () =>
            lines
                .map((line) => {
                    const catalogLine = resolveCatalogLine(
                        line.productId,
                        line.variantId,
                    );
                    if (!catalogLine || catalogLine.stock <= 0) return null;

                    const quantity = normalizeRequestedQuantity(
                        line.quantity,
                        catalogLine.stock,
                    );
                    if (quantity <= 0) return null;

                    return {
                        ...catalogLine,
                        lineKey: getLineKey(line.productId, line.variantId),
                        quantity,
                        lineSubtotalCents: catalogLine.unitPriceCents * quantity,
                    };
                })
                .filter(Boolean),
        [lines],
    );

    const totalItems = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items],
    );
    const subtotalCents = useMemo(
        () =>
            items.reduce(
                (total, item) => total + item.unitPriceCents * item.quantity,
                0,
            ),
        [items],
    );

    const value = useMemo(
        () => ({
            items,
            totalItems,
            subtotalCents,
            isEmpty: items.length === 0,
            addItem,
            setItemQuantity,
            removeItem,
            clearCart,
        }),
        [
            addItem,
            clearCart,
            items,
            removeItem,
            setItemQuantity,
            subtotalCents,
            totalItems,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart precisa ser usado dentro de CartProvider");
    }

    return context;
}
