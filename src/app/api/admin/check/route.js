import { requireAdmin } from "@/lib/helpers/server/auth/adminAuth";

export async function GET(request) {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;

    return Response.json(
        {
            ok: true,
            user: {
                id: auth.user.id,
                email: auth.user.email,
                role: auth.user.role,
            },
        },
        { status: 200 },
    );
}
