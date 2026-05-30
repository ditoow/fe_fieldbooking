"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

// Pakai tipe union biar jelas statusnya ada 3 kemungkinan
type AuthStatus = "idle" | "authorized" | "unauthorized";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [status, setStatus] = useState<AuthStatus>("idle");

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        const session = localStorage.getItem("user_session");

        // Wrap di setTimeout(0) — ini trick yang valid untuk menghindari
        // setState synchronous di dalam effect body
        // Eksekusinya tetap cepat (next tick), tapi React tidak anggap ini cascading
        setTimeout(() => {
            if (!token || !session) {
                setStatus("unauthorized");
            } else {
                setStatus("authorized");
            }
        }, 0);
    }, []);

    // Unauthorized → redirect ke login
    useEffect(() => {
        if (status === "unauthorized") {
            router.replace("/login");
        }
    }, [status, router]);

    // idle = belum selesai cek, unauthorized = lagi redirect
    // keduanya tampilkan loading screen
    if (status !== "authorized") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF5]">
                <Leaf className="w-10 h-10 text-[#8CB954] animate-pulse mb-4" />
                <p className="text-[#1B3627] font-bold text-sm tracking-widest uppercase animate-pulse">
                    Memeriksa Akses...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}