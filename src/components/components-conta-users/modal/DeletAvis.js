"use client"

import Modal from "./modal"
import { useState } from "react"


export default function DeletAvis({ isOpen, onClose, onSubmit }) {

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h3>Tem certeza de que deseja deletar?</h3>
            <button onClick={onSubmit}>Sim</button>
            <button onClick={onClose}>Cancelar</button>
        </Modal>
    )

}