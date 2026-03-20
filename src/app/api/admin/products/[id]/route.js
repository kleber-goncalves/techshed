import { randomUUID } from "crypto";
import prisma from "@/lib/prisma/prisma";
import { requireAdmin } from "@/lib/helpers/server/auth/adminAuth";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const BUCKET = "product-images";

function toImageArray(value, productName) {
    return (Array.isArray(value) ? value : [])
        .map((image, index) => ({
            url: toText(image?.url),
            alt: toText(image?.alt) || `${productName} imagem ${index + 1}`,
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

function toText(value) {
    return typeof value === "string" ? value.trim() : "";
}

function toInt(value, fallback = null) {
    const n = Number(value);
    return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : fallback;
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
    return null;
}

function slugify(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function GET(request, { params }) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;

    const product = await prisma.produto.findUnique({
        where: { id },
        include: {
            variantes: {
                include: {
                    images: { orderBy: { position: "asc" } },
                },
            },
            images: { orderBy: { position: "asc" } },
        },
    });

    if (!product) {
        return Response.json(
            { error: "Produto não encontrado" },
            { status: 404 },
        );
    }

    return Response.json(product);
}

export async function PUT(request, { params }) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await request.json();
    const data = {};
    let currentProduct = null;
    let removedPaths = [];

    async function loadCurrentProduct() {
        if (currentProduct) return currentProduct;

        currentProduct = await prisma.produto.findUnique({
            where: { id },
            include: {
                images: true,
                variantes: {
                    include: {
                        images: true,
                    },
                },
            },
        });

        return currentProduct;
    }

    if ("name" in body) {
        const name = toText(body.name);
        if (!name)
            return Response.json({ error: "name invalido" }, { status: 400 });
        data.name = name;
    }

    if ("description" in body)
        data.description = toText(body.description) || null;

    if ("images" in body) {
        const current = await loadCurrentProduct();

        if (!current) {
            return Response.json(
                { error: "Produto não encontrado" },
                { status: 404 },
            );
        }

        const productName = data.name ?? current.name ?? "Produto";
        const images = toImageArray(body.images, productName);
        const primary = buildPrimaryImage(
            images,
            null,
            `${productName} imagem do produto`,
        );

        removedPaths.push(
            ...(current.images ?? [])
            .map((image) => image.storagePath)
            .filter(Boolean)
            .filter(
                (path) =>
                    !images.some((nextImage) => nextImage.storagePath === path),
            ),
        );

        data.img = primary.url;
        data.alt = primary.alt;
        data.images = {
            deleteMany: {},
            ...(images.length ? { create: images } : {}),
        };
    }

    if ("variants" in body) {
        const current = await loadCurrentProduct();

        if (!current) {
            return Response.json(
                { error: "Produto não encontrado" },
                { status: 404 },
            );
        }

        const productName = data.name ?? current.name ?? "Produto";
        const nextProductImages = "images" in body
            ? toImageArray(body.images, productName)
            : current.images;
        const productPrimary = buildPrimaryImage(
            nextProductImages,
            current.img
                ? {
                    url: current.img,
                    alt: current.alt,
                }
                : null,
            `${productName} imagem do produto`,
        );
        const currentVariantMap = new Map(
            (current.variantes ?? []).map((variant) => [variant.id, variant]),
        );

        const variants = (Array.isArray(body.variants) ? body.variants : []).map(
            (variant, index) => {
                const variantId = toText(variant?.id) || randomUUID();
                const currentVariant = currentVariantMap.get(variantId);
                const variantName =
                    toText(variant?.name) ||
                    currentVariant?.name ||
                    `${productName} variante ${index + 1}`;
                const variantImages = toImageArray(variant?.images, variantName);
                const variantPrimary = buildPrimaryImage(
                    variantImages,
                    productPrimary,
                    `${variantName} imagem`,
                );

                return {
                    id: variantId,
                    name: variantName,
                    corName: toText(variant?.corName) || null,
                    hex: toText(variant?.hex) || null,
                    priceCents: toInt(
                        variant?.priceCents,
                        currentVariant?.priceCents ?? 0,
                    ),
                    stock: toInt(variant?.stock, currentVariant?.stock ?? 0),
                    img: variantPrimary.url,
                    alt: variantPrimary.alt,
                    images: variantImages,
                };
            },
        );

        removedPaths.push(
            ...(current.variantes ?? [])
                .flatMap((variant) => variant.images ?? [])
                .map((image) => image.storagePath)
                .filter(Boolean)
                .filter(
                    (path) =>
                        !variants.some((variant) =>
                            variant.images.some(
                                (image) => image.storagePath === path,
                            ),
                        ),
                ),
        );

        const nextVariantIds = variants.map((variant) => variant.id);

        data.variantes = {
            deleteMany: nextVariantIds.length
                ? {
                    id: { notIn: nextVariantIds },
                }
                : {},
            upsert: variants.map((variant) => ({
                where: { id: variant.id },
                update: {
                    name: variant.name,
                    img: variant.img,
                    alt: variant.alt,
                    priceCents: variant.priceCents,
                    stock: variant.stock,
                    hex: variant.hex,
                    corName: variant.corName,
                    images: {
                        deleteMany: {},
                        ...(variant.images.length
                            ? {
                                create: variant.images,
                            }
                            : {}),
                    },
                },
                create: {
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
                },
            })),
        };
    }

    if ("alt" in body && !("images" in body)) data.alt = toText(body.alt);
    if ("category" in body) data.category = toText(body.category);
    if ("catalogKey" in body) data.catalogKey = toText(body.catalogKey);
    if ("promocao" in body) data.promocao = toText(body.promocao) || null;
    if ("isActive" in body) data.isActive = Boolean(body.isActive);
    if ("features" in body) {
        const features = toStringArray(body.features);
        if (features === null) {
            return Response.json(
                { error: "features invalido" },
                { status: 400 },
            );
        }
        data.features = features;
    }

    if ("priceCents" in body) {
        const priceCents = toInt(body.priceCents);
        if (priceCents === null) {
            return Response.json(
                { error: "priceCents invalido" },
                { status: 400 },
            );
        }
        data.priceCents = priceCents;
    }

    if ("stock" in body) {
        const stock = toInt(body.stock);
        if (stock === null) {
            return Response.json({ error: "stock invalido" }, { status: 400 });
        }
        data.stock = stock;
    }

    if ("slug" in body) {
        const nextSlug = slugify(body.slug);
        if (!nextSlug) {
            return Response.json({ error: "slug invalido" }, { status: 400 });
        }

        const exists = await prisma.produto.findFirst({
            where: { slug: nextSlug, id: { not: id } },
            select: { id: true },
        });

        if (exists) {
            return Response.json({ error: "slug já existe" }, { status: 409 });
        }

        data.slug = nextSlug;
    }

    if (Object.keys(data).length === 0) {
        return Response.json(
            { error: "Nenhum campo para atualizar" },
            { status: 400 },
        );
    }

    try {
        const updated = await prisma.produto.update({
            where: { id },
            data,
        });

        const uniqueRemovedPaths = Array.from(new Set(removedPaths.filter(Boolean)));
        if (uniqueRemovedPaths.length) {
            const { error: storageError } = await supabaseAdmin.storage
                .from(BUCKET)
                .remove(uniqueRemovedPaths);

            if (storageError) {
                console.error(
                    "Falha ao remover imagens antigas do produto:",
                    storageError,
                );
            }
        }

        return Response.json(updated);
    } catch (error) {
        if (error?.code === "P2025") {
            return Response.json(
                { error: "Produto não encontrado" },
                { status: 404 },
            );
        }
        console.error("PUT /api/admin/products/[id]:", error);
        return Response.json(
            { error: "Erro ao atualizar produto" },
            { status: 500 },
        );
    }
}

export async function DELETE(request, { params }) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const { id } = await params;

    try {
        await prisma.produto.update({
            where: { id },
            data: { isActive: false },
        });

        return Response.json({ success: true });
    } catch (error) {
        if (error?.code === "P2025") {
            return Response.json(
                { error: "Produto não encontrado" },
                { status: 404 },
            );
        }
        console.error("DELETE /api/admin/products/[id]:", error);
        return Response.json(
            { error: "Erro ao deletar produto" },
            { status: 500 },
        );
    }
}
