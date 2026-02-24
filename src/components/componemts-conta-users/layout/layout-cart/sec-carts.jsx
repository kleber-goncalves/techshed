export default function SecCarts() {
    return (
        <section className="grid grid-cols-2 gap-3">
            <div className="flex flex-row gap-3">
               
                <img src="" alt="" />
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                        <p>Mastercard (2751)</p>
                        <button className="border border-black rounded-full px-3 py-1 text-xs">
                            Padrão
                        </button>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p>Data de vencimento: 07/2027</p>
                        <p>Titular do cartão: John Doe</p>
                    </div>
                </div>
            </div>

            <button className="w-fit h-fit justify-self-end border border-black px-3 py-2">
                Gerenciar cartão
            </button>
        </section>
    );
}