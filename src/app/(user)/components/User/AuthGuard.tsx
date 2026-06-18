"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function AuthGuard({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
    const router = useRouter();
    const { user, token, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!token || !user) {
            router.replace("/login");
            return;
        }

        if (requireAdmin) {
            const userRole = user.role || user.roles?.[0]?.name;
            if (userRole?.toLowerCase() !== "admin") {
                router.replace("/login");
            }
        }
    }, [loading, token, user, requireAdmin, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF5]">
                <Leaf className="w-10 h-10 text-[#8CB954] animate-pulse mb-4" />
                <p className="text-[#1B3627] font-bold text-sm tracking-widest uppercase animate-pulse">
                    Memeriksa Akses...
                </p>
            </div>
        );
    }

    const userRole = user?.role || user?.roles?.[0]?.name;
    const isAuthorized = token && user && (!requireAdmin || userRole?.toLowerCase() === "admin");

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF5]">
                <Leaf className="w-10 h-10 text-[#8CB954] animate-pulse mb-4" />
                <p className="text-[#1B3627] font-bold text-sm tracking-widest uppercase animate-pulse">
                    Mengalihkan Akses...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}