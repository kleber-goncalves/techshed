import TopHeader from "@/app/(privado)/account/_components/top";

export default function accountLayout({ children }) {
    return (
        <section className="w-full flex flex-col px-6 py-12 bg-zinc-300 dark:bg-black text-black dark:text-white ">
            <TopHeader />
            <section className="mt-6 px-3">{children}</section>
        </section>
    );
}
