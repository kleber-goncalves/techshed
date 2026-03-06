import prisma from "@/lib/prisma/prisma";
import { supabase } from '@/lib/supabase/supabaseClient';


export async function getSessionUser(request) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");


    if (!token) {
        return {
            error: Response.json({ error: "Token não enviando" }, { status: 401 }),
        };
    }

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
        return {
            error: Response.json({ error: "Usuário não autenticado" }, { status: 401 }),
        };
    }

    const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        },
    });

    if (!dbUser) {
        return {
            error: Response.json(
                { error: "Usuário não sicronizado no banco de dados" },
                { status: 403 },
            ),
        };
    }

    return { user: dbUser };
}


/**
 * Verifica se o usuário autenticado na requisição tem permissão de admin.
 * Se o usuário não for autenticado ou não tiver permissão de admin,
 * retorna um erro com status 401 ou 404 respectivamente.
 * Caso contrário, retorna o objeto de autenticação do usuário.
 * @param {import('next/api').NextApiRequest} request
 * @returns {Promise<{ user: import('@prisma/client').User } | { error: Response }>}
 *******/
export async function requireAdmin(request) {
    const auth = await getSessionUser(request);

    if (auth.error) return auth;

    if (auth.user.role !== "ADMIN") {
        return {
            error: Response.json(
                { error: "Página não encontrada" },
                { status: 404 },
            ),
        };


    }

    return auth;
}
