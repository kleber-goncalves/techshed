/**
 * Ordena produtos com base no critério selecionado
 * @param {Array} produtos
 * @param {string} sort
 * @returns {Array}
 */
export function applySort(produtos, sort) {
    if (!Array.isArray(produtos)) return [];

    const sorted = [...produtos]; // evita mutação

    switch (sort) {
        case "az":
            return sorted.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

        case "za":
            return sorted.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));

        case "price-asc":
            return sorted.sort((a, b) => a.priceCents - b.priceCents);

        case "price-desc":
            return sorted.sort((a, b) => b.priceCents - a.priceCents);

        case "rating":
            return sorted.sort((a, b) => b.rating - a.rating);

        default:
            return sorted;
    }
}
