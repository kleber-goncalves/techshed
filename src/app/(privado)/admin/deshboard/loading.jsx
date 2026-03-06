export default function Loading() {
    return (
        <section className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-zinc-900">
                            Carregando painel administrativo...
                        </p>
                        <p className="text-xs text-zinc-500">
                            Preparando verificação de acesso.
                        </p>
                    </div>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-zinc-300" />
                </div>
            </div>
        </section>
    );
}
