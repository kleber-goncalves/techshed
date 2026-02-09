import Link from "next/link";
import { navCategories } from "@/data/categories";

export default function Nav() {
    return (
        <nav className="flex items-center gap-6 px-6 py-3 bg-white dark:bg-black text-sm">
            <Link href="/loja">Loja</Link>
            {navCategories.map((categoria) => (
                <Link
                    key={categoria.slug}
                    href={`/categoria/${categoria.slug}`}
                >
                    {categoria.label}
                </Link>
            ))}
            <Link href="/loja">Promoções</Link>
        </nav>
    );
}
