"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
    return (
        // 'attribute="class"' é essencial para funcionar com o Tailwind
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    );
}
