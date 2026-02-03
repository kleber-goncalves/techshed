"use client";

export default function VariantsButton({
    produto,
    setImagemAtiva,
    corAtiva,
    setCorAtiva,
    ClassBaseButton,
    ClassBase
}) {
    const baseButton = "w-9 h-9 rounded-full border-2 transition";
    const corActivate
 = "scale-110 border-black";
    const corDisable = "border-gray-300";

    return (
        <div className={`flex gap-3 mt-4 ${ClassBase}`}>
            {produto.colors.map((cor) => (
                <button
                    key={cor.id}
                    onClick={() => {
                        setImagemAtiva(cor.img);
                        setCorAtiva(cor.id);
                    }}
                    className={`
                        ${baseButton} ${ClassBaseButton}
                        ${corAtiva === cor.id ? corActivate : corDisable}
                    `}
                    style={{ backgroundColor: cor.hex }}
                    title={cor.name}
                />
            ))}
        </div>
    );
}
