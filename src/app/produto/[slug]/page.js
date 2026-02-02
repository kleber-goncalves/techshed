



import { Button } from "@/components/ui/button";
import { produtos } from "@/data/produtos";
import Image from "next/image";


export default async function Produto({ params }) {
    const resolvedParams = await params;

    const produto = Object.values(produtos)
        .flat()
        .find((p) => p.slug === resolvedParams.slug);

    if (!produto) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-xl">
                <h1>Produto não encontrado!</h1>
            </div>
        );
    }
   
    return (
        <section className="grid grid-cols-2 gap-2 dark:bg-red-500  h-screen  px-73 ">
            {/* sessao de img + desc */}
            <section className="flex flex-col items-end bg-green-100 h-fit">
                <div className="max-w-lg bg-gray-400">
                    <Image
                        src={produto.img}
                        alt={produto.alt}
                        width={1000}
                        height={1000}
                        className="rounded-2xl border border-black"
                    />
                </div>
                <div>
                    <p className="text-white">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequatur, perspiciatis.
                    </p>
                </div>
                <div></div>
            </section>

            <section className="flex flex-col bg-violet-300 gap-8 h-fit">
                <h1 className="text-3xl font-semibold dark:text-white max-w-xs">
                    {produto.name}
                </h1>
                <section className="flex flex-col w-full justify-center gap-3">
                    <p className="text-xl text-green-600">
                        R$ {(produto.priceCents / 100).toFixed(2)}
                    </p>
                    <p>Quantidade</p>
                    <div className="flex flex-col w-full gap-2">
                        <Button variant="default">Adicionar ao carrinho</Button>
                        <Button variant="default">Comprar</Button>
                    </div>
                </section>
            </section>
        </section>
    );
}
