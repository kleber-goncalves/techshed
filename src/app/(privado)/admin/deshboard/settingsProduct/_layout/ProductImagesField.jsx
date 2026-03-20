"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
    GripVertical,
    Loader2,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/supabaseClient";

async function getAccessToken() {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token;
}

async function uploadImage(file, productId) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);

    const response = await fetch("/api/admin/uploads", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || "Falha no upload da imagem.");
    }

    return payload;
}

function createImageItem(file, uploadResult, position) {
    return {
        id: crypto.randomUUID(),
        url: uploadResult.url,
        alt: file.name,
        storagePath: uploadResult.storagePath,
        position,
    };
}

function updateImageList(images, imageId, updater) {
    return images.map((image) =>
        image.id === imageId ? updater(image) : image,
    );
}

function reorderImages(images, dragId, targetId) {
    const fromIndex = images.findIndex((image) => image.id === dragId);
    const targetIndex = images.findIndex((image) => image.id === targetId);

    if (fromIndex === -1 || targetIndex === -1 || fromIndex === targetIndex) {
        return images;
    }

    const nextImages = [...images];
    const [movedImage] = nextImages.splice(fromIndex, 1);

    nextImages.splice(targetIndex, 0, movedImage);

    return nextImages.map((image, index) => ({
        ...image,
        position: index,
    }));
}

function AddImageTile({ disabled, isUploading, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 transition-all",
                "hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-60",
            )}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                {isUploading ? (
                    <Loader2 className="size-8 animate-spin text-primary" />
                ) : (
                    <Plus className="size-10 text-primary" />
                )}
                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        {isUploading ? "Enviando..." : "Adicionar foto"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Clique para selecionar
                    </p>
                </div>
            </div>
        </button>
    );
}

