import prisma from "@/lib/prisma/prisma";
import { requireAdmin } from "@/lib/helpers/server/auth/adminAuth";

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
        },
    });
    return Response.json(user);
}

export async function GET(request) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    const users = await prisma.user.findMany();
    return Response.json(users);
}
