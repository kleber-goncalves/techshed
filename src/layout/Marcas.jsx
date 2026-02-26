import Image from "next/image";

export default function Marcas() {
    const marcasImg = [
        {
            id: 1,
            image: "/imgMarcas/zodiac.avif",
            alt: "Slide 1",
        },
        {
            id: 2,
            image: "/imgMarcas/zoro.avif",
            alt: "Slide 2",
        },
        {
            id: 3,
            image: "/imgMarcas/pjk.avif",
            alt: "Slide 3",
        },
        {
            id: 4,
            image: "/imgMarcas/gxl.avif",
            alt: "Slide 3",
        },
        {
            id: 5,
            image: "/imgMarcas/horizon.avif",
            alt: "Slide 3",
        },
    ];

    return (
        <section className="w-full ">
            <div className="flex flex-col gap-12 items-center">
                <h1 className="text-3xl text-black dark:text-white font-semibold">
                    Marcas parceiras
                </h1>

                <div className="flex flex-row gap-4">
                    {marcasImg.map((Imagem) => (
                        <div key={Imagem.id} className="bg-white rounded-2xl">
                            <Image
                                width={1000}
                                height={1000}
                                src={Imagem.image}
                                alt={Imagem.alt}
                                className="w-full h-full"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
