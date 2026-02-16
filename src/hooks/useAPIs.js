import { useState, useEffect } from "react";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "@/lib/userApi"


/**
 * Hook para buscar todos os usuários
 */
export function useUsers() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const users = await getAllUsers();
                setData(users);
               
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    return { data, loading, error };
}


/**
 * Hook para buscar usuário por ID
 */
export function useUser(id) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!id) return;
        async function fetchUser() {
            try {
                const user = await getUserById(id);
                setData(user);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [id]);

    return { data, loading, error };
}



/**
 * Hook para criar usuário
 */
export function useCreateUser() {

    const [error, setError] = useState(null);

    const create = async (userData) => {
        try {
            await createUser(userData);
        } catch (err) {
            setError(err);
        }
    };

    return { create, error };
}


/**
 * Hook para atualizar usuário
 */
export function useUpdateUser() {

    const [error, setError] = useState(null);

    const update = async (id, userData) => {
        try {
            await updateUser(id, userData);
        } catch (err) {
            setError(err);
        }
    };
    
    return { update, error };
}



/**
 * Hook para deletar usuário
 */
export function useDeleteUser() {

    const [error, setError] = useState(null);

    const remove = async (id) => {
        try {
            await deleteUser(id);
        } catch (err) {
            setError(err);
        }
    };

    return { remove, error };
}