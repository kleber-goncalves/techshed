// lib/api/userApi.js

import { supabase } from "@/lib/supabase/supabaseClient";

async function getAccessToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token;
}

async function authFetch(url, init = {}) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("Usuário não autenticado");
    }

    const headers = new Headers(init.headers || {});
    headers.set("Authorization", `Bearer ${token}`);

    if (init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    return fetch(url, {
        ...init,
        headers,
    });
}

/**
 * Busca todos os usuários
 * @returns {Promise<Array>}
 */
export async function getAllUsers() {
    const response = await authFetch("/api/users");
    if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
    }
    return await response.json();
}

/**
 * Busca um usuário pelo ID
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getUserById(id) {
    const response = await authFetch(`/api/users/${id}`);
    if (!response.ok) {
        throw new Error("Erro ao buscar usuário");
    }
    return await response.json();
}

/**
 * Cria um usuário
 * @param {{name: string, email: string}} data
 */
export async function createUser(data) {
    const response = await authFetch("/api/users", {
        method: "POST",
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Erro ao criar usuário");
    }
    return await response.json();
}

/**
 * Atualiza um usuário existente
 * @param {string} id
 * @param {{name?: string, email?: string}} data
 */
export async function updateUser(id, data) {
    const response = await authFetch(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
    }
    return await response.json();
}

/**
 * Deleta um usuário
 * @param {string} id
 */
export async function deleteUser(id) {
    const response = await authFetch(`/api/users/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Erro ao deletar usuário");
    }
    return await response.json();
}
