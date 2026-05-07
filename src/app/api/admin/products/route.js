import { randomUUID } from "crypto";
import prisma from "@/lib/prisma/prisma";
import { requireAdmin } from "@/lib/helpers/server/auth/adminAuth";

function toPositiveInt(value, fallback, min = 1, max = 100) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    const i = Math.trunc(n);
    return Math.min(max, Math.max(min, i));
}

function toText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function toInt(value, fallback = 0) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(0, Math.trunc(n));
}

function toStringArray(value) {
    if (Array.isArray(value)) {
        return value.map((v) => String(v).trim()).filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean);
    }

    return [];
}

function toImageArray(value, label) {
    return (Array.isArray(value) ? value : [])
        .map((image, index) => ({
            url: toText(image?.url),
            alt: toText(image?.alt) || `${label} imagem ${index + 1}`,
            position: index,
            storagePath: toText(image?.storagePath) || null,
        }))
        .filter((image) => image.url);
}

function buildPrimaryImage(images, fallbackImage, fallbackAlt) {
    if (images[0]) {
        return {
            url: images[0].url,
            alt: images[0].alt || fallbackAlt,
        };
    }

    if (fallbackImage?.url) {
        return {
            url: fallbackImage.url,
            alt: fallbackImage.alt || fallbackAlt,
        };
    }

    return {
        url: "/imgProdutos/placeholder.avif",
        alt: fallbackAlt,
    };
}

function toVariantArray(value, productName, fallbackImage) {
    return (Array.isArray(value) ? value : []).map((variant, index) => {
        const variantName =
            toText(variant?.name) || `${productName} variante ${index + 1}`;
        const variantImages = toImageArray(variant?.images, variantName);
        const variantFallback = toText(variant?.img)
            ? {
                url: toText(variant?.img),
                alt: toText(variant?.alt) || `${variantName} imagem`,
            }
            : fallbackImage;
        const primary = buildPrimaryImage(
            variantImages,
            variantFallback,
            `${variantName} imagem`,
        );

        return {
            id: toText(variant?.id) || randomUUID(),
            name: variantName,
            corName: toText(variant?.corName) || null,
            hex: toText(variant?.hex) || null,
            priceCents: toInt(variant?.priceCents, 0),
            stock: toInt(variant?.stock, 0),
            img: primary.url,
            alt: primary.alt,
            images: variantImages,
        };
    });
}

function slugify(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function ensureUniqueSlug(baseSlug) {
    let slug = baseSlug || `produto-${Date.now()}`;
    let suffix = 2;

    while (await prisma.produto.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix}`;
        suffix += 1;
    }

    return slug;
}

export async function GET(request) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const q = toText(searchParams.get("q"));
    const status = toText(searchParams.get("status")); // all | active|inactive
    const category = toText(searchParams.get("category")); // all | <categoria>
    const page = toPositiveInt(searchParams.get("page"), 1, 1, 9999);
    const limit = toPositiveInt(searchParams.get("limit"), 20, 1, 100);

    const where = {};
    if (q) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
        ];
    }

    if (status === "active") where.isActive = true;
    if (status === "inactive") where.isActive = false;
    if (category && category !== "all") {
        where.category = { equals: category, mode: "insensitive" };
    }

    const skip = (page - 1) * limit;

    const [total, items, activeCount, lowStockCount] = await Promise.all([
        prisma.produto.count({ where }),
        prisma.produto.findMany({
            where,
            include: { variantes: true },
            orderBy: { updatedAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.produto.count({ where: { ...where, isActive: true } }),
        prisma.produto.count({ where: { ...where, stock: { lte: 5 } } }),
    ]);

    const hasMore = page * limit < total;
    const summary = {
        total,
        active: activeCount,
        inactive: total - activeCount,
        lowStock: lowStockCount,
    };

    return Response.json({
        items,
        page,
        limit,
        total,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
        summary,
    });
}

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();

    const name = toText(body.name);
    const category = toText(body.category);
    const catalogKey = toText(body.catalogKey);

    if (!name || !category || !catalogKey) {
        return Response.json(
            { error: "Campos obrigatórios: name, category, catalogKey" },
            { status: 400 },
        );
    }

    const baseSlug = slugify(toText(body.slug) || name);
    const slug = await ensureUniqueSlug(baseSlug);
    const productImages = toImageArray(body.images, name);
    const primaryImage = buildPrimaryImage(
        productImages,
        toText(body.img)
            ? {
                url: toText(body.img),
                alt: toText(body.alt) || `${name} imagem do produto`,
            }
            : null,
        `${name} imagem do produto`,
    );
    const variants = toVariantArray(body.variants, name, primaryImage);

    const created = await prisma.produto.create({
        data: {
            id: slug,
            slug,
            name,
            description: toText(body.description) || null,
            img: primaryImage.url,
            alt: primaryImage.alt,
            priceCents: toInt(body.priceCents, 0),
            stock: toInt(body.stock, 0),
            category,
            catalogKey,
            features: toStringArray(body.features),
            promocao: toText(body.promocao) || null,
            isActive: body.isActive !== false,
            ...(productImages.length
                ? {
                    images: {
                        create: productImages,
                    },
                }
                : {}),
            ...(variants.length
                ? {
                    variantes: {
                        create: variants.map((variant) => ({
                            id: variant.id,
                            name: variant.name,
                            img: variant.img,
                            alt: variant.alt,
                            priceCents: variant.priceCents,
                            stock: variant.stock,
                            hex: variant.hex,
                            corName: variant.corName,
                            ...(variant.images.length
                                ? {
                                    images: {
                                        create: variant.images,
                                    },
                                }
                                : {}),
                        })),
                    },
                }
                : {}),
        },
    });

    return Response.json(created, { status: 201 });
}
