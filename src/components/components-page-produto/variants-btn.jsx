"use client";

import { useState } from "react";

export default function VariantsButton({
    produto,
    setImagemAtiva,
    corAtiva,
    setCorAtiva,
    ClassBaseButton,
    ClassBase,
}) {
    const [hoveredId, setHoveredId] = useState(null);

    const baseButton = "w-6 h-6 rounded-full border-2 transition";
    const corActivate = "scale-110 border-black dark:border-white cursor-pointer";
    const corDisable = "border-gray-300 dark:border-gray-600 cursor-pointer";

    const hoveredColor = hoveredId
        ? produto.colors.find((cor) => cor.id === hoveredId)
        : null;
    const selectedColor = corAtiva
        ? produto.colors.find((cor) => cor.id === corAtiva)
        : null;
    const activeColor = hoveredColor ?? selectedColor;
    const activeLabel = activeColor?.corName ?? "";
    const labelClass = activeColor?.hex ? "font-semibold" : "text-sm text-gray-700";
    const labelStyle = activeColor?.hex ? { color: activeColor.hex } : undefined;

    return (
        <div className="flex flex-col gap-2">
            <p className="">
                Cor:
                <sapn className={labelClass} style={labelStyle}>
                  
                    {activeLabel ? ` ${activeLabel}` : ""}
                </sapn>
            </p>

            <div className={`flex gap-3 ${ClassBase}`}>
                {produto.colors.map((cor) => (
                    <button
                        key={cor.id}
                        type="button"
                        onClick={() => {
                            setImagemAtiva(cor.img);
                            setCorAtiva(cor.id);
                        }}
                        onMouseEnter={() => setHoveredId(cor.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onFocus={() => setHoveredId(cor.id)}
                        onBlur={() => setHoveredId(null)}
                        className={`
                            ${baseButton} ${ClassBaseButton}
                            ${corAtiva === cor.id ? corActivate : corDisable}
                        `}
                        style={{ backgroundColor: cor.hex }}
                        title={cor.name}
                        aria-label={cor.name}
                    />
                ))}
            </div>
        </div>
    );
}
