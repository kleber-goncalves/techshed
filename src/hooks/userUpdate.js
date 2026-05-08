import { supabase } from "@/lib/supabase/supabaseClient";

export async function updateUserProfile(userId, data) {
    try {
        // Validação mínima
        if (!userId) {
            return { success: false, error: "ID do usuário não informado." };
        }

        if (
            !data.email &&
            !data.name &&
            !data.phone &&
            !data.newPassword &&
            !data.avatarUrl &&
            !data.avatarStoragePath
        ) {
            return { success: false, error: "Nada para atualizar." };
        }

        // Atualiza dados na tabela Prisma
        const tokenResponse = await supabase.auth.getSession();

        const accessToken = tokenResponse?.data?.session?.access_token;

        if (!accessToken) {
            return { success: false, error: "Usuário não autenticado." };
        }

        // API de atualização do usuário (Prisma)
        const res = await fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                phone: data.phone,
                avatarUrl: data.avatarUrl,
                avatarStoragePath: data.avatarStoragePath,
            }),
        });

        if (!res.ok) {
            const errPayload = await res.json();
            return {
                success: false,
                error: errPayload?.error || "Erro ao atualizar.",
            };
        }

        // Atualiza a senha caso tenha sido pedido
        if (data.newPassword) {
            const { error: supaError } = await supabase.auth.updateUser({
                password: data.newPassword,
            });

            if (supaError) {
                return { success: false, error: supaError.message };
            }
        }

        const updatedUser = await res.json();

        return { success: true, payload: updatedUser };
    } catch (error) {
        return { success: false, error: error?.message || "Erro desconhecido" };
    }
}

export async function uploadProfileAvatar(file) {
    try {
        if (!(file instanceof File)) {
            return { success: false, error: "Arquivo inválido." };
        }

        const tokenResponse = await supabase.auth.getSession();
        const accessToken = tokenResponse?.data?.session?.access_token;

        if (!accessToken) {
            return { success: false, error: "Usuário não autenticado." };
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/users/avatar", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const errPayload = await res.json();
            return {
                success: false,
                error: errPayload?.error || "Erro ao enviar imagem.",
            };
        }

        const payload = await res.json();
        return { success: true, payload };
    } catch (error) {
        return { success: false, error: error?.message || "Erro desconhecido" };
    }
}

export async function deleteOldProfileAvatar() {
    try {
        const tokenResponse = await supabase.auth.getSession();
        const accessToken = tokenResponse?.data?.session?.access_token;

        if (!accessToken) {
            return { success: false, error: "Usuário não autenticado." };
        }

        const res = await fetch("/api/users/avatar", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const errPayload = await res.json();
            return {
                success: false,
                error: errPayload?.error || "Erro ao remover imagem antiga.",
            };
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error?.message || "Erro desconhecido" };
    }
}
