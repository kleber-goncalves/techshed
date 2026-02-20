"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useCatalogo } from "./catalog-context";


const STORAGE_KEY = "techshed.cart.v1";
const BASE_VARIANT_ID = "base";

const CartContext = createContext(null);



/**
 * O que faz:
 * - Converte qualquer valor recebido para numero inteiro truncado.
 * - Se a conversao falhar (NaN, infinito ou valor invalido), devolve um fallback seguro.
 *
 * Por que e importante:
 * - Protege o carrinho contra entradas inesperadas vindas de UI, localStorage ou payloads incompletos.
 * - Garante que quantidades e precos sejam tratados como numeros inteiros confiaveis.
 */
function toInteger(value, fallback = 0) {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? Math.trunc(parsedValue) : fallback;
}

/**
 * O que faz:
 * - Limita um valor para que ele sempre fique entre um minimo e um maximo.
 * - Se estiver abaixo do minimo, retorna o minimo; se estiver acima do maximo, retorna o maximo.
 *
 * Por que e importante:
 * - Evita estados invalidos, como quantidade negativa ou acima do estoque.
 * - Centraliza uma regra de limite usada em varias partes do fluxo de carrinho.
 */
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * O que faz:
 * - Normaliza a quantidade pedida de um item com base no estoque maximo disponivel.
 * - Se nao houver estoque, retorna 0; caso contrario, garante faixa entre 1 e maxStock.
 *
 * Por que e importante:
 * - Impede que o carrinho mantenha quantidades impossiveis para compra.
 * - Mantem consistencia entre a intencao do usuario e a disponibilidade real de produto.
 */
function normalizeRequestedQuantity(quantity, maxStock) {
    if (maxStock <= 0) return 0;
    return clamp(toInteger(quantity, 1), 1, maxStock);
}

/**
 * O que faz:
 * - Cria uma chave unica de linha do carrinho no formato "produto::variante".
 * - Quando nao existe variante, usa um identificador base padrao.
 *
 * Por que e importante:
 * - Permite identificar de forma deterministica cada linha para atualizar/remover sem ambiguidades.
 * - Facilita deduplicacao de itens iguais em sanitizeLines.
 */
function getLineKey(productId, variantId) {
    return `${productId}::${variantId ?? BASE_VARIANT_ID}`;
}

/**
 * O que faz:
 * - Converte uma lineKey de texto novamente para { productId, variantId }.
 * - Valida formato minimo esperado e retorna null quando a chave e invalida.
 *
 * Por que e importante:
 * - Evita alterar linhas erradas quando uma chave malformada chega na acao de update.
 * - Funciona como protecao de integridade antes de manipular estado do carrinho.
 */
function parseLineKey(lineKey) {
    if (typeof lineKey !== "string") return null;

    const separatorIndex = lineKey.indexOf("::");
    if (separatorIndex <= 0) return null;

    const productId = lineKey.slice(0, separatorIndex);
    const rawVariantId = lineKey.slice(separatorIndex + 2);
    const variantId =
        rawVariantId === BASE_VARIANT_ID || !rawVariantId ? null : rawVariantId;

    return { productId, variantId };
}

/**
 * O que faz:
 * - Resolve dados completos de uma linha do carrinho a partir de productId e variantId.
 * - Se houver variante valida, usa dados da variante com fallback para dados do produto base.
 * - Se nao houver variante, monta a linha usando apenas dados do produto base.
 *
 * Por que e importante:
 * - Concentra em um unico ponto a regra de fallback entre variante e produto principal.
 * - Garante que nome, imagem, preco e estoque fiquem coerentes para renderizacao e calculos.
 */
function resolveCatalogLine(productIndex, productId, variantId) {
    const product = productIndex.get(productId);
    if (!product) return null;

    if (variantId) {
        const variant = product.colors?.find((color) => color.id === variantId);
        if (!variant) return null;

        return {
            productId: product.id,
            variantId,
            slug: product.slug,
            name: variant.name ?? product.name,
            img: variant.img ?? product.img,
            alt: variant.alt ?? product.alt ?? product.name,
            colorName: variant.corName ?? null,
            colorHex: variant.hex ?? null,
            stock: Math.max(0, toInteger(variant.stock ?? product.stock, 0)),
            unitPriceCents: Math.max(
                0,
                toInteger(variant.priceCents ?? product.priceCents, 0),
            ),
        };
    }

    return {
        productId: product.id,
        variantId: null,
        slug: product.slug,
        name: product.name,
        img: product.img,
        alt: product.alt ?? product.name,
        colorName: null,
        colorHex: null,
        stock: Math.max(0, toInteger(product.stock, 0)),
        unitPriceCents: Math.max(0, toInteger(product.priceCents, 0)),
    };
}

