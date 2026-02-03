"use client";

export default function QuantitySelector({ quantity, setQuantity, max = 99 }) {
    const isMin = quantity <= 1;
    const isMax = quantity >= max;

    function diminuir() {
        if (!isMin) {
            setQuantity(quantity - 1);
        }
    }

    function aumentar() {
        if (!isMax) {
            setQuantity(quantity + 1);
        }
    }

    return (
        <div className="flex items-center border border-black w-fit">
            {/* Botão - */}
            <button
                onClick={diminuir}
                disabled={isMin}
                className={`
                    w-8 h-8  border rounded-md flex items-center justify-center text-lg
                    transition
                    ${
                        isMin
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    }
                `}
            >
                −
            </button>

            {/* Quantidade */}
            <span className="min-w-[32px] text-center font-medium cursor-default">
                {quantity}
            </span>

            {/* Botão + */}
            <button
                onClick={aumentar}
                disabled={isMax}
                className={`
                    w-8 h-8  border rounded-md flex items-center justify-center text-lg
                    transition
                    ${
                        isMax
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    }
                `}
            >
                +
            </button>
        </div>
    );
}
