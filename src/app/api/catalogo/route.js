import { getCatalogoAgrupado } from "@/lib/catalogo-db";

export const dynamic    = "force-dynamic";

export async function GET() {
    try {
        const data = await getCatalogoAgrupado();
        return Response.json(data, { status: 200 });
    } catch (error) {
        console.error("GET /api/catalogo error:" ,error);
        return Response.json({ error: "Erro ao buscar catalogo" }, { status: 500 });
    }
}