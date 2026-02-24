"use client";

import { useState } from "react";
import SearchModal from "@/components/Search/SearchModal";
import dynamic from "next/dynamic";
import HeaderBrandSearch from "./header/HeaderBrandSearch";
import HeaderUserSection from "./header/HeaderUserSection";
import HeaderQuickActions from "./header/HeaderQuickActions";

const BtnThemas = dynamic(() => import("../btnTema"), {
    ssr: false,
    loading: () => <div className="p-2 h-9 w-9" />, // Opcional: um placeholder
});

export default function Header() {
    const [openSearch, setOpenSearch] = useState(false);

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-black shadow-md">
                <HeaderBrandSearch onOpenSearch={() => setOpenSearch(true)} />

                <div className="flex items-center gap-4">
                    <BtnThemas />
                    <HeaderUserSection />
                    <HeaderQuickActions />
                </div>
            </header>
            {openSearch && <SearchModal onClose={() => setOpenSearch(false)} />}
        </>
    );
}
