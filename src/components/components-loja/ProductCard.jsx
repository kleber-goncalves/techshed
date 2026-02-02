
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ produto }) {
   
    return (
        <Link href={`/src/components/components-loja/ProductCard.jsx`}>
            <section className="border border-black  rounded-2xl flex flex-col w-full h-full  hover:shadow-[0_0_40px_0px_rgba(0,0,0,0.5)] transition ease-in-out duration-400">
                <div className="bg-white flex items-center justify-center rounded-t-2xl">
                    <Image
                        src={produto.img}
                        alt={produto.alt}
                        width={320}
                        height={320}
                        className="rounded-2xl"
                    />
                </div>
                <div className="flex flex-col max-w-xs h-full px-4 items-start bg-gray-300 gap-3 rounded-b-2xl">
                    <p className="text-base text-black ">{produto.name}</p>
                    <p className="text-xl text-violet-600">
                        R$ {(produto.priceCents / 100).toFixed(2)}
                    </p>
                </div>
            </section>
        </Link>
    );
}
