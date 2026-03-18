import AdminProdutosClient from "./_layout/AdminProdutosClient";
import AdminAccessGate from "./_components/AdminAccessGate";

export default function AdminProdutosPages() {
    return (
        <section className="bg-muted/20 min-h-screen px-4 py-8 sm:px-6 lg:px-10">
            <AdminAccessGate>
                <AdminProdutosClient />
            </AdminAccessGate>
        </section>
    );
}
