export default function PriceFilter({ filters, setFilters }) {
    return (
        <div className="border border-black rounded-2xl p-4 bg-violet-300">
            <p className="font-semibold mb-2 ">Preço</p>

            <div className="flex gap-1 bg-red-300">
                <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 border p-2 rounded border-black"
                    value={filters.minPrice}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            minPrice: Number(e.target.value),
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 border p-2 rounded border-black"
                    value={filters.maxPrice}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            maxPrice: Number(e.target.value),
                        })
                    }
                />
            </div>
        </div>
    );
}
