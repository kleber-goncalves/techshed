/**
 * Aplica filtros avancados em uma lista de produtos
 * @param {Array} produtos - lista de produtos normalizados
 * @param {Object} filters - estado atual dos filtros
 * @returns {Array} produtos filtrados
 */
export function applyFilters(produtos, filters) {
    // Seguranca defensiva
    if (!Array.isArray(produtos)) return [];
    if (!filters) return produtos;

    return produtos.filter((produto) => {
        const price = produto.priceCents ?? 0;
        const rating = produto.rating ?? 0;

        // Busca textual
        const matchSearch =
            !filters.search ||
            produto.name.toLowerCase().includes(filters.search.toLowerCase());

        // Categoria
        const matchCategory =
            filters.category === "all" || produto.category === filters.category;

        // Faixa de preco
        const matchPrice =
            produto.priceCents >= (filters.minPrice ?? 0) &&
            produto.priceCents <= (filters.maxPrice ?? Infinity);

        // Estoque
        const matchStock = !filters.onlyInStock || (produto.stock ?? 0) > 0;

        // Novidade
        const matchNew = !filters.onlyNew || produto.isNew === true;

        // Avaliacao minima
        const matchRating = rating >= (filters.minRating ?? 0);

        // Features
        const matchFeatures =
            !filters.features?.length ||
            filters.features.every((f) => produto.features?.includes(f));

        // Produto passa se TODOS forem verdadeiros
        return (
            matchSearch &&
            matchCategory &&
            matchPrice &&
            matchStock &&
            matchNew &&
            matchRating &&
            matchFeatures
        );
    });
}