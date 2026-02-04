"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Função utilitária para formatar preço (opcional, mas recomendada)
const formatPrice = (cents) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(cents / 100);
};

export function ProductAccordion({ product }) {
    if (!product) return null;

    return (
        <Accordion
            type="multiple"
            className="w-full max-w-lg text-black"
            defaultValue={["details"]} // Opcional: deixa a aba de detalhes aberta por padrão
        >
            {/* ITEM 1: Informações do Produto (Dados Dinâmicos) */}
            <AccordionItem value="details">
                <AccordionTrigger>Detalhes do Produto</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600  space-y-2">
                    <p>
                        <strong className="text-foreground">Nome:</strong>{" "}
                        {product.name}
                    </p>
                    <p>
                        <strong className="text-foreground">Categoria:</strong>{" "}
                        <span className="capitalize">{product.category}</span>
                    </p>
                    <p>
                        <strong className="text-foreground">Preço:</strong>{" "}
                        {formatPrice(product.priceCents)}
                    </p>
                    <p>
                        <strong className="text-foreground">
                            Estoque disponível:
                        </strong>{" "}
                        {product.stock} unidades
                    </p>

                    {/* Renderiza Features se existirem */}
                    {product.features && product.features.length > 0 && (
                        <div className="mt-2">
                            <strong className="text-foreground">
                                Características:
                            </strong>
                            <ul className="list-disc pl-4 mt-1">
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>

            {/* ITEM 2: Política de Devolução e Reembolso (Texto Estático) */}
            <AccordionItem value="refund">
                <AccordionTrigger>
                    Política de Devolução e Reembolso
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 ">
                    <p className="mb-2">
                        Aceitamos devoluções gratuitas no prazo de{" "}
                        <strong>30 dias</strong> após a data de entrega. O
                        produto deve estar em sua embalagem original e sem
                        sinais de uso.
                    </p>
                    <p>
                        O reembolso será processado no método de pagamento
                        original em até 5 dias úteis após o recebimento e
                        inspeção do item em nosso centro de distribuição.
                    </p>
                </AccordionContent>
            </AccordionItem>

            {/* ITEM 3: Informações de Entrega (Texto Estático) */}
            <AccordionItem value="shipping">
                <AccordionTrigger>Informações de Entrega</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600 ">
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Envio Padrão: 5-7 dias úteis.</li>
                        <li>Envio Expresso: 2-3 dias úteis.</li>
                        <li>
                            O código de rastreio será enviado para seu e-mail
                            assim que o pedido for despachado.
                        </li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
