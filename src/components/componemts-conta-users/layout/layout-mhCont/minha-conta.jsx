import SectionInfP from "@/components/componemts-conta-users/layout/layout-mhCont/sectionInfP";
import InfLog from "./inf-log";

export default function MinhaContaContent() {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex flex-col pb-6 gap-3 border-b border-black">
                <h1 className="text-2xl font-semibold">Conta</h1>
                <p>Veja e edite suas informações</p>
            </div>
            <SectionInfP />
            <InfLog />
        </section>
    );
}
