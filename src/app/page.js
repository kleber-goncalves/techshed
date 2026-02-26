import Hero from "@/layout/hero";
import Nav from "@/components/nav";
import Ofertas from "@/layout/ofertas";
import Categoria from "@/layout/categorias";
import Beneficons from "@/layout/beneficios";
import OfertaII from "@/layout/ofertaII";
import OfertaIII from "@/layout/ofertaIII";
import Marcas from "@/layout/Marcas";
import EmailNewsletter from "@/layout/Email-newsletter";
import CentralAjuda from "@/layout/Central-ajuda";
import Footer from "@/layout/footer";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full flex-col bg-white dark:bg-black ">
                <section className="flex flex-col px-7 mt-7 py-12">
                    <Hero />
                    <Ofertas />
                    <Beneficons />
                    <Categoria />
                    <OfertaII />
                    <OfertaIII />
                    <Marcas />
                    <EmailNewsletter />
                </section>
            </main>
        </div>
    );
}
