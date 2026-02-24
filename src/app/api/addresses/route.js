import prisma from "@/lib/prisma/prisma";
import { supabase } from "@/lib/supabase/supabaseClient";

export async function GET(request) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user)
        return Response.json({ error: "Não autenticado" }, { status: 401 });

    const addresses = await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return Response.json(addresses);
}


export async function POST(request) {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    const {
        data: { user },
    } = await supabase.auth.getUser(token);

    if (!user)
        return Response.json({ error: "Não autenticado" }, { status: 401 });

    const body = await request.json();

    const newAddress = await prisma.address.create({
        data: {
            userId: user.id,
            label: body.label,
            street: body.street,
            city: body.city,
            state: body.state,
            zipCode: body.zipCode,
        },
    });

    return Response.json(newAddress);
}
