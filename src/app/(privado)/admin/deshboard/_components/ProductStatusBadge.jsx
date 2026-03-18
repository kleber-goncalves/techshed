import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProductStatusBadge({ isActive }) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "rounded-full border px-2 py-0 text-[11px] font-medium",
                isActive
                    ? "border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                    : "border-zinc-300 bg-zinc-500/10 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300",
            )}
        >
            {isActive ? "Ativo" : "Inativo"}
        </Badge>
    );
}
