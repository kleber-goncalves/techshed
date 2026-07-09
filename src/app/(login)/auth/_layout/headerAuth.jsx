'use client'

import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";




export default function Headerauth() {
    const locationPage = usePathname();

    const pageTxt = {
        "/auth/login": "Acesse sua conta",
        "/auth/signUp": "Crie sua conta",
    };

    const text = pageTxt[locationPage] || "";
    return (
        <>
            <header className="bg-[#8000ff] border-b border-black/10">
                <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-black/20 flex items-center justify-center font-black text-white">
                            TS
                        </div>
                        <div className="leading-tight">
                            <div className="font-extrabold tracking-tight text-white">
                                TechShed
                            </div>
                            <div className="text-xs text-white/80">{text}</div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-20 text-center justify-center items-center">
                        <p className="text-sm text-white/80 hidden sm:block">
                            Compra e venda com mais confiança
                        </p>
                        <Link
                            href="/"
                            className="flex flex-row gap-2 text-center justify-center items-center text-white/70 hover:text-white"
                        >
                            <p>Sair</p>
                            <LogIn className="cursor-pointer w-7 h-7" />
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
}
