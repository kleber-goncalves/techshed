import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ produto, noMaxWidth = false }) {
    const infoClassName = `flex flex-col h-23.25 pl-3  items-start bg-white gap-3 rounded-b-2xl${
        noMaxWidth ? "" : " max-w-xs"
    }`;

    return (
        <Link href={`/produto/${produto.slug}`}>
            <section className=" border border-black  rounded-2xl flex flex-col w-full h-full  hover:shadow-[0_0_40px_0px_rgba(0,0,0,0.5)] transition ease-in-out duration-400">
                <div className="bg-white flex items-center justify-center rounded-t-2xl">
                    <Image
                        src={produto.img}
                        alt={produto.alt}
                        width={320}
                        height={320}
                        className="rounded-2xl"
                    />
                </div>
                <div className={infoClassName}>
                    <p className="text-base text-black ">{produto.name}</p>
                    <div className=" w-full h-full flex ">
                        <p className="text-xl text-violet-600">
                            R$ {(produto.priceCents / 100).toFixed(2)}
                        </p>
                    </div>
                </div>
            </section>
        </Link>
    );
}
