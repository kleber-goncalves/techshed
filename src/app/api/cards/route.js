import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";

/**
 * GET /api/cards
 *
 * Retorna lista de cartoes do usuario autenticado
 *
 * @param {Request} request - Requisicao
 * @returns {Response} - Resposta com lista de cartoes
 * @throws {Response} - Erro de nao autenticado com status 401
 */
export async function GET(request) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return Response.json({ error: "Nao autenticado" }, { status: 401 });
    
    const cards = await prisma.card.findMany({
        where: { userId: user.id },
    });

    return Response.json(cards);
}


/**
 * POST /api/cards
 *
 * Cria uma nova carta para o usuario autenticado
 *
 * @param {Request} request - Requisicao
 * @returns {Response} - Resposta com a carta criada
 * @throws {Response} - Erro de nao autenticado com status 401
 */
export async function POST(request) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return Response.json({ error: "Nao autenticado" }, { status: 401 });

    const body = await request.json();

    const newCard = await prisma.card.create({
        data: {
            userId: user.id,
            holder: body.holder,
            number: body.number,
            brand: body.brand,
            expMonth: parseInt(body.expMonth),
            expYear: parseInt(body.expYear)
        },
    });

    return Response.json(newCard);
}