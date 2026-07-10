"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Leaf, AlertCircle } from "lucide-react";
import { register } from "@/lib/api/auth";
import axios from "axios";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const isStudentEmail = email.toLowerCase().endsWith("@mhs.dinus.ac.id");
      await register({
        name: nama,
        email,
        phone: "+62" + phone,
        password,
        password_confirmation: password,
        student_id: isStudentEmail ? studentId : undefined,
      });

      // BE hanya return { message, user }, tidak ada token
      // jadi redirect ke login, user login manual
      router.push("/login");

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const beErrors = err.response?.data?.errors;
        if (beErrors) {
          // Laravel return errors per-field, ambil pesan pertamanya
          const firstError = Object.values(beErrors)[0] as string[];
          setError(firstError[0]);
        } else {
          setError(err.response?.data?.message || "Registrasi gagal, coba lagi.");
        }
      } else {
        setError("Registrasi gagal, coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* KIRI */}
      <div className="hidden md:flex md:w-5/12 bg-linear-to-b from-[#2B2317] to-[#132A1D] text-white p-12 flex-col justify-between relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link href="/" className="flex items-center gap-2 z-10 hover:opacity-80 transition w-fit">
            <Leaf className="w-5 h-5 text-[#8CB954]" />
            <span className="font-bold text-lg tracking-wide">MyUGO</span>
          </Link>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="z-10 mt-12 flex-1 flex flex-col justify-center"
        >
          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">Bergabung <br /> dengan MyUGO</h1>
          <p className="text-sm text-gray-300 leading-relaxed mb-10 max-w-sm">Masuki galeri botani fasilitas olahraga premium UDINUS.</p>
        </motion.div>
      </div>

      {/* KANAN */}
      <div className="w-full md:w-7/12 bg-[#FDFBF5] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        <div className="max-w-md w-full mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold text-[#1B3627] mb-2">Buat Akun Baru</h2>
            <p className="text-sm text-gray-500">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="text-[#1B3627] font-semibold hover:underline">Masuk di sini</Link>
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
            onSubmit={handleRegister}
          >
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full bg-[#F5F2E9] border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#EAD0B3] outline-none text-[#1B3627]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                required
                className="w-full bg-[#F5F2E9] border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#EAD0B3] outline-none text-[#1B3627]"
              />
            </div>

            {email.toLowerCase().endsWith("@mhs.dinus.ac.id") && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nomor Induk Mahasiswa (NIM)</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="A11.2023.xxxxx"
                  required
                  className="w-full bg-[#F5F2E9] border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#EAD0B3] outline-none text-[#1B3627]"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">No. HP</label>
              <div className="flex bg-[#F5F2E9] rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#EAD0B3]">
                <span className="flex items-center justify-center px-4 border-r border-gray-200/50 text-sm text-gray-600">+62</span>
                <input
                  type="text"
                  value={phone}
                  onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "")}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="81234567890"
                  required
                  className="w-full bg-transparent border-none px-4 py-3 text-sm outline-none text-[#1B3627]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
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
              className="w-full bg-[#E5C3A6] hover:bg-[#d5b090] disabled:opacity-60 disabled:cursor-not-allowed text-[#1B3627] font-semibold py-3.5 rounded-md transition duration-200 mt-4"
            >
              {isLoading ? "Membuat akun..." : "Buat Akun"}
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}