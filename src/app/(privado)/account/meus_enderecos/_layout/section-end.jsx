"use client";

import AddressFormModal from "@/components/components-conta-users/modal/AddressFormModal";

import {
    useAddresses,
    useCreateAddress,
    useUpdateAddress,
    useDeleteAddress,
} from "@/hooks/addressHooks";
import { useState } from "react";
import DeletAvis from "@/components/components-conta-users/modal/DeletAvis";

export default function EnderecosPage() {
    const { addresses, setAddresses } = useAddresses();
    const createAddr = useCreateAddress();
    const updateAddr = useUpdateAddress();
    const deleteAddr = useDeleteAddress();

    const [editingAddress, setEditingAddress] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const openNew = () => {
        setEditingAddress(null);
        setIsDeleteOpen(false);
        setIsFormOpen(true);
    };

    const openEdit = (addr) => {
        setEditingAddress(addr);
        setIsDeleteOpen(false);
        setIsFormOpen(true);
    };

    const openDelete = (addr) => {
        setEditingAddress(addr);
        setIsFormOpen(false);
        setIsDeleteOpen(true);
    };

    const handleSubmit = async (formData) => {
        if (editingAddress) {
            const updated = await updateAddr(editingAddress.id, formData);
            setAddresses((prev) =>
                prev.map((a) => (a.id === editingAddress.id ? updated : a)),
            );
        } else {
            const newAddr = await createAddr(formData);
            setAddresses((prev) => [newAddr, ...prev]);
        }
        setIsFormOpen(false);
        setEditingAddress(null);
    };

    const handleDelete = async (id) => {
        await deleteAddr(id);
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        setIsDeleteOpen(false);
        setEditingAddress(null);
    };

    return (
        <div>
            <h2>Meus Endereços</h2>
            <button onClick={openNew}>Adicionar Endereço</button>

            <ul>
                {addresses.map((addr) => (
                    <li key={addr.id}>
                        <span>
                            {addr.label} - {addr.street}, {addr.city},{" "}
                            {addr.state} ({addr.zipCode})
                        </span>
                        <button onClick={() => openEdit(addr)}>Editar</button>
                        <button onClick={() => openDelete(addr)}>
                            Excluir
                        </button>
                    </li>
                ))}
            </ul>

            <AddressFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingAddress || {}}
            />

            <DeletAvis
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onSubmit={() => handleDelete(editingAddress?.id)}
            />
        </div>
    );
}
