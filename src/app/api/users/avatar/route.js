import crypto from "crypto";
import { supabase } from "@/lib/supabase/supabaseClient";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const BUCKET = "profile-images";

export async function POST(request) {
    try {
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.replace("Bearer ", "");

        if (!token) {
            return Response.json({ error: "Token ausente." }, { status: 401 });
        }

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return Response.json({ error: "Usuário não autenticado." }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return Response.json({ error: "Arquivo inválido." }, { status: 400 });
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
            return Response.json({ error: uploadError.message }, { status: 500 });
        }

        const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);

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
