import Image from "next/image";

export default function MetodosPagamentos() {
    return (
        <section className="flex flex-col items-center gap-8 py-15">
            <p>Metodos de pagamento</p>
            <div>
                <Image width={500} height={500} src="/imgMetodoPagamentos/metodoPagamentos.avif" alt="" />
            </div>
        </section>
    )
}