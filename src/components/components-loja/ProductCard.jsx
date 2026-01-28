
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ produto }) {
   
    return (
        <Link href={`/src/components/components-loja/ProductCard.jsx`}>
            <section className="border border-black flex flex-col w-full h-full  bg-red-200">
                <div className="">
                    <Image
                        src={produto.img}
                        alt={produto.alt}
                        width={320}
                        height={320}
                    />
                </div>
                <div className="flex flex-col max-w-xs h-full px-4 items-start bg-gray-300 gap-3">
                    <p className="text-base text-black ">{produto.name}</p>
                    <p className="text-xl text-violet-600">
                        R$ {(produto.priceCents / 100).toFixed(2)}
                    </p>
                </div>
            </section>
        </Link>
    );
}
