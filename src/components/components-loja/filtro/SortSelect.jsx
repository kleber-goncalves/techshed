"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function SortSelect({ sort, setSort }) {
    return (
        <section className="flex justify-end w-full mb-4  ">
            <div className="flex gap-2">
                {/* Label estilo Mercado Livre */}
                <span className="text-sm text-muted-foreground hidden sm:block">
                    Ordenar por:
                </span>

                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger
                        className="
              w-[160px]
              h-9
              border-none
              shadow-none
              text-sm
              font-medium
              hover:text-blue-200
              focus:ring-0
              focus:ring-offset-0
              bg-transparent
              
            "
                    >
                        <SelectValue placeholder="Mais relevantes" />
                    </SelectTrigger>

                    <SelectContent align="end">
                        <SelectItem value="relevance">
                            Mais relevantes
                        </SelectItem>

                        <SelectItem value="az">Nome (A → Z)</SelectItem>
                        <SelectItem value="za">Nome (Z → A)</SelectItem>
                        <SelectItem value="price-asc">Menor preço</SelectItem>
                        <SelectItem value="price-desc">Maior preço</SelectItem>
                        <SelectItem value="rating">Melhor avaliação</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </section>
    );
}
