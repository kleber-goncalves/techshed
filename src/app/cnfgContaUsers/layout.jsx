import TopHeader from "@/components/componemts-conta-users/layout/top";


export default function CnfgContaUsersLayout({ children }) {
    return (
        <section className="w-full flex flex-col px-6 py-12 bg-zinc-300 text-black ">
            <TopHeader />
            <section className="mt-6 px-3">{children}</section>
        </section>
    );
}
