'use client';

import { Fragment } from "react";

import CategoryFilter from "./CategoryFilter";
import FeatureFilter from "./FeatureFilter";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";
import StockFilter from "./StockFilter";

const DEFAULT_ENABLED = ["category", "price", "rating", "stock", "features"];

export default function FiltersSidebar({
    filters,
    setFilters,
    enabled,
    data,
    className = "",
}) {
    const filtersEnabled =
        Array.isArray(enabled) && enabled.length > 0
            ? enabled
            : DEFAULT_ENABLED;

    const registry = {
        category: () => (
            <CategoryFilter
                filters={filters}
                setFilters={setFilters}
                categories={data?.categories}
            />
        ),
        price: () => (
            <PriceFilter
                filters={filters}
                setFilters={setFilters}
                minPlaceholder={data?.minPlaceholder}
                maxPlaceholder={data?.maxPlaceholder}
                minLimit={data?.minLimit}
                maxLimit={data?.maxLimit}
            />
        ),
        rating: () => (
            <RatingFilter filters={filters} setFilters={setFilters} />
        ),
        stock: () => <StockFilter filters={filters} setFilters={setFilters} />,
        features: () => (
            <FeatureFilter
                filters={filters}
                setFilters={setFilters}
                features={data?.features}
            />
        ),
    };

    return (
        <aside
            className={`w-full md:w-64 h-fit p-4 rounded-2xl flex flex-col justify-center text-black border-none dark:text-white ${className}`}
        >
            <h2 className="text-lg font-bold">Filtros</h2>

            {filtersEnabled.map((key) => {
                const RenderFilter = registry[key];
                return RenderFilter ? (
                    <Fragment key={key}>{RenderFilter()}</Fragment>
                ) : null;
            })}
        </aside>
    );
}
