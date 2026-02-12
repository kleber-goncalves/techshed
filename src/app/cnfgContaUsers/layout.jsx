import TopHeader from "@/components/componemts-conta-users/layout/top";

export default function CnfgContaUsersLayout({ children }) {
    return (
        <section>
            <TopHeader />
            <div className="mt-6">{children}</div>
        </section>
    );
}
