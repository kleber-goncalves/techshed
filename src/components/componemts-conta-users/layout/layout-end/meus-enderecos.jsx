import AvisoTemp from "./avisoTemp";

export default function MeusEnderecos() {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex flex-col pb-6 gap-3 border-b border-black">
                <h1 className="text-2xl font-semibold">Meus endereços</h1>
            <p>Adicione e gerencie os endereços que você usa com frequência.</p>
            </div>
            <AvisoTemp/>
        </section>
    );
}