export default function AvisoTemp() {
    return (
        <section className="flex flex-col w-full h-full items-center justify-center">
            <div className="flex flex-col gap-6 items-center ">
                <h1 className="text-2xl font-semibold">Você ainda não possui endereços</h1>
                <button className="bg-violet-600 rounded-lg py-4 px-13 w-fit text-white hover:text-black font-semibold hover:bg-violet-300 transition-all ease-in-out duration-700">
                    Adicionar novo endereço
                </button>
            </div>
        </section>
    );
}