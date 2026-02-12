import Link from "next/link";

export default function TopHeader() {
    return (
        <>
            <section className="">
                <header className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">
                        Configurações da conta
                    </h1>
                </header>
                <nav>
                    <ul className="flex gap-4">
                        <li>
                            <Link href="/cnfgContaUsers/minha-conta">
                                Minha conta
                            </Link>
                        </li>
                        <li>
                            <Link href="/cnfgContaUsers/enderecos">
                                Meus endereços
                            </Link>
                        </li>
                        <li>
                            <Link href="/cnfgContaUsers/carteira">
                                Meus carteira
                            </Link>
                        </li>
                    </ul>
                </nav>
            </section>
        </>
    );
}
