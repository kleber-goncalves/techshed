"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import {
    updateUserProfile,
    uploadProfileAvatar,
    deleteOldProfileAvatar,
} from "@/hooks/userUpdate";
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
    const [savedAvatarPreview, setSavedAvatarPreview] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
            const initialAvatar =
                dbUser?.avatarUrl || loggedUser.user_metadata?.avatar_url || "";
            setAvatarPreview(initialAvatar);
            setSavedAvatarPreview(initialAvatar);
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
            // Upload da nova
            const uploadResult = await uploadProfileAvatar(avatarFile);
            if (!uploadResult.success) {
                setMessage("Erro no upload da foto: " + uploadResult.error);
                setIsSaving(false);
                return;
            }

            // Tenta remover a antiga (não bloqueia fluxo se falhar)
            const deleteResult = await deleteOldProfileAvatar();
            if (!deleteResult.success) {
                console.warn(
                    "Falha ao remover foto antiga:",
                    deleteResult.error,
                );
            }

            avatarPayload = {
                avatarUrl: uploadResult.payload.url,
                avatarStoragePath: uploadResult.payload.storagePath,
            };
        }

        // Salva dados do perfil + caminho da nova no Prisma
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
                setSavedAvatarPreview(avatarPayload.avatarUrl);
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

        if (!ALLOWED_TYPES.includes(file.type)) {
            setMessage("Formato invalido. Use JPG, PNG ou WEBP.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setMessage("Tamanho do arquivo grande. Máximo de 2MB.");
            return;
        }

        setMessage("");
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }

    return (
        <section className="flex flex-col gap-7 py-8 pb-12 border-b border-black dark:border-b-white">
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
                        <div className="flex flex-col gap-2 col-span-2 ">
                            <label htmlFor="avatar">Foto de perfil</label>
                            <div className="flex items-center gap-4">
                                <Image
                                    src={avatarPreview || "/semImgPerfil.png"}
                                    alt="Pré-visualização da foto de perfil"
                                    width={64}
                                    height={64}
                                    className="w-20 h-20 rounded-full object-cover border border-black dark:border-white"
                                />
                                <input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="avatar"
                                    className="inline-flex cursor-pointer items-center rounded-md border border-violet-700 px-4 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50"
                                >
                                    Selecionar foto
                                </label>
                                {avatarFile && (
                                    <p className="max-w-[220px] truncate text-sm text-gray-700">
                                        {avatarFile.name}
                                    </p>
                                )}
                                {avatarFile && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAvatarFile(null);
                                            setAvatarPreview(
                                                savedAvatarPreview,
                                            );
                                            setMessage("");
                                        }}
                                        className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Nome</label>
                            <input
                                className="border border-black dark:border-white max-w-3/4 p-2"
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
                                className="border border-black dark:border-white max-w-3/4 p-2"
                                type="text"
                                placeholder="Sobrenome"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Telefone</label>
                            <input
                                className="border border-black dark:border-white max-w-3/4 p-2"
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
                                className="border border-black dark:border-white max-w-3/4 p-2"
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
                            <button
                                disabled={isSaving}
                                type="submit"
                                className="border cursor-pointer border-violet-700 bg-violet-700 py-2 px-4 text-white disabled:opacity-60"
                            >
                                {isSaving ? "Salvando..." : "Atualizar"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
}
