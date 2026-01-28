export default function CategoryFilter({ filters, setFilters }) {
    return (
        <div className="bg-green-200 border rounded-2xl p-4 border-black">
            <p className="font-semibold mb-2">Categoria</p>

            <select
                className="w-full border border-black p-2 rounded"
                value={filters.category}
                onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                }
            >
                <option value="all">Todas</option>
                <option value="celular">Celulares</option>
                <option value="tablet">Tablets</option>
                <option value="camera">Câmeras</option>
            </select>
        </div>
    );
}
