import BtnTemas from "../btnTema";
import { Button } from "../ui/button";

const imgs = [
    {
        id: 1,
        image: "/imgOfertas/Picsart_26-01-19_17-43-30-550.png",
        alt: "Slide 1",
    }
]


export default function OfertaII () {
    return (
        <section className="w-full pt-67 pb-32 ">
            <div className="bg-gray-300  dark:bg-gray-900 relative rounded-3xl h-[480px] flex items-center px-10 overflow-visible shadow-[0_0_4px_0px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_0px_rgba(0,0,0,0.5)]  dark:hover:shadow-[0_0_40px_0px_rgba(255,255,255,0.5)] transition-all ease-in-out duration-700">
                {/* --- SOMBRA/GLOW ATRÁS DO SLIDE --- */}
                {/* Esta div cria uma bola difusa atrás da imagem para dar destaque */}
                <div className="absolute top-1/4 left-10  -translate-y-1/3 w-[690px] h-[430px] bg-black/40 dark:bg-white/40 blur-[70px] rounded-full z-0 pointer-events-none"></div>
                {/* Lado da Imagem (Flutuando por cima) */}
                <div className="absolute left-8 top-1/7 -translate-y-1/2 w-1/2 h-[140%] hidden md:flex justify-center items-center pointer-events-none">
                    {/* A imagem tem h-full para usar os 140% de altura definidos na div pai acima */}
                    <img
                        src="/imgOfertas/Picsart_26-01-19_17-43-30-550_upscayl_2x_high-fidelity-4x.png"
                        alt="Oferta destaque"
                        className="h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    />
                </div>

                <div className="w-fit  z-10 text-white space-y-4.5 ml-auto">
                    <div>
                        <p className="text-3xl font-medium  text-black dark:text-white/90">
                            Economize até
                        </p>
                        <h1 className="text-[90px] font-semibold  text-black dark:text-white/90">
                            R$ 150
                        </h1>
                        <p className="text-3xl font-medium  text-black dark:text-white/90">
                            em laptops e tablets selecionados
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-lg opacity-80  text-black dark:text-white/90">
                            Aplicam-se termos e condições
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button
                            variant="meu2"
                            size="xl"
                            className="bg-white text-red-500 hover:bg-gray-100 font-bold px-8 py-6 rounded-full"
                        >
                            Comprar
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}