import { Button } from "@/components/ui/button";

export default function Ofertas() {
    return (
        <section className="w-full flex py-13 flex-col ">
            <div className="flex flex-row w-full justify-between gap-8">
                <div className="flex flex-col w-full pr-25 pt-23 pb-23 pl-13 bg-gray-300 transition-all ease-in-out duration-500  hover:shadow-[0_0_30px_rgba(176,31,0.9)]  dark:hover:shadow-[0_0_40px_0px_rgba(176,31,0.9)] rounded-2xl bg-[url('/card-celular.jpg')] bg-cover bg-center">
                    <div className="flex flex-col max-w-2xl gap-5 text-start">
                        <p className="text-xl text-white">Ofertas de Natal</p>

                        <h1 className="text-[50px] text-white font-semibold max-w-3xs">
                            Até <br></br> 30% off
                        </h1>

                        <p className="text-xl text-white max-w-xs">
                            em marcas de smartphone selecionadas
                        </p>
                        <Button variant="meu2" size="xl">
                            Comprar
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col w-full pr-23 pt-23 pb-23 pl-23 bg-gray-300 transition-all ease-in-out duration-500 hover:shadow-[0_0_30px_rgba(86,48,150,0.9)]  dark:hover:shadow-[0_0_40px_0px_rgba(86,48,150,0.9)] rounded-2xl bg-[url('/card-fone.avif')] bg-cover bg-center">
                    <div className="flex flex-col max-w-2xl gap-5 ">
                        <p className="text-xl text-white ">Novidade</p>
                        <h1 className="text-[50px] text-white font-semibold max-w-sm">
                            Leve seu som aonde você quiser
                        </h1>
                        <p className="text-xl text-white">
                            Os melhores headphones
                        </p>
                        <Button variant="meu2" size="xl">
                            Comprar
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
