import Image from "next/image";
import BtnTemas from "../btnTema";
import { Button } from "../ui/button";

const imgs = [
    {
        id: 1,
        image: "/imgOfertas/Picsart_26-01-19_17-43-30-550.png",
        alt: "Slide 1",
    },
];

export default function OfertaIII() {
    return (
        <section className="w-full py-33">
            <div className="bg-gray-300 dark:bg-gray-900 relative rounded-3xl h-[480px] flex items-center px-10 overflow-visible shadow-lg">
                <div className="w-fit  z-10 text-white space-y-4.5 ">
                    <p className="font-bold uppercase tracking-wide bg-red-500 w-fit px-3 py-1 rounded-sm">
                        Só hoje
                    </p>
                    <div>
                        <h2 className="text-3xl font-medium  text-black dark:text-white/90">
                            Melhor vista aérea da cidade
                        </h2>
                        <h1 className="text-[90px] font-semibold  text-black dark:text-white/90">
                            30% OFF
                        </h1>
                        <p className="text-3xl font-medium  text-black dark:text-white/90">
                            em drones profissionais
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <p className="text-sm opacity-80  text-black dark:text-white/90">
                            Quantidade limitada.
                        </p>
                        <p className="text-sm opacity-80  text-black dark:text-white/90">
                            Consulte disponibilidade na página do produto.
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

                {/* --- SOMBRA/GLOW ATRÁS DO SLIDE --- */}
                {/* Esta div cria uma bola difusa atrás da imagem para dar destaque */}
                <div className="absolute top-1/4 left-200 -translate-y-1/3 w-[690px] h-[430px] bg-black/40 dark:bg-white/40 blur-[70px] rounded-full z-0 pointer-events-none"></div>

                <div className="absolute left-[35%] top-1/3 -translate-y-1/2 w-2/3 hidden md:flex justify-center items-center pointer-events-none ">
                    <Image
                        width={1000}
                        height={1000}
                        src="/imgOfertasIII/drones_brancos.avif"
                        alt="Oferta destaque"
                        className="hidden dark:block h-full w-full overflow-hidden drop-shadow-2xl  transform hover:scale-105 transition-transform duration-500"
                    />
                    <Image
                        width={1000}
                        height={1000}
                        src="/imgOfertasIII/drones_preto.avif"
                        alt="Oferta destaque"
                        className="dark:hidden h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </div>
        </section>
    );
}
