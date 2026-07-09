/* eslint-disable @next/next/no-page-custom-font */

import { Providers } from "../provider/providers";

import "../style/globals.css";


export const metadata = {
    title: "TechShed",
    description: "A sua loja de tecnologia",

};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin=""
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 ease-in-out">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
