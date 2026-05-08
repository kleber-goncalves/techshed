"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getDisplayName, getInitials } from "@/lib/helpers/userDisplay";

export function useHeaderAuth({ onLogoutSuccess } = {}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const applySessionUser = useCallback((user) => {
        setIsAuthenticated(Boolean(user));
        setDisplayName(user ? getDisplayName(user) : "");
        if (!user) setAvatarUrl("");
    }, []);

    const loadAvatarFromDb = useCallback(async (session) => {
        const token = session?.access_token;
        const sessionUser = session?.user;

        if (!token || !sessionUser?.id) {
            setAvatarUrl("");
            return;
        }

        try {
            const res = await fetch(`/api/users/${sessionUser.id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setAvatarUrl("");
                return;
            }

            const dbUser = await res.json();
            setAvatarUrl(dbUser?.avatarUrl || "");
        } catch {
            setAvatarUrl("");
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (!mounted) return;

                const session = data?.session ?? null;
                applySessionUser(session?.user ?? null);
                await loadAvatarFromDb(session);
            } catch {
                if (!mounted) return;
                applySessionUser(null);
                setAvatarUrl("");
            } finally {
                if (mounted) setIsAuthReady(true);
            }
        })();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                applySessionUser(session?.user ?? null);
                await loadAvatarFromDb(session ?? null);
                setIsAuthReady(true);
            },
        );

        return () => {
            mounted = false;
            listener?.subscription?.unsubscribe?.();
        };
    }, [applySessionUser, loadAvatarFromDb]);

    const logout = useCallback(async () => {
        if (isLoggingOut) return { error: null };
        setIsLoggingOut(true);

        const { error } = await supabase.auth.signOut();

        if (!error) {
            applySessionUser(null);
            setAvatarUrl("");
            onLogoutSuccess?.();
        }

        setIsLoggingOut(false);
        return { error };
    }, [applySessionUser, isLoggingOut, onLogoutSuccess]);

    const userInitials = useMemo(() => getInitials(displayName), [displayName]);

    return {
        isAuthenticated,
        isAuthReady,
        isLoggingOut,
        displayName,
        avatarUrl,
        userInitials,
        logout,
    };
}
