import prisma from "@/lib/prisma/prisma";

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
        img: p.img,
        alt: p.alt,
        priceCents: p.priceCents,
        stock: p.stock,
        category: p.category,
        features: p.features ?? [],
        promocao: p.promocao ?? undefined,
        colors: (p.variantes ?? []).map((v) => ({
            id: v.id,
            name: v.name,
            img: v.img,
            alt: v.alt,
            priceCents: v.priceCents,
            stock: v.stock,
            hex: v.hex ?? undefined,
            corName: v.corName ?? undefined,
        })),
    };
}

export async function getCatalogoAgrupado() {
    const rows = await prisma.produto.findMany({
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
