
export default function EmailNewsletter() {
    return (
        <section className="w-full py-23">
            <form className="bg-violet-600 rounded-2xl p-20 flex flex-col gap-5 items-center">
                <h1 className="text-3xl font-semibold text-white">
                    Newsletter
                </h1>
                <p className="text-white">
                    Assine para receber novidades e ofertas especiais
                </p>
                <div className="flex flex-row w-full max-w-4xl">
                    <input
                        className="bg-white rounded-tl-lg rounded-bl-lg py-4 px-4 w-full text-black focus:bg-violet-300 focus:outline-none placeholder:text-black transition-all ease-in-out duration-700"
                        type="text"
                        placeholder="Digite seu e-mail"

                    />
                    <button
                        className="bg-black rounded-tr-lg rounded-br-lg py-4 px-13 w-fit text-white hover:text-black font-semibold hover:bg-violet-300 transition-all ease-in-out duration-700"
                        type="submit"
                    >
                        Assinar
                    </button>
                </div>
            </form>
        </section>
    );
}