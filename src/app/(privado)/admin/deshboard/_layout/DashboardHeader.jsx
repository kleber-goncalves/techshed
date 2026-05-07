import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ onNewProduct }) {
    return (
        <header className="bg-card flex flex-col gap-4 rounded-xl border p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">Painel de produtos</h1>
                <p className="text-muted-foreground text-sm">
                    Gerencie catálogo, estoque e disponibilidade com uma visão centralizada.
                </p>
            </div>
            <Button type="button" onClick={onNewProduct} className="gap-2 cursor-pointer">
                <Plus className="size-4" />
                Novo produto
            </Button>
        </header>
    );
}
