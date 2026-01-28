/**
 * Aplica filtros avançados em uma lista de produtos
 * @param {Array} produtos - lista de produtos normalizados
 * @param {Object} filters - estado atual dos filtros
 * @returns {Array} produtos filtrados
 */
export function applyFilters(produtos, filters) {
  // Segurança defensiva
  if (!Array.isArray(produtos)) return [];
  if (!filters) return produtos;

  return produtos.filter((produto) => {
    // 🔍 Busca textual
    const matchSearch =
      !filters.search ||
      produto.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

    // 📂 Categoria
    const matchCategory =
      !filters.category ||
      filters.category === "all" ||
      produto.category === filters.category;

    // 💰 Faixa de preço
    const matchPrice =
      produto.priceCents >= (filters.minPrice ?? 0) &&
      produto.priceCents <= (filters.maxPrice ?? Infinity);

    // 📦 Estoque
    const matchStock =
      !filters.onlyInStock || produto.stock > 0;

    // 🆕 Novidade
    const matchNew =
      !filters.onlyNew || produto.isNew === true;

    // ⭐ Avaliação mínima
    const matchRating =
      produto.rating >= (filters.minRating ?? 0);

    // 🏷️ Features
    const matchFeatures =
      !filters.features ||
      filters.features.length === 0 ||
      filters.features.every((feature) =>
        produto.features?.includes(feature)
      );

    // ✅ Produto passa se TODOS forem verdadeiros
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
