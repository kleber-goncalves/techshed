"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    archiveAdminProduct,
    createAdminProduct,
    listAdminProducts,
    updateAdminProduct,
} from "@/lib/helpers/api/adminProductsApi";

const emptyForm = {
    name: "",
    slug: "",
    description: "",
    img: "",
    alt: "",
    priceCents: 0,
    stock: 0,
    category: "",
    promocao: "",
    featuresText: "",
    isActive: true,
};

function toForm(product) {
    return {
        name: product.name ?? "",
        slug: product.slug ?? "",
        description: product.description ?? "",
        img: product.img ?? "",
        alt: product.alt ?? "",
        priceCents: product.priceCents ?? 0,
        stock: product.stock ?? 0,
        category: product.category ?? "",
        catalogKey: product.catalogKey ?? "",
        promocao: product.promocao ?? "",
        featuresText: (product.features ?? []).join("\n"),
        isActive: Boolean(product.isActive),
    };
}

function toPayload(form) {
    return {
        name: form.name,
        slug: form.slug,
        description: form.description,
        img: form.img,
        alt: form.alt,
        priceCents: Number(form.priceCents) || 0,
        stock: Number(form.stock) || 0,
        category: form.category,
        catalogKey: form.catalogKey,
        promocao: form.promocao,
        features: form.featuresText,
        isActive: form.isActive,
    };
}

export default function AdminProdutosClient() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedProduct = useMemo(
        () => products.find((p) => p.id === selectedId) ?? null,
        [products, selectedId],
    );

    async function loadProducts(currentSearch = "") {
        setLoading(true);
        setError("");

        try {
            const data = await listAdminProducts(currentSearch);
            setProducts(Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            if (err?.status === 404) {
                router.replace("/404");
                return;
            }
            setError(err.message || "Error ao carregat produtos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProducts("");
    }, []);

    function handleSelect(product) {
        setSelectedId(product.id);
        setForm(toForm(product));
        setSuccess("");
    }

    function handleNew() {
        setSelectedId(null);
        setForm(emptyForm);
        setSuccess("");
        setError("");
    }

    function setField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = toPayload(form);

            if (selectedId) {
                await updateAdminProduct(selectedId, payload);
                setSuccess("Produto atualizado com sucesso.");
            } else {
                const created = await createAdminProduct(payload);
                setSelectedId(created.id);
                setSuccess("Produto criado com sucesso.");
            }

            await loadProducts(search);
        } catch (err) {
            if (err?.status === 404) {
                router.replace("/404");
                return;
            }
            setError(err.message || "Erro ao salvar produto");
        } finally {
            setSaving(false);
        }
    }

    async function handleArchive() {
        if (!selectedId) return;
        if (!window.confirm("Deseja desativar este produto:")) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await archiveAdminProduct(selectedId);
            setSuccess("Produto desativado com sucesso.");
            setSelectedId(null);
            setForm(emptyForm);
            await loadProducts(search);
        } catch (err) {
            if (err?.status === 404) {
                router.replace("/404");
                return;
            }
            setError(err.message || "Erro ao desativar produto");
        } finally {
            setSaving(false);
        }
    }

    async function handleSearch(event) {
        event.preventDefault();
        await loadProducts(search);
    }


    return (
        <section>
            <aside className="rounded-xl border bg-white p-4">
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome/categoria/slug"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                        Buscar
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleNew}
                    className="mb-4 w-full rounded-mb border border-black px-4 py-2"
                >
                    Novo produto
                </button>

                {loading ? (
                    <p className="text-sm text-gray-500">Carregando...</p>
                ) : (
                    <div className="max-h-[640px] space-y-2 overflow-auto">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => handleSelect(product)}
                                className={`w-full rounded-md border p-3 text-left ${
                                    selectedId === product.id
                                        ? "border-black bg-gray-100"
                                        : "border-gray-200"
                                }`}
                            >
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-gray-600">
                                    {product.category} / estoque:{" "}
                                    {product.stock}
                                </p>

                                <p className="text-xs text-gray-600">
                                    {product.isActive ? "Ativo" : "Inativo"}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </aside>

            <section className="rounded-xl border bg-white p-5">
                <h1 className="mb-4 text-xl font-semibold">
                    {selectedProduct ? "Editar produto" : "Cadastrar produto"}
                </h1>

                {error ? (
                    <p className="mb-3 text-sm text-red-600">{error}</p>
                ) : null}

                {success ? (
                    <p className="mb-3 text-sm text-green-700">{success}</p>
                ) : null}

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 gap-3 md:grid-cols-2"
                >
                    <input
                        className="rounded-md border px-3 py-2"
                        placeholder="Nome"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        required
                    />
                    <input
                        className="rounded-md border px-3 py-2"
                        placeholder="Slug (opcional)"
                        value={form.slug}
                        onChange={(e) => setField("slug", e.target.value)}
                    />
                    <input
                        className="rounded-md border px-3 py-2"
                        placeholder="Categoria"
                        value={form.category}
                        onChange={(e) => setField("category", e.target.value)}
                        required
                    />
                    <input
                        className="rounded-md border px-3 py-2"
                        placeholder="catalogKey (ex: celulares)"
                        value={form.catalogKey}
                        onChange={(e) => setField("catalogKey", e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        className="rounded-md border px-3 py-2"
                        placeholder="Preço em centavos"
                        value={form.priceCents}
                        onChange={(e) => setField("priceCents", e.target.value)}
                        min={0}
                    />
                    <input
                        type="number"
                        className="rounded-md border px-3 py-2"
                        placeholder="Estoque"
                        value={form.stock}
                        onChange={(e) => setField("stock", e.target.value)}
                        min={0}
                    />
                    <input
                        className="rounded-md border px-3 py-2 md:col-span-2"
                        placeholder="URL da imagem"
                        value={form.img}
                        onChange={(e) => setField("img", e.target.value)}
                    />
                    <input
                        className="rounded-md border px-3 py-2 md:col-span-2"
                        placeholder="Texto alternativo da imagem"
                        value={form.alt}
                        onChange={(e) => setField("alt", e.target.value)}
                    />
                    <input
                        className="rounded-md border px-3 py-2 md:col-span-2"
                        placeholder="Promoção (opcional)"
                        value={form.promocao}
                        onChange={(e) => setField("promocao", e.target.value)}
                    />
                    <textarea
                        className="min-h-[90px] rounded-md border px-3 py-2 md:col-span-2"
                        placeholder="Descrição"
                        value={form.description}
                        onChange={(e) =>
                            setField("description", e.target.value)
                        }
                    />
                    <textarea
                        className="min-h-[110px] rounded-md border px-3 py-2 md:col-span-2"
                        placeholder="Features (uma por linha)"
                        value={form.featuresText}
                        onChange={(e) =>
                            setField("featuresText", e.target.value)
                        }
                    />

                    <label className="flex items-center gap-2 md:col-span-2">
                        <input
                            type="checkbox"
                            checked={form.isActive}
                            onChange={(e) =>
                                setField("isActive", e.target.checked)
                            }
                        />
                        Produto ativo
                    </label>

                    <div className="flex gap-2 md:col-span-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-md bg-black px-5 py-2 text-white disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : "Salvar"}
                        </button>

                        {selectedId ? (
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleArchive}
                                className="rounded-md border border-red-600 px-5 py-2 text-red-700 disabled:opacity-50"
                            >Desativar</button>
                        ) : null}

                    </div>
                </form>
            </section>
        </section>
    );
}
