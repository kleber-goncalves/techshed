import Image from "next/image";
import { CheckCircle2 } from "lucide-react"; // Opcional: npm install lucide-react

export default function CentralAjuda() {
    return (
        <section className="w-full py-24">
            <div className="relative bg-slate-200 dark:bg-[#0f172a] rounded-[3rem] h-[450px] flex items-center  shadow-2xl overflow-visible border border-white/10">
                {/* ÁREA DA IMAGEM */}
                <div className="absolute -top-20 left-0 h-[calc(100%+5rem)] w-1/2 hidden md:flex items-end justify-center z-10 pointer-events-none">
                    <div className="relative w-full h-full flex items-end justify-center">
                        {/* IMAGEM COM MÁSCARA NA BASE */}
                        <div className="relative w-full h-full  flex items-end justify-center">
                            <Image
                                src="/Novo Projeto-redomdo-nv-cp.png"
                                alt="Atendente"
                                width={1000}
                                height={1000}
                                className="h-[110%] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* CONTEÚDO TEXTUAL */}
                <div className="ml-auto w-full md:w-[38%] z-20 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1]">
                            Tem dúvidas? <br />
                            <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                Fale com a Central de Ajuda
                            </span>
                        </h2>
                    </div>

                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                        Atendimento rápido, humano e eficiente. Estamos prontos
                        para te ajudar.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-1">
                            Começar atendimento
                        </button>
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">
                            Grátis e Imediato
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}