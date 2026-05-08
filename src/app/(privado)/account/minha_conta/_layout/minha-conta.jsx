
import InfLog from "./inf-log";
import SectionInfP from "./sectionInfP";

export default function MinhaContaContent() {
    return (
        <section className="flex flex-col gap-2">
            <div className="flex flex-col pb-6 gap-3 border-b border-black dark:border-white">
                <h1 className="text-2xl font-semibold">Conta</h1>
                <p>Veja e edite suas informações</p>
            </div>
            <SectionInfP />
            <InfLog />
        </section>
    );
}
