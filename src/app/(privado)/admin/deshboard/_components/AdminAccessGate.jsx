"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminAccess } from "@/lib/helpers/api/adminProductsApi";

function AdminCheckLoading() {
    return (
        <section className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-zinc-900">
                            Verificando acesso ao painel...
                        </p>
                        <p className="text-xs text-zinc-500">
                            Aguarde um instante.
                        </p>
                    </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-zinc-300" />
                </div>
            </div>
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
