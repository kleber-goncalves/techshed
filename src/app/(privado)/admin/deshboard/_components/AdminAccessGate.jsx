"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { verifyAdminAccess } from "@/lib/helpers/api/adminProductsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function AdminCheckLoading() {
    return (
        <section className="flex min-h-[60vh] items-center justify-center px-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                            <ShieldCheck className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Verificando acesso administrativo</CardTitle>
                            <CardDescription>
                                Estamos confirmando suas permissões. Aguarde um instante.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-6">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Loader2 className="size-4 animate-spin" />
                        Carregando ambiente de gestão...
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </CardContent>
            </Card>
        </section>
    );
}

function AdminCheckError({ message, onRetry }) {
    return (
        <section className="flex min-h-[60vh] items-center justify-center px-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-destructive/10 text-destructive flex size-10 items-center justify-center rounded-full">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base">
                                Não foi possível validar o acesso
                            </CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-6">
                    <Button type="button" onClick={onRetry}>
                        Tentar novamente
                    </Button>
                </CardContent>
            </Card>
        </section>
    );
}

export default function AdminAccessGate({ children }) {
    const router = useRouter();
    const [status, setStatus] = useState("checking");
    const [errorMessage, setErrorMessage] = useState("");

    const checkAccess = useCallback(async () => {
        try {
            setStatus("checking");
            setErrorMessage("");

            await verifyAdminAccess();
            setStatus("allowed");
        } catch (error) {
            if (error?.status === 404) {
                router.replace("/404");
                return;
            }

            if (error?.status === 401) {
                router.replace("/auth");
                return;
            }

            setErrorMessage(
                error?.message ||
                    "O painel não conseguiu confirmar suas permissões neste momento.",
            );
            setStatus("error");
        }
    }, [router]);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                setStatus("checking");
                setErrorMessage("");

                await verifyAdminAccess();
                if (!active) return;
                setStatus("allowed");
            } catch (error) {
                if (!active) return;

                if (error?.status === 404) {
                    router.replace("/404");
                    return;
                }

                if (error?.status === 401) {
                    router.replace("/auth");
                    return;
                }

                setErrorMessage(
                    error?.message ||
                        "O painel não conseguiu confirmar suas permissões neste momento.",
                );
                setStatus("error");
            }
        })();

        return () => {
            active = false;
        };
    }, [router]);

    if (status === "checking") return <AdminCheckLoading />;
    if (status === "error") {
        return (
            <AdminCheckError
                message={errorMessage}
                onRetry={checkAccess}
            />
        );
    }

    return children;
}
