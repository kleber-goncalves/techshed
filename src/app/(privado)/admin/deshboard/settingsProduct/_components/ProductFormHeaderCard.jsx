import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { productFormCardClassName } from "./SectionCard";
import { formatDate } from "../../_utils/utils";

export default function ProductFormHeaderCard({ selectedProduct }) {
    return (
        <Card className={productFormCardClassName}>
            <CardHeader className="space-y-1.3 pb-6">
                <CardTitle className="text-lg">
                    {selectedProduct ? "Editar produto" : "Cadastrar produto"}
                </CardTitle>
                <CardDescription>
                    {selectedProduct
                        ? `Última atualização: ${formatDate(selectedProduct.updatedAt)}`
                        : "Preencha os campos para criar um novo produto."}
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
