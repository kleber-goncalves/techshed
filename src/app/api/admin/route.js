import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";

const adminEmails = new Set(
    (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
);

function resolveRole(email) {
    if (!email) return "CUSTOMER";
    return adminEmails.has(email.toLowerCase()) ? "ADMIN" : "CUSTOMER";
}

export async function POST(request) {
    try {
        const { access_token } = await request.json();

        if (!access_token) {
            return Response.json(
                { error: "Token não enviado" },
                { status: 400 },
            );
        }

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

        const email = user.email ?? "";
        const role = resolveRole(email);

        const syncedUser = await prisma.user.upsert({
            where: { id: user.id },
            update: {
                email,
                name:
                    user.user_metadata?.full_name ??
                    user.user_metadata?.name ??
                    null,
                role,
            },
            create: {
                id: user.id,
                email,
                name:
                    user.user_metadata?.full_name ??
                    user.user_metadata?.name ??
                    null,
                role,
            },
        });

        return Response.json(syncedUser);
    } catch (error) {
        console.error("POST /api/syncUser:", error);
        return Response.json(
            { error: "Erro ao sincronizar usuário" },
            { status: 500 },
        );
    }
}
