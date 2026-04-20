import AdminAccessGate from "../../_components/AdminAccessGate";
import ProductEditorClient from "../_layout/ProductEditorClient";

export default async function EditProductPage({ params }) {
    const { id } = await params;

    return (
        <section className="bg-muted/20 min-h-screen px-4 py-8 sm:px-6 lg:px-10">
            <AdminAccessGate>
                <ProductEditorClient productId={id} />
            </AdminAccessGate>
        </section>
    );
}
