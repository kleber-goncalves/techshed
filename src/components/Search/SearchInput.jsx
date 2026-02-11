"use client";

export default function SearchInput({
    value,
    onChange,
    placeholder = "Buscar...",
    className = "",
}) {
    return (
        <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className={`w-full border px-3 py-2 rounded-md ${className}`}
        />
    );
}
