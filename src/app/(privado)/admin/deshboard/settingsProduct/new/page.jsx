import AdminAccessGate from "../../_components/AdminAccessGate";
import ProductEditorClient from "../../_components/admin-produtos/ProductEditorClient";

export default function NewProductPage() {
    return (
        <section className="bg-muted/20 min-h-screen px-4 py-8 sm:px-6 lg:px-10">
            <AdminAccessGate>
                <ProductEditorClient />
            </AdminAccessGate>
        </section>
    )
}