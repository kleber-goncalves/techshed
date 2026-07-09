"use client";

import { usePathname } from 'next/navigation';


import Nav from "@/components/nav";
import Footer from "@/layout/footer";
import Header from "@/layout/Header";


export default function HomeLayout({ children }) {

      const locationPage = usePathname();


    const paginasSemComponente = ["/carrinho", "/favoritos"];

    const deveEsconder = paginasSemComponente.includes(locationPage);

    return (
        <>
            <Header />
            <Nav />
            <main>{children}</main>
            {!deveEsconder && <Footer />}
            
        </>
    );
}
