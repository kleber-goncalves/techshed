"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Sugestão de ícones

export default function BtnTemas() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    // resolvedTheme lida melhor com o tema 'system'
    

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Se ainda não montou, renderizamos um botão "vazio" ou um esqueleto
    // Isso evita o erro de hidratação e mantém o layout estável
    if (!mounted) {
        return <div className="p-2 h-9 w-9" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            aria-label="Toggle Dark Mode"
            className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all ease-linear duration-400"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
                <Moon className="w-5 h-5 text-gray-800" />
            )}
        </button>
    );
}
