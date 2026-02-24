import prisma from '@/lib/prisma/prisma';
import { supabase } from '@/lib/supabase/supabaseClient';




/**
 * @api {GET} /api/favorites
 * @summary Retorna a lista de favoritos do usuário.
 * @description Requisita um token de autenticação e retorna uma lista de IDs de produtos favoritados.
 * @param {Authorization} token - Token de autenticação do usuário.
 * @returns {Object} - Corpo da resposta com lista de IDs de produtos favoritados.
 * @throws {Error} 401 - Se o token de autenticação é inválido.
 */
export async function GET(request) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user)
        return Response.json({ error: "Não autenticado" }, { status: 401 });

    const rows = await prisma.favorite.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return Response.json(rows.map((row) => row.productId));
}


/**
 * @api {PUT} /api/favorites
 * @summary Atualiza a lista de favoritos do usuário.
 * @description Requisita um token de autenticação e uma lista de IDs de produtos.
 * @param {Authorization} token - Token de autenticação do usuário.
 * @param {Object} body - Corpo da requisição.
 * @param {Array<string>} body.ids - Lista de IDs de produtos a serem favoritados.
 * @returns {Object} - Corpo da resposta com chave "success" e valor booleano e "count" com o número de favoritos adicionados.
 * @throws {Error} 401 - Se o token de autenticação é inválido.
 */
export async function PUT(request) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user)
        return Response.json({ error: "Não autenticado" }, { status: 401 });

    const body = await request.json();
    const rawIds = Array.isArray(body?.ids) ? body.ids : [];
    
    // remover ids duplicados e trims de strings vazias 
    const uniqueIds = Array.from(
        new Set(
            rawIds.filter(
                (id) => typeof id === "string" && id.trim()
            ).map((id) => id.trim())
        )
    );

    // remover favoritos duplicados e adicionar novos favoritos
    await prisma.$transaction(async (tx) => {
        await tx.favorite.deleteMany({ where: { userId: user.id } });
        if (uniqueIds.length) {
            await tx.favorite.createMany({
                data: uniqueIds.map((productId) => ({
                    userId: user.id,
                    productId,
                }))
            })
        }
    })

    return Response.json({ success: true, count: uniqueIds.length });
}