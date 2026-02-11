export function formatCurrency(cents) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format((cents ?? 0) / 100);
}
