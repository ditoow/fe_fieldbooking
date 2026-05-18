"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Leaf, User, Menu, X, Bell,
    Settings, LogOut, CheckCircle2,
    Info, AlertTriangle, ChevronRight
} from "lucide-react";

export default function NavbarUser() {
    const [userData, setUserData] = useState<any>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const session = localStorage.getItem("user_session");
        if (session) setUserData(JSON.parse(session));

        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotif(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // REVISI: Alamat href disesuaikan (tanpa kata /user)
    const navLinks = [
        { name: "Booking", href: "/dashboard" },
        { name: "Riwayat", href: "/riwayat" },
    ];

    const notifications = [
        {
            id: 1,
            type: "success",
            title: "Pemesanan Berhasil",
            message: "Booking lapangan Futsal Internasional pukul 19:00 - 21:00 telah dikonfirmasi.",
            time: "2 jam yang lalu",
            isRead: false
        },
        {
            id: 2,
            type: "info",
            title: "Verifikasi Dokumen",
            message: "Admin telah menyetujui berkas Surat TU Anda. Silakan cek riwayat booking.",
            time: "5 jam yang lalu",
            isRead: true
        },
        {
            id: 3,
            type: "warning",
            title: "Batas Reschedule",
            message: "Pengingat: Batas waktu reschedule adalah 2 jam sebelum jadwal dimulai.",
            time: "1 hari yang lalu",
            isRead: true
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("user_session");
        router.push("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#1B3627] text-white shadow-md font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition shrink-0">
                        <Leaf className="w-5 h-5 text-[#8CB954]" />
                        <span className="font-bold text-lg tracking-wide">MyUGO</span>
                    </Link>

                    {/* Nav Links - Desktop (REVISI: Kondisi pathname aktif disesuaikan) */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/dashboard" className={`text-sm font-medium transition-all hover:text-[#E5C3A6] ${pathname === "/dashboard" ? "text-[#E5C3A6] border-b-2 border-[#E5C3A6] pb-1" : "text-gray-300"}`}>
                            Booking
                        </Link>
                        <Link href="/riwayat" className={`text-sm font-medium transition-all hover:text-[#E5C3A6] ${pathname === "/riwayat" ? "text-[#E5C3A6] border-b-2 border-[#E5C3A6] pb-1" : "text-gray-300"}`}>
                            Riwayat
                        </Link>
                    </div>

                    {/* Action Icons - Desktop */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* Bell Icon */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
                                className={`p-2 rounded-full transition-colors ${showNotif ? "bg-white/10 text-[#E5C3A6]" : "text-gray-300 hover:text-white"}`}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1B3627]"></span>
                            </button>

                            {showNotif && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                                    <div className="p-4 bg-[#FDFBF5] border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-[#1B3627]">Notifikasi</h3>
                                        <button className="text-[10px] font-bold text-[#c29867] hover:underline uppercase">Tandai Dibaca</button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto text-[#1B3627]">
                                        {notifications.map((n) => (
                                            <div key={n.id} className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition cursor-pointer ${!n.isRead ? "bg-blue-50/30" : ""}`}>
                                                <div className="shrink-0 mt-1">
                                                    {n.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                                    {n.type === "info" && <Info className="w-4 h-4 text-blue-500" />}
                                                    {n.type === "warning" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900">{n.title}</p>
                                                    <p className="text-[11px] text-gray-500 leading-relaxed my-1">{n.message}</p>
                                                    <p className="text-[9px] text-gray-400 font-medium uppercase">{n.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 text-[10px] font-bold text-gray-400 hover:text-[#1B3627] bg-gray-50 uppercase tracking-widest transition">
                                        Lihat Semua Notifikasi
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Profile Circle */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                                className="flex items-center gap-3 pl-4 border-l border-white/10 group"
                            >
                                <p className="text-xs font-bold uppercase tracking-tighter group-hover:text-[#E5C3A6] transition">
                                    {userData?.nama || "User MyUGO"}
                                </p>
                                <div className={`w-8 h-8 rounded-full bg-[#E5C3A6] flex items-center justify-center text-[#1B3627] font-bold border-2 transition-all ${showProfile ? "border-white" : "border-[#1B3627]"}`}>
                                    <User className="w-5 h-5" />
                                </div>
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200 text-[#1B3627]">
                                    <div className="p-5 bg-[#FDFBF5] border-b border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Akun Saya</p>
                                        <p className="font-bold text-sm truncate">{userData?.nama || "Nuralif Maulana"}</p>
                                        <p className="text-[10px] text-[#8CB954] font-bold uppercase">
                                            {userData?.role || "Mahasiswa"} {userData?.nim && `• ${userData.nim}`}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/user/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group">
                                            <div className="flex items-center gap-3">
                                                <User className="w-4 h-4 text-gray-400 group-hover:text-[#1B3627]" />
                                                <span className="text-xs font-semibold">Profil Saya</span>
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-gray-300" />
                                        </Link>
                                        <Link href="/user/settings" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group">
                                            <div className="flex items-center gap-3">
                                                <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#1B3627]" />
                                                <span className="text-xs font-semibold">Pengaturan</span>
                                            </div>
                                            <ChevronRight className="w-3 h-3 text-gray-300" />
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition group"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="text-xs font-bold">Keluar Akun</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-3">
                        <button onClick={() => setShowNotif(!showNotif)} className="text-gray-300"><Bell className="w-5 h-5" /></button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#132A1D] border-t border-white/5 px-4 py-6 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block text-sm font-medium ${pathname === link.href ? "text-[#E5C3A6]" : "text-gray-300"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E5C3A6] flex items-center justify-center text-[#1B3627]">
                            <User className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold uppercase">{userData?.nama || "User MyUGO"}</p>
                    </div>
                </div>
            )}
        </nav>
    );
}