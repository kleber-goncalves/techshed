import prisma from "@/lib/prisma/prisma";
import { requireAdmin } from "@/lib/helpers/server/auth/adminAuth";

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
    const where = q
        ? {
              OR: [
                  { nome: { contains: q, mode: "insensitive" } },
                  { slug: { contains: q, mode: "insensitive" } },
                  { category: { contains: q, mode: "insensitive" } },
              ],
          }
        : {};

    const items = await prisma.produto.findMany({
        where,
        include: { variantes: true },
        orderBy: { updatedAt: "desc" },
    });

    return Response.json({ items });
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
