import crypto from "crypto";
import { requireAdmin } from "@/lib/helpers/server/auth/adminAuth";
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin";

const BUCKET = "product-images";

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file");
    const productId = formData.get("productId");

    if (!(file instanceof File) || !productId) {
        return Response.json({ error: "Upload invalido." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const storagePath = `products/${productId}/${fileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET)
        .upload(storagePath, Buffer.from(await file.arrayBuffer()), {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        return Response.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(storagePath);

    return Response.json({
        url: data.publicUrl,
        storagePath,
    });
}
