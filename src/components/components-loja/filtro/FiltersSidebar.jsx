'use client';

import CategoryFilter from "./CategoryFilter";
import FeatureFilter from "./FeatureFilter";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";
import StockFilter from "./StockFilter";



export default function FiltersSidebar({ filters, setFilters }) {

    return (
        <aside className="w-full md:w-64 h-fit p-4 border rounded-2xl space-y-6 text-black border-black dark:text-white dark:border-white dark:bg-gray-800">
            <h2 className="text-lg font-bold">Filtros</h2>

            <CategoryFilter filters={filters} setFilters={setFilters} />
            <PriceFilter filters={filters} setFilters={setFilters} />
            <RatingFilter filters={filters} setFilters={setFilters} />
            <StockFilter filters={filters} setFilters={setFilters} />
            <FeatureFilter filters={filters} setFilters={setFilters} />
        </aside>
    );
}
