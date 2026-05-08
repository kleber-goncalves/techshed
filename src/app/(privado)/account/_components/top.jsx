import Link from "next/link";

export default function TopHeader() {
    return (
        <>
            <section className="flex flex-col gap-5 ">
                <header className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">
                        Configurações da conta
                    </h1>
                </header>
                <nav className="">
                    <ul className="flex gap-7">
                        <li>
                            <Link href="/account/minha_conta">Minha conta</Link>
                        </li>
                        <li>
                            <Link href="/account/meus_enderecos">
                                Meus endereços
                            </Link>
                        </li>
                        <li>
                            <Link href="/account/minha_carteira">
                                Minha carteira
                            </Link>
                        </li>
                    </ul>
                </nav>
            </section>
        </>
    );
}
