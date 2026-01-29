import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const Categorias = [
    {
        id: 1,
        title: "Categorias",
        content: [
            { id: 1, title: "Todos", value: "all" },
            // Mapeando "Computadores" para desktop (ou laptop, dependendo da sua preferência)
            { id: 2, title: "Computadores / Desktops", value: "desktop" },
            { id: 10, title: "Laptops", value: "laptop" }, // Adicionei Laptops separado para facilitar
            { id: 3, title: "Tablets", value: "tablet" }, // Singular conforme produtos.js
            { id: 4, title: "Câmeras", value: "camera" },
            { id: 11, title: "Drones", value: "quadcopter" },
            { id: 5, title: "Headphones", value: "headse" }, // Conforme produtos.js
            { id: 6, title: "Alto-falantes", value: "autofalante" },
            { id: 7, title: "Mobile / Celulares", value: "celulare" }, // Conforme produtos.js
            { id: 8, title: "TV e home theater", value: "smartst" },
            { id: 9, title: "Tecnologia vestível", value: "smartwatc" },
        ],
    },
];


export default function CategoryFilter({
    filters = { category: "all" },
    setFilters,
}) {
    const handleSelectCategory = (value) => {
        setFilters({ ...filters, category: value });
        console.log("Categoria selecionada:", value); // debug: ver no console do navegador
    };

    return (
        <div className="bg-green-200 border rounded-2xl p-4 border-black text-black">
            {/* Select mapeado a partir das categorias (mantém coerência com o accordion) */}
            <Accordion
                type="single"
                collapsible
                defaultValue="item-1"
            >
                {Categorias.map((categoria) => (
                    <AccordionItem
                        key={categoria.id}
                        value={`item-${categoria.id}`}
                    >
                        <AccordionTrigger className="flex justify-between items-center">
                            <p className="font-semibold text-base">
                                {categoria.title}
                            </p>
                        </AccordionTrigger>

                        <AccordionContent>
                                <ul className="space-y-1">
                                   {categoria.content.map((sub) => {
                                    // Comparamos o valor salvo no filtro com o value do item
                                    const selected = filters?.category === sub.value;
                                    
                                    return (
                                        <li key={sub.id}>
                                            <button
                                                onClick={() => handleSelectCategory(sub.value)}
                                                className={`w-full text-left p-2 rounded transition ${
                                                    selected
                                                        ? "bg-black text-white"
                                                        : "bg-transparent hover:bg-black/10"
                                                }`}
                                            >
                                                {sub.title}
                                            </button>
                                        </li>
                                    );
                                })}
                                </ul>
                           
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
