import prisma from "@/lib/prisma/prisma";


import { supabase } from "@/lib/supabase/supabaseClient";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return Response.json(
                { error: "Não autorizado — token faltando" },
                { status: 401 },
            );
        }

        const {
            data: { user },
            error: supaError,
        } = await supabase.auth.getUser(token);

        if (supaError || !user) {
            return Response.json(
                { error: "Usuário não autenticado" },
                { status: 401 },
            );
        }

        if (user.id !== id) {
            return Response.json(
                { error: "Não permitido — IDs diferentes" },
                { status: 403 },
            );
        }

        const dbUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!dbUser) {
            return Response.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        return Response.json(dbUser);
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Erro interno ao buscar usuário" },
            { status: 500 },
        );
    }
}

export async function PUT(request, { params }) {
    try {
        // "desembrulhar" params
        const { id } = await params;

        // pegar token do header
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return Response.json(
                { error: "Não autorizado — token faltando" },
                { status: 401 },
            );
        }

        // verificar usuário logado com Supabase
        const {
            data: { user },
            error: supaError,
        } = await supabase.auth.getUser(token);

        if (supaError || !user) {
            return Response.json(
                { error: "Usuário não autenticado" },
                { status: 401 },
            );
        }

        // garantir que o id da URL é o do usuário logado
        if (user.id !== id) {
            return Response.json(
                { error: "Não permitido — IDs diferentes" },
                { status: 403 },
            );
        }

        const body = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                avatarUrl: body.avatarUrl,
                avatarStoragePath: body.avatarStoragePath,
            },
        });

        return Response.json(updatedUser);
    } catch (error) {
        console.error(error);
        return Response.json(
            { error: "Erro interno ao atualizar usuário" },
            { status: 500 },
        );
    }
}


export async function DELETE(request, { params }) {
    await prisma.user.delete({
        where: { id: params.id },
    });
    return Response.json({ success: true });
}
