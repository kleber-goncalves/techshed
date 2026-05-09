"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'error' | 'success' | 'info', text: string }
    const router = useRouter();

    const isFormValid = useMemo(() => {
        return Boolean(email?.trim()) && Boolean(password);
    }, [email, password]);

    /**
     * Tenta criar uma conta no Supabase com o email e senha fornecidos.
     * Se houver erro, alerta o erro.
     * Se a conta for criada com sucesso, alerta que a conta foi criada e pede para verificar o email.
     */
    const handleSignUp = async () => {
        setIsLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({ type: "success", text: "Conta criada! Verifique seu email para confirmar." });
        }

        setIsLoading(false);
    };

    /**
     * Tenta fazer login no Supabase com o email e senha fornecidos.
     * Se houver erro, alerta o erro.
     * Se o login for feito com sucesso, manda o token do Supabase para o backend
     * e redireciona para a pagina de perfil.
     */

    async function handleLogin() {
        setIsLoading(true);
        setMessage(null);

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setMessage({ type: "error", text: error.message });
            setIsLoading(false);
            return;
        }

        if (!data?.session?.access_token) {
            setMessage({ type: "error", text: "Não foi possível iniciar a sessão. Tente novamente." });
            setIsLoading(false);
            return;
        }

        await syncUserAndRedirect(data.session.access_token);
        setIsLoading(false);
    }

    async function syncUserAndRedirect(accessToken) {
        try {
            await fetch("/api/syncUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ access_token: accessToken }),
            });
        } finally {
            router.push("/account/minha_conta");
        }
    }

    // Se já existir sessão, sincroniza com o backend e redireciona.
    useEffect(() => {
        let isMounted = true;

        async function run() {
            try {
                const { data } = await supabase.auth.getSession();
                const accessToken = data?.session?.access_token;
                if (!accessToken) return;

                if (!isMounted) return;
                setIsLoading(true);
                setMessage({ type: "info", text: "Entrando..." });
                await syncUserAndRedirect(accessToken);
            } catch {
                // silencioso: não bloqueia a tela se o getSession falhar
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        run();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <header className="bg-[#FFE600] border-b border-black/10">
                <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-black/10 flex items-center justify-center font-black text-black">
                            TS
                        </div>
                        <div className="leading-tight">
                            <div className="font-extrabold tracking-tight text-black">TechShed</div>
                            <div className="text-xs text-black/70">Acesse sua conta</div>
                        </div>
                    </div>
                    <div className="text-xs text-black/70 hidden sm:block">Compra e venda com mais confiança</div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-10">
                <div className="grid gap-6 lg:grid-cols-2 items-start">
                    <div className="hidden lg:block">
                        <div className="rounded-2xl bg-white border border-black/10 p-8">
                            <div className="text-sm font-semibold text-black/70">
                                Bem-vindo de volta
                            </div>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-black">
                                Entre para acompanhar seus pedidos e sua conta
                            </h2>
                            <p className="mt-4 text-sm text-black/70">
                                Login rápido e seguro para acessar sua conta.
                            </p>
                            <div className="mt-6 grid gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#1D4ED8] font-bold">
                                        ✓
                                    </div>
                                    <div className="text-sm text-black/80">
                                        Sincroniza sua conta automaticamente
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#1D4ED8] font-bold">
                                        ✓
                                    </div>
                                    <div className="text-sm text-black/80">
                                        Sessão protegida pelo Supabase
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#EAF2FF] flex items-center justify-center text-[#1D4ED8] font-bold">
                                        ✓
                                    </div>
                                    <div className="text-sm text-black/80">
                                        Acesso em segundos
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="border-black/10 shadow-sm rounded-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Use seu email e senha para acessar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="voce@exemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label
                                    className="text-sm font-medium"
                                    htmlFor="password"
                                >
                                    Senha
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                />
                            </div>

                            {message?.text ? (
                                <div
                                    className={[
                                        "rounded-lg border px-3 py-2 text-sm",
                                        message.type === "error"
                                            ? "border-red-200 bg-red-50 text-red-700"
                                            : "",
                                        message.type === "success"
                                            ? "border-green-200 bg-green-50 text-green-700"
                                            : "",
                                        message.type === "info"
                                            ? "border-blue-200 bg-blue-50 text-blue-700"
                                            : "",
                                    ].join(" ")}
                                    role={
                                        message.type === "error"
                                            ? "alert"
                                            : "status"
                                    }
                                >
                                    {message.text}
                                </div>
                            ) : null}

                            <Button
                                onClick={handleLogin}
                                disabled={!isFormValid || isLoading}
                                className="w-full bg-[#3483FA] hover:bg-[#2C6FE0] text-white"
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3">
                            <div className="text-xs text-muted-foreground text-center">
                                Não tem conta? Crie uma agora.
                            </div>
                            <Button
                                onClick={handleSignUp}
                                disabled={!isFormValid || isLoading}
                                className="w-full rounded-xl bg-black text-white hover:bg-black/90"
                            >
                                Criar conta
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}
