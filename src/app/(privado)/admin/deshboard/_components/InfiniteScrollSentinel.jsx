import { Loader2 } from "lucide-react";

export default function InfiniteScrollSentinel({
    sentinelRef,
    loadingMore,
    hasMore,
}) {
    if (!hasMore && !loadingMore) {
        return (
            <p className="py-4 text-center text-xs text-muted-foreground">
                Fim da lista.
            </p>
        );
    }

    return (
        <div
            ref={sentinelRef}
            className="flex h-14 items-center justify-center"
        >
            {loadingMore ? (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Carregando mais produtos...
                </span>
            ) : (
                <span className="text-xs text-muted-foreground">
                    Role para carregar mais
                </span>
            )}
        </div>
    );
}
