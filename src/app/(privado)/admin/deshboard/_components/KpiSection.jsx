import { AlertTriangle, CheckCircle2, Package, XCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LOW_STOCK_THRESHOLD } from "../_utils/constants";

function KpiCard({ title, value, description, icon: Icon }) {
    return (
        <Card className="gap-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
                <CardDescription className="text-xs uppercase tracking-wide">
                    {title}
                </CardDescription>
                <Icon
                    className="text-muted-foreground size-4"
                    aria-hidden="true"
                />
            </CardHeader>
            <CardContent className="space-y-1 pb-5">
                <p className="text-2xl font-semibold tracking-tight">{value}</p>
                <p className="text-muted-foreground text-xs">{description}</p>
            </CardContent>
        </Card>
    );
}

function KpiSkeletonCard() {
    return (
        <Card className="gap-3">
            <CardHeader className="space-y-0 pb-0">
                <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="space-y-2 pb-5">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32" />
            </CardContent>
        </Card>
    );
}

export default function KpiSection({ loading, metrics }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {loading ? (
                <>
                    <KpiSkeletonCard />
                    <KpiSkeletonCard />
                    <KpiSkeletonCard />
                    <KpiSkeletonCard />
                </>
            ) : (
                <>
                    <KpiCard
                        title="Total de produtos"
                        value={metrics.total}
                        description="Itens ativos e inativos no catálogo."
                        icon={Package}
                    />
                    <KpiCard
                        title="Ativos"
                        value={metrics.active}
                        description="Produtos visíveis para venda."
                        icon={CheckCircle2}
                    />
                    <KpiCard
                        title="Inativos"
                        value={metrics.inactive}
                        description="Itens pausados temporariamente."
                        icon={XCircle}
                    />
                    <KpiCard
                        title={`Estoque <= ${LOW_STOCK_THRESHOLD}`}
                        value={metrics.lowStock}
                        description="Produtos que exigem reposição."
                        icon={AlertTriangle}
                    />
                </>
            )}
        </div>
    );
}
