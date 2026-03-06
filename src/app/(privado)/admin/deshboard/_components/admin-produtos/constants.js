export const LOW_STOCK_THRESHOLD = 5;

export const STATUS_FILTER_OPTIONS = [
    { value: "all", label: "Todos" },
    { value: "active", label: "Somente ativos" },
    { value: "inactive", label: "Somente inativos" },
];

export function createEmptyProductForm() {
    return {
        name: "",
        slug: "",
        description: "",
        img: "",
        alt: "",
        priceCents: 0,
        stock: 0,
        category: "",
        catalogKey: "",
        promocao: "",
        featuresText: "",
        isActive: true,
    };
}
