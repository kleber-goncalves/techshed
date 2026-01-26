import Image from "next/image"

const icons = [
    {
        id : 1,
        icon: "/imgIcons/icon1.png",
        alt: "Retirada disponível",
        text : "Retirada disponível"
    },
    {
        id : 2,
        icon: "/imgIcons/icon2.png",
        alt: "Frete gratis",
        text: "Frete grátis acima de R$ 250"
    },
    {
        id : 3,
        icon: "/imgIcons/icon3.png",
        alt: "garentia",
        text: "Garantia de preços baixos"
    },
    {
        id : 4,
        icon: "/imgIcons/icons4.png",
        alt: "Disponivel 24h",
        text: "Disponível para você 24/7"
    },
]

export default function Beneficons() {
    return (
        <section className="my-12">
            <div
                className="grid grid-cols-4 gap-24 items-center place-items-center bg-[#ededed] py-12 px-12 rounded-2xl          
               shadow-[0_20px_50px_rgba(255,255,255,0.2)]
                border border-white/10"
            >
                {icons.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-row items-center justify-center gap-4 max-w-3xs"
                    >
                        <Image
                            className=""
                            // Defina um tamanho base aqui (ex: 120px)
                            width={100}
                            height={100}
                            src={item.icon}
                            alt={item.alt}
                        />
                        <p className="text-xl text-black font-bold">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}