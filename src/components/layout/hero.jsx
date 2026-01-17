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
        image: "/hero-relogio.png",
        alt: "Slide 1",
    },
    {
        id: 2,
        image: "/hero-pc.png",
        alt: "Slide 2",
    },
    {
        id: 3,
        image: "/hero-celular.png",
        alt: "Slide 3",
    },
]

    return (
        <section className="relative w-full h-150 overflow-hidden bg-gray-900 px-6 py-24 shadow-md rounded-lg">
            <div className="absolute inset-0 z-0">
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    className="w-full h-full"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full">
                                <img
                                    src={slide.image}
                                    alt={slide.alt}
                                    className="w-full h-full object-cover"
                                />
                             
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="flex flex-col max-w-2xl gap-5 pl-43  relative z-10 h-full">
                <p className="text-xl text-white bg-red-500 w-fit px-2 rounded-sm ">
                    Melhores preços
                </p>
                <h1 className="text-6xl text-black">
                    Preços incríveis para todos os seus favoritos
                </h1>
                <p className="text-xl text-black">
                    Compre mais por menos em marcas selecionadas
                </p>
                <Button variant="meu" size="xl">
                    Comprar agora
                </Button>
            </div>
        </section>
    );
}
