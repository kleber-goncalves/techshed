"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Login() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        message,
        isFormValid,
        handleLogin,
    } = useAuth();

    return (
        <div className="min-h-screen bg-[#F5F5F5] dark:bg-black">


            <main className="mx-auto max-w-5xl px-4 py-10 ">
                <div className="grid gap-6 lg:grid-cols-2 items-start">
                    <div className="hidden lg:block">
                        <div className="rounded-2xl bg-white dark:bg-card border border-black/10 p-8">
                            <div className="text-sm font-semibold text-black/70 dark:text-white/80">
                                Bem-vindo de volta
                            </div>
                            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-black dark:text-white">
                                Entre para acompanhar seus pedidos e sua conta
                            </h2>
                            <p className="mt-4 text-sm text-black/70 dark:text-white/80">
                                Login rápido e seguro para acessar sua conta.
                            </p>
                            <div className="mt-6 grid gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#bc7bfe43] flex items-center justify-center text-[#9b38ff] font-bold">
                                        ✓
                                    </div>
                                    <div className="text-sm text-black/80 dark:text-white/70">
                                        Sincroniza sua conta automaticamente
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#bc7bfe43] flex items-center justify-center text-[#9b38ff] font-bold">
                                        ✓
                                    </div>
                                    <div className="text-sm text-black/80 dark:text-white/70">
                                        Sessão protegida pelo Supabase
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-[#bc7bfe43] flex items-center justify-center text-[#9b38ff] font-bold">
                                        ✓
                                    </div>
                                    <div className="text-sm text-black/80 dark:text-white/70">
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
                                className="w-full cursor-pointer bg-[#8000ff] hover:bg-[#a743ff] text-white"
                            >
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                        </CardContent>
                        <CardFooter className="flex flex-row gap-2 mt-4 items-center justify-center">
                            <div className="text-xs text-muted-foreground text-center">
                                Não tem uma conta?
                            </div>
                            <Link
                                href="/auth/signUp"
                                className="text-sm font-semibold dark:font-semibold text-fuchsia-700 dark:text-fuchsia-400"
                            >
                                Crie uma agora
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
}
