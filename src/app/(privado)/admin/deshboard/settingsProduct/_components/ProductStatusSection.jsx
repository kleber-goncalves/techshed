import { Switch } from "@/components/ui/switch";
import SectionCard from "./SectionCard";

export default function ProductStatusSection({ form, onFieldChange }) {
    return (
        <SectionCard
            title="Status"
            description="Controle se o item aparece ou não no catálogo público."
            contentClassName="space-y-0"
        >
            <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                    <p className="text-sm font-medium">Produto ativo</p>
                    <p className="text-muted-foreground text-xs">
                        Quando desativado, o item sai do catálogo público.
                    </p>
                </div>

                <Switch
                    checked={Boolean(form.isActive)}
                    onCheckedChange={(checked) =>
                        onFieldChange("isActive", checked)
                    }
                />
            </div>
        </SectionCard>
    );
}
