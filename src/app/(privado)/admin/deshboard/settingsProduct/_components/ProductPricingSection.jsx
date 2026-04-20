import { Input } from "@/components/ui/input";
import SectionCard from "./SectionCard";

function createNumberFieldHandler(onFieldChange, field) {
    return (event) => onFieldChange(field, event.target.value);
}

export default function ProductPricingSection({ form, onFieldChange }) {
    return (
        <SectionCard
            title="Preço e estoque"
            description="Defina o valor de venda e a quantidade disponível."
        >
            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="admin-prod-price"
                        className="text-sm font-medium"
                    >
                        Preço (centavos)
                    </label>
                    <Input
                        id="admin-prod-price"
                        type="number"
                        placeholder="0"
                        min={0}
                        value={form.priceCents}
                        onChange={createNumberFieldHandler(
                            onFieldChange,
                            "priceCents",
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="admin-prod-stock"
                        className="text-sm font-medium"
                    >
                        Estoque
                    </label>
                    <Input
                        id="admin-prod-stock"
                        type="number"
                        placeholder="0"
                        min={0}
                        value={form.stock}
                        onChange={createNumberFieldHandler(onFieldChange, "stock")}
                    />
                </div>
            </div>
        </SectionCard>
    );
}
