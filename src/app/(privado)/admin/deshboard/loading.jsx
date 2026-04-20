import { Loader2, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <section className="flex min-h-[60vh] items-center justify-center px-4">
            <Card className="w-full max-w-lg">
                <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
                            <Package className="size-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base">Carregando painel administrativo</CardTitle>
                            <CardDescription>
                                Preparando produtos, permissões e métricas.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-6">
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Loader2 className="size-4 animate-spin" />
                        Organizando dados do catálogo...
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                </CardContent>
            </Card>
        </section>
    );
}
