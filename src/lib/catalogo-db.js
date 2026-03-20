import prisma from "@/lib/prisma/prisma";

function mapImages(images, fallbackImage = null, prefix = "img") {
    const fallbackImages = fallbackImage?.url
        ? [
            {
                id: `${prefix}-cover`,
                url: fallbackImage.url,
                alt: fallbackImage.alt ?? "",
                position: 0,
                storagePath: null,
            },
        ]
        : [];

    const source = images?.length ? images : fallbackImages;

    return source.map((image, index) => ({
        id: image.id ?? `${prefix}-${index}`,
        url: image.url,
        alt: image.alt ?? "",
        position: index,
        storagePath: image.storagePath ?? null,
    }));
}

function mapVariantSummary(v) {
    return {
        id: v.id,
        name: v.name,
        img: v.img,
        alt: v.alt,
        priceCents: v.priceCents,
        stock: v.stock,
        hex: v.hex ?? undefined,
        corName: v.corName ?? undefined,
    };
}

/**
 * Mapeia um produto da base de dados para o formato esperado
 * pelo front-end.
 *
 * @param {Object} p - O produto da base de dados.
 *
 * @returns {Object} - O produto no formato esperado pelo front-end.
 */
function mapProdutos(p) {
    return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        description: p.description ?? "",
        img: p.img,
        alt: p.alt,
        priceCents: p.priceCents,
        stock: p.stock,
        category: p.category,
        isActive: p.isActive,
        features: p.features ?? [],
        promocao: p.promocao ?? undefined,
        colors: (p.variantes ?? []).map(mapVariantSummary),
    };
}

function mapProdutoDetalhe(p) {
    return {
        ...mapProdutos(p),
        images: mapImages(
            p.images,
            p.img
                ? {
                    url: p.img,
                    alt: p.alt,
                }
                : null,
            `product-${p.id}`,
        ),
        colors: (p.variantes ?? []).map((variant) => ({
            ...mapVariantSummary(variant),
            images: mapImages(
                variant.images,
                variant.img
                    ? {
                        url: variant.img,
                        alt: variant.alt,
                    }
                    : null,
                `variant-${variant.id}`,
            ),
        })),
    };
}

export async function getCatalogoAgrupado({ includeInactive = false } = {}) {
    const rows = await prisma.produto.findMany({
        where: includeInactive ? undefined : { isActive: true },
        include: { variantes: true },
        orderBy: { category: "asc" },
    });

    const grouped = {};
    for (const p of rows) {
        if (!grouped[p.catalogKey]) grouped[p.catalogKey] = [];
        grouped[p.catalogKey].push(mapProdutos(p));
    }
    return grouped;
}


export async function getCatalogoFlat() {
    const grouped = await getCatalogoAgrupado();
    return Object.values(grouped).flat();
}

export async function getProdutoBySlug(slug) {
    const product = await prisma.produto.findFirst({
        where: { slug, isActive: true },
        include: {
            images: { orderBy: { position: "asc" } },
            variantes: {
                include: {
                    images: { orderBy: { position: "asc" } },
                },
            },
        },
    });

    if (!product) return null;

    return mapProdutoDetalhe(product);
}
