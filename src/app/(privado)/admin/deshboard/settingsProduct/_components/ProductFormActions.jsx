import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { productFormCardClassName } from "./SectionCard";

export default function ProductFormActions({
    saving,
    selectedId,
    archiveDialogOpen,
    onArchiveDialogOpenChange,
    onArchive,
}) {
    return (
        <Card className={productFormCardClassName}>
            <CardContent className="flex flex-wrap gap-2 py-6">
                <Button type="submit" disabled={saving} className="min-w-40 cursor-pointer">
                    {saving ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        "Salvar alterações"
                    )}
                </Button>

                {selectedId ? (
                    <AlertDialog
                        open={archiveDialogOpen}
                        onOpenChange={onArchiveDialogOpenChange}
                    >
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="destructive"
                                disabled={saving}
                                className="cursor-pointer"
                            >
                                Desativar produto
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Confirmar desativação
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esse produto ficará inativo e não será
                                    exibido no catálogo público.
                                </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    type="button"
                                    disabled={saving}
                                >
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    type="button"
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    disabled={saving}
                                    onClick={onArchive}
                                >
                                    {saving
                                        ? "Desativando..."
                                        : "Confirmar desativação"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : null}
            </CardContent>
        </Card>
    );
}
