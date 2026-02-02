import { useState } from "react";

export default function PriceFilter({ filters, setFilters }) {
const [localMin, setLocalMin] = useState("");
const [localMax, setLocalMax] = useState("");

const applyPrice = () => {
    setFilters({
        ...filters,
        minPrice: localMin === "" ? 0 : Number(localMin) * 100,
        maxPrice: localMax === "" ? Infinity : Number(localMax) * 100,
    });
};

    return (
        <div className="py-4 border-b border-gray-200 bg-white max-w-[250px] text-black">
            <p className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                Preço
            </p>

            <div className="flex items-center gap-2">
                {/* Input Mínimo */}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Mínimo"
                        className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
                        value={localMin}
                        onChange={(e) => setLocalMin(e.target.value)}
                    />
                </div>

                <span className="text-gray-400">—</span>

                {/* Input Máximo */}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Máximo"
                        className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-all"
                        value={localMax}
                        onChange={(e) => setLocalMax(e.target.value)}
                    />
                </div>

                {/* Botão de Aplicar (Estilo ML) */}
                <button
                    onClick={applyPrice}
                    className="ml-1 p-2 cursor-pointer bg-white border border-gray-300 rounded-full hover:bg-gray-50 shadow-sm text-blue-500 transition-colors"
                    aria-label="Aplicar filtro"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
