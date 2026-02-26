"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { getDisplayName, getInitials } from "@/lib/helpers/userDisplay";

export function useHeaderAuth({ onLogoutSuccess } = {}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [displayName, setDisplayName] = useState("");

    const applySessionUser = useCallback((user) => {
        setIsAuthenticated(Boolean(user));
        setDisplayName(user ? getDisplayName(user) : "");
    }, []);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (!mounted) return;
                applySessionUser(data?.session?.user ?? null);
            } catch {
                if (!mounted) return;
                applySessionUser(null);
            } finally {
                if (mounted) setIsAuthReady(true);
            }
        })();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                applySessionUser(session?.user ?? null);
                setIsAuthReady(true);
            },
        );

        return () => {
            mounted = false;
            listener?.subscription?.unsubscribe?.();
        };
    }, [applySessionUser]);

    const logout = useCallback(async () => {
        if (isLoggingOut) return { error: null };
        setIsLoggingOut(true);

        const { error } = await supabase.auth.signOut();

        if (!error) {
            applySessionUser(null);
            onLogoutSuccess?.();
        }

        setIsLoggingOut(false);
        return { error };
    }, [applySessionUser, isLoggingOut, onLogoutSuccess]);

    const userInitials = useMemo(
        () => getInitials(displayName),
        [displayName],
    );

    return {
        isAuthenticated,
        isAuthReady,
        isLoggingOut,
        displayName,
        userInitials,
        logout,
    };
}
