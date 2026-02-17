import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function PUT(request, { params }) {
    const { id } = await params;

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user)
        return Response.json({ error: "Não autenticado" }, { status: 401 });

    const body = await request.json();

    const updated = await prisma.address.updateMany({
        where: {
            id,
            userId: user.id,
        },
        data: {
            label: body.label,
            street: body.street,
            city: body.city,
            state: body.state,
            zipCode: body.zipCode,
        },
    });

    return Response.json(updated);
}


export async function DELETE(request, { params }) {
    const { id } = await params;

    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user)
        return Response.json({ error: "Não autenticado" }, { status: 401 });

    await prisma.address.deleteMany({
        where: {
            id,
            userId: user.id,
        },
    });

    return Response.json({ success: true });
}
