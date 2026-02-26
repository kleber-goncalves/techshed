"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useFavorite } from "@/contexts/favorit-context";
import { getCartBackPath, saveCartReturnPath } from "@/lib/cartReturnPath";
import { getFvrtBackPath, saveFvrtReturnPath } from "@/lib/fvrtReturnPath";

function CounterBadge({ value }) {
    return (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-[11px] leading-none flex items-center justify-center font-semibold">
            {value > 99 ? "99+" : value}
        </span>
    );
}

export default function HeaderQuickActions() {
    const { totalItems } = useCart();
    const { totalFavorites } = useFavorite();
    const router = useRouter();
    const pathname = usePathname();
    const currentRoute = pathname || "/";

    useEffect(() => {
        if (pathname === "/carrinho") return;
        saveCartReturnPath(currentRoute);
    }, [currentRoute, pathname]);

    useEffect(() => {
        if (pathname === "/favoritos") return;
        saveFvrtReturnPath(currentRoute);
    }, [currentRoute, pathname]);

    function handleCartIconClick() {
        if (pathname === "/carrinho") {
            router.push(getCartBackPath());
            return;
        }

        saveCartReturnPath(currentRoute);
        router.push("/carrinho");
    }

    function handleFavoriteIconClick() {
        if (pathname === "/favoritos") {
            router.push(getFvrtBackPath());
            return;
        }

        saveFvrtReturnPath(currentRoute);
        router.push("/favoritos");
    }

    return (
        <>
            <Button
                variant="ghost"
                className="relative cursor-pointer flex items-center gap-1"
                onClick={handleFavoriteIconClick}
                aria-label={
                    totalFavorites > 0
                        ? `Favoritos com ${totalFavorites} itens`
                        : "Favoritos vazio"
                }
            >
                <Heart className="w-6 h-6 text-red-500 size-1" />
                {totalFavorites > 0 && <CounterBadge value={totalFavorites} />}
            </Button>

            <Button
                variant="ghost"
                className="relative cursor-pointer"
                onClick={handleCartIconClick}
                aria-label={
                    totalItems > 0
                        ? `Carrinho com ${totalItems} itens`
                        : "Carrinho vazio"
                }
            >
                <ShoppingCart className="w-5 h-5 size-1" />
                {totalItems > 0 && <CounterBadge value={totalItems} />}
            </Button>
        </>
    );
}
