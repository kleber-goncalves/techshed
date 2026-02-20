"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";


const CatalogoContext = createContext(null);

/**
 * Provider que fornece o catalogo de produtos.
 *
 * Fornece um estado global com as seguintes propriedades:
 * - products: array de objetos de produto.
 * - productIndex: um Map com chave o id do produto e valor o objeto do produto.
 * - isLoading: boolean para indicar se o catalogo esta carregando.
 * - isReady: boolean para indicar se o catalogo esta pronto para uso.
 * - error: objeto com o erro caso haja um problema ao carregar o catalogo.
 *
 * O provedor eh responsavel por carregar o catalogo atraves de uma chamada
 * a API e armazenar o resultado no estado global.
 *
 * @param {ReactNode} children - Elementos React que serao renderizados
 *                                dentro do provedor.
 *
 * @returns {ReactNode} - Elemento React que fornece o estado global do
 *                           catalogo.
 */
export function CatalogoProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;

        async function load() {
            try {
                setIsLoading(true);
                const res = await fetch("/api/catalogo/flat", { cache: "no-cache" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                if (!active) return;
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                if (!active) return;
                setError(err);
                setProducts([]);
            } finally {
                if (active) setIsLoading(false);
            }
        }

        load();
        return () => {
            active = false;
        };
    }, []);

    const productIndex = useMemo(() => {
        const map = new Map();
        products.forEach((p) => map.set(p.id, p));
        return map;
    }, [products]);

    const value = useMemo(() => ({
        products,
        productIndex,
        isLoading,
        isReady: !isLoading && !error,
        error,
    }),
        [products, productIndex, isLoading, error]
    
    );

    return <CatalogoContext.Provider value={value}>{children}</CatalogoContext.Provider>;
}

export function useCatalogo() {
    const ctx = useContext(CatalogoContext);
    if (!ctx) {
        throw new Error(
            "useCatalogo precisa ser usado dentro de CatalogoProvider",
        );
    }
    return ctx;
}
