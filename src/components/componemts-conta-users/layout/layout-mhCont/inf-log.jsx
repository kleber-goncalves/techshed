export default function InfLog() {
    return (
        <section className="flex flex-col gap-7 py-8 pb-7 border-b border-black">
            <div className="flex flex-col  gap-3">
                <h1 className="text-2xl font-semibold">Informações de login</h1>
                <p>Veja e atualize seu e-mail e senha e login</p>
            </div>
            <div className="flex flex-col">
                <p>
                    Email:
                </p>
                <p>exemplo@gmail.com</p>
               
            </div>
            <div>
                <p>
                    Senha:
                </p>
                <p>********</p>
            </div>
        </section>
    );
}