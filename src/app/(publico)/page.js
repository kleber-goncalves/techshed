import Beneficons from "@/layout/beneficios";
import Categoria from "@/layout/categorias";
import CentralAjuda from "@/layout/Central-ajuda";
import EmailNewsletter from "@/layout/Email-newsletter";
import Hero from "@/layout/hero";
import Marcas from "@/layout/Marcas";
import OfertaII from "@/layout/ofertaII";
import OfertaIII from "@/layout/ofertaIII";
import Ofertas from "@/layout/ofertas";


export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <section className="flex min-h-screen w-full flex-col bg-white dark:bg-black ">
                <section className="flex flex-col px-7 mt-7 py-12">
                    <Hero />
                    <Ofertas />
                    <Beneficons />
                    <Categoria />
                    <OfertaII />
                    <OfertaIII />
                    <Marcas />
                    <EmailNewsletter />
                    <CentralAjuda />
                </section>
            </section>
        </div>
    );
}
