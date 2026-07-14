"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, AlertCircle } from "lucide-react";
import { login } from "@/lib/api/auth";
import { useAuth } from "@/lib/context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const { loginContext } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await login({ email, password });
            console.log('result login:', result); // tambah ini
            console.log('user:', result.user);    // tambah ini
            console.log('roles:', result.user?.roles); // tambah ini

            // Simpan data ke Context (otomatis set token & session di state & localStorage)
            loginContext(result.token, result.user);

            // Redirect berdasarkan role dari Spatie Permission
            const role = result.user?.roles?.[0]?.name;
            if (role === "admin") {
                router.push("/admin/dashboard");
            } else {
                router.push("/dashboard");
            }

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Email atau password salah.");
            } else {
                setError("Email atau password salah.");
            }
        } finally {
            // Apapun hasilnya, matiin loading state
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full font-sans">
            {/* SISI KIRI */}
            <div className="hidden md:flex md:w-5/12 bg-linear-to-b from-[#2B2317] to-[#132A1D] text-white p-12 flex-col justify-between relative overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Link href="/" className="flex items-center gap-2 z-10 hover:opacity-80 transition w-fit">
                        <img src="/logo.png?v=3" alt="Pivactive Logo" className="h-8 w-auto object-contain" />
                        <span className="font-bold text-lg tracking-wide">Pivactive</span>
                    </Link>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="z-10 mt-12 flex-1 flex flex-col justify-center"
                >
                    <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">Selamat datang <br /> kembali.</h1>
                    <p className="text-sm text-gray-300 leading-relaxed mb-10 max-w-sm">Masuk untuk melanjutkan pemesanan fasilitas olahraga premium UDINUS.</p>
                </motion.div>
            </div>

            {/* SISI KANAN */}
            <div className="w-full md:w-7/12 bg-[#FDFBF5] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
                <div className="max-w-md w-full mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-10"
                    >
                        <h2 className="text-3xl font-bold text-[#1B3627] mb-2">Masuk Akun</h2>
                        <p className="text-sm text-gray-500">
                            Belum memiliki akun?{" "}
                            <Link href="/register" className="text-[#1B3627] font-semibold hover:underline">Daftar di sini</Link>
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2"
                        >
                            <AlertCircle className="w-4 h-4" />{error}
                        </motion.div>
                    )}

                    <motion.form 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-5" 
                        onSubmit={handleLogin}
                    >
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nama@email.com"
                                required
                                className="w-full bg-[#F5F2E9] border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#EAD0B3] outline-none text-[#1B3627]"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-[#F5F2E9] border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#EAD0B3] outline-none text-[#1B3627]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#E5C3A6] hover:bg-[#d5b090] disabled:opacity-60 disabled:cursor-not-allowed text-[#1B3627] font-semibold py-3.5 rounded-md transition duration-200 mt-8"
                        >
                            {isLoading ? "Sedang masuk..." : "Masuk"}
                        </button>
                    </motion.form>
                </div>
            </div>
        </div>
    );
}