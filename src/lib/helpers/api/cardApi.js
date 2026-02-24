import { supabase } from "@/lib/supabase/supabaseClient";

async function getToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
}

export async function getCards() {
    const token = await getToken();
    const res = await fetch("/api/cards", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
}

export async function addCard(data) {
    const token = await getToken();
    const res = await fetch("/api/cards", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        console.log("Erro ao adicionar um card");
        return;
    }

    return res.json();
}

/**
 * Exclui uma carta pelo seu ID.
 *
 * @param {Object} data - Dados da carta a ser excluida.
 * @returns {Promise} - Resposta com o resultado da operação.
 * @throws {Response} - Erro de nao autenticado com status 401.
 */
export async function deleteCard(id) {
    const token = await getToken();
    const res = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return res.json();
}