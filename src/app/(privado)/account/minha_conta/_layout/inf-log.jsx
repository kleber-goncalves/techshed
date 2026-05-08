"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/supabaseClient";

export default function InfLog() {

  const [user, setUser] = useState(null);

  useEffect(() => {
      async function loadUser() {
          const { data } = await supabase.auth.getUser();
          setUser(data.user);
      }
      loadUser();
  }, []);

  if (!user) return <p>Você não está logado.</p>;

    return (
        <section className="flex flex-col gap-7 py-8 pb-7 border-b border-black dark:border-white">
            <div className="flex flex-col  gap-3">
                <h1 className="text-2xl font-semibold">Informações de login</h1>
                <p>Veja e atualize seu e-mail e senha e login</p>
            </div>
            <div className="flex flex-col">
                <p>
                    Email:
                </p>
                <p>{user.email}</p>
               
            </div>
            <div>
                <p>
                    Senha:
                </p>
                <p>{user.password}</p>
            </div>
        </section>
    );
}