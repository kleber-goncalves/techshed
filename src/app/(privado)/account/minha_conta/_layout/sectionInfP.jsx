"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { updateUserProfile, uploadProfileAvatar } from "@/hooks/userUpdate";
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
      const [avatarFile, setAvatarFile] = useState(null);
      const [avatarPreview, setAvatarPreview] = useState("");
      const [isSaving, setIsSaving] = useState(false);

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
              const accessToken = sessionData.session.access_token;

              setUser(loggedUser);

              let dbUser = null;
              const dbUserResponse = await fetch(`/api/users/${loggedUser.id}`, {
                  method: "GET",
                  headers: {
                      Authorization: `Bearer ${accessToken}`,
                  },
              });

              if (dbUserResponse.ok) {
                  dbUser = await dbUserResponse.json();
              }

              setForm({
                  name: dbUser?.name || loggedUser.user_metadata?.full_name || "",
                  email: loggedUser.email,
                  phone: dbUser?.phone || loggedUser.user_metadata?.phone || "",
                  newPassword: "",
              });
              setAvatarPreview(
                  dbUser?.avatarUrl || loggedUser.user_metadata?.avatar_url || "",
              );
          }
          loadUser();
      }, [router]);

      async function handleSubmit(e) {
          e.preventDefault();

          if (!user) return;
          setIsSaving(true);
          setMessage("");

          let avatarPayload = {};

          if (avatarFile) {
              const uploadResult = await uploadProfileAvatar(avatarFile);
              if (!uploadResult.success) {
                  setMessage("Erro no upload da foto: " + uploadResult.error);
                  setIsSaving(false);
                  return;
              }
              avatarPayload = {
                  avatarUrl: uploadResult.payload.url,
                  avatarStoragePath: uploadResult.payload.storagePath,
              };
          }

          const result = await updateUserProfile(user.id, {
              name: form.name,
              email: form.email,
              phone: form.phone,
              newPassword: form.newPassword,
              ...avatarPayload,
          });

          if (result.success) {
              setMessage("Dados atualizados com sucesso!");
              setAvatarFile(null);
              if (avatarPayload.avatarUrl) {
                  setAvatarPreview(avatarPayload.avatarUrl);
              }
          } else {
              setMessage("Erro: " + result.error);
          }
          setIsSaving(false);
      }

      function handleChange(e) {
          setForm({ ...form, [e.target.name]: e.target.value });
      }

      function handleAvatarChange(e) {
          const file = e.target.files?.[0];
          if (!file) return;
          setAvatarFile(file);
          setAvatarPreview(URL.createObjectURL(file));
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
                        <div className="flex flex-col gap-2 col-span-2">
                            <label htmlFor="avatar">Foto de perfil</label>
                            <div className="flex items-center gap-4">
                                <img
                                    src={avatarPreview || "/semImgPerfil.png"}
                                    alt="Pré-visualização da foto de perfil"
                                    className="w-17 h-16 rounded-full object-cover border border-black"
                                />
                                <input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                        </div>
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
                            <button disabled={isSaving} type="submit" className="border cursor-pointer border-violet-700 bg-violet-700 py-2 px-4 text-white disabled:opacity-60">
                                {isSaving ? "Salvando..." : "Atualizar"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
