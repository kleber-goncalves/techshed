import SearchPageClient from "./SearchPageClient";
import { getCatalogoFlat } from "@/lib/catalogo-db";

export default async function Busca({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const query =
        (typeof resolvedSearchParams?.q === "string"
            ? resolvedSearchParams.q
            : "").trim();
    
    const listaCompleta = await getCatalogoFlat();

    const features = [
        ...new Set(
            listaCompleta.flatMap((produto) => produto.features || []),
        ),
    ];

    const priceCentsList = listaCompleta.map(
        (produto) => produto.priceCents ?? 0,
    );
    const minPriceCents =
        priceCentsList.length > 0 ? Math.min(...priceCentsList) : 0;
    const maxPriceCents =
        priceCentsList.length > 0 ? Math.max(...priceCentsList) : 0;

    const filtersData = {
        features,
        minLimit: Math.floor(minPriceCents / 100),
        maxLimit: Math.ceil(maxPriceCents / 100),
    };

    return (
        <SearchPageClient
            produtos={listaCompleta}
            filtersData={filtersData}
            initialQuery={query}
        />
    );
}
