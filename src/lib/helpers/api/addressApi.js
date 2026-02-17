import { supabase } from "@/lib/supabase/supabaseClient";

async function getToken(address) {
    const {
        data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token;
}

export async function getAddresses() {
    const token = await getToken();
    const res = await fetch("/api/addresses", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok ? res.json() : [];
}

export async function createAddress(data) {
    const token = await getToken();
    const res = await fetch("/api/addresses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateAddress(id, data) {
    const token = await getToken();
    const res = await fetch(`/api/addresses/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteAddress(id) {
    const token = await getToken();
    const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
}