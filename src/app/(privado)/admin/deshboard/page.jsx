import AdminProdutosClient from "./_layout/AdminProdutosClient";
import AdminAccessGate from "./_components/AdminAccessGate";
import Header from "@/layout/Header";
import Nav from "@/components/nav";

export default function AdminProdutosPages() {
    return (
        <>
            <Header />
            <Nav />
            <main className="bg-muted/20 min-h-screen px-4 py-8 sm:px-6 lg:px-10">
                <AdminAccessGate>
                    <AdminProdutosClient />
                </AdminAccessGate>
            </main>
        </>
    );
}
