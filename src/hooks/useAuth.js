"use client";

import { syncUserWithBackend } from "@/lib/helpers/authHelper";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useAuth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'error' | 'success' | 'info', text: string }
    const router = useRouter();

    const isFormValid = useMemo(() => {
        return Boolean(email?.trim()) && Boolean(password);
    }, [email, password]);

    const syncAndRedirect = useCallback(
        async (token) => {
            try {
                await syncUserWithBackend(token);
            } finally {
                router.push("/account/minha_conta");
            }
        },
        [router]
    );

    const handleSignUp = async () => {
        setIsLoading(true);
        setMessage(null);
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({
                type: "success",
                text: "Conta criada! Verifique seu email para confirmar.",
            });
        }
        setIsLoading(false);
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setMessage(null);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data?.session?.access_token) {
            setMessage({
                type: "error",
                text: error?.message || "Erro ao iniciar sessão.",
            });
            setIsLoading(false);
            return;
        }

        await syncAndRedirect(data.session.access_token);
        setIsLoading(false);
    };

    useEffect(() => {
        let isMounted = true;
        async function checkSession() {
            try {
                const { data } = await supabase.auth.getSession();
                const token = data?.session?.access_token;
                if (token && isMounted) {
                    setIsLoading(true);
                    setMessage({ type: "info", text: "Entrando..." });
                    await syncAndRedirect(token);
                }
            } catch {
                // Silencioso
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        checkSession();
        return () => {
            isMounted = false;
        };
    }, [syncAndRedirect]);

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        message,
        isFormValid,
        handleLogin,
        handleSignUp,
    };
}
