"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { updateUserProfile } from "@/hooks/userUpdate";
import { useRouter } from "next/navigation";

export default function SectionInfP() {


      const router = useRouter();
      const [user, setUser] = useState(null);
      const [form, setForm] = useState({
          name: "",
          email: "",
          phone: "",
          newPassword: "",
      });
      const [message, setMessage] = useState("");

      useEffect(() => {
          async function loadUser() {
              const { data: sessionData } = await supabase.auth.getSession();
              if (!sessionData.session) {
                  router.push("/auth");
                  return;
              }

              const {
                  data: { user: loggedUser },
              } = await supabase.auth.getUser();

              setUser(loggedUser);

              setForm({
                  name: loggedUser.user_metadata?.full_name || "",
                  email: loggedUser.email,
                  phone: loggedUser.user_metadata?.phone || "",
                  newPassword: "",
              });
          }
          loadUser();
      }, [router]);

      async function handleSubmit(e) {
          e.preventDefault();

          if (!user) return;

          const result = await updateUserProfile(user.id, {
              name: form.name,
              email: form.email,
              phone: form.phone,
              newPassword: form.newPassword,
          });

          if (result.success) {
              setMessage("Dados atualizados com sucesso!");
          } else {
              setMessage("Erro: " + result.error);
          }
      }

      function handleChange(e) {
          setForm({ ...form, [e.target.name]: e.target.value });
      }



    return (
        <section className="flex flex-col gap-7 py-8 pb-12 border-b border-black">
            <div className="flex flex-col gap-3">
                <h1 className="text-xl font-semibold">Informações pessoais</h1>
                <p>Atualize suas informações pessoais</p>
            </div>
            {message && <p>{message}</p>}
            <div className="">
                {user && (
                    <form
                        className="grid grid-cols-2 gap-y-8"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Nome</label>
                            <input
                                className="border border-black max-w-3/4 p-2"
                                name="name"
                                type="text"
                                placeholder="Nome"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Sobrenome</label>
                            <input
                                className="border border-black max-w-3/4 p-2"
                                type="text"
                                placeholder="Sobrenome"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Telefone</label>
                            <input
                                className="border border-black max-w-3/4 p-2"
                                name="phone"
                                type="text"
                                placeholder="Telefone"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label>Nova senha</label>
                            <input
                                className="border border-black max-w-3/4 p-2"
                                name="newPassword"
                                type="password"
                                value={form.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-row gap-5 items-end justify-end">
                            <button className="border border-violet-700 py-2 px-4 text-violet-700">
                                Descartar
                            </button>
                            <button type="submit" className="border cursor-pointer border-violet-700 bg-violet-700 py-2 px-4 text-white">
                                Atualizar
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
