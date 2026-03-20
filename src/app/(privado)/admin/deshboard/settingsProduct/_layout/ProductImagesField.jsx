"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/supabaseClient";

async function getAccessToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token;
}

// Função para fazer o upload da imagem
async function uploadImage(file, productId) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);

    const res = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const payload = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(payload.error || "Falha no upload da imagem.");
    }

    return payload;
}

// Componente do campo de imagens
export default function ProductImagesField({ productId, value, onChange }) {
    const addInputRef = useRef(null);
    const [dragId, setDragId] = useState(null);

    // Função para lidar com a adicionaçao de imagens
    async function handleAdd(files) {
        if (!files?.length || !productId) return;

        const uploaded = await Promise.all(
            Array.from(files).map(async (file, index) => {
                const image = await uploadImage(file, productId);
                return {
                    id: crypto.randomUUID(),
                    url: image.url,
                    alt: file.name,
                    storagePath: image.storagePath,
                    position: value.length + index,
                };
            }),
        );

        onChange([...value, ...uploaded]);
    }

    // Função para lidar com a substituição
    async function handleReplace(imageId, file) {
        if (!file || !productId) return;

        const image = await uploadImage(file, productId);
        onChange(
            value.map((item) =>
                item.id === imageId
                    ? { ...item, url: image.url, storagePath: image.storagePath }
                    : item,
            ),
        );
    }

    // Função para lidar com a remoção
    function handleRemove(imageId) {
        onChange(
            value
                .filter((item) => item.id !== imageId)
                .map((item, index) => ({ ...item, position: index })),
        );
    }

    // Função para lidar com o arrastar e soltar
    function handleDrop(targetId) {
        if (!dragId || dragId === targetId) return;
        const items = [...value];
        const from = items.findIndex((item) => item.id === dragId);
        const to = items.findIndex((item) => item.id === targetId);
        const [moved] = items.splice(from, 1);
        items.splice(to, 0, moved);
        onChange(items.map((item, index) => ({ ...item, position: index })));
    }


    return (
        <div className="space-y-3">
            <Button
                type="button"
                variant="outline"
                onClick={() => addInputRef.current?.click()}
            >
                Adicionar foto
            </Button>

            <Input
                ref={addInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleAdd(e.target.files)}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 ">
                {value.map((image, index) => (
                    <div
                        key={image.id}
                        draggable
                        onDragStart={() => setDragId(image.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(image.id)}
                        className="rounded-xl border p-3 space-y-3"
                    >
                        <div className="relative aspect-square overflow-hidden rounded-lg border">
                            <Image
                                src={image.url}
                                alt={image.alt || "Imagem do produto"}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <p className="text-xs text-muted-foreground">
                            {index === 0
                                ? "Capa do produto"
                                : `Foto ${index + 1}`}
                        </p>

                        <Input
                            value={image.alt}
                            placeholder="Texto alternativo"
                            onChange={(e) =>
                                onChange(
                                    value.map((item) =>
                                        item.id === image.id
                                            ? { ...item, alt: e.target.value }
                                            : item,
                                    ),
                                )
                            }
                        />

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                handleReplace(image.id, e.target.files?.[0])
                            }
                        />

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleRemove(image.id)}
                        >
                            Remover foto
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
