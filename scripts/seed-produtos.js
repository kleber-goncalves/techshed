const fs = require("node:fs");
const path = require("node:path");
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is required to run seed-produtos.js.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function loadProdutosData(filePath) {
    const source = fs.readFileSync(filePath, "utf8");
    const match = source.match(/export const produtos = ([\s\S]*);\s*$/);

    if (!match) {
        throw new Error(
            "Could not parse src/data/produtos.js. Expected `export const produtos = ...`.",
        );
    }

    return Function(`"use strict"; return (${match[1]});`)();
}

function asString(value, fieldName) {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`Invalid value for ${fieldName}.`);
    }
    return value;
}

function asInt(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

function asStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
}

async function seed() {
    const produtosPath = path.join(process.cwd(), "src", "data", "produtos.js");
    const produtosByCatalog = loadProdutosData(produtosPath);

    let seededProducts = 0;
    let seededVariants = 0;

    await prisma.$transaction(
        async (tx) => {
            for (const [catalogKey, productList] of Object.entries(produtosByCatalog)) {
                if (!Array.isArray(productList)) continue;

                for (const product of productList) {
                    const productId = asString(product.id, "product.id");

                    const productData = {
                        slug: asString(product.slug, `product.slug (${productId})`),
                        name: asString(product.name, `product.name (${productId})`),
                        img: asString(product.img, `product.img (${productId})`),
                        alt: asString(product.alt, `product.alt (${productId})`),
                        priceCents: asInt(product.priceCents, 0),
                        stock: asInt(product.stock, 0),
                        category: asString(
                            product.category,
                            `product.category (${productId})`,
                        ),
                        catalogKey: asString(catalogKey, `catalogKey (${productId})`),
                        features: asStringArray(product.features),
                        promocao:
                            typeof product.promocao === "string" && product.promocao.trim()
                                ? product.promocao.trim()
                                : null,
                    };

                    await tx.produto.upsert({
                        where: { id: productId },
                        update: productData,
                        create: {
                            id: productId,
                            ...productData,
                        },
                    });

                    seededProducts += 1;

                    const variants = Array.isArray(product.colors) ? product.colors : [];
                    const incomingVariantIds = variants
                        .map((variant) => variant?.id)
                        .filter((id) => typeof id === "string" && id.trim())
                        .map((id) => id.trim());

                    if (incomingVariantIds.length === 0) {
                        await tx.produtoVariante.deleteMany({
                            where: { produtoId: productId },
                        });
                    } else {
                        await tx.produtoVariante.deleteMany({
                            where: {
                                produtoId: productId,
                                id: { notIn: incomingVariantIds },
                            },
                        });
                    }

                    for (const variant of variants) {
                        const variantId = asString(
                            variant.id,
                            `variant.id for product (${productId})`,
                        );

                        const variantData = {
                            produtoId: productId,
                            name: asString(variant.name, `variant.name (${variantId})`),
                            img: asString(variant.img, `variant.img (${variantId})`),
                            alt: asString(variant.alt, `variant.alt (${variantId})`),
                            priceCents: asInt(variant.priceCents, productData.priceCents),
                            stock: asInt(variant.stock, productData.stock),
                            hex:
                                typeof variant.hex === "string" && variant.hex.trim()
                                    ? variant.hex.trim()
                                    : null,
                            corName:
                                typeof variant.corName === "string" && variant.corName.trim()
                                    ? variant.corName.trim()
                                    : null,
                        };

                        await tx.produtoVariante.upsert({
                            where: { id: variantId },
                            update: variantData,
                            create: {
                                id: variantId,
                                ...variantData,
                            },
                        });

                        seededVariants += 1;
                    }
                }
            }
        },
        {
            maxWait: 10000,
            timeout: 120000,
        },
    );

    const [totalProducts, totalVariants, promoSample] = await Promise.all([
        prisma.produto.count(),
        prisma.produtoVariante.count(),
        prisma.produto.findUnique({
            where: { id: "light-phantom-jp-5g-16-gb" },
            select: { id: true, promocao: true },
        }),
    ]);

    console.log("Seed finished.");
    console.log(`Processed products: ${seededProducts}`);
    console.log(`Processed variants: ${seededVariants}`);
    console.log(`Current Produtos count: ${totalProducts}`);
    console.log(`Current ProdutoVariantes count: ${totalVariants}`);
    console.log(
        `Promo sample: ${promoSample?.id ?? "not-found"} => ${promoSample?.promocao ?? "null"}`,
    );
}

seed()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
