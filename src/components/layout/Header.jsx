"use client";

import { useState } from "react";
import SearchModal from "@/components/Search/SearchModal";

import React from "react";
import Link from "next/link";

// shadcn/ui components
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Lucide icons
import { Search, Heart, ShoppingCart, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";

const BtnThemas = dynamic(() => import("../btnTema"), {
    ssr: false,
    loading: () => <div className="p-2 h-9 w-9" />, // Opcional: um placeholder
});

export default function Header() {
    const [openSearch, setOpenSearch] = useState(false);
    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-black shadow-md">
                <div className="flex flex-row gap-5">
  <Link href="/" className="flex flex-row">
                    <h1 className="text-[40px] font-semibold">TechShed</h1>
                </Link>
   
                <Button variant="ghost" onClick={() => setOpenSearch(true)} className="cursor-pointer">
                    <Search className="w-12 h-12" />
                </Button>
                </div>
              

                <div className="flex items-center gap-4">
                    <BtnThemas />
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1"
                                >
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback>SK</AvatarFallback>
                                    </Avatar>
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    Configurações da Conta
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Meus Pedidos
                                </DropdownMenuItem>
                                <DropdownMenuItem>Sair</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Link href="/favoritos">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-1"
                        >
                            <Heart className="w-5 h-5 text-red-500" />
                            Favoritos
                        </Button>
                    </Link>
                    <Link href="/carrinho">
                        <Button variant="ghost">
                            <ShoppingCart className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </header>
            {openSearch && <SearchModal onClose={() => setOpenSearch(false)} />}
        </>
    );
}