/**
 * O que faz:
 * - Normaliza variantId para string valida ou null.
 * - Remove casos vazios/inuteis (undefined, string em branco etc).
 *
 * Por que e importante:
 * - Evita criar chaves diferentes para o mesmo item por causa de valores "vazios".
 * - Mantem consistencia no tratamento de produtos sem variacao.
 */
function normalizeVariantId(variantId) {
    return typeof variantId === "string" && variantId.trim() ? variantId : null;
}

/**
 * O que faz:
 * - Recebe uma lista "bruta" de linhas e devolve uma lista limpa e valida para o estado.
 * - Descarta linhas invalidas (sem productId, sem produto no catalogo, sem estoque, quantidade invalida).
 * - Une linhas repetidas pela lineKey e soma quantidades respeitando limite de estoque (clamp).
 *
 * Por que e importante:
 * - E a principal barreira de qualidade dos dados do carrinho.
 * - Impede estados quebrados, reduz duplicacoes e garante consistencia antes de persistir/renderizar.
 */
function sanitizeLines(rawLines, productIndex) {
    if (!Array.isArray(rawLines) || !productIndex || productIndex.size === 0) {
        return [];
    }

    const mergedLines = new Map();

    rawLines.forEach((line) => {
        const productId =
            typeof line?.productId === "string" ? line.productId : null;
        if (!productId) return;

        const variantId = normalizeVariantId(line.variantId);
        const catalogLine = resolveCatalogLine(productIndex, productId, variantId);

        if (!catalogLine || catalogLine.stock <= 0) return;

        const quantity = normalizeRequestedQuantity(
            line.quantity,
            catalogLine.stock,
        );
        if (quantity <= 0) return;

        const lineKey = getLineKey(productId, variantId);
        const previousLine = mergedLines.get(lineKey);
        const mergedQuantity = previousLine
            ? clamp(previousLine.quantity + quantity, 1, catalogLine.stock)
            : quantity;

        mergedLines.set(lineKey, {
            productId,
            variantId,
            quantity: mergedQuantity,
        });
    });

    return Array.from(mergedLines.values());
}

/**
 * O que faz:
 * - Tenta ler e converter o texto salvo no localStorage para linhas do carrinho.
 * - Em caso de JSON invalido ou vazio, retorna lista vazia sem quebrar a aplicacao.
 *
 * Por que e importante:
 * - Protege o boot do carrinho contra dados corrompidos no armazenamento local.
 * - Garante inicializacao segura do estado mesmo apos erros anteriores do navegador/usuario.
 */
