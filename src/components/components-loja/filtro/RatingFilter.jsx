export default function RatingFilter({ filters, setFilters }) {
    return (
        <div className="border-b py-10">
            <p className="font-semibold mb-2">Avaliação mínima</p>

            <select
                className="w-full border p-2 rounded dark:bg-black"
                value={filters.minRating}
                onChange={(e) =>
                    setFilters({
                        ...filters,
                        minRating: Number(e.target.value),
                    })
                }
            >
                <option value={0}>Todas</option>
                <option value={3}>⭐⭐⭐ ou mais</option>
                <option value={4}>⭐⭐⭐⭐ ou mais</option>
                <option value={4.5}>⭐⭐⭐⭐⭐</option>
            </select>
        </div>
    );
}
