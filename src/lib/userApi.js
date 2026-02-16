// lib/api/userApi.js

/**
 * Busca todos os usuários
 * @returns {Promise<Array>}
 */
export async function getAllUsers() {
    const response = await fetch("/api/users");
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
    const response = await fetch(`/api/users/${id}`);
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
    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
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
    const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
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
    const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Erro ao deletar usuário");
    }
    return await response.json();
}
