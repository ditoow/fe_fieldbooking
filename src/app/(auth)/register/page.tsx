"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Leaf } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* 1. KIRI: Branding & Informasi (Disembunyikan di layar kecil) */}
      <div className="hidden md:flex md:w-5/12 bg-gradient-to-b from-[#2B2317] to-[#132A1D] text-white p-12 flex-col justify-between relative overflow-hidden">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10 hover:opacity-80 transition w-fit">
          <Leaf className="w-5 h-5 text-[#8CB954]" />
          <span className="font-bold text-lg tracking-wide">MyUGO</span>
        </Link>

        {/* Konten Teks */}
        <div className="z-10 mt-12 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Bergabung <br /> dengan MyUGO
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed mb-10 max-w-sm">
            Masuki galeri botani fasilitas olahraga premium Universitas Dian Nuswantoro. Mulai perjalanan kebugaran Anda hari ini.
          </p>

          <ul className="space-y-5">
            <li className="flex items-center gap-3 text-sm text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#4D6B3C] fill-[#1B3627]" />
              Akses Eksklusif Fasilitas Kampus
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#4D6B3C] fill-[#1B3627]" />
              Sistem Booking Real-time 24/7
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-200">
              <CheckCircle2 className="w-5 h-5 text-[#4D6B3C] fill-[#1B3627]" />
              Notifikasi Jadwal & Event Olahraga
            </li>
          </ul>
        </div>

        {/* Ornamen Daun Transparan di Kiri Bawah */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.3" 
          className="absolute -bottom-16 -left-16 w-96 h-96 text-[#8CB954] opacity-20 pointer-events-none"
        >
          <path d="M12 2C6 2 2 8 2 14c0 4.5 4 8 10 8s10-3.5 10-8c0-6-4-12-10-12z" />
          <path d="M12 2v20" />
          <path d="M12 14c-4-2-7-1-8 0" />
          <path d="M12 10c4-2 7-1 8 0" />
        </svg>
      </div>

      {/* 2. KANAN: Form Register */}
      <div className="w-full md:w-7/12 bg-[#FDFBF5] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        
        {/* Watermark UGO */}
        <div className="absolute top-10 right-10 text-[120px] lg:text-[180px] font-bold text-[#F3EFE6] select-none pointer-events-none z-0 tracking-tighter leading-none">
          UGO
        </div>

        <div className="max-w-md w-full mx-auto relative z-10">
          
          {/* Header Form */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#1B3627] mb-2">Buat Akun Baru</h2>
            <p className="text-sm text-gray-500">
              Sudah memiliki akun? <Link href="/login" className="text-[#1B3627] font-semibold hover:underline">Masuk di sini</Link>
            </p>
          </div>

          {/* Form Fields */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {/* Nama Lengkap */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-[#F5F2E9] border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#EAD0B3] outline-none text-[#1B3627]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Email</label>
              <input 
                type="email" 
                placeholder="nama@email.com" 
                className="w-full bg-[#F5F2E9] border-none rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#EAD0B3] outline-none text-[#1B3627]"
              />
            </div>

            {/* Nomor HP */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">No. HP</label>
              <div className="flex bg-[#F5F2E9] rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#EAD0B3]">
                <span className="flex items-center justify-center px-4 border-r border-gray-200/50 text-sm text-gray-600 bg-transparent">
                  +62
                </span>
                <input 
                  type="tel" 
                  placeholder="81234567890" 
                  className="w-full bg-transparent border-none px-4 py-3 text-sm outline-none text-[#1B3627]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <div className="relative flex items-center">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
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

            {/* Checkbox Syarat & Ketentuan */}
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1B3627] focus:ring-[#1B3627]"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-tight">
                Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi MyUGO.
              </label>
            </div>

            {/* Tombol Submit */}
            <button 
              type="submit" 
              className="w-full bg-[#E5C3A6] hover:bg-[#d5b090] text-[#1B3627] font-semibold py-3.5 rounded-md transition duration-200 mt-4"
            >
              Buat Akun
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">Atau daftar dengan</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Tombol Google */}
          <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-sm font-medium py-3.5 rounded-md transition duration-200 flex items-center justify-center gap-2 text-gray-700 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Daftar dengan Google
          </button>

          {/* Footer Text */}
          <p className="text-[10px] text-center text-gray-400 mt-12">
            © 2026 MyUGO Editorial Framework. Universitas Dian Nuswantoro.
          </p>
        </div>
      </div>
    </div>
  );
}