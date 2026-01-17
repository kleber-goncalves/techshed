import Hero from "@/components/layout/hero";
import Nav from "@/components/nav";
import Ofertas from "@/components/layout/ofertas";
import Categoria from "@/components/layout/categorias";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col bg-white dark:bg-black ">
                <Nav />
                <section className="flex flex-col px-7 mt-7">
                    <Hero />
                    <Ofertas />
                    <Categoria />
                </section>
            </main>
        </div>
    );
}
