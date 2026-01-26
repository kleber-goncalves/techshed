'use client';

import { Button } from "@/components/ui/button";

// 1. Importações do Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

// 2. Importações de CSS do Swiper
import "swiper/css";
import "swiper/css/effect-fade"; // Opcional: para efeito de transição suave

export default function Hero() {

    const slides = [
        {
            id: 1,
            image: "/imgHero/celular.png",
            alt: "Slide 1",
        },
        {
            id: 2,
            image: "/imgHero/pc.png",
            alt: "Slide 2",
        },
        {
            id: 3,
            image: "/imgHero/sem-fundo.png",
            alt: "Slide 3",
        },
    ];

    return (
        <section className="relative w-full h-full overflow-hidden  py-6 bg-gray-300 dark:bg-gray-800 rounded-2xl hover:shadow-[0_0_40px_0px_rgba(0,0,0,0.5)]  dark:hover:shadow-[0_0_10px_1px_rgba(237,237,237,0.8)] dark:hover:scale-102 transition-all ease-in-out duration-900">
            <div className="flex flex-col md:flex-row  items-center justify-between gap-10">
                <div className="flex flex-col max-w-2xl gap-5 itens-start text-left px-15 z-10 ">
                    <p className="text-xl text-white bg-red-500 w-fit px-2 rounded-sm shadow-sm">
                        Melhores preços
                    </p>
                    <h1 className="text-6xl text-black dark:text-white">
                        Preços incríveis para todos os seus favoritos
                    </h1>
                    <p className="text-xl text-black dark:text-white">
                        Compre mais por menos em marcas selecionadas
                    </p>
                    <Button variant="meu" size="xl">
                        Comprar agora
                    </Button>
                </div>

                <div className="relative w-full md:w-1/2 h-[400px] md:h-[500px] ml-auto md:translate-x-12">
                    {/* --- SOMBRA/GLOW ATRÁS DO SLIDE --- */}
                    {/* Esta div cria uma bola difusa atrás da imagem para dar destaque */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/2 w-[490px] h-[490px] bg-black/40 dark:bg-white/40 blur-[70px] rounded-full z-0 pointer-events-none"></div>

                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        fadeEffect={{ crossFade: true }}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        className="w-full h-full z-10"
                    >
                        {slides.map((slide) => (
                            <SwiperSlide key={slide.id} className="">
                                <div className="w-full h-full flex items-center justify-center md:justify-end pr-24">
                                    <img
                                        src={slide.image}
                                        alt={slide.alt}
                                        className="h-full object-contain drop-shadow-2xl"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
