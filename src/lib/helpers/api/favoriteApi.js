import { supabase } from "@/lib/supabase/supabaseClient";

async function getToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
}

export async function getFavorites() {
    const token = await getToken();
    const res = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
}

export async function saveFavorites(ids) {
    const token = await getToken();
    const res = await fetch("/api/favorites", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
    });
    return res.json();
}