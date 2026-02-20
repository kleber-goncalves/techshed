"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/cart-context";
import { FavoriteProvider } from "@/contexts/favorit-context";
import { CatalogoProvider } from "@/contexts/catalog-context";

export function Providers({ children }) {
    return (
        // 'attribute="class"' é essencial para funcionar com o Tailwind
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CatalogoProvider>
                <CartProvider>
                    <FavoriteProvider>{children}</FavoriteProvider>
                </CartProvider>
            </CatalogoProvider>
        </ThemeProvider>
    );
}
