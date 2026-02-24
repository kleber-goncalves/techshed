import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function POST(request) {
    try {
        const { access_token } = await request.json();

        if (!access_token) {
            return Response.json(
                { error: "Token não enviado" },
                { status: 400 },
            );
        }

        // Pegar sessão/usuário no Supabase com o token
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser(access_token);

        if (userError || !user) {
            return Response.json(
                { error: "Usuário não encontrado" },
                { status: 401 },
            );
        }

        // Criar ou atualizar o usuário no banco via Prisma
        const createdUser = await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: {
                id: user.id,
                email: user.email,
            },
        });

        return Response.json(createdUser);
    } catch (error) {
        return Response.json({ error: "Erro interno" }, { status: 500 });
    }
}
