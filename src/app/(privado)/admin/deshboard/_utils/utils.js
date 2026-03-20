import { LOW_STOCK_THRESHOLD } from "./constants";

function normalizeImages(images, fallbackImage = null, legacyIdPrefix = "img") {
    const fallbackImages = fallbackImage?.url
        ? [
            {
                id: `${legacyIdPrefix}-cover`,
                url: fallbackImage.url,
                alt: fallbackImage.alt ?? "",
                position: 0,
                storagePath: null,
            },
        ]
        : [];

    const source = images?.length ? images : fallbackImages;

    return source.map((image, index) => ({
        id: image.id ?? `${legacyIdPrefix}-${index}`,
        url: image.url,
        alt: image.alt ?? "",
        position: index,
        storagePath: image.storagePath ?? null,
    }));
}

export function toForm(product) {
    const images = normalizeImages(
        product.images,
        product.img
            ? {
                url: product.img,
                alt: product.alt ?? "",
            }
            : null,
        "legacy",
    );

    const variants = (product.variantes ?? []).map((variant, index) => ({
        id: variant.id ?? `variant-${index}`,
        name: variant.name ?? "",
        corName: variant.corName ?? "",
        hex: variant.hex ?? "",
        priceCents: variant.priceCents ?? 0,
        stock: variant.stock ?? 0,
        images: normalizeImages(
            variant.images,
            variant.img
                ? {
                    url: variant.img,
                    alt: variant.alt ?? "",
                }
                : null,
            `variant-${variant.id ?? index}`,
        ),
    }));

    return {
        name: product.name ?? "",
        slug: product.slug ?? "",
        description: product.description ?? "",
        images,
        variants,
        priceCents: product.priceCents ?? 0,
        stock: product.stock ?? 0,
        category: product.category ?? "",
        catalogKey: product.catalogKey ?? "",
        promocao: product.promocao ?? "",
        featuresText: (product.features ?? []).join("\n"),
        isActive: Boolean(product.isActive),
    };
}

export function toPayload(form) {
    return {
        name: form.name,
        slug: form.slug,
        description: form.description,
        images: form.images.map((image, index) => ({
            id: image.id,
            url: image.url,
            alt: image.alt,
            position: index,
            storagePath: image.storagePath ?? null,
        })),
        variants: (form.variants ?? []).map((variant) => ({
            id: variant.id,
            name: variant.name,
            corName: variant.corName,
            hex: variant.hex,
            priceCents: Number(variant.priceCents) || 0,
            stock: Number(variant.stock) || 0,
            images: (variant.images ?? []).map((image, index) => ({
                id: image.id,
                url: image.url,
                alt: image.alt,
                position: index,
                storagePath: image.storagePath ?? null,
            })),
        })),
        priceCents: Number(form.priceCents) || 0,
        stock: Number(form.stock) || 0,
        category: form.category,
        catalogKey: form.catalogKey,
        promocao: form.promocao,
        features: form.featuresText,
        isActive: form.isActive,
    };
}

export function formatDate(value) {
    if (!value) return "-";
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "-";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(parsedDate);
}

export function buildMetrics(products) {
    const total = products.length;
    const active = products.filter((product) => product.isActive).length;
    const inactive = total - active;
    const lowStock = products.filter(
        (product) => Number(product.stock ?? 0) <= LOW_STOCK_THRESHOLD,
    ).length;

    return { total, active, inactive, lowStock };
}

export function filterProductsByStatus(products, statusFilter) {
    if (statusFilter === "all") return products;
    return products.filter((product) =>
        statusFilter === "active" ? product.isActive : !product.isActive,
    );
}
