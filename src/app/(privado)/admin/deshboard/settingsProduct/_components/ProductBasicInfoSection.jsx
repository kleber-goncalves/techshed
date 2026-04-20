import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SectionCard from "./SectionCard";

function createTextFieldHandler(onFieldChange, field) {
    return (event) => onFieldChange(field, event.target.value);
}

export default function ProductBasicInfoSection({ form, onFieldChange }) {
    return (
        <SectionCard
            title="Dados básicos"
            description="Informações principais que identificam o produto na vitrine."
            contentClassName="space-y-6"
        >
            <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <label
                        htmlFor="admin-prod-name"
                        className="text-sm font-medium"
                    >
                        Nome
                    </label>
                    <Input
                        id="admin-prod-name"
                        placeholder="Nome do produto"
                        value={form.name}
                        onChange={createTextFieldHandler(onFieldChange, "name")}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="admin-prod-promocao"
                    className="text-sm font-medium"
                >
                    Promoção
                </label>
                <Input
                    id="admin-prod-promocao"
                    placeholder="Opcional"
                    value={form.promocao}
                    onChange={createTextFieldHandler(onFieldChange, "promocao")}
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="admin-prod-description"
                    className="text-sm font-medium"
                >
                    Descrição
                </label>
                <Textarea
                    id="admin-prod-description"
                    className="min-h-24"
                    placeholder="Descrição do produto"
                    value={form.description}
                    onChange={createTextFieldHandler(
                        onFieldChange,
                        "description",
                    )}
                />
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="admin-prod-features"
                    className="text-sm font-medium"
                >
                    Features (uma por linha)
                </label>
                <Textarea
                    id="admin-prod-features"
                    className="min-h-28"
                    placeholder={"Ex.:\nTela OLED\n5G\nBateria 5000mAh"}
                    value={form.featuresText}
                    onChange={createTextFieldHandler(
                        onFieldChange,
                        "featuresText",
                    )}
                />
            </div>
        </SectionCard>
    );
}
