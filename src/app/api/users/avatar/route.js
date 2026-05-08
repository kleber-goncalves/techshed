import crypto from "crypto";
import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const BUCKET = "profile-images";

async function getAuthenticatedUser(request) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        return {
            error: Response.json({ error: "Token ausente." }, { status: 401 }),
        };
    }

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return {
            error: Response.json(
                { error: "Usuário não autenticado." },
                { status: 401 },
            ),
        };
    }

    return { user };
}

export async function POST(request) {
    try {
        const auth = await getAuthenticatedUser(request);

        if (auth.error) return auth.error;

        const { user } = auth;
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return Response.json(
                { error: "Arquivo inválido." },
                { status: 400 },
            );
        }

        const MAX_FILE_SIZE = 2 * 1024 * 1024;
        const ALLOWED_TYPES = new Set([
            "image/jpeg",
            "image/png",
            "image/webp",
        ]);

        if (!ALLOWED_TYPES.has(file.type)) {
            return Response.json(
                { error: "Formato inválido." },
                { status: 400 },
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return Response.json(
                { error: "Arquivo acima de 2MB." },
                { status: 400 },
            );
        }

        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const storagePath = `users/${user.id}/${fileName}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(storagePath, Buffer.from(await file.arrayBuffer()), {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            return Response.json(
                { error: uploadError.message },
                { status: 500 },
            );
        }

        const { data } = supabaseAdmin.storage
            .from(BUCKET)
            .getPublicUrl(storagePath);

        return Response.json({
            url: data.publicUrl,
            storagePath,
        });
    } catch (error) {
        return Response.json(
            { error: error?.message || "Erro interno ao enviar foto." },
            { status: 500 },
        );
    }
}

export async function DELETE(request) {
    try {
        const auth = await getAuthenticatedUser(request);
        if (auth.error) return auth.error;

        const { user } = auth;

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { avatarStoragePath: true },
        });

        if (!dbUser?.avatarStoragePath) {
            return Response.json({
                success: true,
                message: "Sem foto antiga para remover.",
            });
        }

        const { error: removeError } = await supabaseAdmin.storage
            .from(BUCKET)
            .remove([dbUser.avatarStoragePath]);

        if (removeError) {
            return Response.json(
                { error: removeError.message },
                { status: 500 },
            );
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json(
            { error: error?.message || "Erro interno ao remover foto." },
            { status: 500 },
        );
    }
}
