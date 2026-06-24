"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Save, ShieldAlert, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { updateProfile, updatePassword } from "@/lib/api/auth";
import toast from 'react-hot-toast';

interface UserSessionData {
    nama: string;
    email: string;
    role: string;
    nim?: string;
    phone?: string;
}

export default function ProfilePage() {
    const { user, updateUserContext, loading: authLoading } = useAuth();
    const [userData, setUserData] = useState<UserSessionData>({
        nama: "",
        email: "",
        role: "",
        nim: "",
        phone: ""
    });
    const [loading, setLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (!authLoading && user) {
            setUserData({
                nama: user.name || "",
                email: user.email || "",
                role: user.role || user.roles?.[0]?.name || "Mahasiswa",
                nim: user.student_id || "",
                phone: user.phone || ""
            });
            setLoading(false);
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSavingProfile) return;

        setIsSavingProfile(true);
        try {
            const res = await updateProfile({
                name: userData.nama,
                email: userData.email,
                phone: userData.phone?.trim() ? userData.phone : undefined,
            });

            // Update di konteks global (otomatis sync ke Navbar)
            updateUserContext({
                name: res.user.name,
                email: res.user.email,
                phone: res.user.phone,
                student_id: res.user.student_id,
                role: res.user.role || res.user.roles?.[0]?.name,
                roles: res.user.roles,
            });

            toast.success(res.message || "Profil Anda berhasil diperbarui!");
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat memperbarui profil.";
            toast.error(errorMessage);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSavingPassword) return;

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Konfirmasi password baru tidak cocok!");
            return;
        }

        setIsSavingPassword(true);
        try {
            const res = await updatePassword({
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword,
                new_password_confirmation: passwordData.confirmPassword,
            });

            toast.success(res.message || "Password berhasil diubah!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat mengganti password.";
            toast.error(errorMessage);
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#1B3627] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 font-sans min-height-screen">
            <div className="bg-[#1B3627] rounded-3xl p-6 md:p-8 text-white mb-8 shadow-lg flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E5C3A6] flex items-center justify-center text-[#1B3627] text-3xl font-black border-4 border-white/20 shrink-0 shadow-inner">
                    {userData.nama ? userData.nama.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                </div>
                
                <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-xl md:text-2xl font-black tracking-tight">{userData.nama || "User MyUGO"}</h1>
                    <p className="text-xs text-[#8CB954] font-bold uppercase tracking-widest">
                        {userData.role} {userData.nim && `• ${userData.nim}`}
                    </p>
                    <p className="text-xs text-gray-300 font-medium">{userData.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                <div className="lg:col-span-2">
                    <Card className="bg-[#FDFBF5] border-gray-200/60 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-gray-100 bg-white/50 p-6">
                            <CardTitle className="text-base font-extrabold text-[#1B3627] flex items-center gap-2">
                                <User className="w-4 h-4 text-[#8CB954]" /> Informasi Pribadi
                            </CardTitle>
                            <CardDescription className="text-[11px] text-gray-400 font-medium">
                                Perbarui data diri dan kontak utama akun Anda di sini.
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-6">
                            <form onSubmit={handleProfileSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nama Lengkap</label>
                                    <Input 
                                        type="text"
                                        value={userData.nama}
                                        onChange={(e) => setUserData({ ...userData, nama: e.target.value })}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] h-auto"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nomor Handphone</label>
                                        <Input 
                                            type="text"
                                            value={userData.phone}
                                            placeholder="Masukkan nomor HP"
                                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                            className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] h-auto"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Nomor Induk Mahasiswa (NIM)</label>
                                        <Input 
                                            type="text"
                                            value={userData.nim}
                                            disabled
                                            className="w-full bg-gray-100 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-400 cursor-not-allowed h-auto"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                                    <Input 
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] h-auto"
                                    />
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={isSavingProfile}
                                        className="bg-[#1B3627] hover:bg-[#132A1D] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-green-900/10 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSavingProfile ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" /> Simpan Perubahan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="bg-[#FDFBF5] border-gray-200/60 shadow-sm rounded-2xl overflow-hidden">
                        <CardHeader className="border-b border-gray-100 bg-white/50 p-6">
                            <CardTitle className="text-base font-extrabold text-[#1B3627] flex items-center gap-2">
                                <Lock className="w-4 h-4 text-[#8CB954]" /> Keamanan Akun
                            </CardTitle>
                            <CardDescription className="text-[11px] text-gray-400 font-medium">
                                Ganti password Anda secara berkala demi keamanan.
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="p-6">
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password Sekarang</label>
                                    <Input 
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] h-auto"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password Baru</label>
                                    <Input 
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] h-auto"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Konfirmasi Password</label>
                                    <Input 
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full bg-white border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#1B3627] focus-visible:ring-2 focus-visible:ring-[#c29867] h-auto"
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button 
                                        type="submit" 
                                        disabled={isSavingPassword}
                                        className="w-full bg-[#8b5a2b] hover:bg-[#724a23] text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md h-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSavingPassword ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Memperbarui...
                                            </>
                                        ) : (
                                            "Perbarui Password"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="mt-4 p-4 bg-amber-50/50 border border-amber-200/40 rounded-xl flex gap-3 text-amber-800">
                        <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                        <p className="text-[11px] font-medium leading-relaxed m-0">
                            Untuk melakukan perubahan pada kolom institusi (NIM/Role), harap hubungi pihak Biro Administrasi Umum atau Helpdesk IT GOR UDINUS.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
