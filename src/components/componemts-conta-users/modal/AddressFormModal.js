"use client";

import Modal from "./modal";
import { useState } from "react";

export default function AddressFormModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}) {
    initialData = initialData || {};
    
    const [form, setForm] = useState({
        label: initialData.label || "",
        street: initialData.street || "",
        city: initialData.city || "",
        state: initialData.state || "",
        zipCode: initialData.zipCode || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
        onClose();
    };

    return (
       
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3>{initialData.id ? "Editar Endereço" : "Novo Endereço"}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    name="label"
                    placeholder="Rótulo"
                    value={form.label}
                    onChange={handleChange}
                    required
                />
                <input
                    name="street"
                    placeholder="Rua"
                    value={form.street}
                    onChange={handleChange}
                    required
                />
                <input
                    name="city"
                    placeholder="Cidade"
                    value={form.city}
                    onChange={handleChange}
                    required
                />
                <input
                    name="state"
                    placeholder="Estado"
                    value={form.state}
                    onChange={handleChange}
                    required
                />
                <input
                    name="zipCode"
                    placeholder="CEP"
                    value={form.zipCode}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {initialData.id ? "Salvar Alterações" : "Adicionar"}
                </button>
                <button type="button" onClick={onClose}>
                    Cancelar
                </button>
            </form>
        </Modal>
    );
}
