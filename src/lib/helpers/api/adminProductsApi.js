import { supabase } from "@/lib/supabase/supabaseClient";

async function getToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
}

export function getAdminProduct(id) {
    return authFetch(`/api/admin/products/${id}`);
}

async function authFetch(url, init = {}) {
    const token = await getToken();
    if (!token) {
        const error = new Error("Sessão expirada. Faça login novamente.");
        error.status = 401;
        throw error;
    }

    const headers = new Headers(init.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    if (init.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const res = await fetch(url, {
        ...init,
        headers,
        cache: "no-store",
    });

    if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        const error = new Error(payload.error || `Erro HTTP ${res.status}`);
        error.status = res.status;
        throw error;
    }

    return res.json();
}

export function listAdminProducts({
    search = "",
    status = "all",
    page = 1,
    limit = 20,
} = {}) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (status && status !== "all") params.set("status", status);
    params.set("page", String(page));
    params.set("limit", String(limit));

    return authFetch(`/api/admin/products?${params.toString()}`);
}

export function createAdminProduct(payload) {
    return authFetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateAdminProduct(id, payload) {
    return authFetch(`/api/admin/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function archiveAdminProduct(id) {
    return authFetch(`/api/admin/products/${id}`, {
        method: "DELETE",
    });
}

export function verifyAdminAccess() {
    return authFetch("/api/admin/check");
}
