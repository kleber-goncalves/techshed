import { supabase } from "@/lib/supabase/supabaseClient";

async function getToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
}

export async function getCartItems() {
    const token = await getToken();
    const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
}

export async function saveCartItems(items) {
    const token = await getToken();
    const res = await fetch("/api/cart", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
    });
    return res.json();
}