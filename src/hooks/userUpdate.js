// src/lib/api/userUpdate.js
import { supabase } from "@/lib/supabase/supabaseClient";

/**
 * Atualiza os dados do usuário.
 * @param {string} userId - ID do usuário
 * @param {{name?: string, email?: string, phone?: string, newPassword?: string}} data
 * @returns {Promise<{ success: boolean, payload?: any, error?: string }>}
 */
export async function updateUserProfile(userId, data) {
    try {
        // Validação mínima
        if (!userId) {
            return { success: false, error: "ID do usuário não informado." };
        }

        if (!data.email && !data.name && !data.phone && !data.newPassword) {
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
