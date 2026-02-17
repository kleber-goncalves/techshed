"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
const router = useRouter();

    const handleSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) alert("Erro ao criar conta: " + error.message);
        else alert("Conta criada! Verifique seu email.");
    };

async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        alert(error.message);
        return;
    }

    if (data.session) {
        // Vai mandar o token pro backend
        await fetch("/api/syncUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: data.session.access_token,
            }),
        });

        // Redireciona logo depois
        router.push("/cnfgContaUsers/minha_conta");
    }
}

    return (
        <div style={{ padding: "20px" }}>
            <h1>Login / Cadastro</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button  onClick={handleSignUp}>Criar Conta</button>
            <button className="cursor-pointer" onClick={handleLogin}>Entrar</button>
        </div>
    );
}
