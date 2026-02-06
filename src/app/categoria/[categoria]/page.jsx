import { produtos } from "@/data/produtos";
import ProductCard from "@/components/components-loja/ProductCard";
import { categorySlugMap } from "@/data/categories";

export default async function Categoria({ params }) {
    const { categoria } = await params;
    const slug = String(categoria || "").toLowerCase().trim();
    const key = categorySlugMap[slug] ?? slug;

    const listaCompleta = Object.values(produtos).flat();
    const listaPorChave = produtos[key];

    const produtosCategoria = Array.isArray(listaPorChave)
        ? listaPorChave
        : listaCompleta.filter(
              (produto) => produto.category === slug || produto.category === key,
          );

    if (produtosCategoria.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-xl">Nenhum produto encontrado</h1>
            </div>
        );
    }

    return (
        <section className="grid grid-cols-4 gap-6 p-6">
            {produtosCategoria.map((produto) => (
                <ProductCard key={produto.id} produto={produto} />
            ))}
        </section>
    );
}
