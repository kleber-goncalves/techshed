'use client';

import Image from "next/image";

export default function VariantsImg({
    produto,
    setImagemAtiva,
    corAtiva,
    setCorAtiva,
    ClassBase
}) {
    return (
        <div className={`flex gap-2 ${ClassBase}`}>
            {produto.colors.map((cor) => (
                <button
                    key={cor.id}
                    onClick={() => {
                        setImagemAtiva(cor.img);
                        setCorAtiva(cor.id);
                    }}
                    className={`border-2 rounded-lg transition

        ${corAtiva === cor.id ? "border-black" : "border-transparent"}
      `}
                >
                    <Image 
                        width={900}
                        height={900}
                        src={cor.img}
                        alt={cor.label}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                </button>
            ))}
        </div>
    );
}
