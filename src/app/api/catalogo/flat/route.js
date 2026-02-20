import { getCatalogoFlat } from "@/lib/catalogo-db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const data = await getCatalogoFlat();
        return Response.json(data, { status: 200 });
    } catch (error) {
        console.error("GET /api/catalogo/flat:", error);
        return Response.json({ error: "Erro ao buscar catalogo" }, { status: 500 });
    }
}