"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorite } from "@/contexts/favorit-context";

export default function IconFavorit({ productId }) {
    const { isFavorite, toggleFavorite } = useFavorite();
    const isActive = isFavorite(productId);

    return (
        <Button
            type="button"
            variant="ghost"
            className={`cursor-pointer rounded-full ${
                isActive
                    ? "text-red-600 hover:text-red-700"
                    : "text-neutral-500 hover:text-red-600"
            }`}
            onClick={() => toggleFavorite(productId)}
            aria-pressed={isActive}
            aria-label={
                isActive ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
        >
            <Heart className={`w-7 h-7 ${isActive ? "fill-current" : ""}`} />
        </Button>
    );
}
