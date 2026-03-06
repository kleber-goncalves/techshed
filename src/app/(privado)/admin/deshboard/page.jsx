import AdminProdutosClient from "./_components/AdminProdutosClient";
import AdminAccessGate from "./_components/AdminAccessGate";

export default function AdminProdutosPages() {
    return (
        <section className="px-6 py-10">
            <AdminAccessGate>
                <AdminProdutosClient />
            </AdminAccessGate>
        </section>
    )
}
