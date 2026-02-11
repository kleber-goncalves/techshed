"use client";

import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/contexts/cart-context";

export function Providers({ children }) {
    return (
        // 'attribute="class"' é essencial para funcionar com o Tailwind
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CartProvider>{children}</CartProvider>
        </ThemeProvider>
    );
}
