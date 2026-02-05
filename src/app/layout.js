/* eslint-disable @next/next/no-page-custom-font */

import Footer from "@/components/layout/footer";
import { Providers } from "../contexts/providers";

import "../style/globals.css";
import Header from "@/components/layout/Header";
import CentralAjuda from "@/components/layout/Central-ajuda";
import Nav from "@/components/nav";

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 ease-in-out">
                <Providers>
                    <Header />
                    <Nav/>
                    <main>{children}</main>
                    <section className="flex flex-col px-7 py-12">
                       <CentralAjuda/>
                        <Footer />
                    </section>
                </Providers>
            </body>
        </html>
    );
}
