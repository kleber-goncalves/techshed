export default function SectionInfP() {
    return (
        <section className="flex flex-col gap-7 py-8 pb-12 border-b border-black">
            <div className="flex flex-col gap-3">
                <h1 className="text-xl font-semibold">Informações pessoais</h1>
                <p>Atualize suas informações pessoais</p>
            </div>
            <div className="">
                <form className="grid grid-cols-2 gap-y-8">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Nome</label>
                        <input
                            className="border border-black max-w-3/4 p-2"
                            type="text"
                            placeholder="Nome"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Sobrenome</label>
                        <input
                            className="border border-black max-w-3/4 p-2"
                            type="text"
                            placeholder="Sobrenome"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Telefone</label>
                        <input
                            className="border border-black max-w-3/4 p-2"
                            type="tel"
                            placeholder="Telefone"
                        />
                    </div>
                    <div className="flex flex-row gap-5 items-end justify-end">
                        <button className="border border-violet-700 py-2 px-4 text-violet-700">
                            Descartar
                        </button>
                        <button className="border border-violet-700 bg-violet-700 py-2 px-4 text-white">
                            Atualizar
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
