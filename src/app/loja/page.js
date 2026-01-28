import ProductCard from "@/components/components-loja/ProductCard";
import { produtos } from "@/data/produtos";

export default function Loja() {
  const todosProdutos = Object.values(produtos).flat();

    return (
        <section className="flex flex-col items-center gap-14">
            <h1 className="text-5xl text-black font-semibold">Todos os produtos</h1>
            <section className="grid grid-cols-4">
                {todosProdutos.map((produto) => (
                    <ProductCard key={produto.id} produto={produto} />
                ))}
            </section>
        </section>
    );
}