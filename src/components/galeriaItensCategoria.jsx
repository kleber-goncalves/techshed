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
]

export default function ItensGaleria() {
    return (
        <div className="grid grid-cols-5 gap-20">
            {itens.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-4">
                    <div className="">
                        <img className="rounded-full" src={item.image} alt={item.alt} />
                    </div>
                    <p className="text-xl text-black font-semibold">{item.name}</p>
                </div>
            ))}
        </div>
    )
};