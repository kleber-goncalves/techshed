import SecCarts from "./sec-carts";

export default function MhCart() {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex flex-col pb-6 gap-3 border-b border-black">
                <h1 className="text-2xl font-semibold">Carteira</h1>
                <p>Salve suas informações de pagamento para um checkout mais rápido.</p>
            </div>
            <SecCarts/>
        </section>
    );
}
