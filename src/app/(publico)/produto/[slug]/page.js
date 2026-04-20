import { getProdutoBySlug } from "@/lib/catalogo-db";
import ProdutoClient from "./ProdutoClient";

export default async function Produto({ params }) {
    const { slug } = await params;
    const produto = await getProdutoBySlug(slug);

    if (!produto) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-xl">Produto não encontrado</h1>
            </div>
        );
    }

    return <ProdutoClient produto={produto} />;
}
