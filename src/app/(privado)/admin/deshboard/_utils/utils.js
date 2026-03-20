import { LOW_STOCK_THRESHOLD } from "./constants";

export function toForm(product) {
    const fallbackImages = product.img
        ? [
            {
                id: "legacy-cover",
                url: product.img,
                alt: product.alt ?? "",
                position: 0,
                storagePath: null,
            },
        ]
        : [];

    const images = (product.images?.length ? product.images : fallbackImages).map(
        (image, index) => ({
            id: image.id ?? `img-${index}`,
            url: image.url,
            alt: image.alt ?? "",
            position: index,
            storagePath: image.storagePath ?? null,
        }),
    );

    return {
        name: product.name ?? "",
        slug: product.slug ?? "",
        description: product.description ?? "",
        images,
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
