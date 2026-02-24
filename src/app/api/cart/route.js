import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";

const BASE_VARIANT_ID = "base";

function toDbvariantId(variantId) {
    return typeof variantId === "string" && variantId.trim()
        ? variantId.trim()
        : BASE_VARIANT_ID;
}

export async function GET(request) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return Response.json({ error: "Nao autenticado" }, { status: 401 });

    const items = await prisma.cartItem.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return Response.json(items);
}


export async function PUT(request) {
    const autHeader = request.headers.get("Authorization");
    const token = autHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return Response.json({ error: "Nao autenticado" }, { status: 401 });

    const body = await request.json();
    const rawsItems = Array.isArray(body?.items) ? body.items : [];

    const items = rawsItems
        .filter(
            (item) =>
                typeof item?.productId === "string" && item.productId.trim(),
        )
        .map((item) => ({
            userId: user.id,
            productId: item.productId.trim(),
            variantId: toDbvariantId(item.variantId),
            quantity: Math.max(1, Math.trunc(Number(item.quantity) || 1)),
        }));

    const unique = new Map();
    items.forEach((item) => {
        unique.set(`${item.productId}::${item.variantId}`, item);
    });
    const dedupedItems = Array.from(unique.values());

    await prisma.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({ where: { userId: user.id } });
        if (dedupedItems.length) {
            await tx.cartItem.createMany({
                data: dedupedItems,
                skipDuplicates: true,
            });
        }
    });

    return Response.json({ success: true, count: dedupedItems.length });
}
