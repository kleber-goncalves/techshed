import prisma from "@/lib/prisma/prisma";

export async function POST(request) {
    const body = await request.json();
    const user = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
        },
    });
    return Response.json(user);
}

export async function GET() {
    const users = await prisma.user.findMany();
    return Response.json(users);
}
