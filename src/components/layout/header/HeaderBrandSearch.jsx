"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeaderBrandSearch({ onOpenSearch }) {
    return (
        <div className="flex flex-row gap-5">
            <Link href="/" className="flex flex-row">
                <h1 className="text-[40px] font-semibold">TechShed</h1>
            </Link>

            <Button
                variant="ghost"
                onClick={onOpenSearch}
                className="cursor-pointer"
            >
                <Search className="w-12 h-12" />
            </Button>
        </div>
    );
}
