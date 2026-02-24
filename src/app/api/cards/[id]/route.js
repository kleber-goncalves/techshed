import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";


/**
 * DELETE /api/cards/:id
 *
 * Exclui uma cartao pelo seu ID. A cartao precisa pertencer ao usuario autenticado.
 *
 * @param {Request} request - Requisicao
 * @param {Object} params - Parametros da rota
 * @returns {Response} - Resposta com mensagem de sucesso
 * @throws {Response} - Erro de nao autenticado com status 401
 */
export async function DELETE(request, { params }) {
    const { id } = params;

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) return Response.json({ error: "Nao autenticado" }, { status: 401 });

    await prisma.card.deleteMany({
        where: {
            id,
            userId: user.id,
        },
    });

    return Response.json({ success: true });
}