function parsePersistedLines(rawValue) {
    if (!rawValue) return [];

    try {
        const parsed = JSON.parse(rawValue);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

/**
 * O que faz:
 * - Fornece o contexto global de carrinho para toda a arvore React filha.
 * - Gerencia estado, persistencia no localStorage, acoes de manipulacao e dados derivados.
 *
 * Por que e importante:
 * - Centraliza regras de negocio do carrinho em um unico lugar.
 * - Evita duplicacao de logica entre paginas/componentes e facilita manutencao para o time.
 */
export function CartProvider({ children }) {
    const { productIndex, isReady: isCatalogReady } = useCatalogo();
    const [lines, setLines] = useState(() => {
        if (typeof window === "undefined") return [];
        return parsePersistedLines(window.localStorage.getItem(STORAGE_KEY));
    });

    const sanitizedLines = useMemo(() => {
        if (!isCatalogReady) return [];
        return sanitizeLines(lines, productIndex);
    }, [lines, isCatalogReady, productIndex]);

    useEffect(() => {
        if (!isCatalogReady) return;
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(sanitizedLines),
        );
    }, [sanitizedLines, isCatalogReady]);

    // Acao de adicionar item: inclui uma nova linha e reaplica sanitizacao para unificar e validar tudo.
    const addItem = useCallback(
        ({ productId, variantId = null, quantity = 1 }) => {
            if (!productId) return;

            setLines((previousLines) => {
                const nextLines = [
                    ...previousLines,
                    {
                        productId,
                        variantId: normalizeVariantId(variantId),
                        quantity,
                    },
                ];

                return isCatalogReady
                    ? sanitizeLines(nextLines, productIndex)
                    : nextLines;
            });
        },
        [isCatalogReady, productIndex],
    );

    // Acao de atualizar quantidade: valida lineKey, altera a linha alvo e sanitiza o resultado.
    // O parse da chave evita atualizacao com identificador invalido, e sanitizeLines reaplica limites/estoque.
    const setItemQuantity = useCallback(
        ({ lineKey, quantity }) => {
            const parsedLine = parseLineKey(lineKey);
            if (!parsedLine) return;

            setLines((previousLines) => {
                let found = false;
                const nextLines = previousLines.map((line) => {
                    const currentLineKey = getLineKey(
                        line.productId,
                        line.variantId,
                    );
                    if (currentLineKey !== lineKey) return line;

                    found = true;
                    return { ...line, quantity };
                });

                if (!found) return previousLines;

                return isCatalogReady
                    ? sanitizeLines(nextLines, productIndex)
                    : nextLines;
            });
        },
        [isCatalogReady, productIndex],
    );

    // Acao de remocao: remove a linha exata identificada pela lineKey.
    const removeItem = useCallback((lineKey) => {
        setLines((previousLines) =>
            previousLines.filter(
                (line) =>
                    getLineKey(line.productId, line.variantId) !== lineKey,
            ),
        );
    }, []);

    // Acao de limpeza total: zera todas as linhas do carrinho.
    const clearCart = useCallback(() => {
        setLines([]);
    }, []);

    // Dados derivados para interface: resolve dados do catalogo, valida quantidade e calcula subtotal por linha.
    const items = useMemo(() => {
        if (!isCatalogReady) return [];

        return sanitizedLines
            .map((line) => {
                const catalogLine = resolveCatalogLine(
                    productIndex,
                    line.productId,
                    line.variantId,
                );
                if (!catalogLine || catalogLine.stock <= 0) return null;

                const quantity = normalizeRequestedQuantity(
                    line.quantity,
                    catalogLine.stock,
                );
                if (quantity <= 0) return null;

                return {
                    ...catalogLine,
                    lineKey: getLineKey(line.productId, line.variantId),
                    quantity,
                    lineSubtotalCents: catalogLine.unitPriceCents * quantity,
                };
            })
            .filter(Boolean);
    }, [sanitizedLines, isCatalogReady, productIndex]);

    // Totais derivados para resumo de compra e badge de quantidade.
    const totalItems = useMemo(
        () => items.reduce((total, item) => total + item.quantity, 0),
        [items],
    );
    const subtotalCents = useMemo(
        () =>
            items.reduce(
                (total, item) => total + item.unitPriceCents * item.quantity,
                0,
            ),
        [items],
    );

    // Valor unico do contexto: expoe estado pronto para consumo e todas as acoes publicas do carrinho.
    const value = useMemo(
        () => ({
            items,
            totalItems,
            subtotalCents,
            isEmpty: items.length === 0,
            isReady: isCatalogReady,
            addItem,
            setItemQuantity,
            removeItem,
            clearCart,
        }),
        [
            addItem,
            clearCart,
            isCatalogReady,
            items,
            removeItem,
            setItemQuantity,
            subtotalCents,
            totalItems,
        ],
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

/**
 * O que faz:
 * - Hook de acesso ao CartContext para ler estado e chamar acoes do carrinho.
 * - Lanca erro claro quando usado fora do CartProvider.
 *
 * Por que e importante:
 * - Evita uso incorreto do contexto em componentes sem provider.
 * - Falha cedo com mensagem objetiva, facilitando debug para quem esta aprendendo React Context.
 */
export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart precisa ser usado dentro de CartProvider");
    }

    return context;
}
