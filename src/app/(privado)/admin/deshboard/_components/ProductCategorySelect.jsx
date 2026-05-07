import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function normalizeCategories(categories, currentValue) {
    const source = Array.isArray(categories) ? categories : [];
    const cleaned = source
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);

    const unique = Array.from(new Set(cleaned));
    unique.sort((a, b) => a.localeCompare(b, "pt-BR"));

    if (currentValue && currentValue !== "all" && !unique.includes(currentValue)) {
        return [currentValue, ...unique];
    }

    return unique;
}

export default function ProductCategorySelect({
    value,
    onValueChange,
    categories,
    disabled,
}) {
    const options = normalizeCategories(categories, value);

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className="h-10 w-full sm:w-[220px] cursor-pointer">
                <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectItem className="cursor-pointer" value="all">
                    Todas as categorias
                </SelectItem>
                {options.map((category) => (
                    <SelectItem
                        className="cursor-pointer"
                        key={category}
                        value={category}
                    >
                        {category}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
