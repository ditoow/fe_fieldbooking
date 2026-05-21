"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Mengecek apakah ada sesi user yang tersimpan
        const session = localStorage.getItem("user_session");

        if (!session) {
            // Jika tidak ada sesi, langsung lempar ke halaman login
            router.replace("/login");
        } else {
            // Jika ada sesi, izinkan akses ke halaman
            setIsAuthorized(true);
        }
    }, [router]);

    // Tampilkan layar loading atau kosong saat sedang mengecek sesi 
    // (Mencegah isi dashboard berkedip/bocor sesaat sebelum di-redirect)
    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF5]">
                <Leaf className="w-10 h-10 text-[#8CB954] animate-pulse mb-4" />
                <p className="text-[#1B3627] font-bold text-sm tracking-widest uppercase animate-pulse">
                    Memeriksa Akses...
                </p>
            </div>
        );
    }

    // Jika aman, tampilkan isi halamannya
    return <>{children}</>;
}