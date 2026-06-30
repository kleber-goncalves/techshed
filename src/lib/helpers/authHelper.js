/**
 * Sincroniza o token do Supabase com a base de dados interna através da API do Next.js
 * @param {string} accessToken
 */
export async function syncUserWithBackend(accessToken) {
    const response = await fetch("/api/syncUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
    });

    if (!response.ok) {
        throw new Error("Falha ao sincronizar utilizador com o servidor.");
    }
    return response.json();
}
