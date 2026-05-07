import prisma from "@/lib/prisma/prisma";
import { requireAdmin } from "@/lib/helpers/server/auth/adminAuth";

export async function GET(request) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const rows = await prisma.produto.findMany({
        select: { category: true },
        distinct: ["category"],
        orderBy: { category: "asc" },
    });

    const items = rows
        .map((row) => (typeof row.category === "string" ? row.category.trim() : ""))
        .filter(Boolean);

    return Response.json({ items }, { status: 200 });
}
