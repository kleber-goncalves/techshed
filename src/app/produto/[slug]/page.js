import { produtos } from "@/data/produtos";
import ProdutoClient from "./ProdutoClient";

export default async function Produto({ params }) {
    const { slug } = await params;

    const produto = Object.values(produtos)
        .flat()
        .find((p) => p.slug === slug);

    if (!produto) {
        return (
            <div className="flex h-screen items-center justify-center">
                <h1 className="text-xl">Produto não encontrado</h1>
            </div>
        );
    }

    return <ProdutoClient produto={produto} />;
}
