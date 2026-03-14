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

    const created = await prisma.produto.create({
        data: {
            id: slug,
            slug,
            name,
            description: toText(body.description) || null,
            img: toText(body.img) || "/imgProdutos/placeholder.avif",
            alt: toText(body.alt) || `${name} imagem do produto`,
            priceCents: toInt(body.priceCents, 0),
            stock: toInt(body.stock, 0),
            category,
            catalogKey,
            features: toStringArray(body.features),
            promocao: toText(body.promocao) || null,
            isActive: body.isActive !== false,
        },
    });

    return Response.json(created, { status: 201 });
}
