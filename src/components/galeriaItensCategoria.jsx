import Image from "next/image";

// dados da galeria
const itens = [
    {
        id: 1,
        image: "/img/categoria-notebook.avif",
        name: "Computadores",
        alt: "notebook",
       
    },
    {
        id: 2,
        image: "/img/categoria-celular.avif",
        name: "Mobile",
        alt: "notebook",
      
    },
    {
        id: 3,
        image: "/img/categoria-drone.avif",
        name: "Drones e câmeras",
        alt: "notebook",
      
    },
    {
        id: 4,
        image: "/img/categoria-icon-promocoes.avif",
        name: "Promoções",
        alt: "notebook",
    },
    {
        id: 5,
        image: "/img/categoria-tablet.avif",
        name: "Tablets",
        alt: "notebook",
       
    },
    {
        id: 6,
        image: "/img/categoria-icon-maisvendidos.avif",
        name: "Mais vendidos",
        alt: "notebook",
    },
    {
        id: 7,
        image: "/img/categoria-tv.avif",
        name: "TV e home theater",
        alt: "notebook",
      
    },
    {
        id: 8,
        image: "/img/categoria-relogia.avif",
        name: "Tecnologias vestíveis",
        alt: "notebook",
        
    },
    {
        id: 9,
        image: "/img/categoria-som.avif",
        name: "Alto-falantes",
        alt: "notebook",
       
    },
    {
        id: 10,
        image: "/img/categoia-fone.avif",
        name: "Headphones",
        alt: "notebook",
       
    },
];

const imgFone = itens.map((item) => item.id === 10);
// tentar tirar o pading no fone

export default function ItensGaleria() {
    return (
        <div className="grid grid-cols-5 gap-20">
            {itens.map((item) => (
                <div
                    key={item.id}
                    className="flex flex-col items-center gap-4 "
                >
                    <div
                        className={`
                            /* Configuração Base */
                            rounded-full flex items-center justify-center
                            transition-all duration-700 ease-in-out
                            
                            /* Cores de Fundo e SOMBRAS PERSONALIZADAS (Glow) */
                            ${
                                item.id === 4
                                    ? // Roxo: Sombra roxa, 0 deslocamento, 25px blur, 5px spread
                                      "bg-[#731efc] hover:shadow-[0_0_25px_5px_rgba(115,30,252,0.7)]"
                                    : item.id === 6
                                      ? // Preto: Sombra branca forte para contraste
                                        "bg-black border-2 border-white  hover:shadow-[0_0_40px_0px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_0_40px_0px_rgba(255,255,255,0.5)]"
                                      : // Padrão (Cinza): Sombra escura suave
                                        "bg-[#ededed] shadow-[0_0_4px_0px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_0px_rgba(0,0,0,0.5)]  dark:hover:shadow-[0_0_40px_0px_rgba(255,255,255,0.5)] transition-all ease-in-out duration-700"
                            }

                            /* Lógica do Padding */
                            ${item.id === 10 ? "p-4" : "p-4"}
                        `}
                    >
                        <Image
                            className={` rounded-full hover:scale-114 transition-all ease-in-out duration-700 cursor-pointer `}
                            // Defina um tamanho base aqui (ex: 120px)
                            width={200}
                            height={200}
                            src={item.image}
                            alt={item.alt}
                        />
                    </div>
                    <p className="text-xl text-black dark:text-white font-semibold">
                        {item.name}
                    </p>
                </div>
            ))}
        </div>
    );
}
