import ItensGaleria from "../galeriaItensCategoria";

export default function Categoria() {
    return (
        <section className="py-12">
            <div className="flex flex-col p-10 gap-20">
                <div>
                    <h1 className="text-3xl text-black dark:text-white font-semibold">
                        Compre por categoria
                    </h1>
                </div>
                <div>
                    <ItensGaleria />
                </div>
            </div>
        </section>
    );
}