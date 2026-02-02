export default function StockFilter({ filters, setFilters }) {
    return (
        <label className="flex items-center gap-2">
            <input
                type="checkbox"
                checked={filters.onlyInStock}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        onlyInStock: e.target.checked,
                    })
                }
            />
            Somente em estoque
        </label>
    );
}
