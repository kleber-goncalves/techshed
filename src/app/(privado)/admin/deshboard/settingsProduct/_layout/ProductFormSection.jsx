import ProductImagesField from "./ProductImagesField";
import ProductVariantsField from "./ProductVariantsField";
import ProductAdvancedInfoSection from "../_components/ProductAdvancedInfoSection";
import ProductBasicInfoSection from "../_components/ProductBasicInfoSection";
import ProductFormActions from "../_components/ProductFormActions";
import ProductFormHeaderCard from "../_components/ProductFormHeaderCard";
import ProductPricingSection from "../_components/ProductPricingSection";
import ProductStatusSection from "../_components/ProductStatusSection";
import SectionCard, {
    productFormCardClassName,
} from "../_components/SectionCard";

export default function ProductFormSection({
    selectedProduct,
    form,
    onFieldChange,
    onSubmit,
    saving,
    selectedId,
    archiveDialogOpen,
    onArchiveDialogOpenChange,
    onArchive,
}) {
    const productId = selectedProduct?.id ?? selectedId;
    const solidFormCardClassName = `${productFormCardClassName} border-solid`;

    return (
        <div className="space-y-6">
            <ProductFormHeaderCard selectedProduct={selectedProduct} />

            <form
                onSubmit={onSubmit}
                className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
            >
                <div className="space-y-6">
                    <ProductBasicInfoSection
                        form={form}
                        onFieldChange={onFieldChange}
                    />

                    <ProductPricingSection
                        form={form}
                        onFieldChange={onFieldChange}
                    />

                    <ProductVariantsField
                        productId={productId}
                        title="Variantes"
                        description="Cadastre cores e outras variações com preço, estoque e galeria própria."
                        cardClassName={solidFormCardClassName}
                        value={form.variants}
                        onChange={(variants) =>
                            onFieldChange("variants", variants)
                        }
                    />
                    {selectedId ? (
                        <ProductImagesField
                            productId={productId}
                            title="Mídia e texto"
                            description="Adicione, reorganize e troque as imagens que aparecem na página do produto."
                            cardClassName={solidFormCardClassName}
                            value={form.images}
                            onChange={(images) =>
                                onFieldChange("images", images)
                            }
                        />
                    ) : (
                        <SectionCard
                            title="Mídia e texto"
                            description="A galeria pode ser preenchida assim que o produto for salvo pela primeira vez."
                        >
                            <p className="text-sm text-muted-foreground">
                                Salve o produto primeiro para adicionar fotos.
                            </p>
                        </SectionCard>
                    )}

                    <ProductStatusSection
                        form={form}
                        onFieldChange={onFieldChange}
                    />

                    <ProductFormActions
                        saving={saving}
                        selectedId={selectedId}
                        archiveDialogOpen={archiveDialogOpen}
                        onArchiveDialogOpenChange={onArchiveDialogOpenChange}
                        onArchive={onArchive}
                    />
                </div>

                <div className="space-y-6 lg:self-start">
                    <ProductAdvancedInfoSection
                        form={form}
                        onFieldChange={onFieldChange}
                    />
                </div>
            </form>
        </div>
    );
}
