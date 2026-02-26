"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useFavorite } from "@/contexts/favorit-context";
import { useHeaderAuth } from "./useHeaderAuth";

export default function HeaderUserSection() {
    const { clearCart } = useCart();
    const { clearFavorites } = useFavorite();

    const handleLogoutSuccess = useCallback(() => {
        clearCart();
        clearFavorites();
    }, [clearCart, clearFavorites]);

    const {
        isAuthenticated,
        isAuthReady,
        isLoggingOut,
        displayName,
        userInitials,
        logout,
    } = useHeaderAuth({ onLogoutSuccess: handleLogoutSuccess });

    const handleLogout = useCallback(async () => {
        const { error } = await logout();
        if (error) {
            alert(`Erro ao sair: ${error.message}`);
        }
    }, [logout]);

    if (!isAuthReady) return null;

    if (!isAuthenticated) {
        return (
            <div className="flex items-center gap-3">
                <Link href="/auth" className="text-sm hover:underline">
                    Criar a sua conta
                </Link>
                <Link href="/auth" className="text-sm font-medium hover:underline">
                    Entre
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <span className="max-w-32 truncate text-sm">
                            {displayName}
                        </span>
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem disabled className="opacity-100">
                        Olá, {displayName}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/account">Configurações da Conta</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Meus Pedidos</DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={isLoggingOut}
                        onSelect={(event) => {
                            event.preventDefault();
                            handleLogout();
                        }}
                    >
                        {isLoggingOut ? "Saindo..." : "Sair"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
