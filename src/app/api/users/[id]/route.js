import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
    const body = await request.json();
    const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: {
            name: body.name,
            email: body.email,
        },
    });
    return Response.json(updatedUser);
}


export async function DELETE(request, { params }) {
    await prisma.user.delete({
        where: { id: params.id },
    });
    return Response.json({ success: true });
}
