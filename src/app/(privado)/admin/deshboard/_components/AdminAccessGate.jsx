"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { verifyAdminAccess } from "@/lib/helpers/api/adminProductsApi";
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

export default function AdminAccessGate({ children }) {
    const router = useRouter();
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let active = true;

        async function checkAccess() {
            try {
                await verifyAdminAccess();
                if (!active) return;
                setStatus("allowed");
            } catch {
                if (!active) return;
                router.replace("/404");
            }
        }

        checkAccess();

        return () => {
            active = false;
        };
    }, [router]);

    if (status !== "allowed") return <AdminCheckLoading />;

    return children;
}
