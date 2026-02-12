export default function SectionInfP() {
    return (
        <section>
            <div>
                <h1>Informações pessoais</h1>
                <p>Atualize suas informações pessoais</p>
            </div>
            <div className="">
                <form>
                    <div>
                        <label htmlFor="name">Nome</label>
                        <input type="text" placeholder="Nome" />
                    </div>
                    <div>
                        <label htmlFor="name">Sobrenome</label>
                        <input type="text" placeholder="Sobrenome" />
                    </div>
                    <div>
                        <label htmlFor="name">Telefone</label>
                        <input type="phone"  placeholder="Telefone" />
                    </div>
                </form>
            </div>

            <div>
                <button>Descartar</button>
                <button>Atualizar</button>
            </div>
        </section>
    );
}