function ImageCard({
    image,
    index,
    isCover = false,
    isBusy = false,
    onAltChange,
    onRemove,
    onReplaceClick,
    onDragStart,
    onDragEnd,
    onDrop,
}) {
    return (
        <div
            draggable={!isBusy}
            onDragStart={() => onDragStart(image.id)}
            onDragEnd={onDragEnd}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDrop(image.id)}
            className={cn(
                "group rounded-2xl border bg-card shadow-sm transition-shadow",
                isCover ? "overflow-hidden" : "p-3 hover:shadow-md",
            )}
        >
            <div className={cn("space-y-3", isCover && "p-4")}>
                <div
                    className={cn(
                        "relative overflow-hidden rounded-xl border bg-muted",
                        isCover
                            ? "aspect-[6/5] min-h-[250px] md:min-h-[280px]"
                            : "aspect-square",
                    )}
                >
                    <Image
                        src={image.url}
                        alt={image.alt || "Imagem do produto"}
                        fill
                        className="object-cover"
                    />

                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                        <Badge variant={isCover ? "default" : "secondary"}>
                            {isCover ? "Imagem principal" : `Foto ${index + 1}`}
                        </Badge>

                        <div className="rounded-full bg-background/90 p-2 text-muted-foreground shadow-sm">
                            <GripVertical className="size-4" />
                        </div>
                    </div>

                    {isCover ? (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 text-white">
                            <p className="text-sm font-medium">
                                A primeira imagem da galeria é usada como capa.
                            </p>
                            <p className="text-xs text-white/80">
                                Arraste outra foto para esta posição se quiser
                                trocar a capa.
                            </p>
                        </div>
                    ) : null}
                </div>

                <div className="space-y-3">
                    <Input
                        value={image.alt}
                        placeholder="Texto alternativo da imagem"
                        disabled={isBusy}
                        onChange={(event) =>
                            onAltChange(image.id, event.target.value)
                        }
                    />

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            disabled={isBusy}
                            onClick={() => onReplaceClick(image.id)}
                        >
                            {isBusy ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Pencil className="size-4" />
                            )}
                            Trocar
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            disabled={isBusy}
                            onClick={() => onRemove(image.id)}
                        >
                            <Trash2 className="size-4" />
                            Remover
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductImagesField({
    productId,
    value = [],
    onChange,
    title = "Galeria do produto",
    description = "A imagem principal fica em destaque e as demais podem ser adicionadas, reordenadas, trocadas ou removidas.",
    emptyTitle = "Adicione a primeira imagem do produto",
    emptyDescription = "A primeira foto enviada vira a capa principal automaticamente.",
}) {
    const addInputRef = useRef(null);
    const replaceInputRefs = useRef({});
    const [dragId, setDragId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [replacingId, setReplacingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const coverImage = value[0] ?? null;
    const galleryImages = value.slice(1);

    function clearFileInput(event) {
        if (event?.target) {
            event.target.value = "";
        }
    }

    function handleAltChange(imageId, alt) {
        onChange(updateImageList(value, imageId, (image) => ({ ...image, alt })));
    }

    function handleRemove(imageId) {
        const nextImages = value
            .filter((image) => image.id !== imageId)
            .map((image, index) => ({
                ...image,
                position: index,
            }));

        onChange(nextImages);
    }

    function handleDragStart(imageId) {
        setDragId(imageId);
    }

    function handleDragEnd() {
        setDragId(null);
    }

    function handleDrop(targetId) {
        if (!dragId) return;

        onChange(reorderImages(value, dragId, targetId));
        setDragId(null);
    }

    async function handleAdd(files) {
        if (!files?.length || !productId) return;

        setErrorMessage("");
        setIsAdding(true);

        try {
            const uploadedImages = await Promise.all(
                Array.from(files).map(async (file, index) => {
                    const result = await uploadImage(file, productId);
                    return createImageItem(file, result, value.length + index);
                }),
            );

            onChange([...value, ...uploadedImages]);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível enviar a imagem.",
            );
        } finally {
            setIsAdding(false);
        }
    }

    async function handleReplace(imageId, file) {
        if (!file || !productId) return;

        setErrorMessage("");
        setReplacingId(imageId);

        try {
            const result = await uploadImage(file, productId);

            onChange(
                updateImageList(value, imageId, (image) => ({
                    ...image,
                    url: result.url,
                    storagePath: result.storagePath,
                })),
            );
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível substituir a imagem.",
            );
        } finally {
            setReplacingId(null);
        }
    }

    function openAddDialog() {
        addInputRef.current?.click();
    }

    function openReplaceDialog(imageId) {
        replaceInputRefs.current[imageId]?.click();
    }

    return (
        <Card className="border-dashed">
            <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{title}</CardTitle>
                    <Badge variant="outline">
                        {value.length} {value.length === 1 ? "imagem" : "imagens"}
                    </Badge>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 pb-6">
                <Input
                    ref={addInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                        handleAdd(event.target.files);
                        clearFileInput(event);
                    }}
                />

                {value.map((image) => (
                    <Input
                        key={`replace-input-${image.id}`}
                        ref={(element) => {
                            replaceInputRefs.current[image.id] = element;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                            handleReplace(image.id, event.target.files?.[0]);
                            clearFileInput(event);
                        }}
                    />
                ))}

                {errorMessage ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {errorMessage}
                    </div>
                ) : null}

                <div className="grid gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
                    <div className="space-y-3">
                        {coverImage ? (
                            <ImageCard
                                image={coverImage}
                                index={0}
                                isCover
                                isBusy={replacingId === coverImage.id}
                                onAltChange={handleAltChange}
                                onRemove={handleRemove}
                                onReplaceClick={openReplaceDialog}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDrop={handleDrop}
                            />
                        ) : (
                            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
                                <div className="max-w-xs space-y-3">
                                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Plus className="size-7" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium">{emptyTitle}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {emptyDescription}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Miniaturas</p>
                                <p className="text-xs text-muted-foreground">
                                    Arraste para reorganizar a ordem das fotos.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">


                            {galleryImages.map((image, index) => (
                                <ImageCard
                                    key={image.id}
                                    image={image}
                                    index={index + 1}
                                    isBusy={replacingId === image.id}
                                    onAltChange={handleAltChange}
                                    onRemove={handleRemove}
                                    onReplaceClick={openReplaceDialog}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDrop={handleDrop}
                                />
                            ))}

                                                        <AddImageTile
                                disabled={isAdding}
                                isUploading={isAdding}
                                onClick={openAddDialog}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
