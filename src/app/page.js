import Hero from "@/components/layout/hero";
import Nav from "@/components/nav";
import Ofertas from "@/components/layout/ofertas";
import Categoria from "@/components/layout/categorias";
import Beneficons from "@/components/layout/beneficios";
import OfertaII from "@/components/layout/ofertaII";
import OfertaIII from "@/components/layout/ofertaIII";
import Marcas from "@/components/layout/Marcas";
import EmailNewsletter from "@/components/layout/Email-newsletter";
import CentralAjuda from "@/components/layout/Central-ajuda";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col bg-white dark:bg-black ">
                <Nav />
                <section className="flex flex-col px-7 mt-7">
                    <Hero />
                    <Ofertas />
                    <Beneficons />
                    <Categoria />
                    <OfertaII />
                    <OfertaIII />
                    <Marcas />
                    <EmailNewsletter />
                    <CentralAjuda/>
                </section>
            </main>
        </div>
    );
}
