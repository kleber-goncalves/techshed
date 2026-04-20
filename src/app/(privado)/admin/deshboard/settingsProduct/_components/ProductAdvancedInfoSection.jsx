import { Input } from "@/components/ui/input";
import SectionCard from "./SectionCard";

function createTextFieldHandler(onFieldChange, field) {
    return (event) => onFieldChange(field, event.target.value);
}

export default function ProductAdvancedInfoSection({ form, onFieldChange }) {
    return (
        <SectionCard
            title="Dados avançados"
            description="Campos de organização interna e identificação no catálogo."
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="admin-prod-slug"
                        className="text-sm font-medium"
                    >
                        Slug
                    </label>
                    <Input
                        id="admin-prod-slug"
                        placeholder="slug-opcional"
                        value={form.slug}
                        onChange={createTextFieldHandler(onFieldChange, "slug")}
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="admin-prod-category"
                        className="text-sm font-medium"
                    >
                        Categoria
                    </label>
                    <Input
                        id="admin-prod-category"
                        placeholder="Categoria"
                        value={form.category}
                        onChange={createTextFieldHandler(
                            onFieldChange,
                            "category",
                        )}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="admin-prod-catalog-key"
                        className="text-sm font-medium"
                    >
                        Catalog key
                    </label>
                    <Input
                        id="admin-prod-catalog-key"
                        placeholder="Ex.: celulares"
                        value={form.catalogKey}
                        onChange={createTextFieldHandler(
                            onFieldChange,
                            "catalogKey",
                        )}
                        required
                    />
                </div>
            </div>
        </SectionCard>
    );
}
