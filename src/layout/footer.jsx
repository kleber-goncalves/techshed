"use client";

import React, { useState } from "react";

import {
    FacebookIcon,
    Instagram,
    InstagramIcon,
    LucideInstagram,
    Twitch,
    Youtube,
} from "lucide-react";
import MetodosPagamentos from "../components/Pagament-footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function Footer() {
    const [openValue, setOpenValue] = useState("");

    
    return (
        <footer className="w-full bg-slate-200 dark:bg-[#0f172a] rounded-t-2xl overflow-hidden">
            <Accordion
                type="single"
                collapsible
                value={openValue}
                onValueChange={setOpenValue}
                className="w-full"
            >
                <AccordionItem value="more-info" className="border-0">
                    <AccordionTrigger
                        className={`
                            cursor-pointer relative w-fit hover:no-underline space-x-7 items-center justify-center border-b border-black/10 
                            py-2 text-center text-sm font-semibold text-black transition-colors dark:border-white/10
                            bg-white/5 dark:text-white [&>svg]:relative [&>svg]:right-6  [&>svg]:size-6 [&>svg]:text-center [&>svg]:justify-center
                            ${openValue === "more-info" ? "rounded-none" : "rounded-none"} 
                        `}
                    >
                        <span>Mais Informações</span>
                    </AccordionTrigger>

                    <AccordionContent className="p-0 bg-slate-200 dark:bg-[#0f172a]">
                        <section
                            id="dentroAcrodion"
                            className="flex flex-col w-full "
                        >
                            <section className="flex flex-row justify-between px-23">
                                <section className="flex flex-col p-10 gap-6">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Endereço
                                        </h2>
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-3">
                                            <p>Rua Prates, 194 - Bom Retiro</p>
                                            <p>SP 01121-000</p>
                                            <p>info@meusite.com</p>
                                            <p>Telefone: (11) 3456-7890</p>
                                        </div>
                                        <div className="flex flex-row gap-3">
                                            <FacebookIcon />
                                            <Instagram />
                                            <Twitch />
                                            <Youtube />
                                        </div>
                                    </div>
                                </section>
                                <section className="flex flex-col p-10 gap-6">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Loja
                                        </h2>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <p>Loja</p>
                                        <p>Computadores</p>
                                        <p>Tablets</p>
                                        <p>Drones e Câmeras</p>
                                        <p>Áudio</p>
                                        <p>Mobile</p>
                                        <p>Tv e home theater</p>
                                        <p>Tecnologia vestível</p>
                                        <p>Promoções</p>
                                    </div>
                                </section>
                                <section className="flex flex-col p-10 gap-6">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Endereço
                                        </h2>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <p>Contato</p>
                                        <p>Central de ajuda</p>
                                        <p>Sobre nós</p>
                                        <p>Carreiras</p>
                                    </div>
                                </section>
                                <section className="flex flex-col p-10 gap-6">
                                    <div>
                                        <h2 className="text-xl font-semibold">
                                            Endereço
                                        </h2>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <p>Entregas e devoluções</p>
                                        <p>Termos e condições</p>
                                        <p>Métodos de pagamento</p>
                                        <p>Política de Cookies</p>
                                        <p>FAQ</p>
                                    </div>
                                </section>
                                {/* ... Mantenha as outras seções/colunas normais aqui ... */}
                            </section>
                            <div
                            className="flex flex-row w-full pt-1 pb-1 px-56 items-center justify-between"
                        >
                            <span className=" bg-white w-full border  rounded-full"></span>
                        </div>
                            
                            <MetodosPagamentos />
                        </section>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <section className="w-full flex flex-col py-5 px-12 gap-2 bg-gray-400 text-black text-sm">
                <p>© 2023 Meu Site. Todos os direitos reservados.</p>
                <p>
                    TechShed - CPF/CNPJ: 12.345.678/0000-01 - Rua Prates, 194 -
                    Bom Retiro - São Paulo - SP, 01121-000. SP 12345-678 -
                    info@meusite.com. Telefone: (11) 3456-7890
                </p>
            </section>
        </footer>
    );
}
