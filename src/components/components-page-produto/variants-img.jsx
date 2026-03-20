"use client";

import Image from "next/image";

export default function VariantsImg({
    images = [],
    activeIndex = 0,
    onSelect,
    productName,
    ClassBase,
}) {
    return (
        <div className={`flex gap-2 ${ClassBase}`}>
            {images.map((image, index) => (
                <button
                    key={image.id ?? `${image.url}-${index}`}
                    type="button"
                    onClick={() => onSelect(index)}
                    className={`border-2 rounded-lg transition
        ${activeIndex === index ? "border-black dark:border-white dark:border-2" : "border-transparent"}
      `}
                >
                    <Image
                        width={900}
                        height={900}
                        src={image.url}
                        alt={image.alt || productName}
                        className="w-16 h-16 object-cover rounded-md cursor-pointer"
                    />
                </button>
            ))}
        </div>
    );
}
